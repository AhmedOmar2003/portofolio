export default function ArticleDetailLoading() {
  return (
    <div className="animate-pulse px-6 pb-16 pt-10 md:px-10 lg:px-12">
      <div className="mx-auto max-w-3xl">
        {/* Back button */}
        <div className="h-9 w-32 rounded-full bg-white/5 mb-10" />

        {/* Meta */}
        <div className="flex gap-3 mb-6">
          <div className="h-4 w-24 rounded-full bg-white/5" />
          <div className="h-4 w-24 rounded-full bg-white/5" />
        </div>

        {/* Title */}
        <div className="h-12 w-5/6 rounded-2xl bg-white/5 mb-3" />
        <div className="h-12 w-3/4 rounded-2xl bg-white/5 mb-8" />

        {/* Description */}
        <div className="h-5 w-full rounded-full bg-white/5 mb-2" />
        <div className="h-5 w-4/5 rounded-full bg-white/5 mb-12" />

        {/* Article content */}
        <div className="flex flex-col gap-4">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-4 rounded-full bg-white/5"
              style={{ width: `${70 + (i % 3) * 10}%` }}
            />
          ))}
          <div className="my-4" />
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-4 rounded-full bg-white/5"
              style={{ width: `${65 + (i % 4) * 8}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
