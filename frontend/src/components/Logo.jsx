export default function Logo({ theme = 'light' }) {
  const textClass = theme === 'light' ? 'text-white' : 'text-graphite'
  return (
    <div className="flex items-center gap-2 select-none">
      <div className="w-9 h-9 rounded-lg bg-brand-gradient grid place-items-center">
        <span className="text-white font-extrabold text-lg leading-none">M</span>
      </div>
      <span className={`text-xl font-semibold ${textClass}`}>Maayo</span>
    </div>
  )
}


