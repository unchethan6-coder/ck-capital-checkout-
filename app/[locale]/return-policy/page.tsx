import { getTranslations } from "next-intl/server";
import { TriangleAlert } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Return & Dispute Policy",
  description:
    "CK Capital Return and Dispute Policy — Information regarding refund guidelines and dispute processes.",
  path: "/return-policy",
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 border-t border-[#E5E7EB] pt-8">
      <h2 className="font-[family-name:var(--font-jakarta)] text-xl font-bold text-[#0A0A0C] md:text-2xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-[#4B5563]">
        {children}
      </div>
    </section>
  );
}

const MAILTO = "service@ckcapital.co.uk";
const EmailLink = (
  <a
    href={`mailto:${MAILTO}`}
    className="font-semibold text-[#0A0A0C] underline decoration-[#7943E0]/40 underline-offset-4 transition-colors hover:text-[#A98BFF]"
  >
    {MAILTO}
  </a>
);

export default async function ReturnPolicyPage() {
  const t = await getTranslations("legal");

  return (
    <div className="min-h-screen bg-background" data-od-id="return-page">

      {/* ─────────────── Hero ─────────────── */}
      <section className="relative isolate -mt-[72px] md:-mt-[76px] overflow-hidden border-b border-gray-200 bg-white pt-28 md:pt-36 pb-14 md:pb-20 text-[#0A0A0C]" data-od-id="return-hero">
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[140%] h-[80%] rounded-full opacity-70 fx-hero-glow-1" />
          <div className="absolute top-[15%] -left-[10%] w-[60%] h-[70%] rounded-full opacity-60 fx-hero-glow-2" />
        </div>
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#A98BFF]">
              {t("badgeLegal")}
              <span className="text-violet-400">·</span>
              {t("returnBadge")}
            </span>
            <h1
              className="mt-5 font-[family-name:var(--font-jakarta)] text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-[#0A0A0C] md:text-5xl"
              data-od-id="return-hero-title"
            >
              {t("returnTitle")}
            </h1>
          </div>
        </Container>
      </section>

      {/* ─────────────── Document ─────────────── */}
      <section className="bg-white py-12 md:py-20 text-[#111827]" data-od-id="return-document">
        <Container className="max-w-4xl">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 sm:p-12 shadow-sm text-[15px] leading-relaxed text-[#4B5563]">
            <p className="font-semibold text-[#0A0A0C]">
              Welcome to CK Capital Group LTD (the &quot;Company&quot;).
            </p>

            <Section title="Payment and Access">
              <p>
                After a cleared payment on the purchase of one of our programs occurs,
                you will receive an email with the login details to access your trading
                platform. Once this information is emailed to you, no refund will be
                given.
              </p>
              <p>
                In some special circumstances, we will provide a refund if there were no
                trades placed on the account. For assistance, please contact our email{' '}
                {EmailLink}.
              </p>
            </Section>

            <Section title="Payment Options">
              <p>We accept the following payment methods:</p>
              <ul className="ml-5 list-disc space-y-2">
                <li>Stripe</li>
                <li>PayPal</li>
                <li>Cryptocurrency</li>
              </ul>
            </Section>

            <Section title="Dispute Policy">
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5">
                <TriangleAlert size={20} className="mt-0.5 shrink-0 text-red-600" />
                <p className="font-semibold text-red-900 leading-relaxed">
                  Clients who improperly dispute charges or request chargebacks with
                  their bank will be permanently banned from the Platform.
                </p>
              </div>
              <p>
                Please contact our email support at {EmailLink} if you have any questions.
              </p>
            </Section>

            <Section title="Acceptance of This Policy">
              <p>
                It is your responsibility to familiarize yourself with this refund policy.
                By placing an order for any of our products, you indicate that you have
                read this refund policy and that you agree with and fully accept the terms
                of this refund policy.
              </p>
              <p>
                If you do not agree with or fully accept the terms of this refund policy,
                we ask that you do not place an order with us. Please contact us at{' '}
                {EmailLink} should you have any questions regarding our refund policy.
              </p>
            </Section>
          </div>
        </Container>
      </section>
    </div>
  )
}
