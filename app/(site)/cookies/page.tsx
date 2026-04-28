// This is standard placeholder text. The customer should update it with their company details. Editable from the admin panel.

import type { Metadata } from 'next';
import { LegalPageShell } from '../../../components/LegalPageShell';
import { content } from '../../../lib/content';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: `Information about cookies used on the ${content.meta.companyName} website.`,
};

export default function CookiesPage() {
  const company = content.meta.companyName;

  return (
    <LegalPageShell title="Cookie Policy" lastUpdated="Last updated: 2026">
      <p>
        This cookie policy explains which cookies {company} uses on its website, for
        what purposes, and how you can manage them.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files that are sent to your browser and stored on your
        device when you visit a website. They help the site work correctly, remember
        your preferences, and analyze visitor behavior.
      </p>

      <h2>2. Types of Cookies We Use</h2>
      <ul>
        <li>
          <strong>Strictly necessary cookies:</strong> Required for the basic functions
          of the site; they cannot be disabled.
        </li>
        <li>
          <strong>Performance cookies:</strong> Measure anonymous visitor behavior and
          help us improve the site.
        </li>
        <li>
          <strong>Functional cookies:</strong> Remember personal preferences such as
          language selection.
        </li>
        <li>
          <strong>Marketing cookies:</strong> Enable content and advertising relevant
          to your interests. Only used with your consent.
        </li>
      </ul>

      <h2>3. Third-Party Cookies</h2>
      <p>
        Our site may use cookies from third-party analytics and performance providers.
        These providers are subject to their own privacy policies.
      </p>

      <h2>4. Managing Cookies</h2>
      <p>
        You can accept, reject, or delete cookies through your browser settings. If you
        disable cookies, some features of the site may not work as expected.
      </p>

      <h2>5. Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. The most current version will
        always be available on this page.
      </p>
    </LegalPageShell>
  );
}
