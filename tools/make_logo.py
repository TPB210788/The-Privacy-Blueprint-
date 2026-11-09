"""Redraws The Privacy Blueprint logo as crisp SVG files in the site colours.

Run:  python3 tools/make_logo.py   (needs: pip install fonttools brotli)
Uses the site's own fonts: Playfair Display for "PB", Raleway for the tagline.
Writes:
  netlify-site/assets/logo-full.svg        full logo, navy (light backgrounds)
  netlify-site/assets/logo-full-light.svg  full logo, sand (dark backgrounds)
  netlify-site/assets/logo.svg             compact PB mark, navy (header)
  netlify-site/assets/favicon.svg          PB mark on a navy square (browser tab)
and copies them into public/ for the Health Check app.
"""
import shutil
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "netlify-site" / "assets" / "fonts"
ASSETS = ROOT / "netlify-site" / "assets"
NAVY, SAND, BRASS = "#1C2B4A", "#F6F2EB", "#B68A4C"

serif = TTFont(FONTS / "playfair-display-latin-600-normal.woff2")
sans = TTFont(FONTS / "raleway-latin-500-normal.woff2")


def glyph_path(font, ch, size, x, baseline):
    gs = font.getGlyphSet()
    name = font.getBestCmap()[ord(ch)]
    scale = size / font["head"].unitsPerEm
    pen = SVGPathPen(gs)
    gs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, x, baseline)))
    return pen.getCommands(), gs[name].width * scale


def bounds(font, ch, size):
    gs = font.getGlyphSet()
    bp = BoundsPen(gs)
    gs[font.getBestCmap()[ord(ch)]].draw(bp)
    s = size / font["head"].unitsPerEm
    xmin, ymin, xmax, ymax = bp.bounds
    return xmin * s, ymin * s, xmax * s, ymax * s


def text_paths(font, text, size, x, baseline, tracking):
    out, cx = [], x
    for ch in text:
        if ch == " ":
            cx += size * 0.32 + tracking
            continue
        d, adv = glyph_path(font, ch, size, cx, baseline)
        out.append(d)
        cx += adv + tracking
    return " ".join(out), cx - tracking - x


# Hand drawn PB, matched to the original logo: thick stems, hairline tops,
# heavy right hand curves. Cap height H = 300.
H = 300
S = 47  # stem width
P_SHAPES = [
    f"M0,0H{S + 1.5}V{H}H0Z",
    "M47,0L130,0C190,0 225,38 225,90C225,142 190,180 130,180L47,180Z"
    "M47,9L128,9C164,9 180,45 180,90C180,135 164,171 128,171L47,171Z",
]
B_SHAPES = [
    f"M0,0H{S + 1.5}V{H}H0Z",
    "M47,0L118,0C176,0 210,32 210,74C210,116 176,148 118,148L47,148Z"
    "M47,9L116,9C150,9 166,40 166,74C166,108 150,139 116,139L47,139Z",
    "M47,139L128,139C195,139 232,177 232,220C232,264 195,300 128,300L47,300Z"
    "M47,148L126,148C170,148 186,183 186,220C186,258 170,291 126,291L47,291Z",
]
P_W, B_W, GAP = 225, 232, 42


def letters(x):
    out = [f'<g transform="translate({x:.1f},0)">' + "".join(f'<path fill-rule="evenodd" d="{d}"/>' for d in P_SHAPES) + "</g>"]
    bx = x + P_W + GAP
    out.append(f'<g transform="translate({bx:.1f},0)">' + "".join(f'<path fill-rule="evenodd" d="{d}"/>' for d in B_SHAPES) + "</g>")
    return "".join(out)


def build(with_tagline=True):
    letters_w = P_W + GAP + B_W
    cap = H
    band_c = H * 0.52
    band_h = H * (0.26 if with_tagline else 0.16)
    tag = "THE PRIVACY BLUEPRINT"
    t_size = (H * 0.09) / (bounds(sans, "T", 1000)[3] / 1000)
    _, nat_w = text_paths(sans, tag, t_size, 0, 0, 0)
    target = letters_w * 1.17
    tracking = (target - nat_w) / (len(tag) - 1)
    tag_w = target
    tag_cap = H * 0.09
    line, pad = H * 0.29, 14
    total_w = tag_w + 2 * (line + pad) if with_tagline else letters_w
    off = (total_w - letters_w) / 2
    top, bot = band_c - band_h / 2, band_c + band_h / 2
    clip = (f'<clipPath id="cut"><rect x="-1" y="-10" width="{total_w + 2:.1f}" height="{top + 10:.1f}"/>'
            f'<rect x="-1" y="{bot:.1f}" width="{total_w + 2:.1f}" height="{cap - bot + 20:.1f}"/></clipPath>')
    parts = [f'<g clip-path="url(#cut)">{letters(off)}</g>']
    if with_tagline:
        tx = (total_w - tag_w) / 2
        tdp, _ = text_paths(sans, tag, t_size, tx, band_c + tag_cap / 2, tracking)
        parts.append(f'<path d="{tdp}"/>')
        parts.append(f'<rect class="rule" x="0" y="{band_c - 1.6:.1f}" width="{line:.1f}" height="3.2"/>')
        parts.append(f'<rect class="rule" x="{total_w - line:.1f}" y="{band_c - 1.6:.1f}" width="{line:.1f}" height="3.2"/>')
    else:
        parts.append(f'<rect class="rule" x="{-24:.1f}" y="{band_c - 3:.1f}" width="{letters_w + 48:.1f}" height="6"/>')
    return total_w, cap, clip, "".join(parts)


def svg(w, h, clip, body, fill, rule, pad=0, bg=None):
    vb = f"{-pad:.1f} {-pad:.1f} {w + 2 * pad:.1f} {h + 2 * pad:.1f}"
    bgrect = f'<rect x="{-pad:.1f}" y="{-pad:.1f}" width="{w + 2 * pad:.1f}" height="{h + 2 * pad:.1f}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="The Privacy Blueprint">'
            f'<defs>{clip}<style>.rule{{fill:{rule}}}</style></defs>{bgrect}<g fill="{fill}">{body}</g></svg>')


if __name__ == "__main__":
    w, h, clip, body = build(True)
    (ASSETS / "logo-full.svg").write_text(svg(w, h, clip, body, NAVY, NAVY, pad=6))
    (ASSETS / "logo-full-light.svg").write_text(svg(w, h, clip, body, SAND, SAND, pad=6))
    mw, mh, mclip, mbody = build(False)
    side = max(mw, mh) + 40
    # square mark, centred
    pad_x = (side - mw) / 2
    mark = svg(mw, mh, mclip, mbody, NAVY, BRASS, pad=0).replace(
        f'viewBox="0.0 0.0 {mw:.1f} {mh:.1f}"', f'viewBox="{-pad_x:.1f} {-(side - mh) / 2:.1f} {side:.1f} {side:.1f}"')
    (ASSETS / "logo.svg").write_text(mark)
    fav = svg(mw, mh, mclip, mbody, SAND, BRASS, bg=NAVY).replace(
        f'viewBox="0.0 0.0 {mw:.1f} {mh:.1f}"', f'viewBox="{-pad_x - 30:.1f} {-(side - mh) / 2 - 30:.1f} {side + 60:.1f} {side + 60:.1f}"')
    fav = fav.replace(f'<rect x="0.0" y="0.0" width="{mw:.1f}" height="{mh:.1f}" fill="{NAVY}"/>',
                      f'<rect x="{-pad_x - 30:.1f}" y="{-(side - mh) / 2 - 30:.1f}" width="{side + 60:.1f}" height="{side + 60:.1f}" fill="{NAVY}"/>')
    (ASSETS / "favicon.svg").write_text(fav)
    for f in ["logo.svg", "logo-full.svg", "logo-full-light.svg", "favicon.svg"]:
        shutil.copy(ASSETS / f, ROOT / "public" / f)
        print("wrote", f)
