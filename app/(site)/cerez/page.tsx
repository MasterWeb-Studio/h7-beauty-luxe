// Bu standart placeholder metindir. Müşteri kendi şirket bilgileriyle güncellemeli. Admin panelden düzenlenebilir.

import type { Metadata } from 'next';
import { LegalPageShell } from '../../../components/LegalPageShell';
import { content } from '../../../lib/content';

export const metadata: Metadata = {
  title: 'Çerez Politikası',
  description: `${content.meta.companyName} web sitesinde kullanılan çerezlere ilişkin bilgiler.`,
};

export default function CerezPage() {
  const company = content.meta.companyName;

  return (
    <LegalPageShell title="Çerez Politikası" lastUpdated="Son güncelleme: 2026">
      <p>
        Bu çerez politikası, {company} olarak web sitemizde hangi çerezleri hangi amaçla
        kullandığımızı ve bu çerezleri nasıl yönetebileceğinizi açıklar.
      </p>

      <h2>1. Çerez Nedir?</h2>
      <p>
        Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınıza gönderilen ve cihazınızda
        saklanan küçük metin dosyalarıdır. Çerezler, sitenin doğru çalışması, tercihlerinizin
        hatırlanması ve ziyaretçi davranışının analiz edilmesi için kullanılır.
      </p>

      <h2>2. Kullandığımız Çerez Türleri</h2>
      <ul>
        <li>
          <strong>Zorunlu çerezler:</strong> Sitenin temel işlevleri için gerekli olan,
          devre dışı bırakılamayan çerezler.
        </li>
        <li>
          <strong>Performans çerezleri:</strong> Ziyaretçi davranışını anonim olarak ölçen
          ve sitemizi iyileştirmemize yardımcı olan çerezler.
        </li>
        <li>
          <strong>İşlevsel çerezler:</strong> Dil tercihi gibi kişisel tercihlerinizi
          hatırlayan çerezler.
        </li>
        <li>
          <strong>Pazarlama çerezleri:</strong> İlgi alanlarınıza uygun içerik ve reklam
          gösterilmesini sağlayan çerezler. (Yalnızca onayınızla kullanılır.)
        </li>
      </ul>

      <h2>3. Üçüncü Taraf Çerezleri</h2>
      <p>
        Sitemizde analitik ve performans ölçümü için üçüncü taraf hizmet sağlayıcıların
        çerezleri kullanılabilir. Bu sağlayıcılar kendi gizlilik politikalarına tabidir.
      </p>

      <h2>4. Çerezleri Nasıl Yönetebilirsiniz?</h2>
      <p>
        Tarayıcınızın ayarları üzerinden çerezleri kabul edebilir, reddedebilir veya
        silebilirsiniz. Çerezleri devre dışı bırakmanız halinde sitenin bazı özellikleri
        beklendiği gibi çalışmayabilir.
      </p>

      <h2>5. Politika Değişiklikleri</h2>
      <p>
        Bu politikayı zaman zaman güncelleyebiliriz. En güncel versiyon her zaman bu
        sayfada yayımlanır.
      </p>
    </LegalPageShell>
  );
}
