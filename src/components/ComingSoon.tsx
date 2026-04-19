interface Props {
  label: string;
  description: string;
}

export default function ComingSoon({ label, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div
        className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest px-3 py-1 rounded mb-6"
        style={{ backgroundColor: 'rgba(139,115,85,0.1)', color: '#8B7355' }}
      >
        Coming Soon
      </div>
      <h2 className="font-playfair text-2xl text-charcoal mb-3">{label}</h2>
      <p className="text-charcoal/55 text-sm max-w-sm leading-relaxed">{description}</p>
    </div>
  );
}
