import { getTranslations } from "next-intl/server";
import { Container } from "@/components/shared/Container";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Terms & Conditions",
  description:
    "CK Capital Terms and Conditions — Please review our rules and terms before purchasing or using our services.",
  path: "/terms-conditions",
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

export default async function TermsPage() {
  const t = await getTranslations("legal");

  return (
    <div className="min-h-screen bg-background" data-od-id="terms-page">

      {/* ─────────────── Hero ─────────────── */}
      <section className="relative isolate -mt-[72px] md:-mt-[76px] overflow-hidden border-b border-gray-200 bg-white pt-28 md:pt-36 pb-14 md:pb-20 text-[#0A0A0C]" data-od-id="terms-hero">
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[140%] h-[80%] rounded-full opacity-70 fx-hero-glow-1" />
          <div className="absolute top-[15%] -left-[10%] w-[60%] h-[70%] rounded-full opacity-60 fx-hero-glow-2" />
        </div>
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#A98BFF]">
              {t("badgeLegal")}
              <span className="text-violet-400">·</span>
              {t("termsBadge")}
            </span>
            <h1
              className="mt-5 font-[family-name:var(--font-jakarta)] text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-[#0A0A0C] md:text-5xl"
              data-od-id="terms-hero-title"
            >
              {t("termsTitle")}
            </h1>
          </div>
        </Container>
      </section>

      {/* ─────────────── Document (LIGHT) ─────────────── */}
      <section className="bg-white py-12 md:py-20 text-[#111827]" data-od-id="terms-document">
        <Container className="max-w-4xl">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 sm:p-12 shadow-sm text-[15px] leading-relaxed text-[#4B5563]">
            <p className="font-semibold text-[#0A0A0C]">
              Welcome to CK Capital Group LTD. The &quot;Company&quot; provides you
              (&quot;You&quot; or the &quot;Trader&quot;) with a limited license to use
              the services (the &quot;Services&quot;) offered by the Company subject to
              the terms and conditions contained herein (the &quot;Agreement&quot;).
            </p>
            <p className="mt-4">
              This Agreement is a legally binding contract, and you have a duty to read
              this Agreement before accessing the Services offered by the Company. By
              using the Services, you are agreeing to the terms and conditions contained
              within this Agreement.
            </p>
            <p className="mt-4">
              The Company reserves the right to suspend, replace, modify, amend, or
              terminate this Agreement at any time and within its sole and absolute
              discretion. In the event The Company replaces, modifies, or amends this
              Agreement, your continued use of the Services after a change in the
              Effective Date of said changes will constitute your agreement to any
              replacement, modification, or amendment to this Agreement.
            </p>

            <Section title="Trader Representations">
              <p>
                By using the Services, you represent that you are at least eighteen (18)
                years old and are of sound mind and that you have the capacity to agree to
                and uphold the terms and conditions contained within this Agreement.
              </p>
              <p>
                You represent that your use of the Services does not violate any law,
                regulation, ordinance, statute, or treaty that is applicable to individuals
                or business entities located in the jurisdiction in which you live. You
                further represent that you are not prohibited from entering into this
                Agreement by the terms of any pre-existing agreement.
              </p>
            </Section>

            <Section title="Limited License">
              <p>
                The Company provides you with limited, non-exclusive, non-sublicensable,
                non-assignable, revocable, and royalty-free license to use the Services for
                its customary and intended purposes. You are expressly prohibited from
                scraping, framing, hacking, reverse engineering, crawling, or aggregating
                the Services, the Company Website, whether in whole or in part, without the
                prior written consent of the Company.
              </p>
              <p>
                You acknowledge and agree that your limited use of the Services does not
                entitle you to any license or intellectual property rights to any
                technology, intellectual property, copyrights, trademarks, or trade secrets
                of the Company or any third-party contractor thereof. You acknowledge and
                agree that your use of the Services is limited by the terms of this
                Agreement, and you expressly agree that you will not use the Services in
                any manner that is not expressly authorized under the terms of this
                Agreement. The Company reserves all of its rights not expressly granted
                through this Agreement.
              </p>
              <p>
                This license is revocable at any time, and any rights not expressly granted
                in this Agreement are reserved for the Company.
              </p>
            </Section>

            <Section title="Prohibited Uses">
              <p>
                You are expressly prohibited from using the Services to violate any law,
                statute, ordinance, regulation, or treaty, whether local, state, provincial,
                national, or international, or to violate the rights of a third-party,
                including, but not limited to intellectual property rights, privacy rights,
                rights of publicity, or other personal or proprietary rights.
              </p>
              <p>
                Additionally, you are expressly prohibited from scraping, crawling,
                framing, posting unauthorized links to, aggregating, hacking, performing
                denial of service (DOS) attacks on, reverse engineering, or circumventing
                technological protection measures of the Services or the Company website.
              </p>
              <p>
                You are also prohibited from using the Services or the Company website to
                transmit unsolicited commercial emails to third parties or Traders of the
                Company.
              </p>
              <p>
                You are also prohibited from using any trading strategy that is expressly
                prohibited by the Company or the Brokers it uses. Such prohibited trading
                shall include, but not be limited to:
              </p>
              <ul className="ml-5 list-disc space-y-2">
                <li>Exploiting errors or latency in the pricing and/or platform(s) provided by the Broker</li>
                <li>Utilizing non-public and/or insider information</li>
                <li>Front-running of trades placed elsewhere</li>
                <li>Trading in any way that jeopardizes the relationship that the Company has with a broker</li>
                <li>Trading in any way that creates regulatory issues for the Broker</li>
                <li>Utilizing any third-party strategy, off-the-shelf strategy or one marketed to pass challenge accounts</li>
                <li>Attempting to arbitrage an assessment account with another account with the Company or any third-party company</li>
              </ul>
            </Section>

            <Section title="Education">
              <p>
                Although The Company may provide data, information, and content relating
                to investment approaches and opportunities to make trades, such data,
                information and content is provided solely for general informational and
                educational purposes. The Company does not invite the Trader to take any
                action based upon any of the information and materials provided by the
                Company; you should not construe any such data, information, or content as
                investment, financial, tax, legal, or other kind of advice.
              </p>
              <p>
                The Company further does not make any representations that any data,
                information, and content on the Company website is accurate or complete.
                You alone will bear the sole responsibility of evaluating the merits and
                risks associated with using any such data, information, and content.
              </p>
              <p>
                While the Company does not provide you with the opportunity to invest
                actual currency, the Company wants to make sure you understand the risks
                involved with traditional investing. You should be aware that the risk of
                trading and investing is high and substantial.
              </p>
            </Section>

            <Section title="Account Creation">
              <p>
                In order to register as a Trader, you may be asked to provide personal
                information, including, but not limited to your name, email address,
                mailing address, phone number, date of birth and a username and password
                for an account that is unique to you. The information provided is subject
                to the Company&apos;s privacy policy.
              </p>
              <p>
                The account will be personal to You, and You cannot share it with anybody
                else. You also may not purchase an account on behalf of a third party or
                have an account purchased for you by a third party. You will be responsible
                for maintaining the confidentiality of your username and password.
              </p>
            </Section>

            <Section title="Restricted Countries">
              <p>
                Individuals residing or having only citizenship in the following countries
                are prohibited from registering as a Trader: Afghanistan, Belarus, Burundi,
                Central African Republic, Chad, Democratic Republic of the Congo, Crimea,
                Eritrea, Iran, Iraq, Cuba, North Korea, Libya, Myanmar, Somalia, Sudan,
                Russia, South Sudan, Syria, Yemen, and Venezuela.
              </p>
            </Section>

            <Section title="Purchases and Refunds">
              <p>
                The Company may provide products, services, subscriptions, or access to
                certain portions to the Company&apos;s website at a monetary cost. Prices
                and availability are subject to change without notice.
              </p>
              <p>
                There are no refunds on any Services purchased from the Company. If you,
                as a purchaser, are deemed &quot;high risk&quot; by our payment processors
                we may require you to provide additional documentation or information in
                order to proceed with the assessment.
              </p>
            </Section>

            <Section title="Disclaimer of Warranties and Limitation of Liability">
              <div className="rounded-xl border border-primary/25 bg-primary/[0.06] p-5">
                <p className="font-semibold text-foreground/85">
                  YOU ACKNOWLEDGE AND AGREE THAT THE SERVICE AND COMPANY WEBSITE ARE
                  PROVIDED ON AN &quot;AS-IS&quot; BASIS AND WITHOUT WARRANTY OF ANY KIND.
                  THE COMPANY&apos;S LIABILITY IS LIMITED TO THE AMOUNT THAT YOU PAID TO
                  USE THE SERVICES OR $1,000, WHICHEVER IS LESS.
                </p>
              </div>
            </Section>

            <Section title="Term and Termination">
              <p>
                The term of this Agreement will begin when you purchase a Service offered
                via the Company and will continue until either the Company terminates your
                access to the Services or you stop using the Services. The Company reserves
                the right to terminate the Services or your access to the Company website
                in its sole and absolute discretion and without prior notice.
              </p>
            </Section>
          </div>
        </Container>
      </section>
    </div>
  )
}
