# Reine

Nişantaşı'nın en sessiz lüksü

Reine, İstanbul Nişantaşı'nda cilt, saç ve el bakımında editorial lüks sunan butik güzellik atölyesi. Randevunuzu alın.

## Başlangıç

```bash
npm install
npm run dev
```

Tarayıcıdan: http://localhost:3000

## Derleme

```bash
npm run build
npm run start
```

## Admin Erişimi

Proje içinde `/admin` panelinden dashboard ve içerik editörüne erişebilirsin.

- **URL:** http://localhost:3000/admin/login
- **Şifre:** `52f9e920-3fad-4897-9be3-922cca03dbd3`

Bu şifreyi güvenli yere kaydedin — kaybolursa `.env.local` dosyasındaki `ADMIN_PASSWORD` satırını değiştirip yeniden girebilirsiniz.

Admin panelinde Gün 3 itibarıyla:
- **Dashboard:** proje özeti, lead/randevu sayaçları, son 5 lead ve yaklaşan 5 randevu.
- **İçerik:** sayfaları ve section'ları JSON olarak düzenleme.
- Lead'ler, Randevular, Ayarlar sayfaları Gün 4'te gelecek.

> Bu basit env-password auth **production için yeterli değil**. Hafta 5'te Supabase Auth magic link'e geçilecek.

## İçerik & tasarım

- `lib/content.ts` — sayfalar ve metinler (scaffolder üretti).
- `lib/design-tokens.ts` — renk, tipografi, radius, container width.
- `lib/fonts.ts` — next/font/google import'ları (headingFont + bodyFont).
- `lib/project-info.ts` — slug, industry, generatedAt.
- `app/globals.css` — CSS variable'lar ile tokens.
- Yeni sayfa eklemek için `lib/content.ts` > `pages[]`'e yeni giriş ekleyin; `app/(site)/[slug]/page.tsx` otomatik yakalar.

## CRM Endpoint'leri

Public form'lar aşağıdaki route'lara POST eder; kayıtlar Supabase'teki `crm_*` tablolarına düşer.

Bu proje **`appointment`** section kullanıyor → form `/api/appointment` endpoint'ine POST eder.

### POST `/api/lead`
- **Ne zaman:** `contact` section'lı sayfalardaki iletişim formundan.
- **Alanlar:** `name`, `email`, `phone?`, `message`.
- **Yazılan tablo:** `crm_leads` (status default `new`).
- **Sektörler:** saas, agency, corporate, law, real-estate (diğer / belirsizler de).

### POST `/api/appointment`
- **Ne zaman:** `appointment` section'lı sayfalardaki randevu formundan.
- **Alanlar:** `name`, `phone`, `email?`, `service?`, `preferredDate` (YYYY-MM-DD), `preferredTime` (`morning` | `noon` | `afternoon` | `evening`), `notes?`.
- **Yazılan tablo:** `crm_appointments` (status default `requested`).
- **Sektörler:** beauty, salon, wellness, medical, dental, veterinary, consulting, fitness.

Content Architect sektöre göre (bu projede: **beauty**) uygun form tipini seçti.

## Ortam değişkenleri

Scaffolder `.env.local` üretti. Bulunması gerekenler:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side — admin dashboard için)
- `NEXT_PUBLIC_TENANT_ID`
- `NEXT_PUBLIC_PROJECT_ID`
- `ADMIN_PASSWORD`

`.env.local` `.gitignore`'da; commit etmeyin. Vercel'a deploy'da aynı değerleri proje ortam değişkeni olarak ekleyin.

## Supabase şeması

Form submit'lerinin ve admin panelin çalışması için Supabase'te şu tabloların olması gerekir:

- `crm_leads` — iletişim formundan gelen lead'ler
- `crm_appointments` — randevu formundan gelen talepler
- `crm_customers`, `crm_notes` — ileride kullanılacak

Ana şema: `packages/shared/src/schema.sql` (tenants, projects, crm_*, support_tickets).

### H6 Modül şemaları

Her modülün kendi migration'ı `packages/shared/src/schema/<id>.sql`'de:
- `products` → `module_products` tablosu (kategori + locale-aware)

İhtiyacınız olan modüllerin migration'ını SQL Editor'de ayrıca çalıştırın. Migration'lar idempotent — tekrar koşmak güvenli.

## Yasal sayfalar

Template dört TR yasal sayfayı otomatik içerir: `/kvkk`, `/cerez`, `/gizlilik`, `/kullanim-sartlari`. İngilizce karşılıkları da mevcut (`/privacy`, `/cookies`, `/terms`). İçerikler placeholder — kendi şirket bilgilerinizle güncelleyin.
