"use client";
import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Menu,
  X,
  ArrowRight,
  Search,
  ChevronDown,
  ArrowUpRight,
  Users,
  Trophy,
  Handshake,
  Headphones,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Zap,
  Layers,
  Coins,
  Scale,
  Target,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { GlobalSearchDialog } from "@/components/search/GlobalSearchDialog";

interface NavColumnItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  titleKey: string;
  descKey: string;
  href: string;
  priceKey?: string;
  external?: boolean;
}

interface NavColumn {
  titleKey: string;
  items: NavColumnItem[];
}

export function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const t = useTranslations("nav");
  const tSearch = useTranslations("search");
  const pathname = usePathname();

  // Programs / Objectives Menu Data (Matching Company 2-column icon grid format)
  const programColumns: NavColumn[] = [
    {
      titleKey: "fundingModelsHeader",
      items: [
        {
          icon: Zap,
          titleKey: "oneStepTitle",
          descKey: "oneStepDesc",
          href: "/evaluation",
          priceKey: "oneStepPrice",
        },
        {
          icon: Layers,
          titleKey: "twoStepTitle",
          descKey: "twoStepDesc",
          href: "/evaluation",
          priceKey: "twoStepPrice",
        },
        {
          icon: Coins,
          titleKey: "instantTitle",
          descKey: "instantDesc",
          href: "/instant",
          priceKey: "instantPrice",
        },
      ],
    },
    {
      titleKey: "rulesToolsHeader",
      items: [
        {
          icon: Scale,
          titleKey: "compareAllTitle",
          descKey: "compareAllDesc",
          href: "/trading-objectives#compare-models",
        },
        {
          icon: Target,
          titleKey: "tradingObjectivesTitle",
          descKey: "tradingObjectivesDesc",
          href: "/trading-objectives#evaluation-selector",
        },
        {
          icon: HelpCircle,
          titleKey: "rulesFaqTitle",
          descKey: "rulesFaqDesc",
          href: "/trading-objectives#objectives-faq",
        },
      ],
    },
  ];

  // Company Menu Data (Matching 2-column icon grid format)
  const companyColumns: NavColumn[] = [
    {
      titleKey: "companyHeader",
      items: [
        {
          icon: ShieldCheck,
          titleKey: "aboutUs",
          descKey: "aboutUsDesc",
          href: "/about-us",
        },
        {
          icon: Trophy,
          titleKey: "payoutsProof",
          descKey: "payoutsProofDesc",
          href: "/payouts",
        },
        {
          icon: Handshake,
          titleKey: "affiliateProgram",
          descKey: "affiliateProgramDesc",
          href: "/affiliates",
        },
      ],
    },
    {
      titleKey: "connectHeader",
      items: [
        {
          icon: Headphones,
          titleKey: "support247",
          descKey: "support247Desc",
          href: "/contact",
        },
        {
          icon: BookOpen,
          titleKey: "blogTitle",
          descKey: "blogDesc",
          href: "/blog",
        },
        {
          icon: HelpCircle,
          titleKey: "helpCenter",
          descKey: "helpCenterDesc",
          href: "https://intercom.help/ck-capital/",
          external: true,
        },
      ],
    },
  ];

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const onResize = () => window.innerWidth >= 1280 && setOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const navRef = useRef<HTMLElement>(null);
  const programsTriggerRef = useRef<HTMLAnchorElement>(null);
  const companyTriggerRef = useRef<HTMLButtonElement>(null);
  const [programsCaretLeft, setProgramsCaretLeft] = useState<number | null>(null);
  const [companyCaretLeft, setCompanyCaretLeft] = useState<number | null>(null);
  const [activeMegaMenu, setActiveMegaMenu] = useState<"programs" | "company" | null>(null);

  const updateCaretPositions = useCallback(() => {
    if (!navRef.current) return;
    const navRect = navRef.current.getBoundingClientRect();

    if (programsTriggerRef.current) {
      const triggerRect = programsTriggerRef.current.getBoundingClientRect();
      const center = triggerRect.left + triggerRect.width / 2 - navRect.left;
      setProgramsCaretLeft(center);
    }

    if (companyTriggerRef.current) {
      const triggerRect = companyTriggerRef.current.getBoundingClientRect();
      const center = triggerRect.left + triggerRect.width / 2 - navRect.left;
      setCompanyCaretLeft(center);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateCaretPositions);
    return () => window.removeEventListener("resize", updateCaretPositions);
  }, [updateCaretPositions]);

  const isProgramsActive =
    pathname.startsWith("/evaluation") ||
    pathname.startsWith("/instant") ||
    pathname.startsWith("/trading-objectives");

  const isCompanyActive =
    pathname.startsWith("/about-us") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/blog");

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // Close menus smoothly so click events register cleanly
    setOpen(false);
    setMobileExpanded(null);
    setActiveMegaMenu(null);

    if (!href || href.startsWith("http") || href.startsWith("mailto:")) {
      return;
    }

    if (href.includes("#")) {
      const [targetPath, hash] = href.split("#");
      const normTarget = targetPath === "" ? "/" : targetPath;
      const normCurrent = pathname === "" ? "/" : pathname;

      const isTargetPage =
        normCurrent === normTarget ||
        (normTarget === "/trading-objectives" &&
          normCurrent.startsWith("/trading-objectives"));

      if (isTargetPage && hash) {
        e.preventDefault();
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.replaceState(
            null,
            "",
            `${window.location.pathname}#${hash}`
          );
        }
      }
    } else {
      // No specific target ID -> ALWAYS SCROLL TO 0
      const normTarget = href === "" ? "/" : href;
      const normCurrent = pathname === "" ? "/" : pathname;

      if (normCurrent === normTarget) {
        e.preventDefault();
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    }
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-colors duration-300 ease-out",
          open
            ? "bg-[#030A1C] border-b border-white/[0.08] pointer-events-auto"
            : scrolled
            ? "bg-transparent border-b border-transparent pointer-events-none"
            : "bg-[#030A1C] border-b border-white/[0.08] pointer-events-auto"
        )}
        data-od-id="top-nav"
      >
        <nav
          ref={navRef}
          className={cn(
            "relative max-w-7xl transform-gpu transition-[transform,border-radius,box-shadow,border-color] duration-300 ease-out",
            open
              ? "mx-auto px-4 sm:px-6 lg:px-8 bg-[#030A1C] rounded-none border border-transparent shadow-none pointer-events-auto translate-y-0"
              : scrolled
              ? "pointer-events-auto translate-y-2 sm:translate-y-2.5 mx-3 sm:mx-4 xl:mx-auto rounded-2xl sm:rounded-[22px] border border-white/[0.14] bg-[#030A1C] shadow-[0_20px_50px_rgba(0,0,0,0.8)] px-4 sm:px-6 lg:px-8"
              : "mx-auto px-4 sm:px-6 lg:px-8 bg-[#030A1C] rounded-none border border-transparent shadow-none pointer-events-auto translate-y-0"
          )}
        >
          <div className="flex items-center justify-between flex-nowrap gap-1 lg:gap-1.5 xl:gap-3 h-16 w-full">
            <Link
              href="/"
              onClick={(e) => handleNavClick(e, "/")}
              className="shrink-0 pr-1 lg:pr-2 whitespace-nowrap flex items-center gap-2 cursor-pointer"
              data-od-id="nav-logo"
            >
              <img
                src="/images/brand/CKLogo.png"
                alt="CK Capital"
                width={696}
                height={100}
                className="h-6 sm:h-7 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center h-full flex-nowrap gap-1 2xl:gap-1.5 shrink min-w-0" data-od-id="nav-links">
              
              {/* 1. PROGRAMS MEGA MENU */}
              <div
                className="h-full flex items-center"
                onMouseEnter={() => {
                  updateCaretPositions();
                  setActiveMegaMenu("programs");
                }}
                onMouseLeave={() => {
                  setActiveMegaMenu((prev) => (prev === "programs" ? null : prev));
                }}
              >
                <Link
                  ref={programsTriggerRef}
                  href="/trading-objectives"
                  onClick={(e) => handleNavClick(e, "/trading-objectives")}
                  data-od-id="desktop-nav-tradingObjectives"
                  className={cn(
                    "whitespace-nowrap px-2 xl:px-3 py-1.5 rounded-lg text-[12px] xl:text-[13px] font-semibold transition-colors flex items-center gap-1",
                    isProgramsActive
                      ? "bg-primary/10 text-[#A98BFF] font-bold"
                      : "text-white/75 hover:text-[#A98BFF] hover:bg-white/[0.04]"
                  )}
                >
                  <span>{t("tradingObjectives" as any)}</span>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "opacity-50 transition-transform duration-200",
                      activeMegaMenu === "programs" ? "rotate-180 text-[#A98BFF]" : ""
                    )}
                  />
                </Link>

                {/* Dropdown Popover Spanning Full Nav Width */}
                <div
                  data-od-id="desktop-dropdown-tradingObjectives"
                  className={cn(
                    "absolute top-full left-0 right-0 w-full pt-2 transition-all duration-200 z-50 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']",
                    activeMegaMenu === "programs"
                      ? "opacity-100 visible pointer-events-auto"
                      : "opacity-0 invisible pointer-events-none"
                  )}
                >
                  {/* Pointer Caret dynamically centered above trigger */}
                  <div
                    className="absolute top-1 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-white/[0.12] before:content-[''] before:absolute before:top-[1px] before:-left-[7px] before:w-0 before:h-0 before:border-x-[7px] before:border-x-transparent before:border-b-[7px] before:border-b-[#030A1C]"
                    style={programsCaretLeft !== null ? { left: `${programsCaretLeft}px` } : undefined}
                  />

                  <div className="w-full bg-[#030A1C] border border-white/[0.12] rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] flex overflow-hidden">
                    {/* Left 2 Columns: Funding Models & Rules (Matching Company Format) */}
                    <div className="flex-1 pt-9 pb-7 px-7 xl:pt-10 xl:pb-8 xl:px-9 grid grid-cols-2 gap-6 xl:gap-8">
                      {programColumns.map((col, cIdx) => (
                        <div key={col.titleKey} className="flex flex-col">
                          <span className="block text-[11px] font-extrabold uppercase tracking-wider text-white/45 px-1 pt-1 pb-3 mb-2.5 border-b border-white/[0.08]">
                            {t(col.titleKey as any)}
                          </span>
                          <div className="flex flex-col gap-1.5">
                            {col.items.map((item) => {
                              const IconComponent = item.icon;

                              return (
                                <Link
                                  key={item.titleKey}
                                  href={item.href}
                                  onClick={(e) => handleNavClick(e, item.href)}
                                  data-od-id={`desktop-subitem-${item.titleKey === "oneStepTitle" ? "evaluation" : item.titleKey === "twoStepTitle" ? "evaluation-2step" : item.titleKey === "instantTitle" ? "instantFunding" : item.titleKey === "compareAllTitle" ? "compare" : "tradingObjectives"}`}
                                  className="group/citem flex items-center justify-between p-2.5 xl:p-3 rounded-xl hover:bg-white/[0.04] transition-colors"
                                >
                                  <div className="flex items-center gap-3.5 min-w-0">
                                    <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-lg bg-primary/10 border border-primary/20 text-[#A98BFF] flex items-center justify-center shrink-0 group-hover/citem:bg-primary group-hover/citem:text-primary-foreground transition-all duration-200">
                                      <IconComponent size={17} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-[13px] xl:text-[13.5px] font-bold text-foreground group-hover/citem:text-[#A98BFF] transition-colors flex items-center gap-1">
                                        <span>{t(item.titleKey as any)}</span>
                                      </div>
                                      <div className="text-[11px] xl:text-[11.5px] text-foreground/65 line-clamp-1 mt-0.5">
                                        {t(item.descKey as any)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 pl-2 shrink-0">
                                    {item.priceKey && (
                                      <span className="text-[11px] xl:text-[11.5px] font-bold text-foreground/75 group-hover/citem:text-[#A98BFF]">
                                        {t(item.priceKey as any)}
                                      </span>
                                    )}
                                    <ArrowUpRight size={13} className="text-foreground/65 group-hover/citem:text-[#A98BFF] transition-colors" />
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right Column: Compact Promotional Image Banner Card */}
                    <div className="w-[320px] xl:w-[360px] bg-gradient-to-br from-primary/10 via-foreground/[0.02] to-transparent relative pt-9 pb-7 px-7 xl:pt-10 xl:pb-8 xl:px-8 flex flex-col justify-between border-l border-white/[0.08] group/featured">
                      <div>
                        {/* Thumbnail Artwork with Controlled Height */}
                        <div className="w-full h-[125px] xl:h-[135px] rounded-xl overflow-hidden mb-3.5 border border-white/10 relative group-hover/featured:border-primary/40 transition-colors shadow-lg">
                          <img
                            src="/images/placeholders/eval-banner-placeholder.svg"
                            alt={t("featuredEvalTitle" as any)}
                            className="w-full h-full object-cover group-hover/featured:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Text Details */}
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wider bg-primary/20 text-[#A98BFF] border border-primary/30 mb-1.5">
                          {t("featuredEvalBadge" as any)}
                        </span>
                        <div className="font-bold text-white text-[14.5px] leading-tight mt-0.5">
                          {t("featuredEvalTitle" as any)}
                        </div>
                        <p className="text-[11.5px] text-white/65 mt-1.5 leading-relaxed line-clamp-2">
                          {t("featuredEvalDesc" as any)}
                        </p>
                      </div>

                      <Link
                        href="/trading-objectives"
                        data-od-id="desktop-featured-cta-tradingObjectives"
                        onClick={(e) => handleNavClick(e, "/trading-objectives")}
                        className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#A98BFF] group-hover/featured:underline mt-4 pt-3 border-t border-white/[0.08]"
                      >
                        <span>{t("viewAllPrograms" as any)}</span>
                        <ArrowRight size={13} className="group-hover/featured:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. PAYOUTS DIRECT LINK */}
              <Link
                href="/payouts"
                data-od-id="desktop-nav-payouts"
                onClick={(e) => handleNavClick(e, "/payouts")}
                className={cn(
                  "whitespace-nowrap px-2 xl:px-3 py-1.5 rounded-lg text-[12px] xl:text-[13px] font-semibold transition-colors",
                  pathname === "/payouts"
                    ? "bg-primary/10 text-[#A98BFF] font-bold"
                    : "text-white/75 hover:text-[#A98BFF] hover:bg-white/[0.04]"
                )}
              >
                {t("payouts" as any)}
              </Link>

              {/* 3. COMPANY MEGA MENU (Full-Width Maximized Spacing) */}
              <div
                className="h-full flex items-center"
                onMouseEnter={() => {
                  updateCaretPositions();
                  setActiveMegaMenu("company");
                }}
                onMouseLeave={() => {
                  setActiveMegaMenu((prev) => (prev === "company" ? null : prev));
                }}
              >
                <button
                  ref={companyTriggerRef}
                  type="button"
                  data-od-id="desktop-nav-company"
                  onClick={() => {
                    updateCaretPositions();
                    setActiveMegaMenu((prev) => (prev === "company" ? null : "company"));
                  }}
                  className={cn(
                    "whitespace-nowrap px-2 xl:px-3 py-1.5 rounded-lg text-[12px] xl:text-[13px] font-semibold transition-colors flex items-center gap-1",
                    isCompanyActive
                      ? "bg-primary/10 text-[#A98BFF] font-bold"
                      : "text-white/75 hover:text-[#A98BFF] hover:bg-white/[0.04]"
                  )}
                >
                  <span>{t("company" as any)}</span>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "opacity-50 transition-transform duration-200",
                      activeMegaMenu === "company" ? "rotate-180 text-[#A98BFF]" : ""
                    )}
                  />
                </button>

                {/* Dropdown Popover Spanning Full Nav Width */}
                <div
                  data-od-id="desktop-dropdown-company"
                  className={cn(
                    "absolute top-full left-0 right-0 w-full pt-2 transition-all duration-200 z-50 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']",
                    activeMegaMenu === "company"
                      ? "opacity-100 visible pointer-events-auto"
                      : "opacity-0 invisible pointer-events-none"
                  )}
                >
                  {/* Pointer Caret dynamically centered above trigger */}
                  <div
                    className="absolute top-1 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-white/[0.12] before:content-[''] before:absolute before:top-[1px] before:-left-[7px] before:w-0 before:h-0 before:border-x-[7px] before:border-x-transparent before:border-b-[7px] before:border-b-[#030A1C]"
                    style={companyCaretLeft !== null ? { left: `${companyCaretLeft}px` } : undefined}
                  />

                  <div className="w-full bg-[#030A1C] border border-white/[0.12] rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] flex overflow-hidden">
                    {/* Left 2 Columns: Company & Connect (Spacious Grid) */}
                    <div className="flex-1 pt-9 pb-7 px-7 xl:pt-10 xl:pb-8 xl:px-9 grid grid-cols-2 gap-6 xl:gap-8">
                      {companyColumns.map((col, cIdx) => (
                        <div key={col.titleKey} className="flex flex-col">
                          <span className="block text-[11px] font-extrabold uppercase tracking-wider text-white/45 px-1 pt-1 pb-3 mb-2.5 border-b border-white/[0.08]">
                            {t(col.titleKey as any)}
                          </span>
                          <div className="flex flex-col gap-1.5">
                            {col.items.map((item) => {
                              const IconComponent = item.icon;
                              const isExt = item.external || item.href.startsWith("http");
                              const itemKey = item.titleKey === "aboutUs" ? "aboutUs" : item.titleKey === "payoutsProof" ? "payouts" : item.titleKey === "affiliateProgram" ? "affiliates" : item.titleKey === "support247" ? "contact" : "blog";

                              const content = (
                                <>
                                  <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-lg bg-primary/10 border border-primary/20 text-[#A98BFF] flex items-center justify-center shrink-0 group-hover/citem:bg-primary group-hover/citem:text-primary-foreground transition-all duration-200">
                                    <IconComponent size={17} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-[13px] xl:text-[13.5px] font-bold text-foreground group-hover/citem:text-[#A98BFF] transition-colors flex items-center gap-1">
                                      <span>{t(item.titleKey as any)}</span>
                                      {isExt && <ArrowUpRight size={13} className="opacity-50" />}
                                    </div>
                                    <div className="text-[11px] xl:text-[11.5px] text-foreground/65 line-clamp-1 mt-0.5">
                                      {t(item.descKey as any)}
                                    </div>
                                  </div>
                                </>
                              );

                              if (isExt) {
                                return (
                                  <a
                                    key={item.titleKey}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-od-id={`desktop-subitem-${item.titleKey}`}
                                    onClick={() => {
                                      setActiveMegaMenu(null);
                                      setOpen(false);
                                    }}
                                    className="group/citem flex items-center gap-3 p-2.5 xl:p-3 rounded-xl hover:bg-white/[0.04] transition-colors"
                                  >
                                    {content}
                                  </a>
                                );
                              }

                              return (
                                <Link
                                  key={item.titleKey}
                                  href={item.href}
                                  data-od-id={`desktop-subitem-${itemKey}`}
                                  onClick={(e) => handleNavClick(e, item.href)}
                                  className="group/citem flex items-center gap-3 p-2.5 xl:p-3 rounded-xl hover:bg-white/[0.04] transition-colors"
                                >
                                  {content}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right Featured Card: Community & Support (Compact Card) */}
                    <div className="w-[320px] xl:w-[360px] bg-gradient-to-br from-primary/10 via-foreground/[0.02] to-transparent relative pt-9 pb-7 px-7 xl:pt-10 xl:pb-8 xl:px-8 flex flex-col justify-between border-l border-white/[0.08] group/comm">
                      <div>
                        {/* Thumbnail Artwork with Controlled Height */}
                        <div className="w-full h-[125px] xl:h-[135px] rounded-xl overflow-hidden mb-3.5 border border-white/10 relative group-hover/comm:border-primary/40 transition-colors shadow-lg">
                          <img
                            src="/images/placeholders/community-banner-placeholder.svg"
                            alt={t("featuredCommunityTitle" as any)}
                            className="w-full h-full object-cover group-hover/comm:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Text Details */}
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wider bg-primary/20 text-[#A98BFF] border border-primary/30 mb-1.5">
                          {t("featuredCommunityBadge" as any)}
                        </span>
                        <div className="font-bold text-white text-[14.5px] leading-tight mt-0.5">
                          {t("featuredCommunityTitle" as any)}
                        </div>
                        <p className="text-[11.5px] text-white/65 mt-1.5 leading-relaxed line-clamp-2">
                          {t("featuredCommunityDesc" as any)}
                        </p>
                      </div>

                      <a
                        href="https://discord.com/invite/hGSVx9CmS2"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          setActiveMegaMenu(null);
                          setOpen(false);
                        }}
                        className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#A98BFF] group-hover/comm:underline mt-4 pt-3 border-t border-white/[0.08]"
                      >
                        <span>{t("joinDiscord" as any)}</span>
                        <ArrowRight size={13} className="group-hover/comm:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. AFFILIATES DIRECT LINK */}
              <Link
                href="/affiliates"
                data-od-id="desktop-nav-affiliates"
                onClick={(e) => handleNavClick(e, "/affiliates")}
                className={cn(
                  "whitespace-nowrap px-2 xl:px-3 py-1.5 rounded-lg text-[12px] xl:text-[13px] font-semibold transition-colors",
                  pathname === "/affiliates"
                    ? "bg-primary/10 text-[#A98BFF] font-bold"
                    : "text-white/75 hover:text-[#A98BFF] hover:bg-white/[0.04]"
                )}
              >
                {t("affiliates" as any)}
              </Link>

              {/* 5. FAQ DIRECT LINK */}
              <a
                href="https://intercom.help/ck-capital/"
                target="_blank"
                rel="noopener noreferrer"
                data-od-id="desktop-nav-faq"
                onClick={() => {
                  setActiveMegaMenu(null);
                  setOpen(false);
                }}
                className="whitespace-nowrap px-2 xl:px-3 py-1.5 rounded-lg text-[12px] xl:text-[13px] font-semibold transition-colors text-white/75 hover:text-[#A98BFF] hover:bg-white/[0.04]"
              >
                {t("faq" as any)}
              </a>
            </div>

            {/* Desktop Actions */}
            <div className="hidden xl:flex items-center flex-nowrap gap-1.5 xl:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center justify-center gap-1.5 h-10 min-h-10 w-8 xl:w-auto px-0 xl:px-2.5 rounded-lg border border-white/15 bg-white/[0.03] text-white/60 hover:text-white hover:border-[#894CEF]/40 hover:bg-white/[0.06] transition-colors text-xs shrink-0"
                aria-label={tSearch("searchAria")}
                data-od-id="nav-search-trigger"
              >
                <Search size={14} className="text-[#A98BFF] opacity-90 shrink-0" />
                <span className="hidden xl:inline text-[11.5px]">{tSearch("buttonLabel")}</span>
                <kbd className="hidden 2xl:inline-flex items-center rounded border border-white/20 bg-white/[0.08] px-1.5 py-0.5 font-mono text-[9px] text-white/50">
                  ⌘K
                </kbd>
              </button>
              <LanguageSwitcher compact />
              <a
                href="https://app.ckcapital.co.uk/signin"
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap inline-flex items-center h-10 min-h-10 px-2.5 xl:px-3.5 rounded-lg border border-white/20 text-[11.5px] xl:text-[12.5px] font-bold text-white hover:border-[#894CEF] hover:text-[#A98BFF] hover:bg-[#894CEF]/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shrink-0"
              >
                {t("signIn" as any)}
              </a>
              <Link
                href="/#start-challenge"
                data-od-id="nav-cta"
                onClick={(e) => handleNavClick(e, "/#start-challenge")}
                className="whitespace-nowrap inline-flex items-center h-10 min-h-10 px-3 xl:px-4 rounded-lg brand-gradient-btn text-[11.5px] xl:text-[12.5px] font-bold text-[#1A1030] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 shrink-0"
              >
                {t("startChallenge" as any)}
              </Link>
            </div>

            {/* Mobile / Tablet Header Actions */}
            <div className="xl:hidden flex items-center flex-nowrap gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                data-od-id="mobile-search-trigger"
                className="inline-flex items-center justify-center h-10 w-10 min-h-10 min-w-10 text-foreground/80 hover:text-foreground rounded-lg border border-foreground/10 shrink-0 active:bg-white/10 transition-colors"
                aria-label={tSearch("searchAria")}
              >
                <Search size={16} className="text-[#A98BFF]" />
              </button>
              <LanguageSwitcher compact />
              <button
                className="inline-flex items-center justify-center h-10 w-10 min-h-10 min-w-10 text-foreground/80 hover:text-foreground rounded-lg border border-foreground/10 shrink-0 active:bg-white/10 transition-colors"
                onClick={() => setOpen(!open)}
                aria-label={t("menu" as any)}
                aria-expanded={open}
                data-od-id="mobile-menu-trigger"
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile / Tablet Drawer (Floating Overlay - never pushes down page contents) */}
          {open && (
            <>
              {/* Dimmed backdrop */}
              <div
                className="fixed inset-0 top-16 z-40 bg-black/75 backdrop-blur-sm xl:hidden"
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />

              {/* Slide-down Drawer Panel */}
              <div
                className="absolute top-full left-0 right-0 z-50 w-full overflow-y-auto overscroll-contain bg-[#030A1C] border-b border-white/[0.12] shadow-[0_30px_70px_rgba(0,0,0,0.95)] max-h-[calc(100dvh-4rem)] px-4 sm:px-6 py-4 xl:hidden animate-in fade-in-0 slide-in-from-top-1 duration-200"
                data-od-id="mobile-drawer"
              >
                <div className="flex flex-col gap-1 pb-4">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setSearchOpen(true);
                  }}
                  className="flex items-center justify-between w-full h-11 px-3.5 rounded-lg border border-foreground/10 bg-foreground/[0.03] text-sm text-foreground/60 mb-2"
                >
                  <span className="flex items-center gap-2">
                    <Search size={16} className="text-[#A98BFF]" />
                    <span>{tSearch("placeholder")}</span>
                  </span>
                  <kbd className="rounded border border-foreground/15 bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-foreground/65">
                    ⌘K
                  </kbd>
                </button>

                {/* Programs Accordion */}
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    data-od-id="mobile-accordion-tradingObjectives"
                    onClick={() => setMobileExpanded(mobileExpanded === "programs" ? null : "programs")}
                    className={cn(
                      "flex items-center justify-between min-h-11 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors w-full",
                      isProgramsActive
                        ? "bg-primary/10 text-[#A98BFF] font-semibold"
                        : "text-foreground/80 hover:text-foreground hover:bg-foreground/[0.05]"
                    )}
                  >
                    <span>{t("tradingObjectives" as any)}</span>
                    <ChevronDown
                      size={16}
                      className={cn("opacity-60 transition-transform", mobileExpanded === "programs" ? "rotate-180" : "")}
                    />
                  </button>
                  {mobileExpanded === "programs" && (
                    <div className="flex flex-col pl-3 border-l-2 border-primary/20 ml-3 gap-1 py-1" data-od-id="mobile-dropdown-tradingObjectives">
                      {programColumns.flatMap((col) => col.items).map((item) => {
                        const IconComponent = item.icon;
                        const itemKey =
                          item.titleKey === "oneStepTitle"
                            ? "evaluation"
                            : item.titleKey === "twoStepTitle"
                            ? "evaluation-2step"
                            : item.titleKey === "instantTitle"
                            ? "instantFunding"
                            : item.titleKey === "compareAllTitle"
                            ? "compare"
                            : item.titleKey === "tradingObjectivesTitle"
                            ? "tradingObjectives"
                            : "rulesFaq";

                        return (
                          <Link
                            key={item.titleKey}
                            href={item.href}
                            data-od-id={`mobile-subitem-${itemKey}`}
                            onClick={(e) => handleNavClick(e, item.href)}
                            className={cn(
                              "flex items-center justify-between py-2 px-3 text-sm rounded-lg transition-colors",
                              pathname === item.href
                                ? "text-[#A98BFF] font-semibold bg-primary/5"
                                : "text-foreground/75 hover:text-foreground hover:bg-white/5"
                            )}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-6 h-6 rounded-md bg-primary/10 text-[#A98BFF] flex items-center justify-center shrink-0">
                                <IconComponent size={13} />
                              </div>
                              <span>{t(item.titleKey as any)}</span>
                            </div>
                            {item.priceKey ? (
                              <span className="text-xs font-semibold text-foreground/65">{t(item.priceKey as any)}</span>
                            ) : (
                              <ArrowRight size={13} className="opacity-40" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Direct Link: Payouts */}
                <Link
                  href="/payouts"
                  data-od-id="mobile-nav-payouts"
                  onClick={(e) => handleNavClick(e, "/payouts")}
                  className={cn(
                    "flex items-center justify-between min-h-11 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    pathname === "/payouts"
                      ? "bg-primary/10 text-[#A98BFF] font-semibold"
                      : "text-foreground/80 hover:text-foreground hover:bg-foreground/[0.05]"
                  )}
                >
                  <span>{t("payouts" as any)}</span>
                  <ArrowRight size={14} className="opacity-40" />
                </Link>

                {/* Company Accordion */}
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    data-od-id="mobile-accordion-company"
                    onClick={() => setMobileExpanded(mobileExpanded === "company" ? null : "company")}
                    className={cn(
                      "flex items-center justify-between min-h-11 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors w-full",
                      isCompanyActive
                        ? "bg-primary/10 text-[#A98BFF] font-semibold"
                        : "text-foreground/80 hover:text-foreground hover:bg-foreground/[0.05]"
                    )}
                  >
                    <span>{t("company" as any)}</span>
                    <ChevronDown
                      size={16}
                      className={cn("opacity-60 transition-transform", mobileExpanded === "company" ? "rotate-180" : "")}
                    />
                  </button>
                  {mobileExpanded === "company" && (
                    <div className="flex flex-col pl-3 border-l-2 border-primary/20 ml-3 gap-1 py-1" data-od-id="mobile-dropdown-company">
                      {companyColumns.flatMap((col) => col.items).map((item) => {
                        const isExt = item.external || item.href.startsWith("http");
                        const itemKey = item.titleKey === "aboutUs" ? "aboutUs" : item.titleKey === "payoutsProof" ? "payouts" : item.titleKey === "affiliateProgram" ? "affiliates" : item.titleKey === "support247" ? "contact" : item.titleKey === "blogTitle" ? "blog" : "faq";

                        if (isExt) {
                          return (
                            <a
                              key={item.titleKey}
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-od-id={`mobile-subitem-${itemKey}`}
                              onClick={() => setOpen(false)}
                              className="flex items-center justify-between py-2 px-3 text-sm text-foreground/75 hover:text-foreground hover:bg-white/5 rounded-lg"
                            >
                              <span>{t(item.titleKey as any)}</span>
                              <ArrowUpRight size={13} className="opacity-40" />
                            </a>
                          );
                        }

                        return (
                          <Link
                            key={item.titleKey}
                            href={item.href}
                            data-od-id={`mobile-subitem-${itemKey}`}
                            onClick={(e) => handleNavClick(e, item.href)}
                            className={cn(
                              "flex items-center justify-between py-2 px-3 text-sm rounded-lg transition-colors",
                              pathname === item.href
                                ? "text-[#A98BFF] font-semibold bg-primary/5"
                                : "text-foreground/75 hover:text-foreground hover:bg-white/5"
                            )}
                          >
                            <span>{t(item.titleKey as any)}</span>
                            <ArrowRight size={13} className="opacity-40" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Direct Link: Affiliates */}
                <Link
                  href="/affiliates"
                  data-od-id="mobile-nav-affiliates"
                  onClick={(e) => handleNavClick(e, "/affiliates")}
                  className={cn(
                    "flex items-center justify-between min-h-11 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    pathname === "/affiliates"
                      ? "bg-primary/10 text-[#A98BFF] font-semibold"
                      : "text-foreground/80 hover:text-foreground hover:bg-foreground/[0.05]"
                  )}
                >
                  <span>{t("affiliates" as any)}</span>
                  <ArrowRight size={14} className="opacity-40" />
                </Link>

                {/* Direct Link: FAQ */}
                <a
                  href="https://intercom.help/ck-capital/"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-od-id="mobile-nav-faq"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between min-h-11 px-3 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/[0.05] rounded-lg transition-colors"
                >
                  <span>{t("faq" as any)}</span>
                  <ArrowUpRight size={14} className="opacity-40" />
                </a>

                {/* Action Buttons in Mobile Drawer */}
                <div className="pt-4 flex flex-col gap-2.5">
                  <a
                    href="https://app.ckcapital.co.uk/signin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center min-h-11 px-4 py-2.5 rounded-xl border border-white/20 text-sm font-bold text-white hover:border-[#894CEF] hover:text-[#A98BFF] hover:bg-[#894CEF]/10 transition-colors"
                  >
                    {t("signIn" as any)}
                  </a>
                  <Link
                    href="/#start-challenge"
                    data-od-id="mobile-nav-cta"
                    onClick={(e) => handleNavClick(e, "/#start-challenge")}
                    className="flex items-center justify-center min-h-11 px-4 py-2.5 rounded-xl brand-gradient-btn text-sm font-bold text-[#1A1030] transition-all shadow-md"
                  >
                    {t("startChallenge" as any)}
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
        </nav>
      </header>
      <GlobalSearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
