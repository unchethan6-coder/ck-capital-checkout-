import { getTranslations } from "next-intl/server";
import { Container } from "@/components/shared/Container";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Cookie Policy",
  description:
    "CK Capital Cookie Policy — Information about cookies and how they are used on our platform.",
  path: "/cookie-policy",
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

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pt-2">
      <h3 className="font-[family-name:var(--font-jakarta)] text-base font-bold text-[#0A0A0C] md:text-lg">
        {title}
      </h3>
      <div className="mt-3 text-[#4B5563]">{children}</div>
    </div>
  );
}

export default async function CookiePolicyPage() {
  const t = await getTranslations("legal");

  return (
    <div className="min-h-screen bg-background" data-od-id="cookie-page">

      {/* ─────────────── Hero ─────────────── */}
      <section className="relative isolate -mt-[72px] md:-mt-[76px] overflow-hidden border-b border-gray-200 bg-white pt-28 md:pt-36 pb-14 md:pb-20 text-[#0A0A0C]" data-od-id="cookie-hero">
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[140%] h-[80%] rounded-full opacity-70 fx-hero-glow-1" />
          <div className="absolute top-[15%] -left-[10%] w-[60%] h-[70%] rounded-full opacity-60 fx-hero-glow-2" />
        </div>
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#A98BFF]">
              {t("badgeLegal")}
              <span className="text-violet-400">·</span>
              {t("cookieBadge")}
            </span>
            <h1
              className="mt-5 font-[family-name:var(--font-jakarta)] text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-[#0A0A0C] md:text-5xl"
              data-od-id="cookie-hero-title"
            >
              {t("cookieTitle")}
            </h1>
          </div>
        </Container>
      </section>

      {/* ─────────────── Document (LIGHT) ─────────────── */}
      <section className="bg-white py-12 md:py-20 text-[#111827]" data-od-id="cookie-document">
        <Container className="max-w-4xl">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 sm:p-12 shadow-sm text-[15px] leading-relaxed text-[#4B5563]">
            <Section title="Information Automatically Collected">
              <p>
                During your visit, usage, or navigation of the Services, certain
                information is automatically collected by us. This information, while not
                revealing your specific identity (e.g. name or contact details), may
                include device and usage data such as IP address, browser and device
                specifications, operating system, language preferences, source URLs,
                device name, country, location, usage information of our Services, and
                other technical details.
              </p>
              <p>
                This information is mainly utilized for ensuring the security and
                functioning of our Services, as well as for internal analysis and
                reporting purposes. Similar to other businesses, we also gather
                information through the use of cookies and similar technologies.
              </p>
            </Section>

            <Section title="Information We Collect">
              <Subsection title="Log and Usage Data">
                <p>
                  This refers to information related to service, diagnostics, usage, and
                  performance, which our servers automatically gather when you access or
                  utilize our Services. This data is stored in log files and may include
                  details like your IP address, device information, browser type and
                  settings, and information about your activities within the Services
                  (such as timestamps of usage, pages/files viewed, searches performed,
                  and other actions like feature usage), and device event information
                  (such as system activity, error reports, and hardware configurations),
                  depending on your interaction with us.
                </p>
              </Subsection>
            </Section>

            <Section title="How Do We Process Your Information?">
              <p>
                Your personal information is processed by us for several purposes, based
                on your interaction with our Services. These may include:
              </p>
              <ul className="ml-5 list-disc space-y-2">
                <li>Easing account creation and authentication and identifying fraudulent activity</li>
                <li>Seeking feedback and communicating with you regarding your usage of our Services</li>
                <li>Processing information when necessary to protect someone's vital interests, for instance, to prevent harm</li>
              </ul>
            </Section>

            <Section title="Do We Use Cookies and Other Tracking Technologies?">
              <p>
                The use of cookies and other tracking technologies (e.g. web beacons,
                pixels) may allow access or storage of information. Our Cookie Notice
                provides detailed information on our usage of these technologies and
                offers options to decline certain cookies.
              </p>
              <p>
                We also utilize various tracking methods such as Google AdWords, Meta
                Advertising, and Google Analytics to gather and store data on user
                interactions with our websites.
              </p>
            </Section>

            <Section title="Web Browser Cookie Settings">
              <p>
                Web browsers are typically configured to accept cookies by default. You
                can choose to remove or reject cookies, but this may impact certain
                features or services of our Services. To opt out of interest-based ads by
                advertisers on our Services, go to{' '}
                <a
                  href="https://youradchoices.com/control"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#0A0A0C] underline decoration-[#7943E0]/40 underline-offset-4 transition-colors hover:text-[#A98BFF]"
                >
                  https://youradchoices.com/control
                </a>
                .
              </p>
            </Section>

            <Section title="Controls For Do-Not-Track Features">
              <p>
                Many web browsers, mobile OS and apps have a Do-Not-Track
                (&quot;DNT&quot;) feature to signal your preference for not having your
                online browsing activities monitored and collected. However, as there is
                no agreed technology standard for DNT, we do not currently respond to DNT
                browser signals or any other mechanism that communicates your preference
                not to be tracked. If a future standard for online tracking is adopted,
                we will update this policy and inform you.
              </p>
            </Section>

            <Section title="Contact Us">
              <p>
                For privacy-related questions or comments, email us at{' '}
                <a
                  href="mailto:support@ckcapital.co.uk"
                  className="font-semibold text-[#0A0A0C] underline decoration-[#7943E0]/40 underline-offset-4 transition-colors hover:text-[#A98BFF]"
                >
                  support@ckcapital.co.uk
                </a>
                .
              </p>
            </Section>
          </div>
        </Container>
      </section>
    </div>
  )
}
