export default function ArticlesLoading() {
  return (
    <div className="animate-pulse px-6 pb-16 pt-10 md:px-10 lg:px-12">
      <div className="mx-auto max-w-[1380px]">
        {/* Header */}
        <div className="mb-10">
          <div className="h-4 w-24 rounded-full bg-white/5 mb-4" />
          <div className="h-10 w-64 rounded-2xl bg-white/5 mb-2" />
          <div className="h-4 w-48 rounded-full bg-white/5" />
        </div>

        {/* Article list */}
        <div className="flex flex-col gap-6 max-w-3xl">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="section-shell p-6 rounded-3xl flex flex-col gap-3 bg-white/[0.02]">
              <div className="h-3 w-24 rounded-full bg-white/5" />
              <div className="h-7 w-4/5 rounded-xl bg-white/5" />
              <div className="h-4 w-full rounded-full bg-white/5" />
              <div className="h-4 w-3/4 rounded-full bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
