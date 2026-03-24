type BrandMarkProps = {
  className?: string
  compact?: boolean
}

export default function BrandMark({ className = '', compact = false }: BrandMarkProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-[1.25rem] border border-white/10 bg-[linear-gradient(145deg,rgba(141,246,200,0.16),rgba(106,215,255,0.1)_48%,rgba(7,12,24,0.92))] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_18px_38px_rgba(2,8,23,0.28)] ${compact ? 'h-11 w-11' : 'h-14 w-14'} ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-[1px] rounded-[1.15rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_34%),linear-gradient(180deg,rgba(10,16,30,0.82),rgba(4,7,15,0.98))]" />
      <svg
        viewBox="0 0 64 64"
        className="relative z-10 h-[72%] w-[72%]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="AE brand mark"
      >
        <path d="M14 48L26.5 17L39 48" stroke="url(#brand-stroke)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20.5 33.5H32.5" stroke="url(#brand-stroke)" strokeWidth="4" strokeLinecap="round" />
        <path d="M41 17.5V48" stroke="url(#brand-stroke)" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M41 17.5H52" stroke="url(#brand-stroke)" strokeWidth="4" strokeLinecap="round" />
        <path d="M41 32.5H49" stroke="url(#brand-stroke)" strokeWidth="4" strokeLinecap="round" />
        <path d="M41 48H52" stroke="url(#brand-stroke)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="52" cy="17.5" r="3" fill="#8DF6C8" fillOpacity="0.9" />
        <defs>
          <linearGradient id="brand-stroke" x1="14" y1="17" x2="52" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EAFBF4" />
            <stop offset="0.45" stopColor="#8DF6C8" />
            <stop offset="1" stopColor="#6AD7FF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
