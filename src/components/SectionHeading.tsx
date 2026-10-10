type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  text?: string;
  light?: boolean;
};

export function SectionHeading({ eyebrow, title, text, light = false }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${light ? "text-orange-300" : "text-orange-600"}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl ${light ? "text-white" : "text-slate-950"}`}>
        {title}
      </h2>
      <span className="mt-4 block h-1.5 w-16 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500" />
      {text ? (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? "text-white/75" : "text-slate-600"}`}>{text}</p>
      ) : null}
    </div>
  );
}
