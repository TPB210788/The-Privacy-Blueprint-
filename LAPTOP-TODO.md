# Laptop to-do: website updates

Saved for when you're at your laptop. All changes are on the branch `ccr-66998721-9w9jes`.

## 1. Decide two wording points (5 min)
- [ ] Keep "£75 Action Plan credited in full against a Gap Assessment booked within 30 days"? (Services page, Home page, quiz results)
- [ ] Keep "I'll email your checklist within 1 working day"? (quiz, after someone enters their email)

Tell Claude your answers and it will update the wording.

## 2. Publish the main website and move it to theprivacyblueprint.co.uk (15 min)
First, check the screenshot `updated-homepage-preview.png` from the chat looks like glittering-cocada-3b4fc5.netlify.app (plum button, serif headline). If it does:

**Upload the updates**
- [ ] Download `theprivacyblueprint-site.zip` from the branch on GitHub
- [ ] Netlify > open the **glittering-cocada** site > Deploys > drag and drop the zip
- [ ] Open glittering-cocada-3b4fc5.netlify.app and check it looks right

**Move your domain to it**
- [ ] In Netlify, open the **old** site that currently uses theprivacyblueprint.co.uk
- [ ] Domain management > remove theprivacyblueprint.co.uk (and www) from it
- [ ] Open the **glittering-cocada** site > Domain management > Add a domain > theprivacyblueprint.co.uk
- [ ] If your DNS is managed by Netlify, that's it. If it's at your domain registrar (e.g. GoDaddy, 123 Reg), make sure the `www` record points to `glittering-cocada-3b4fc5.netlify.app` and not the old site's address
- [ ] Wait up to an hour, then check https://theprivacyblueprint.co.uk shows the new design and the padlock (HTTPS)

**Final checks**
- [ ] Live About page has no photo or name
- [ ] Privacy Policy and Cookie Policy footer links open
- [ ] Optional: rename the site in Netlify (Site configuration > Change site name) to something like `theprivacyblueprint`

## 3. Publish the Health Check quiz (5 min)
- [ ] Merge the branch into `main` on GitHub (or ask Claude to open the pull request)
- [ ] Vercel updates automatically. Take the quiz once and check the results page

## 4. Get found on Google (10 min)
- [ ] Go to Google Search Console and add theprivacyblueprint.co.uk
- [ ] Submit `https://theprivacyblueprint.co.uk/sitemap.xml`

## 5. Later, when ready
- [ ] Ask 2 or 3 clients for a short quote (initials + business type) and send to Claude to add to the About page
- [ ] Switch checklist emails to MailerLite (free) once you get more than about 5 sign-ups a week
