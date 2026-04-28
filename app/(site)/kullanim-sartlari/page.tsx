// Bu standart placeholder metindir. Müşteri kendi şirket bilgileriyle güncellemeli. Admin panelden düzenlenebilir.

import type { Metadata } from 'next';
import { LegalPageShell } from '../../../components/LegalPageShell';
import { content } from '../../../lib/content';

export const metadata: Metadata = {
  title: 'Kullanım Şartları',
  description: `${content.meta.companyName} web sitesi kullanım şartları ve koşulları.`,
};

export default function KullanimSartlariPage() {
  const company = content.meta.companyName;

  return (
    <LegalPageShell title="Kullanım Şartları" lastUpdated="Son güncelleme: 2026">
      <p>
        Bu kullanım şartları, {company} web sitesini ziyaret etmeniz veya hizmetlerimizden
        faydalanmanızla birlikte geçerli olur. Siteyi kullanarak bu şartları kabul etmiş
        sayılırsınız.
      </p>

      <h2>1. Hizmet Tanımı</h2>
      <p>
        {company}, sitesi üzerinden bilgilendirme ve iletişim imkanı sunar. Sunulan
        içeriğin kapsamı ve niteliği önceden haber verilmeksizin değiştirilebilir.
      </p>

      <h2>2. Kullanıcı Yükümlülükleri</h2>
      <ul>
        <li>Siteyi yürürlükteki mevzuata uygun kullanmak</li>
        <li>Üçüncü tarafların haklarını ihlal etmemek</li>
        <li>Sistem güvenliğini tehdit edecek eylemlerde bulunmamak</li>
        <li>Verdiğiniz bilgilerin doğru ve güncel olmasını sağlamak</li>
      </ul>

      <h2>3. Fikri Mülkiyet Hakları</h2>
      <p>
        Sitede yer alan tüm içerik, tasarım, logo, metin ve görseller {company} veya
        lisans veren üçüncü kişilere aittir. Yazılı izin olmaksızın kopyalanamaz,
        çoğaltılamaz veya ticari amaçla kullanılamaz.
      </p>

      <h2>4. Sorumluluk Reddi</h2>
      <p>
        Sitedeki içerikler genel bilgilendirme amaçlıdır ve tavsiye niteliği taşımaz.
        İçeriklerin kullanımından doğabilecek doğrudan veya dolaylı zararlardan
        {company} sorumlu tutulamaz.
      </p>

      <h2>5. Üçüncü Taraf Bağlantıları</h2>
      <p>
        Site, üçüncü taraf kaynaklarına bağlantılar içerebilir. Bu kaynakların içeriği
        ve gizlilik uygulamaları üzerinde kontrolümüz yoktur.
      </p>

      <h2>6. Şartların Değiştirilmesi</h2>
      <p>
        Bu şartları önceden bildirimde bulunmaksızın değiştirme hakkımız saklıdır.
        Güncel versiyon her zaman bu sayfada yayımlanır.
      </p>

      <h2>7. Uygulanacak Hukuk</h2>
      <p>
        Bu şartlar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda İstanbul
        mahkemeleri ve icra daireleri yetkilidir.
      </p>
    </LegalPageShell>
  );
}
