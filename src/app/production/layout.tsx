import Link from "next/link";

const navItems = [
  { href: "/production", label: "🎭 Spectacles" },
  { href: "/production/representations", label: "📅 Représentations" },
  { href: "/production/objets", label: "🎪 Objets" },
];

export default function ProductionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md border-b-4 border-[#D00039]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-[#D00039] hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="py-8">{children}</main>
    </div>
  );
}
