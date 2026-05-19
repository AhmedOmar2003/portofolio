export default function AdminLoading() {
  return (
    <div className="animate-pulse p-6 md:p-10">
      {/* Page header */}
      <div className="mb-8">
        <div className="h-4 w-20 rounded-full bg-white/5 mb-3" />
        <div className="h-8 w-52 rounded-2xl bg-white/5" />
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="admin-card h-24 rounded-2xl bg-white/[0.02]" />
        ))}
      </div>

      {/* Content area */}
      <div className="admin-card rounded-2xl p-6 flex flex-col gap-4 bg-white/[0.02]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-white/5 shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-4 w-1/3 rounded-full bg-white/5" />
              <div className="h-3 w-2/3 rounded-full bg-white/5" />
            </div>
            <div className="h-8 w-20 rounded-full bg-white/5 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
