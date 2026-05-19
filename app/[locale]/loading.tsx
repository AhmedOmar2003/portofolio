export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse px-6 pb-10 md:px-10 lg:px-12">
      {/* Hero skeleton */}
      <div className="mx-auto max-w-[1380px] py-24 md:py-32">
        <div className="h-5 w-40 rounded-full bg-white/5 mb-8" />
        <div className="h-16 w-3/4 max-w-2xl rounded-2xl bg-white/5 mb-4" />
        <div className="h-16 w-1/2 max-w-xl rounded-2xl bg-white/5 mb-6" />
        <div className="h-5 w-2/3 max-w-lg rounded-full bg-white/5 mb-10" />
        <div className="flex gap-4">
          <div className="h-12 w-36 rounded-full bg-white/8" />
          <div className="h-12 w-36 rounded-full bg-white/5" />
        </div>
      </div>

      {/* Projects skeleton */}
      <div className="mx-auto max-w-[1380px] py-16">
        <div className="h-4 w-32 rounded-full bg-white/5 mb-4" />
        <div className="h-8 w-64 rounded-xl bg-white/5 mb-2" />
        <div className="h-4 w-48 rounded-full bg-white/5 mb-10" />
        <div className="grid gap-6 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="section-shell h-72 rounded-3xl bg-white/[0.02]" />
          ))}
        </div>
      </div>

      {/* Services skeleton */}
      <div className="mx-auto max-w-[1380px] py-16">
        <div className="section-shell px-6 py-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="h-4 w-8 rounded-full bg-white/5" />
                <div className="h-6 w-40 rounded-xl bg-white/5" />
                <div className="h-16 w-full rounded-xl bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
