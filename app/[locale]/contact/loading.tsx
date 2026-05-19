export default function ContactLoading() {
  return (
    <div className="animate-pulse px-6 pb-16 pt-10 md:px-10 lg:px-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto h-4 w-24 rounded-full bg-white/5 mb-4" />
          <div className="mx-auto h-10 w-64 rounded-2xl bg-white/5 mb-2" />
          <div className="mx-auto h-4 w-48 rounded-full bg-white/5" />
        </div>

        {/* Form skeleton */}
        <div className="section-shell p-8 flex flex-col gap-5 bg-white/[0.02]">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-3 w-20 rounded-full bg-white/5" />
              <div className="h-12 w-full rounded-2xl bg-white/5" />
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <div className="h-3 w-20 rounded-full bg-white/5" />
            <div className="h-36 w-full rounded-2xl bg-white/5" />
          </div>
          <div className="h-12 w-full rounded-full bg-white/8" />
        </div>
      </div>
    </div>
  );
}
