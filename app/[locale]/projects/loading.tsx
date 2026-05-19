export default function ProjectsLoading() {
  return (
    <div className="animate-pulse px-6 pb-16 pt-10 md:px-10 lg:px-12">
      <div className="mx-auto max-w-[1380px]">
        {/* Header */}
        <div className="mb-10">
          <div className="h-4 w-28 rounded-full bg-white/5 mb-4" />
          <div className="h-10 w-72 rounded-2xl bg-white/5 mb-2" />
          <div className="h-4 w-56 rounded-full bg-white/5" />
        </div>

        {/* Filter tabs */}
        <div className="mb-8 flex gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-9 w-24 rounded-full bg-white/5" />
          ))}
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="section-shell h-64 rounded-3xl bg-white/[0.02]" />
          ))}
        </div>
      </div>
    </div>
  );
}
