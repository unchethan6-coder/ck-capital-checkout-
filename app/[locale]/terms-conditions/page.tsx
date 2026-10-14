import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { pageSeo } from "@/lib/seo";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const resolved = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  return pageSeo({
    title: "Terms & Conditions",
    description:
      "CK Propfirm Terms and Conditions — Please review our rules and terms before purchasing or using our services.",
    path: "/terms-conditions",
    locale: resolved,
  });
}

function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 border-t border-foreground/10 pt-8 pb-2 first:border-t-0 first:pt-0"
    >
      <h2 className="font-[family-name:var(--font-jakarta)] text-xl font-bold text-foreground md:text-2xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4 pb-6 text-[15px] leading-relaxed text-foreground/70">
        {children}
      </div>
    </section>
  );
}

const PROHIBITED_LINK_CLASS =
  "font-semibold text-[#A98BFF] underline decoration-[#A98BFF]/40 underline-offset-4 transition-colors hover:decoration-[#A98BFF]";

const TOC: { id: string; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "trader-representations", label: "1. Trader Representations" },
  { id: "limited-license", label: "2. Limited License" },
  { id: "prohibited-uses", label: "3. Prohibited Uses" },
  { id: "education", label: "4. Education" },
  { id: "account-creation", label: "5. Account Creation" },
  { id: "purchases-and-refunds", label: "6. Purchases and Refunds" },
  { id: "guidelines", label: "7. Guidelines" },
  { id: "trademarks", label: "8. Trademarks" },
  { id: "disclosure-statement", label: "9. Disclosure Statement" },
  { id: "term-and-termination", label: "10. Term and Termination" },
  {
    id: "disclaimer-of-warranties",
    label: "11. Disclaimer of Warranties and Limitation of Liability",
  },
  { id: "indemnification", label: "12. Indemnification" },
  { id: "arbitration", label: "13. Arbitration" },
  { id: "force-majeure", label: "14. Force Majeure" },
  { id: "survivability", label: "15. Survivability" },
  { id: "severability", label: "16. Severability" },
  { id: "interpretation", label: "17. Interpretation" },
  { id: "assignment", label: "18. Assignment" },
  { id: "waiver", label: "19. Waiver" },
  { id: "entire-agreement", label: "20. Entire Agreement" },
];

export default async function TermsPage() {
  const t = await getTranslations("legal");

  return (
    <div className="min-h-screen bg-background" data-od-id="terms-page">

      {/* ─────────────── Hero ─────────────── */}
      <section
        className="relative isolate overflow-hidden border-b border-foreground/10"
        data-od-id="terms-hero"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(60% 90% at 50% 0%, rgba(121,67,224,0.22), transparent 70%)',
          }}
        />
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center md:py-24">
          <h1
            className="font-[family-name:var(--font-jakarta)] text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-foreground md:text-6xl"
            data-od-id="terms-hero-title"
          >
            {t("termsTitle")}
          </h1>
          <p className="mt-4 text-sm text-foreground/55">Last updated: October 14, 2026</p>
        </div>
      </section>

      {/* ─────────────── Document ─────────────── */}
      <div
        className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16"
        data-od-id="terms-document"
      >
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
          <aside>
            {/* Mobile accordion */}
            <details
              className="group rounded-xl border border-foreground/10 bg-foreground/[0.03] lg:hidden"
              data-od-id="legal-toc-mobile"
            >
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-xs font-bold tracking-[0.14em] text-foreground/70 uppercase">
                On this page
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-down transition-transform group-open:rotate-180"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <nav
                aria-label="On this page"
                className="max-h-[60vh] overflow-y-auto px-2 pb-3"
              >
                <ol className="space-y-0.5">
                  {TOC.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="block rounded-lg border-l-2 border-transparent py-1.5 pr-2 pl-3 text-[13px] leading-snug text-foreground/55 transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </details>
            {/* Desktop sticky nav */}
            <nav
              aria-label="On this page"
              className="sticky top-28 hidden max-h-[calc(100dvh-8rem)] overflow-y-auto pr-2 lg:block"
              data-od-id="legal-toc"
            >
              <p className="mb-3 pl-3 text-[11px] font-bold tracking-[0.16em] text-foreground/50 uppercase">
                On this page
              </p>
              <ol className="space-y-0.5">
                {TOC.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="block rounded-lg border-l-2 border-transparent py-1.5 pr-2 pl-3 text-[13px] leading-snug text-foreground/55 transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
          <div dir="ltr" lang="en" className="max-w-3xl">

            <Section id="overview" title="Overview">
              <p className="font-semibold text-foreground">
                Welcome to CK Capital Group LTD. The “Company” provides you
                (“You” or the “Trader”) with a limited license to use
                the services (the “Services”) offered by the Company subject to
                the terms and conditions contained herein (the “Agreement”).
              </p>
              <p>
                This Agreement is a legally binding contract, and you have a duty to read
                this Agreement before accessing the Services offered by the Company. By
                using the Services, you are agreeing to the terms and conditions contained
                within this Agreement.
              </p>
              <p>
                The Company reserves the right to suspend, replace, modify, amend, or
                terminate this Agreement at any time and within its sole and absolute
                discretion. In the event The Company replaces, modifies, or amends this
                Agreement, your continued use of the Services after a change in the
                Effective Date of said changes will constitute your agreement to any
                replacement, modification, or amendment to this Agreement.
              </p>
            </Section>

            <Section id="trader-representations" title="1. Trader Representations">
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

            <Section id="limited-license" title="2. Limited License">
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

            <Section id="prohibited-uses" title="3. Prohibited Uses">
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
                Company. While The Company is not responsible for any such content posted
                by its Traders and does not have the affirmative obligations to monitor
                such content, it does reserve the right to remove them.
              </p>
              <p>
                You are also prohibited from using any trading strategy that is expressly
                prohibited by the Company or the Brokers it uses. Such prohibited trading
                (“Prohibited Trading”) shall include, but not be limited to:
              </p>
              <ul className="ml-5 list-disc space-y-2">
                <li>Exploiting errors or latency in the pricing and/or platform(s) provided by the Broker</li>
                <li>Utilizing non-public and/or insider information</li>
                <li>Front-running of trades placed elsewhere</li>
                <li>Trading in any way that jeopardizes the relationship that the Company has with a broker or may result in the canceling of trades</li>
                <li>Trading in any way that creates regulatory issues for the Broker</li>
                <li>Utilizing any third-party strategy, off-the-shelf strategy or one marketed to pass challenge accounts</li>
                <li>Attempting to arbitrage an assessment account with another account with the Company or any third-party company, as determined by the Company in its sole and absolute discretion.</li>
              </ul>
              <p>
                If the Company detects that your trading constitutes Prohibited Trading,
                your participation in the program will be terminated and may include
                forfeiture of any fees paid to the Company. Additionally, and before any
                Trader shall receive a funded account, the trading activity of the Trader
                under these Terms and Conditions shall be reviewed by both the Company and
                the Broker to determine whether such trading activity constitutes
                Prohibited Trading. In the case of Prohibited Trading, the Trader shall not
                receive a funded account.
              </p>
              <p>
                Additionally, the Company reserves the right to disallow or block any
                Trader from participating in the program for any reason, in the
                Company’s sole and absolute discretion.
              </p>
            </Section>

            <Section id="education" title="4. Education">
              <p>
                Although The Company may provide data, information, and content relating
                to investment approaches and opportunities to make trades, such data,
                information and content is provided solely for general informational and
                educational purposes. The Company does not invite the Trader to take any
                action based upon any of the information and materials provided on by the
                Company; you should not construe any such data, information, or content as
                investment, financial, tax, legal, or other kind of advice.
              </p>
              <p>
                The Company further does not make any representations that any data,
                information, and content on the Company website is accurate or complete.
                You alone will bear the sole responsibility of evaluating the merits and
                risks associated with using any such data, information, and content. As
                such, you agree not to hold the Company liable for any possible claims of
                damages that may arise from any decision that you make based upon the use
                of data, information, and content on the Company website.
              </p>
              <p>
                While the Company does not provide you with the opportunity to invest
                actual currency, the Company wants to make sure you understand the risks
                involved with traditional investing. You should be aware that the risk of
                trading and investing is high and substantial. It can work for you as well
                as against you. It may or may not lead to substantial losses. Additionally,
                past performance is not indicative of future results.
              </p>
              <p>
                As such, you should carefully consider whether trading and investing is
                right for you depending on your investment objectives, level of experience,
                and risk appetite. If you are unsure, you should consult with a financial
                advisor and/or tax advisor.
              </p>
            </Section>

            <Section id="account-creation" title="5. Account Creation">
              <p>
                In order to register as a Trader, you may be asked to provide personal
                information, including, but not limited to your name, email address,
                mailing address, phone number, date of birth and a username and password
                for an account that is unique to you. The information provided is subject
                to the Company’s privacy policy.
              </p>
              <p>
                The account will be personal to You, and You cannot share it with anybody
                else. You also may not purchase an account on behalf of a third party or
                have an account purchased for you by a third party. You will be responsible
                for maintaining the confidentiality of your username and password. If you
                suspect that your account has been breached, you must immediately notify
                The Company.
              </p>
              <p>
                Individuals residing or have only citizenship in the following countries
                are{" "}
                <Link
                  href="/faq/are-there-any-prohibited-countries"
                  className={PROHIBITED_LINK_CLASS}
                >
                  prohibited
                </Link>{" "}
                from registering as a Trader:
              </p>
              <ol className="ml-5 list-decimal space-y-1.5">
                <li>Afghanistan</li>
                <li>Belarus</li>
                <li>Burundi</li>
                <li>Central African Republic</li>
                <li>Chad</li>
                <li>Democratic Republic of the Congo</li>
                <li>Region of Crimea</li>
                <li>Eritrea</li>
                <li>Iran</li>
                <li>Iraq</li>
                <li>Cuba</li>
                <li>North Korea</li>
                <li>Libya</li>
                <li>Myanmar (Burma)</li>
                <li>Somalia</li>
                <li>Sudan</li>
                <li>Russia</li>
                <li>Republic of South Sudan</li>
                <li>Syria</li>
                <li>Yemen</li>
                <li>Venezuela</li>
              </ol>
            </Section>

            <Section id="purchases-and-refunds" title="6. Purchases and Refunds">
              <p>
                The Company may provide products, services, subscriptions, or access to
                certain portions to the Company’s website at a monetary cost. Prices
                and availability are subject to change without notice. The Company may
                allow for such purchases within its website or via a white label affiliate.
                It is your responsibility to thoroughly read and understand any such terms
                and conditions.
              </p>
              <p>
                By making any such purchases, you agree that the Company has no
                responsibility and acquires no liability for any claim related to your
                purchases. Upon the complete purchase of a product, service, subscription,
                or access to certain portions of the Company website, the Company will make
                any said product, service, or access will be available to you following the
                approved transaction.
              </p>
              <p>
                There are no refunds on any Services purchased from the Company. If you, as
                a purchaser, are deemed “high risk” by our payment processors we
                may require you to provide additional documentation or information in order
                to proceed with the assessment. Failure to provide the requested
                documentation and information within twenty-four (24) hours of said request
                may result in your use of and access to the Services being revoked. The
                documentation and information supplied does not guarantee that this status
                will be revoked and may still be subject to ineligibility.
              </p>
            </Section>

            <Section id="guidelines" title="7. Guidelines">
              <p>
                The Company will display the guidelines associated with the Services on the
                Company’s website and via email, upon becoming a Trader. These
                guidelines, which may change from time to time in The Company’s sole
                discretion, are incorporated in whole into this Agreement. The Company
                makes absolutely no promise, guarantee, or warranty, express or implied, as
                to any promise to future employment as a trader, monetary payments, or any
                other type or kind of compensation or award for your performance as a
                Trader.
              </p>
            </Section>

            <Section id="trademarks" title="8. Trademarks">
              <p>
                You acknowledge and agree that any and all trademarks, trade names, design
                marks, or logos displayed on the Company website by the Company, are common
                law or registered trademarks owned by or licensed to the Company. You are
                expressly prohibited from using the trademarks of the Company to cause
                confusion, cause mistake, deceive consumers, or from falsely designating
                the origin of, source of, or sponsorship of your goods or services. You are
                further prohibited from using the trademarks of the Company in domain
                names, keyword advertisements, trigger keyword advertisements, or in meta
                tags. All other trademarks, trade names, design marks, or logos are the
                property of their respective owners.
              </p>
              <p>
                You acknowledge and agree that the Company’s website, its suppliers
                and licensors expressly reserve all intellectual property rights in all
                text, programs, products, processes, technology, content and other
                materials, which appear on the Company’s website. Access to this
                website does not confer and shall not be considered as conferring upon
                anyone any license under any of the Company’s or any third
                party’s intellectual property rights. All rights, including copyright,
                in this website are owned by or licensed to us or third-party suppliers.
                Any use of this Website or its contents, including copying or storing it or
                them in whole or part, other than for your own personal, non-commercial use is
                prohibited without the permission of The Company. You cannot modify,
                distribute or re-post anything on this website for any purpose.
              </p>
              <p>
                The Company names and logos and all related products and services and our
                slogans are the trademarks or service marks of the Company or licensed to
                the Company. All other marks are the property of their respective
                companies. No trademark or service mark license is granted in connection
                with the materials contained on the Company Website. Access to the Company
                website does not authorize anyone to use any name, logo or mark in any
                manner.
              </p>
              <p>
                All materials, including images, text, illustrations, designs, icons,
                photographs, programs, audio clips or downloads, video clips and written
                and other materials that are part of this Website (collectively, the
                “Contents”) are intended solely for personal, non-commercial use.
                No right, title or interest in any downloaded materials or software is
                transferred to You as a result of any such downloading or copying. You may
                not reproduce (except as noted above), publish, transmit, distribute,
                display, modify, create derivative works from, sell or participate in any
                sale of or exploit in any way, in whole or in part, any of the contents,
                the Company website or any related software and are protected by copyright
                and trademark laws and various other intellectual property rights and
                unfair competition laws of the United States, international copyright laws,
                and international conventions. All software used on the Company website is
                the property of the Company or its suppliers and protected by laws of the
                United Kingdom. Any other use, including the reproduction, modification,
                distribution, transmission, republication, display, or performance, of the
                Contents on the Company website is strictly prohibited. Unless otherwise
                noted, all Contents are copyrights, trademarks and/or other intellectual
                property owned, controlled or licensed by the Company, one of its
                affiliates or by third parties who have licensed their materials to us and
                are protected by laws of the United Kingdom. The compilation (meaning the
                collection, arrangement, and assembly) of all Contents on the Company
                website is the exclusive property of the Company and is also protected by
                the laws of the United Kingdom.
              </p>
            </Section>

            <Section id="disclosure-statement" title="9. Disclosure Statement">
              <p>
                Before deciding to participate in financial markets, you should carefully
                consider your investment objectives, level of experience and risk appetite.
                Most importantly, do not invest money you cannot afford to lose.
              </p>
              <p>
                There is considerable exposure to risk in any over-the-counter transaction,
                including, but not limited to, leverage, creditworthiness, limited
                regulatory protection and market volatility that may substantially affect
                the price of the products you are trading.
              </p>
              <p>
                Moreover, the leveraged nature of over-the-counter trading means that any
                market movement will have an equally proportional effect on your funds.
                This may work against you as well as for you.
              </p>
              <p>
                There are risks associated with utilizing an Internet-based trading system
                including, but not limited to, the failure of hardware, software, and
                Internet connection. The Company is not responsible for communication
                failures or delays when trading via the Internet. The Company employs
                backup systems and contingency plans to minimize the possibility of system
                failure.
              </p>
            </Section>

            <Section id="term-and-termination" title="10. Term and Termination">
              <p>
                The term of this Agreement will begin when you purchase a Service offered
                via the Company and will continue until either the Company terminates your
                access to the Services or you stop using the Services.
              </p>
              <p>
                The Company reserves the right to terminate the Services or your access to
                the Company website in its sole and absolute discretion and without prior
                notice.
              </p>
            </Section>

            <Section
              id="disclaimer-of-warranties"
              title="11. Disclaimer of Warranties and Limitation of Liability"
            >
              <div className="rounded-xl border border-primary/25 bg-primary/[0.06] p-5">
                <p className="font-semibold text-foreground/85">
                  YOU ACKNOWLEDGE AND AGREE THAT THE SERVICE AND COMPANY WEBSITE ARE
                  PROVIDED ON AN “AS-IS” BASIS AND WITHOUT WARRANTY OF ANY KIND,
                  INCLUDING, BUT NOT LIMITED TO WARRANTIES OF TITLE, MERCHANTABILITY,
                  ACCURACY, FITNESS FOR A PARTICULAR PURPOSE, SECURITY, AND
                  NON-INFRINGEMENT. WHEREVER PERMITTED BY LAW, YOU ACKNOWLEDGE THAT THE
                  COMPANY WILL NOT BE HELD RESPONSIBLE OR LIABLE FOR ANY CLAIMS, DAMAGES,
                  JUDGMENTS, CHARGES, OR FEES ARISING OUT OF OR RELATED TO INFORMATION ON
                  THE WEBSITE AND YOUR USE OF OR ACCESS TO THE SERVICE OR THE COMPANY
                  WEBSITE, INCLUDING, BUT NOT LIMITED TO COMPENSATORY DAMAGES,
                  CONSEQUENTIAL DAMAGES, SPECIAL DAMAGES, INCIDENTAL DAMAGES, PUNITIVE
                  DAMAGES, EXEMPLARY DAMAGES, COSTS AND ATTORNEYS’ FEES, DAMAGES
                  ARISING OUT OF ERRORS OR OMISSIONS, AND DAMAGES ARISING OUT OF THE
                  UNAVAILABILITY OF THE WEBSITE OR DOWNTIME. YOU ACKNOWLEDGE THAT YOUR USE
                  OF THE SERVICES AND/OR THE COMPANY WEBSITE IS AT YOUR SOLE RISK AND THAT
                  THE COMPANY’S LIABILITY IS LIMITED TO THE AMOUNT THAT YOU PAID TO
                  USE THE SERVICES OR $1,000, WHICHEVER IS LESS.
                </p>
              </div>
            </Section>

            <Section id="indemnification" title="12. Indemnification">
              <p>
                You agree to indemnify, defend, and hold harmless The Company, its
                officers, shareholders, directors, employees, subsidiaries, affiliates,
                white label users, and representatives from any and all losses, including,
                but not limited to costs and attorneys’ fees arising out of or related
                to your use of the Website; your violation of any term or condition of this
                Agreement; your violation of the rights of third parties, including but not
                limited to intellectual property rights or other personal or proprietary
                rights; and violation of any law, statute, ordinance, regulation, or
                treaty, whether local, state, provincial, national or international.
              </p>
              <p>
                Your obligation to defend The Company will not provide you with the ability
                to control The Company’s defense, and The Company reserves the right
                to control its defense, including its choice of counsel and whether to
                litigate or settle a claim subject to indemnification.
              </p>
            </Section>

            <Section id="arbitration" title="13. Arbitration">
              <p>
                You acknowledge and agree that any controversy or claim arising out of or
                related to this Agreement, including any claim or controversy concerning
                interpretation of this Agreement or your use of this Services, will be
                settled by arbitration pursuant to the most recently effective commercial
                arbitration rules of the American Arbitration Association (AAA). This
                arbitration proceeding will be decided by a single arbitrator randomly
                selected from a list of neutral arbitrators maintained by the AAA.
                Judgement on any award rendered by the arbitrator may be entered in any
                court of competent jurisdiction. The arbitrator will be provided with the
                right to award costs and attorneys’ fees to the prevailing party. This
                arbitration will be held in Quebec and both the Company and Trader agree
                that they will be required to be present in Quebec for arbitration under
                the terms of this Agreement and hereby submit to exclusive personal
                jurisdiction in Quebec. The arbitrator will apply the laws of Quebec in
                deciding any controversy or claim pursuant to this Agreement.
              </p>
            </Section>

            <Section id="force-majeure" title="14. Force Majeure">
              <p>
                The Company shall not be liable to Trader for any claims, losses, damages,
                costs or expenses, including attorneys’ fees, caused, directly or
                indirectly, by any events, actions or omissions, including, without
                limitation, claims, losses, damages, costs or expenses, including
                attorneys’ fees, resulting from civil unrest, war, insurrection,
                international intervention, governmental action (including, without
                limitation, exchange controls, forfeitures, nationalizations,
                devaluations), natural disasters, acts of God, market conditions, inability
                to communicate with any relevant person or any delay, disruption, failure
                or malfunction of any transmission or communication system or computer
                facility, whether belonging to the Company, Trader, or third-party service
                provider.
              </p>
            </Section>

            <Section id="survivability" title="15. Survivability">
              <p>
                The representations, warranties, duties, and covenants made by you under
                this Agreement will survive the termination of this Agreement or the
                Services, including, but not limited to your duty to indemnify and defend
                the Company.
              </p>
            </Section>

            <Section id="severability" title="16. Severability">
              <p>
                In the event that any term or condition of this Agreement is deemed invalid
                or unenforceable by the court of competent jurisdiction, the remaining
                terms and conditions of this Agreement will remain in full force and
                effect.
              </p>
            </Section>

            <Section id="interpretation" title="17. Interpretation">
              <p>
                This Agreement will be deemed to have been drafted by both parties, and the
                terms and conditions of this Agreement will not be interpreted against its
                drafter.
              </p>
            </Section>

            <Section id="assignment" title="18. Assignment">
              <p>
                You are expressly prohibited from assigning your rights and duties under
                this Agreement. The Company reserves the right to assign its rights and
                duties under this Agreement, including in a sale of the Company or its
                Services.
              </p>
            </Section>

            <Section id="waiver" title="19. Waiver">
              <p>
                No term or condition of this Agreement or breach of this Agreement will be
                deemed to have been waived or consented to, unless said waiver is in writing
                and signed by the party to be charged.
              </p>
            </Section>

            <Section id="entire-agreement" title="20. Entire Agreement">
              <p>
                This Agreement contains the entire agreement between the Company and the
                Trader regarding the use of the Services and supersedes all prior
                understandings, agreements, or representations between the Company and
                Trader, whether written or oral.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </div>
  )
}
