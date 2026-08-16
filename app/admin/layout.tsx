import Link from "next/link";
import SignOutButton from "@/components/admin/SignOutButton";
import { siteConfig } from "@/lib/site-config";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a", color: "#f3e3d5" }}>
      <header style={{ background: "#141414", borderBottom: "1px solid rgba(198,160,107,0.2)" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <span className="font-serif text-sm" style={{ color: "#c6a06b" }}>
              Dessi Dollhouse Admin
            </span>
            <nav className="hidden items-center gap-4 sm:flex">
              {[
                { href: "/admin", label: "Dashboard" },
                { href: "/admin/leads", label: "Leads" },
                { href: "/admin/ambassadors", label: "Ambassadors" },
                { href: "/admin/qr", label: "QR Code" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-xs transition-opacity hover:opacity-80"
                  style={{ color: "#c9c9c9" }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs transition-opacity hover:opacity-70"
              style={{ color: "rgba(138,122,110,0.7)" }}
            >
              ← Site
            </Link>
            <SignOutButton />
          </div>
        </div>
        {/* Mobile nav */}
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 sm:hidden">
          {[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/leads", label: "Leads" },
            { href: "/admin/ambassadors", label: "Ambassadors" },
            { href: "/admin/qr", label: "QR" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="shrink-0 text-xs transition-opacity hover:opacity-80"
              style={{ color: "#c9c9c9" }}
            >
              {label}
            </Link>
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
      <footer className="border-t py-4 text-center text-xs" style={{ borderColor: "rgba(198,160,107,0.1)", color: "rgba(138,122,110,0.5)" }}>
        {siteConfig.businessName} Admin · {siteConfig.phone}
      </footer>
    </div>
  );
}
