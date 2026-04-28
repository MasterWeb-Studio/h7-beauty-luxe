// This is standard placeholder text. The customer should update it with their company details. Editable from the admin panel.

import type { Metadata } from 'next';
import { LegalPageShell } from '../../../components/LegalPageShell';
import { content } from '../../../lib/content';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: `Terms and conditions for the ${content.meta.companyName} website.`,
};

export default function TermsPage() {
  const company = content.meta.companyName;

  return (
    <LegalPageShell title="Terms of Use" lastUpdated="Last updated: 2026">
      <p>
        These terms of use apply when you visit the {company} website or use our
        services. By using the site, you agree to these terms.
      </p>

      <h2>1. Description of Service</h2>
      <p>
        {company} provides information and communication services through this website.
        The scope and nature of the content may change at any time without notice.
      </p>

      <h2>2. User Obligations</h2>
      <ul>
        <li>Use the site in accordance with applicable law</li>
        <li>Not infringe the rights of any third party</li>
        <li>Not engage in activities that threaten system security</li>
        <li>Ensure that the information you provide is accurate and up to date</li>
      </ul>

      <h2>3. Intellectual Property</h2>
      <p>
        All content, design, logos, text, and images on the site belong to {company} or
        third parties granting licence. They may not be copied, reproduced, or used
        commercially without written permission.
      </p>

      <h2>4. Disclaimer</h2>
      <p>
        The content on the site is for general informational purposes and does not
        constitute advice. {company} is not liable for any direct or indirect damages
        arising from the use of the content.
      </p>

      <h2>5. Third-Party Links</h2>
      <p>
        The site may contain links to third-party resources. We have no control over
        the content or privacy practices of those resources.
      </p>

      <h2>6. Changes to the Terms</h2>
      <p>
        We reserve the right to modify these terms without prior notice. The current
        version will always be available on this page.
      </p>

      <h2>7. Contact</h2>
      <p>
        If you have questions about these terms, please reach us through the channels
        listed on our contact page.
      </p>
    </LegalPageShell>
  );
}
