import { useState } from "react";
import {
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import Link from "next/link";

type NavItem = { to: string; label: string; desc?: string };
type NavGroup = { label: string; items: NavItem[] };

const NAV: (NavItem | NavGroup)[] = [
  { to: "/", label: "Home" } as NavItem,
  {
    label: "Government",
    items: [
      { to: "/about", label: "About the LGA", desc: "History, wards, demographics" },
      { to: "/leadership", label: "Leadership", desc: "Chairman & council" },
      { to: "/departments", label: "Departments", desc: "Council departments & units" },
      // { to: "/notices", label: "Public Notices", desc: "Official announcements" },
    ],
  },
  {
    label: "Services",
    items: [
      { to: "/services", label: "All Services", desc: "Browse every digital service" },
      // { to: "/digital-services", label: "Digital Services", desc: "E-government portal" },
      { to: "/verify", label: "Verify Certificate", desc: "Authenticate documents" },
      { to: "/complaints", label: "Complaints & Support", desc: "Raise an issue" },
    ],
  },
  {
    label: "Invest & Visit",
    items: [
      { to: "/invest", label: "Investment Opportunities", desc: "Sectors & incentives" },
      { to: "/tourism", label: "Tourism & Culture", desc: "Heritage, festivals, places" },
      // { to: "/projects", label: "Projects", desc: "Ongoing & completed works" },
    ],
  },
  {
    label: "Resources",
    items: [
      { to: "/news", label: "News & Events", desc: "Updates from the council" },
      // { to: "/gallery", label: "Media Gallery", desc: "Photos & moments" },
      // { to: "/downloads", label: "Downloads", desc: "Official documents" },
      // { to: "/procurement", label: "Procurement", desc: "Open tenders & bids" },
      { to: "/careers", label: "Careers", desc: "Work with the LGA" },
      { to: "/faq", label: "FAQ", desc: "Common questions" },
    ],
  },
  { to: "/contact", label: "Contact" } as NavItem,
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
      <div className="hidden md:block bg-primary text-primary-foreground text-xs">
        <div className="container mx-auto px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-5 opacity-90">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3 w-3" /> +234 803 373 3155
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="h-3 w-3" /> info@odeda.lg.gov.ng
            </span>
          </div>
          {/* <div className="flex items-center gap-3 opacity-90">
            <FaFacebookF className="h-3 w-3" />
            <FaTwitter className="h-3 w-3" />
            <FaInstagram className="h-3 w-3" />
            <FaYoutube className="h-3 w-3" />
          </div> */}
        </div>
      </div>

      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/85 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero shadow-elegant group-hover:scale-105 transition-bounce">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight">Odeda LGA</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Ogun State · Official Portal
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
            {NAV.map((n) => {
              if ("to" in n) {
                return (
                  <Link
                    key={n.label}
                    href={n.to}
                    onMouseEnter={() => setHovered(null)}
                    className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-smooth rounded-md"
                    // active={{ className: "text-primary font-semibold" }}
                    // activeOptions={{ exact: n.to === "/" }}
                  >
                    {n.label}
                  </Link>
                );
              }
              const isOpen = hovered === n.label;
              return (
                <div key={n.label} className="relative" onMouseEnter={() => setHovered(n.label)}>
                  <button
                    className={`px-3 py-2 text-sm font-medium rounded-md inline-flex items-center gap-1 transition-smooth ${isOpen ? "text-primary" : "text-foreground/70 hover:text-primary"}`}
                  >
                    {n.label}{" "}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="absolute left-0 top-full pt-2 w-[420px] animate-fade-in">
                      <div className="rounded-xl border border-border/60 bg-background shadow-elegant p-2 grid">
                        {n.items.map((it) => (
                          <Link
                            key={it.to}
                            href={it.to}
                            onClick={() => setHovered(null)}
                            className="rounded-lg px-3 py-2.5 hover:bg-secondary transition-smooth"
                          >
                            <div className="text-sm font-semibold">{it.label}</div>
                            {it.desc && (
                              <div className="text-xs text-muted-foreground">{it.desc}</div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-gradient-hero shadow-elegant hover:shadow-glow transition-smooth"
            >
              <Link href="/register">Citizen Portal</Link>
            </Button>
          </div>

          <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border/40 bg-background max-h-[80vh] overflow-y-auto">
            <div className="container mx-auto flex flex-col gap-1 p-4">
              {NAV.flatMap((n) => ("to" in n ? [n] : n.items)).map((l) => (
                <Link
                  key={l.to}
                  href={l.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted"
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-3">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild className="flex-1 bg-gradient-hero">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 px-4 py-14">
        <div className="col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-gold">
              <ShieldCheck className="h-6 w-6 text-gold-foreground" />
            </div>
            <div>
              <div className="font-bold">Odeda Local Government Area</div>
              <div className="text-[10px] uppercase tracking-wider opacity-70">
                Ogun State, Nigeria
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm opacity-70 max-w-md leading-relaxed">
            The official digital home of Odeda Local Government Area — bringing transparent
            governance, modern services and economic opportunity to every citizen, business and
            investor.
          </p>
          <div className="mt-5 space-y-2 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" /> LGA Secretariat, Odeda, Ogun State
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" /> +234 803 373 3155
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" /> info@odeda.lg.gov.ng
            </div>
          </div>
          {/* <div className="mt-5 flex gap-3 opacity-80">
            <FaFacebookF className="h-4 w-4" />
            <FaTwitter className="h-4 w-4" />
            <FaInstagram className="h-4 w-4" />
            <FaYoutube className="h-4 w-4" />
          </div> */}
        </div>
        <FooterCol
          title="Government"
          links={[
            { to: "/about", label: "About" },
            { to: "/leadership", label: "Leadership" },
            { to: "/departments", label: "Departments" },
            // { to: "/notices", label: "Public Notices" },
            // { to: "/projects", label: "Projects" },
          ]}
        />
        <FooterCol
          title="Services"
          links={[
            { to: "/services", label: "All Services" },
            // { to: "/digital-services", label: "Digital Services Portal" },
            { to: "/verify", label: "Verify Certificate" },
            { to: "/complaints", label: "Complaints" },
            { to: "/login", label: "Sign in" },
          ]}
        />
        <FooterCol
          title="Resources"
          links={[
            { to: "/invest", label: "Invest" },
            { to: "/tourism", label: "Tourism & Culture" },
            { to: "/news", label: "News & Events" },
            // { to: "/gallery", label: "Gallery" },
            // { to: "/downloads", label: "Downloads" },
            { to: "/careers", label: "Careers" },
            // { to: "/procurement", label: "Procurement" },
            { to: "/faq", label: "FAQ" },
            { to: "/contact", label: "Contact" },
          ]}
        />
      </div>
      <div className="border-t border-sidebar-border/40">
        <div className="container mx-auto px-4 py-5 text-xs opacity-60 flex flex-col md:flex-row justify-between gap-2">
          <span>
            © {new Date().getFullYear()} Odeda Local Government Area, Ogun State. All rights
            reserved.
          </span>
          <span>Official Website · Odeda Local Government Area</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="font-semibold mb-3 text-sm">{title}</h4>
      <ul className="space-y-2 text-sm opacity-80">
        {links.map((l) => (
          <li key={l.to + l.label}>
            <Link href={l.to} className="hover:opacity-100 hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
