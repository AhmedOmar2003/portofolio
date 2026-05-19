export default function ProjectDetailLoading() {
  return (
    <div className="animate-pulse px-6 pb-16 pt-10 md:px-10 lg:px-12">
      <div className="mx-auto max-w-[1380px]">
        {/* Back button */}
        <div className="h-9 w-32 rounded-full bg-white/5 mb-10" />

        {/* Hero */}
        <div className="mb-12">
          <div className="h-4 w-24 rounded-full bg-white/5 mb-4" />
          <div className="h-12 w-3/4 rounded-2xl bg-white/5 mb-3" />
          <div className="h-5 w-full max-w-2xl rounded-full bg-white/5 mb-2" />
          <div className="h-5 w-2/3 max-w-xl rounded-full bg-white/5" />
        </div>

        {/* Image carousel */}
        <div className="h-[400px] w-full rounded-3xl bg-white/5 mb-12 md:h-[500px]" />

        {/* Meta tags row */}
        <div className="flex flex-wrap gap-3 mb-12">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-24 rounded-full bg-white/5" />
          ))}
        </div>

        {/* Content blocks */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="section-shell p-8 flex flex-col gap-3 bg-white/[0.02]">
                <div className="h-6 w-48 rounded-xl bg-white/5 mb-2" />
                {[0, 1, 2, 3].map((j) => (
                  <div key={j} className="h-4 w-full rounded-full bg-white/5" />
                ))}
                <div className="h-4 w-2/3 rounded-full bg-white/5" />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <div className="section-shell p-6 bg-white/[0.02] h-64" />
            <div className="section-shell p-6 bg-white/[0.02] h-48" />
          </div>
        </div>
      </div>
    </div>
  );
}
