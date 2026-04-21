export default function Button({ children, variant = "primary", href, onClick, className = "", type = "button", disabled = false, ...props }) {
  const variants = {
    primary: "btn-primary",
    outline: "btn-outline",
    ghost:   "btn-ghost",
    white:   "btn-white",
  };
  const cls = `${variants[variant] ?? "btn-primary"} ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`;

  if (href) return <a href={href} className={cls} {...props}>{children}</a>;
  return <button type={type} onClick={onClick} className={cls} disabled={disabled} {...props}>{children}</button>;
}
