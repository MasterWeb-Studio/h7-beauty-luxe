import { getContent } from '../../lib/content-loader';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';

// Nested site layout — Header + Footer.
// getContent() Supabase'ten taze veri çeker (admin değişiklikleri anında yansır).
// <html>/<body> ve default metadata root'ta (app/layout.tsx, static fallback).

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  return (
    <div className="flex min-h-screen flex-col">
      <Header meta={content.meta} />
      <main className="flex-1">{children}</main>
      <Footer meta={content.meta} />
    </div>
  );
}
