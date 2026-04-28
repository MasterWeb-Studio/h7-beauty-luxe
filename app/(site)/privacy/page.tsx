// This is standard placeholder text. The customer should update it with their company details. Editable from the admin panel.

import type { Metadata } from 'next';
import { LegalPageShell } from '../../../components/LegalPageShell';
import { content } from '../../../lib/content';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `${content.meta.companyName} privacy policy and personal data practices.`,
};

export default function PrivacyPage() {
  const company = content.meta.companyName;

  return (
    <LegalPageShell title="Privacy Policy" lastUpdated="Last updated: 2026">
      <p>
        At {company} we value your privacy. This policy explains what information we
        collect, how we use it, how we protect it, and the rights available to you.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>Identity and contact information you provide to us</li>
        <li>Technical information collected automatically (IP address, browser, device)</li>
        <li>Usage data collected through cookies and similar technologies</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To provide and improve our services</li>
        <li>To respond to your inquiries and requests</li>
        <li>To comply with our legal obligations</li>
        <li>To maintain security and prevent misuse</li>
      </ul>

      <h2>3. Information Sharing</h2>
      <p>
        We share your personal information only when necessary to deliver our services,
        when required by law, or with your explicit consent. We do not sell your
        information to third parties for commercial purposes.
      </p>

      <h2>4. Data Security</h2>
      <p>
        We apply appropriate administrative and technical measures to protect your data
        against unauthorized access, loss, or misuse. However, no transmission over the
        internet can be guaranteed to be 100% secure.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We retain your personal data for as long as necessary to fulfill the purposes
        of collection, or as required by applicable law. After this period the data is
        deleted or anonymized.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        You have the right to access, correct, delete, and object to the processing of
        your personal information. To exercise these rights, please contact us through
        the channels listed on our contact page.
      </p>

      <h2>7. Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. Material changes will be announced
        on our website.
      </p>
    </LegalPageShell>
  );
}
