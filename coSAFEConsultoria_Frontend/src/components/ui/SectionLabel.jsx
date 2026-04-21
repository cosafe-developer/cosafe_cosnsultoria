export default function SectionLabel({ children, variant = "green" }) {
  const cls = {
    green: "label-green",
    steel: "label-steel",
    ink:   "label-ink",
  }[variant] ?? "label-green";

  return (
    <span className={cls}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-pulse" />
      {children}
    </span>
  );
}
