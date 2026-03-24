import { PenTool } from 'lucide-react'

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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_32%_28%,rgba(141,246,200,0.14),transparent_24%),radial-gradient(circle_at_70%_74%,rgba(106,215,255,0.12),transparent_22%)]" />
      <span className="absolute left-[18%] top-[20%] h-1.5 w-1.5 rounded-full bg-[#8df6c8]/80 shadow-[0_0_12px_rgba(141,246,200,0.6)]" />
      <span className="absolute bottom-[20%] right-[18%] h-1.5 w-1.5 rounded-full bg-[#6ad7ff]/80 shadow-[0_0_12px_rgba(106,215,255,0.55)]" />
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <PenTool
          className={`${compact ? 'h-[1.3rem] w-[1.3rem]' : 'h-[1.75rem] w-[1.75rem]'} text-[#e6fff4] drop-shadow-[0_0_16px_rgba(141,246,200,0.22)]`}
          strokeWidth={2}
        />
      </div>
    </div>
  )
}
