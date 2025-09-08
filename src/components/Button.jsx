export default function Button({ children, variant = 'primary', loading = false, ...props }) {
  const classes = variant === 'accent' ? 'btn-accent' : 'btn-primary'

  return (
    <button className={`${classes} disabled:opacity-60`} disabled={loading} {...props}>
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
            ></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
