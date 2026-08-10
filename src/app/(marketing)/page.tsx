/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  ArrowRight,
  FileBadge,
  Store,
  Truck,
  ScrollText,
  Receipt,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Quote,
  Calendar,
  TrendingUp,
  Users,
  Building2,
  Phone,
  Mail,
  MapPin,
  Crown,
  Sprout,
  Camera,
  Home,
  Pickaxe,
} from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import {
  STATS,
  SERVICES,
  // REVENUE_CHART,
  TESTIMONIALS,
  NEWS,
  LEADERSHIP,
  INVEST_OPPS,
  TOURISM,
  WARDS_INFO,
} from "@/lib/mock-data";
import bannerSecretariat from "@/assets/banner5.png";
import bannerOjudeOba from "@/assets/banner1.png";
import bannerMarket from "@/assets/banner2.png";
import bannerInfra from "@/assets/banner3.png";
import bannerFour from "@/assets/banner4.png";
import Link from "next/link";
import Image from "next/image";
import { Helmet } from "react-helmet-async";

const ICONS: Record<string, any> = {
  FileBadge,
  Store,
  Truck,
  ScrollText,
  Receipt,
  MessageSquare,
  Sprout,
  Home,
  Pickaxe,
};

function HomePage() {
  return (
    <>
      <Helmet>
        <title>
          Welcome to the Official Website of Odeda Local Government Area,
          Ogun State, Nigeria.
        </title>
        <link rel="canonical" href="https://www.odeda.lg.gov.ng/" />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">
          <HeroBanner />
          <ChairmanSection />
          <StatsSection />
          <WardsMap />
          <ServicesSection />

          <FeaturedServices />
          <InvestSection />
          <CultureSection />
          {/* <LeadershipPreview /> */}
          <NewsSection />
          {/* <Testimonials /> */}
          <CTASection />
          <ContactSection />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}

function HeroBanner() {
  const slides = [
    {
      img: bannerSecretariat,
      eyebrow: "Official Government Platform",
      title: "Building a Smarter Odeda Local Government",
      subtitle:
        "Delivering transparent governance, digital public services, and sustainable development for every resident",
      cta: { label: "Explore Our Local Government", to: "/dashboard" as const },
      alt: "Odeda LGA Secretariat Complex, Ogun State",
    },
    {
      img: bannerOjudeOba,
      eyebrow: "Agriculture & Rural Prosperity",
      title: "Growing Agriculture, Growing Prosperity",
      subtitle:
        "Supporting farmers, agribusinesses, food production, and rural development across Odeda LGA.",
      cta: { label: "Investment Opportunities", to: "/tourism" as const },
      alt: "Cultural parade and harvest celebrations",
    },
    {
      img: bannerInfra,
      eyebrow: "Education & Youth Development",
      title: "Empowering the Next Generation",
      subtitle:
        "Creating opportunities for education, digital skills, entrepreneurship, innovation, and youth empowerment.",
      cta: { label: "Youth Programs", to: "/projects" as const },
      alt: "Newly paved road with solar streetlights",
    },
    {
      img: bannerMarket,
      eyebrow: "Culture & Heritage",
      title: "Proud Heritage. Bright Future.",
      subtitle:
        "Celebrating our rich Egba Yoruba culture while embracing innovation, education, and economic growth.",
      cta: { label: "Discover Our Communities", to: "/invest" as const },
      alt: "Bustling Osiele and Odeda markets with traders and produce",
    },
    {
      img: bannerFour,
      eyebrow: "Together We Move Forward",
      title: `One Community.
One Vision.
One Future.
`,
      subtitle:
        "Working together to build an inclusive, transparent, innovative, and prosperous Odeda Local Government Area.",
      cta: { label: "Meet the Chairman", to: "/invest" as const },
      alt: "Bustling Odeda market with traders and produce",
    },
  ];
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="relative">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 6000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {slides.map((s, i) => (
            <CarouselItem key={s.title} className="pl-0 relative">
              <div className="relative h-[78vh] min-h-[520px] max-h-[760px] w-full overflow-hidden">
                <Image
                  src={s.img}
                  alt={s.alt}
                  width={1920}
                  height={1080}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-cover scale-105 animate-[fade-in_1s_ease-out]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="container mx-auto relative h-full px-4 flex items-center">
                  <div className="max-w-2xl space-y-5 animate-fade-up">
                    <Badge className="bg-secondary/90 text-primary border border-primary/30 backdrop-blur">
                      <Sparkles className="h-3 w-3 mr-1.5" />
                      {s.eyebrow}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                      {/* {s.title.includes("Odeda") ? (
                        <>
                          Modern public services for{" "}
                          <span className="text-gradient-primary">Odeda LGA</span>
                        </>
                      ) : (
                        s.title
                      )} */}
                      {s.title}
                    </h1>
                    <p className="text-lg text-foreground/85 max-w-xl leading-relaxed">
                      {s.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button
                        asChild
                        size="lg"
                        className="bg-gradient-hero shadow-elegant hover:shadow-glow"
                      >
                        <Link href={s.cta.to}>
                          {s.cta.label}{" "}
                          <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Link>
                      </Button>
                      {/* <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="bg-background/70 backdrop-blur"
                      >
                        <Link href="/login">Sign in</Link>
                      </Button> */}
                      <Button asChild size="lg" variant="ghost">
                        <Link href="/verify">Verify Certificate</Link>
                      </Button>
                    </div>
                    <div className="flex items-center gap-5 pt-3 text-sm text-foreground/80">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-success" /> Secure
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-success" />{" "}
                        Instant Receipts
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-success" /> 24/7
                        Access
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${current === i ? "w-8 bg-primary" : "w-2.5 bg-foreground/30 hover:bg-foreground/50"}`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
}

function StatsSection() {
  const icons = [Icons.LandPlot, Icons.MapPinned, Building2];
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {STATS.map((s, i) => {
          const Icon = icons[i];
          return (
            <Card
              key={s.label}
              className="p-5 bg-gradient-card border-border/40 hover:shadow-elegant transition-smooth"
            >
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                {/* <span className="text-xs font-semibold text-success">
                  {s.trend}
                </span> */}
              </div>
              <div className="mt-4 text-2xl md:text-3xl font-bold tracking-tight">
                {s.value}
              </div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Badge variant="outline" className="mb-3">
          Our Services
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Everything your council does — online
        </h2>
        <p className="mt-3 text-muted-foreground">
          From certificates to levies, every workflow is seamless, traceable and
          verifiable.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SERVICES.map((s) => {
          const Icon = ICONS[s.icon] || FileBadge;
          return (
            <Card
              key={s.title}
              className="group p-6 bg-gradient-card border-border/40 hover:shadow-elegant hover:-translate-y-1 transition-smooth"
            >
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 bg-${s.color}/10 text-${s.color === "gold" ? "gold-foreground" : s.color}`}
                style={{
                  backgroundColor: `color-mix(in oklab, var(--${s.color}) 12%, transparent)`,
                }}
              >
                <Icon
                  className="h-6 w-6"
                  style={{ color: `var(--${s.color})` }}
                />
              </div>
              <h3 className="font-semibold text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
              <Link
                href="/login"
                className="mt-4 inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 gap-1 transition-all"
              >
                Access service <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function FeaturedServices() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-20">
      <div className="grid md:grid-cols-2 gap-5">
        <Card className="relative overflow-hidden p-8 md:p-10 bg-gradient-hero text-primary-foreground border-0">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />
          <Badge className="bg-white/15 text-white border-white/20 backdrop-blur">
            Featured
          </Badge>
          <h3 className="mt-4 text-2xl md:text-3xl font-bold">
            State of Origin Certificate
          </h3>
          <p className="mt-2 opacity-90 max-w-md">
            Apply, pay, get reviewed by your LGA Admin and Ward Councillor, then
            download a QR-verified certificate — all online.
          </p>
          <Button
            asChild
            variant="secondary"
            className="mt-6 bg-gold text-gold-foreground hover:bg-gold/90"
          >
            <Link href="/login">
              Apply now <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </Card>
        <Card className="relative overflow-hidden p-8 md:p-10 bg-gradient-gold text-gold-foreground border-0">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
          <Badge className="bg-black/10 text-gold-foreground border-black/10">
            For Businesses
          </Badge>
          <h3 className="mt-4 text-2xl md:text-3xl font-bold">
            Demand Notices & Permits
          </h3>
          <p className="mt-2 opacity-90 max-w-md">
            Receive official demand notices in your dashboard, settle them
            online, and download verifiable digital receipts instantly.
          </p>
          <Button
            asChild
            className="mt-6 bg-foreground text-background hover:bg-foreground/90"
          >
            <Link href="/register">
              Register your business <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </div>
    </section>
  );
}

function NewsSection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <Badge variant="outline" className="mb-3">
            News & Events
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Latest from your council
          </h2>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {NEWS.map((n) => (
          <Card
            key={n.title}
            className="p-6 bg-gradient-card border-border/40 hover:shadow-elegant transition-smooth"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" /> {n.date}
              <Badge variant="outline" className="ml-auto">
                {n.tag}
              </Badge>
            </div>
            <h3 className="mt-3 font-semibold leading-snug">{n.title}</h3>
            <Link
              href="/"
              className="mt-4 inline-flex items-center text-sm text-primary font-medium gap-1 hover:gap-2 transition-all"
            >
              Read more <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="bg-secondary/40 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="outline" className="mb-3">
            Testimonials
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Trusted by citizens and businesses
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <Card
              key={t.name}
              className="p-6 bg-background border-border/40 hover:shadow-elegant transition-smooth"
            >
              <Quote className="h-6 w-6 text-gold" />
              <p className="mt-3 text-sm leading-relaxed">"{t.quote}"</p>
              <div className="mt-5 pt-5 border-t border-border/60">
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <Card className="relative overflow-hidden p-10 md:p-16 text-center bg-gradient-hero border-0 text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Ready to access government services online?
          </h2>
          <p className="mt-3 opacity-90 max-w-xl mx-auto">
            Create your account in under a minute. Citizens, businesses and
            council staff are all welcome.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-gold"
            >
              <Link href="/register">Create account</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="container mx-auto px-4 py-16 md:py-20">
      <div className="grid md:grid-cols-3 gap-5">
        {[
          {
            icon: MapPin,
            title: "Visit us",
            lines: ["Odeda LGA Secretariat Complex", "Odeda Town, Ogun State"],
          },
          {
            icon: Phone,
            title: "Call us",
            lines: ["+234 803 373 3155", "Mon – Fri, 8am – 5pm"],
          },
          {
            icon: Mail,
            title: "Email us",
            lines: ["info@odeda.lg.gov.ng"],
          },
        ].map((c) => (
          <Card key={c.title} className="p-6 bg-gradient-card border-border/40">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <c.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold">{c.title}</h3>
            {c.lines.map((l) => (
              <div key={l} className="text-sm text-muted-foreground">
                {l}
              </div>
            ))}
          </Card>
        ))}
      </div>
    </section>
  );
}

function ChairmanSection() {
  const c = LEADERSHIP[0];
  return (
    <section className="container mx-auto px-4 py-16 md:py-20">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <Badge variant="outline" className="mb-3">
          Welcome Address
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          A message from our Executive Chairman
        </h2>
      </div>
      <Card className="overflow-hidden border-border/40 bg-gradient-card shadow-elegant">
        <div className="grid md:grid-cols-5">
          <div className="md:col-span-2 relative bg-gradient-hero text-primary-foreground">
            {c.image && (
              <Image
                src={c.image}
                alt={`${c.name}, ${c.role}`}
                className="w-full h-full object-cover object-top md:absolute md:inset-0"
                loading="lazy"
                fill
              />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-gold" />
                <span className="text-xs uppercase tracking-wider opacity-90">
                  Executive Chairman
                </span>
              </div>
              <div className="mt-1 font-bold text-lg leading-tight">
                {c.name}
              </div>
            </div>
          </div>
          <div className="md:col-span-3 p-8 md:p-10">
            <Quote className="h-7 w-7 text-gold" />
            <div className="mt-3 space-y-4 text-sm md:text-base leading-relaxed text-foreground/90">
              <p>
                Dear citizens, residents, farmers, investors and friends of Odeda
                Local Government Area,
              </p>
              <p>
                It is with profound humility and deep gratitude to Almighty God
                that I welcome you to the official digital home of Odeda Local Government Area. Our administration is firmly committed to
                building an Odeda LGA where every community — from{" "}
                <strong>Odeda Secretariat</strong>, our headquarters, to Osiele, Obantoko, Olugbo, Alagbagba, Ilugun, Opeji, and Camp/FUNAAB corridor — feels the impact of
                purposeful, people-centred governance.
              </p>
              <p>
                Since assuming office, we have focused on the issues that matter
                most to you: rehabilitating critical farm-to-market roads, strengthening security across our 10 wards, supporting our farmers, traders and
                youths, and modernising council services via LOGMAS.
              </p>
              <p>
                Governance must be open, accountable and accessible. That is why
                we are bringing every service — Certificate of Origin, Business Permit, Haulage Pass, Building Approval, demand notices, complaints and receipts — into one transparent digital
                ecosystem you can reach from anywhere, at any time.
              </p>
              <p>
                I invite you to explore this portal, engage with us, hold us
                accountable, and partner with us in writing the next chapter of
                our shared story. Together, with God's guidance and your
                support, Odeda Local Government Area will continue to rise.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-border/40">
              <div className="font-semibold">— Hon. Folusho Joseph Badejo</div>
              <div className="text-xs text-muted-foreground">
                Executive Chairman, Odeda Local Government Area · Ogun State
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-gradient-hero shadow-elegant">
                <Link href="/leadership">
                  Meet the leadership <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/about">About the LGA</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

function InvestSection() {
  return (
    <section className="bg-secondary/40 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <Badge variant="outline" className="mb-3">
              Invest in Odeda LGA
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              High-yield opportunities in Solid Minerals, Agro-processing & Real Estate
            </h2>
          </div>
          <Button asChild className="bg-gradient-hero shadow-elegant">
            <Link href="/invest">
              Explore all sectors <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {INVEST_OPPS.slice(0, 6).map((o) => {
            const Icon = (Icons as any)[o.icon] ?? Sprout;
            return (
              <Card
                key={o.sector}
                className="p-6 bg-background border-border/40 hover:shadow-elegant transition-smooth"
              >
                <div className="h-11 w-11 rounded-xl bg-gold/15 text-gold-foreground flex items-center justify-center mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{o.sector}</h3>
                  <Badge className="bg-success/10 text-success border-success/30">
                    ROI {o.roi}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{o.desc}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CultureSection() {
  const palette = ["primary", "gold", "info"];
  return (
    <section className="container mx-auto px-4 py-16 md:py-20">
      <div className="grid lg:grid-cols-5 gap-8 items-center">
        <div className="lg:col-span-2">
          <Badge variant="outline" className="mb-3">
            Culture & Tourism
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            A living heritage worth visiting
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            From Arakanga Forest Reserve to traditional chieftaincy heritage,
            historic landmarks and unforgettable Egba cuisine — Odeda LGA
            invites you to experience Yoruba culture at its richest.
          </p>
          <div className="mt-6 flex gap-3">
            <Button asChild className="bg-gradient-hero shadow-elegant">
              <Link href="/tourism">Explore tourism</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/gallery">
                <Camera className="h-4 w-4 mr-1.5" /> Gallery
              </Link>
            </Button>
          </div>
        </div>
        <div className="lg:col-span-3 grid sm:grid-cols-3 gap-4">
          {TOURISM.slice(0, 3).map((t, i) => (
            <Card
              key={t.title}
              className="overflow-hidden border-border/40 bg-gradient-card"
            >
              <div
                className="h-32"
                style={{
                  background: `linear-gradient(135deg, color-mix(in oklab, var(--${palette[i]}) 70%, transparent), color-mix(in oklab, var(--gold) 40%, transparent))`,
                }}
              />
              <div className="p-4">
                <Badge variant="outline" className="text-xs">
                  {t.tag}
                </Badge>
                <h4 className="mt-2 font-semibold text-sm">{t.title}</h4>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function LeadershipPreview() {
  return (
    <section className="bg-secondary/40 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <Badge variant="outline" className="mb-3">
              Council Leadership
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              A team committed to service
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/leadership">
              View full council <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LEADERSHIP.slice(0, 4).map((m) => (
            <Card
              key={m.name}
              className="p-5 bg-background border-border/40 hover:shadow-elegant transition-smooth text-center"
            >
              <div className="h-20 w-20 rounded-2xl bg-gradient-hero text-primary-foreground flex items-center justify-center font-bold text-xl mx-auto">
                {m.initials}
              </div>
              <div className="mt-3 font-semibold">{m.name}</div>
              <div className="text-xs text-muted-foreground">{m.role}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function WardsMap() {
  const [active, setActive] = useState(0);
  const ward = WARDS_INFO[active];
  return (
    <section className="bg-gradient-mesh border-y border-border/40 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="outline" className="mb-3">
            Our 10 Wards
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Explore Odeda Local Government Area
          </h2>
          <p className="mt-3 text-muted-foreground">
            A council of ten unique wards — each with its own agricultural, mineral, educational and cultural assets. Tap a ward to learn more.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Map */}
          <Card className="lg:col-span-3 p-4 md:p-6 bg-gradient-card border-border/40 shadow-elegant">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[color-mix(in_oklab,var(--success)_8%,var(--background))]">
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="lgaFill" x1="0" y1="0" x2="1" y2="1">
                    <stop
                      offset="0%"
                      stopColor="color-mix(in oklab, var(--primary) 35%, transparent)"
                    />
                    <stop
                      offset="100%"
                      stopColor="color-mix(in oklab, var(--gold) 35%, transparent)"
                    />
                  </linearGradient>
                  <pattern
                    id="grid"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 10 0 L 0 0 0 10"
                      fill="none"
                      stroke="color-mix(in oklab, var(--border) 50%, transparent)"
                      strokeWidth="0.2"
                    />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
                {/* Stylized LGA boundary */}
                <path
                  d="M 14,38 Q 18,18 38,16 Q 60,10 78,18 Q 92,26 90,46 Q 94,64 82,80 Q 66,92 46,90 Q 24,90 14,72 Q 8,56 14,38 Z"
                  fill="url(#lgaFill)"
                  stroke="var(--primary)"
                  strokeWidth="0.6"
                />
                {/* Internal ward boundary hints */}
                <g
                  stroke="color-mix(in oklab, var(--primary) 35%, transparent)"
                  strokeWidth="0.25"
                  fill="none"
                  strokeDasharray="1 1"
                >
                  <path d="M 50,16 L 50,90" />
                  <path d="M 14,48 L 90,48" />
                  <path d="M 30,16 L 38,90" />
                  <path d="M 70,16 L 62,90" />
                </g>
                {/* Ward markers */}
                {WARDS_INFO.map((w, i) => (
                  <g
                    key={w.name}
                    transform={`translate(${w.x} ${w.y})`}
                    className="cursor-pointer"
                    onClick={() => setActive(i)}
                  >
                    <circle
                      r={active === i ? 4.4 : 2.6}
                      fill={`var(--${w.accent})`}
                      opacity={active === i ? 0.25 : 0.18}
                    >
                      {active === i && (
                        <animate
                          attributeName="r"
                          values="3.2;5.4;3.2"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      )}
                    </circle>
                    <circle
                      r={active === i ? 2 : 1.6}
                      fill={`var(--${w.accent})`}
                      stroke="white"
                      strokeWidth="0.4"
                    />
                    <text
                      x={0}
                      y={-3}
                      textAnchor="middle"
                      fontSize={active === i ? "3" : "2.4"}
                      fontWeight={active === i ? 700 : 500}
                      fill="var(--foreground)"
                      style={{
                        paintOrder: "stroke",
                        stroke:
                          "color-mix(in oklab, var(--background) 80%, transparent)",
                        strokeWidth: 0.6,
                      }}
                    >
                      {w.name}
                    </text>
                  </g>
                ))}
                {/* Compass */}
                <g
                  transform="translate(90 10)"
                  fontSize="3"
                  fill="var(--muted-foreground)"
                >
                  <circle
                    r="3.6"
                    fill="color-mix(in oklab, var(--background) 80%, transparent)"
                    stroke="var(--border)"
                    strokeWidth="0.3"
                  />
                  <text textAnchor="middle" y="-1.2">
                    N
                  </text>
                  <path
                    d="M 0,-3 L 0,3"
                    stroke="var(--primary)"
                    strokeWidth="0.4"
                  />
                </g>
              </svg>
              <div className="absolute bottom-3 left-3 text-[10px] uppercase tracking-wider text-muted-foreground bg-background/70 backdrop-blur rounded-md px-2 py-1 border border-border/40">
                Odeda LGA · Ogun State
              </div>
            </div>
          </Card>

          {/* Ward info panel */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6 bg-gradient-card border-border/40 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `color-mix(in oklab, var(--${ward.accent}) 15%, transparent)`,
                    color: `var(--${ward.accent})`,
                  }}
                >
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Ward
                  </div>
                  <div className="text-xl font-bold">{ward.name}</div>
                </div>
                <Badge className="ml-auto" variant="outline">
                  {ward.population} residents
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {ward.feature}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href="/leadership">Ward leadership</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/projects">Projects here</Link>
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              {WARDS_INFO.map((w, i) => (
                <button
                  key={w.name}
                  onClick={() => setActive(i)}
                  className={`text-left px-3 py-2 rounded-lg border transition-smooth text-sm ${active === i ? "border-primary bg-primary/5 font-semibold" : "border-border/60 hover:border-primary/40 hover:bg-secondary/40"}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: `var(--${w.accent})` }}
                    />
                    {w.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
