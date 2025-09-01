export default function Input({ label, type = 'text', name, placeholder, ...props }) {
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-sm font-semibold text-graphite">{label}</span>}
      <input className="input" type={type} name={name} placeholder={placeholder} {...props} />
    </label>
  )
}


