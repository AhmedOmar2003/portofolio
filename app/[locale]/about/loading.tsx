export default function AboutLoading() {
  return (
    <div className="animate-pulse px-6 pb-16 pt-10 md:px-10 lg:px-12">
      <div className="mx-auto max-w-[1380px]">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="h-48 w-48 rounded-3xl bg-white/5" />
            <div className="h-6 w-40 rounded-xl bg-white/5" />
            <div className="h-4 w-32 rounded-full bg-white/5" />
            <div className="flex flex-col gap-2 mt-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-10 w-full rounded-2xl bg-white/5" />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-8">
            <div className="h-4 w-24 rounded-full bg-white/5 mb-2" />
            <div className="h-10 w-3/4 rounded-2xl bg-white/5" />
            <div className="flex flex-col gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-4 w-full rounded-full bg-white/5" />
              ))}
              <div className="h-4 w-2/3 rounded-full bg-white/5" />
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 w-24 rounded-full bg-white/5" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
