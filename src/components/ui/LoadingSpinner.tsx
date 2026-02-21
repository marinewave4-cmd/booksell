interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

const sizes = {
  sm: 'h-6 w-6',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
}

export default function LoadingSpinner({
  size = 'md',
  className = '',
  label = '로딩 중',
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-busy="true"
      aria-label={label}
    >
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-600 ${sizes[size]}`}
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}
