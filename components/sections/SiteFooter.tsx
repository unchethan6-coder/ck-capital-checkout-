"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Globe } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { GoldButton } from "@/components/shared/GoldButton";
import { Link, usePathname } from "@/i18n/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  }

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
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

  const year = new Date().getFullYear();

  const directoryColumns = [
    {
      title: tNav("evaluation"),
      links: [
        { label: t("evaluation"), href: "/evaluation" },
        { label: t("instantFunding"), href: "/instant" },
        { label: t("tradingObjectives"), href: "/trading-objectives" },
        { label: tNav("faq"), href: "https://intercom.help/ck-capital/" },
      ],
    },
    {
      title: t("platforms"),
      links: [
        { label: "MetaTrader 5 (MT5)", href: "/#platforms" },
        { label: "TradeLocker", href: "/#platforms" },
        { label: t("payouts"), href: "/payouts" },
      ],
    },
    {
      title: t("company"),
      links: [
        { label: t("aboutUs"), href: "/about-us" },
        { label: tNav("blog"), href: "/blog" },
        { label: t("contact"), href: "/contact" },
        { label: t("affiliates"), href: "/affiliates" },
      ],
    },
    {
      title: t("legal"),
      links: [
        { label: t("terms"), href: "/terms-conditions" },
        { label: t("privacy"), href: "/privacy-policy" },
        { label: t("cookies"), href: "/cookie-policy" },
        { label: t("riskDisclosure"), href: "/risk-disclosure" },
        { label: t("returnPolicy"), href: "/return-policy" },
      ],
    },
  ];

  const legalLinks = [
    { label: t("cookies"), href: "/cookie-policy" },
    { label: t("terms"), href: "/terms-conditions" },
    { label: t("privacy"), href: "/privacy-policy" },
    { label: t("riskDisclosure"), href: "/risk-disclosure" },
    { label: t("returnPolicy"), href: "/return-policy" },
  ];

  const paymentMethods = [
    { name: "Visa", src: "/payments/visa.svg" },
    { name: "Mastercard", src: "/payments/mastercard.svg" },
    { name: "Apple Pay", src: "/payments/apple-pay.svg" },
    { name: "Google Pay", src: "/payments/google-pay.svg" },
    { name: "PayPal", src: "/payments/paypal.svg" },
    { name: "Crypto", src: "/payments/crypto.svg" },
  ];

  return (
    <footer
      className="bg-[color:var(--background-secondary)] border-t border-foreground/[0.06]"
      data-od-id="site-footer"
    >
      {/* Newsletter / insight capture */}
      <div className="border-b border-foreground/[0.06]" data-od-id="footer-newsletter">
        <Container>
          <div className="grid gap-8 py-10 md:py-12 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                {t("newsletterTitle")}
              </h2>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-foreground/65">
                {t("newsletterSubtitle")}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="self-start lg:pt-1"
              data-od-id="footer-newsletter-form"
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  placeholder={t("emailPlaceholder")}
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#080E24] px-4 text-sm text-foreground outline-none placeholder:text-foreground/65 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  aria-invalid={status === "error"}
                />
                <GoldButton
                  type="submit"
                  size="md"
                  className="h-11 shrink-0 px-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  data-od-id="footer-subscribe"
                >
                  {t("subscribe")}
                </GoldButton>
              </div>
              {status === "error" && (
                <p className="mt-2 text-sm text-red-400">{t("errorEmail")}</p>
              )}
              {status === "success" && (
                <p className="mt-2 text-sm text-[#A98BFF]">{t("successEmail")}</p>
              )}
            </form>
          </div>
        </Container>
      </div>

      {/* Directory */}
      <div className="border-b border-foreground/[0.06]" data-od-id="footer-directory">
        <Container>
          <div className="pt-10 pb-4">
            <Link
              href="/"
              onClick={(e) => handleLinkClick(e, "/")}
              className="inline-block cursor-pointer"
              data-od-id="footer-logo"
            >
              <img
                src="/images/brand/CKLogo.png"
                alt="CK Capital"
                width={696}
                height={100}
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </Link>
          </div>
          <nav
            aria-label="Footer directory"
            className="grid gap-8 pb-10 sm:grid-cols-2 md:gap-10 md:pb-12 lg:grid-cols-4"
          >
            {directoryColumns.map((column) => (
              <div key={column.title}>
                <h2 className="text-sm font-bold text-foreground">
                  {column.title}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => {
                    const linkClassName =
                      "inline-flex min-h-11 items-center text-sm text-foreground/65 transition-colors hover:text-[#A98BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:min-h-0 sm:py-1";
                    if (link.href.startsWith("http")) {
                      return (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkClassName}
                          >
                            {link.label}
                          </a>
                        </li>
                      );
                    }
                    return (
                      <li key={link.label}>
                        <Link
                          href={link.href as never}
                          onClick={(e) => handleLinkClick(e, link.href)}
                          className={linkClassName}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </Container>
      </div>

      {/* Compliance statement — re-branded FundingPips Full Legal, UK/Harpenden */}
      <div className="border-b border-foreground/[0.06] bg-foreground/[0.015]" data-od-id="footer-compliance">
        <Container>
          <div className="py-8 md:py-10">
            <p className="max-w-4xl text-xs font-medium leading-relaxed text-foreground/65 sm:text-[12.5px]">
              {t("disclaimerSimulated")}
            </p>
            <details className="group mt-4 rounded-xl border border-foreground/[0.08] bg-foreground/[0.02]">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-foreground/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
                {t("disclaimerImportantTitle")}
                <span aria-hidden="true" className="text-lg leading-none text-[#A98BFF] transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="space-y-6 border-t border-foreground/[0.08] px-4 py-5 text-xs leading-relaxed text-foreground/65 sm:text-[12.5px]">
              <p className="font-medium text-foreground/65">
                <strong>{t("disclaimerSimulated")}</strong>
              </p>

              <div className="space-y-2">
                <h3 className="text-[12.5px] font-bold text-foreground/70">{t("simulatedEnvTitle")}</h3>
                <p>{t("simulatedEnvBody")}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-[12.5px] font-bold text-foreground/70">{t("noInvestmentTitle")}</h3>
                <p>{t("noInvestmentIntro")}</p>
                <ul className="list-disc space-y-1 pl-5">
                  {(t.raw("noInvestmentBullets") as string[]).map((b: string) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>

              <p>{t("participationBody")}</p>
              <p>{t("operationalBody")}</p>
              <p>{t("offerDisclaimerBody")}</p>
              <p>{t("disclaimerAdvice")}</p>
              <p>{t("disclaimerPerformance")}</p>

              <div className="space-y-2">
                <h3 className="text-[12.5px] font-bold text-foreground/70">{t("riskWarningTitle")}</h3>
                <p>{t("riskWarningBody")}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-[12.5px] font-bold text-foreground/70">{t("corporateTitle")}</h3>
                <p>{t("corporateBody")}</p>
                <p>{t("corporateNote")}</p>
                <p>{t("corporateRestrictions")}</p>
              </div>

              <div className="space-y-1">
                <h3 className="text-[12.5px] font-bold text-foreground/70">{t("registeredAddressTitle")}</h3>
                <p>{t("registeredAddressBody")}</p>
              </div>

              <p>{t("disclaimerJurisdiction")}</p>
              </div>
            </details>
          </div>
        </Container>
      </div>

      {/* Payments */}
      <div className="border-b border-foreground/[0.06]" data-od-id="footer-payments">
        <Container>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-8 md:py-10">
            <p className="text-xs font-bold uppercase tracking-widest text-foreground/65">
              {t("acceptedMethods")}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {paymentMethods.map((m) => (
                <span
                  key={m.name}
                  className="grid h-9 w-14 shrink-0 place-items-center overflow-hidden rounded-md border border-foreground/[0.08] bg-white/[0.04] px-1.5"
                  title={m.name}
                >
                  <img src={m.src} alt={m.name} width={44} height={29} loading="lazy" decoding="async" className="block h-7 w-auto max-w-full object-contain" />
                </span>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Utility / legal */}
      <Container>
        <div
          className="flex flex-col gap-5 py-7 md:flex-row md:items-center md:justify-between md:py-8"
          data-od-id="footer-utility"
        >
          <div className="space-y-3">
            <p className="text-xs text-foreground/65">{t("copyright", { year })}</p>
            <nav aria-label="Footer legal and product links" className="flex flex-wrap gap-x-4 gap-y-1.5">
              {legalLinks.map((link) => (
                <span key={link.label}>
                  <Link
                    href={link.href as never}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="inline-flex min-h-11 items-center text-xs text-foreground/65 transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:min-h-0 sm:py-1"
                  >
                    {link.label}
                  </Link>
                </span>
              ))}
            </nav>
          </div>
        </div>
      </Container>
    </footer>
  );
}
