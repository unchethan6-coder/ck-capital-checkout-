import { getTranslations } from "next-intl/server";
import { Container } from "@/components/shared/Container";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Privacy Policy",
  description:
    "CK Capital Privacy Policy — Learn how we collect, handle, and safeguard your personal data.",
  path: "/privacy-policy",
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
      <div className="mt-3 space-y-4">{children}</div>
    </div>
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

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("legal");

  return (
    <div className="min-h-screen bg-background" data-od-id="privacy-page">

      {/* ─────────────── Hero ─────────────── */}
      <section className="relative isolate -mt-[72px] md:-mt-[76px] overflow-hidden border-b border-gray-200 bg-white pt-28 md:pt-36 pb-14 md:pb-20 text-[#0A0A0C]" data-od-id="privacy-hero">
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[140%] h-[80%] rounded-full opacity-70 fx-hero-glow-1" />
          <div className="absolute top-[15%] -left-[10%] w-[60%] h-[70%] rounded-full opacity-60 fx-hero-glow-2" />
        </div>
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#A98BFF]">
              {t("badgeLegal")}
              <span className="text-violet-400">·</span>
              {t("privacyBadge")}
            </span>
            <h1
              className="mt-5 font-[family-name:var(--font-jakarta)] text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-[#0A0A0C] md:text-5xl"
              data-od-id="privacy-hero-title"
            >
              {t("privacyTitle")}
            </h1>
          </div>
        </Container>
      </section>

      {/* ─────────────── Document (LIGHT) ─────────────── */}
      <section className="bg-white py-12 md:py-20 text-[#111827]" data-od-id="privacy-document">
        <Container className="max-w-4xl">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 sm:p-12 shadow-sm text-[15px] leading-relaxed text-[#4B5563]">
            <p className="font-semibold text-[#0A0A0C]">
              CK Capital Group LTD (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;,
              or &quot;our&quot;) is committed to protecting your privacy. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information when you visit our website or use our evaluation services.
            </p>
            <Section title="Disclaimer - How Do We Use and Share Your Personal Information?">
              <p>
                For additional details on our data collection and sharing procedures,
                please refer to our privacy notice. To get in touch with us, you can
                email us at {EmailLink}, or find the contact information at the bottom of
                this document.
              </p>
              <p>
                If you choose to use an authorized agent to opt out, please note that we
                may reject the request if the authorized agent cannot provide proper proof
                of their authorization to act on your behalf.
              </p>
            </Section>

            <Section title="Will Your Information Be Shared with Anyone Else?">
              <p>
                We may share your personal information with our service providers in
                accordance with the terms outlined in our contracts with them. These
                service providers are for-profit entities that process information on our
                behalf while complying with the CCPA&apos;s rigorous privacy standards.
              </p>
              <p>
                We may use your personal information for internal business purposes, such
                as technological advancement and demonstration research, but this is not
                considered &quot;selling&quot; your personal information.
              </p>
              <p>
                In the past 12 months, the Company has not disclosed, sold, or shared any
                personal information with third parties for business or commercial
                purposes. We will not sell or share personal information about website
                visitors, users, or other consumers in the future.
              </p>
            </Section>

            <Section title="Your Rights with Respect to Your Personal Data">
              <Subsection title="Right to request deletion of the data — Request to delete">
                <p>
                  You have the right to request the deletion of your personal information.
                  We will comply with your request, subject to certain exceptions under the
                  law, such as (but not limited to) when another consumer is exercising
                  their right to free speech, when we are obligated to comply with a legal
                  requirement, or when processing is necessary to prevent illegal
                  activities.
                </p>
              </Subsection>

              <Subsection title="Right to be informed — Request to know">
                <p>You have the right to know:</p>
                <ul className="ml-5 list-disc space-y-2">
                  <li>If we collect and use your personal information</li>
                  <li>The types of personal information we collect</li>
                  <li>The reasons for collecting the personal information</li>
                  <li>Whether we sell or share personal information with third parties</li>
                  <li>The types of personal information that have been sold, shared, or disclosed for business purposes</li>
                  <li>The third parties to whom the personal information was sold, shared, or disclosed for business purposes</li>
                  <li>The purpose of collecting, selling, or sharing personal information</li>
                  <li>The specific personal information we have collected about you</li>
                </ul>
                <p>
                  By law, we are not obligated to supply or remove consumer information
                  that has been de-identified in response to a consumer&apos;s request, or
                  to re-identify individual data to confirm a consumer&apos;s request.
                </p>
              </Subsection>

              <Subsection title="Right to Non-Discrimination for the Exercise of a Consumer's Privacy Rights">
                <p>
                  We will not engage in discrimination if you exercise your privacy
                  rights. You have the right to limit the use and disclosure of sensitive
                  personal information, and we do not handle consumers&apos; sensitive
                  personal information.
                </p>
              </Subsection>
            </Section>

            <Section title="Verification Process">
              <p>
                To confirm your identity when we receive your request, we may need to
                verify that you are the same person whose information we have on record.
                This verification process may require us to ask for additional information
                from you that matches what we already have.
              </p>
              <p>
                For instance, based on the type of request you submit, we may request
                specific information to verify, or reach out to you using a previously
                provided communication method, such as phone or email. Other methods of
                verification may also be employed depending on the situation.
              </p>
              <p>
                The personal information you provide in your request will only be utilized
                to verify your identity and authority to make the request. We will aim to
                minimize the need to request additional information from you for
                verification purposes.
              </p>
              <p>
                If our existing information is insufficient to verify your identity, we
                may ask for additional information to verify your identity, as well as for
                security and fraud prevention purposes. Once the verification process is
                completed, any additional information you provide will be promptly deleted.
              </p>
            </Section>

            <Section title="Other Privacy Rights">
              <ul className="ml-5 list-disc space-y-2">
                <li>You have the right to object to the processing of your personal information.</li>
                <li>You have the right to request correction of your personal data if it is inaccurate or outdated, or to request that processing be limited.</li>
                <li>You may appoint an authorized agent to make a request under the CCPA on your behalf, but we may reject the request if the authorized agent fails to provide proof of their authorization to act on your behalf.</li>
                <li>You may request that your personal information not be sold or shared with third parties in the future. We will respond to your opt-out request within 15 days from the date of receipt.</li>
              </ul>
              <p className="pt-1">
                To assert these rights, contact us via {EmailLink}, or refer to the
                information at the bottom of this document. If you have a concern about
                our data handling, we&apos;d like to hear from you.
              </p>
            </Section>

            <Section title="Do We Make Updates to This Notice?">
              <p>
                This privacy notice may be revised periodically, with the updated version
                indicated by a new &quot;Revised&quot; date. It will become effective
                immediately upon release. We may notify you of significant changes by
                posting a prominent notice or sending you a notification. It&apos;s
                important to regularly review this privacy notice to stay informed of how
                we safeguard your information.
              </p>
            </Section>

            <Section title="How Can You Contact Us About This Notice?">
              <p>
                For questions or comments regarding this notice, you may reach us via
                email at {EmailLink}
              </p>
            </Section>

            <Section title="How Can You Review, Update, Or Delete the Data We Collect From You?">
              <p>
                Depending on your country&apos;s laws, you may have the right to access,
                modify, or delete the personal information we have collected from you. To
                do so, please send your request via email at {EmailLink}
              </p>
            </Section>
          </div>
        </Container>
      </section>
    </div>
  )
}
