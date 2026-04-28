// Bu standart placeholder metindir. Müşteri kendi şirket bilgileriyle güncellemeli. Admin panelden düzenlenebilir.

import type { Metadata } from 'next';
import { LegalPageShell } from '../../../components/LegalPageShell';
import { content } from '../../../lib/content';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
  description: `${content.meta.companyName} gizlilik politikası ve kişisel veri uygulamaları.`,
};

export default function GizlilikPage() {
  const company = content.meta.companyName;

  return (
    <LegalPageShell title="Gizlilik Politikası" lastUpdated="Son güncelleme: 2026">
      <p>
        {company} olarak gizliliğinize değer veriyoruz. Bu politika, sizden topladığımız
        bilgileri nasıl işlediğimizi, ne şekilde koruduğumuzu ve haklarınızı nasıl
        kullanabileceğinizi açıklar.
      </p>

      <h2>1. Topladığımız Bilgiler</h2>
      <ul>
        <li>Sizin bizimle paylaştığınız kimlik ve iletişim bilgileri</li>
        <li>Sitemizi kullanırken otomatik toplanan teknik bilgiler (IP, tarayıcı, cihaz)</li>
        <li>Çerezler aracılığıyla toplanan kullanım verileri</li>
      </ul>

      <h2>2. Bilgileri Nasıl Kullanırız</h2>
      <ul>
        <li>Hizmetlerimizi sunmak ve iyileştirmek</li>
        <li>Sorularınıza ve taleplerinize yanıt vermek</li>
        <li>Yasal yükümlülüklerimizi yerine getirmek</li>
        <li>Güvenliği sağlamak ve kötüye kullanımı önlemek</li>
      </ul>

      <h2>3. Bilgi Paylaşımı</h2>
      <p>
        Kişisel bilgileriniz; yalnızca hizmet sunumu için gerekli olduğunda, hukuki
        zorunluluk halinde veya açık rızanızla üçüncü taraflarla paylaşılır. Bilgilerinizi
        ticari amaçla satmayız.
      </p>

      <h2>4. Veri Güvenliği</h2>
      <p>
        Verilerinizi yetkisiz erişim, kayıp ve kötüye kullanımdan korumak için uygun
        idari ve teknik önlemleri uygularız. Ancak internet üzerinden hiçbir aktarımın
        %100 güvenli olamayacağını belirtmek isteriz.
      </p>

      <h2>5. Veri Saklama Süresi</h2>
      <p>
        Kişisel verilerinizi, toplanma amacının gerektirdiği süre veya yasal mevzuatın
        öngördüğü süre boyunca saklarız. Süre sonunda verileriniz silinir veya anonim
        hale getirilir.
      </p>

      <h2>6. Haklarınız</h2>
      <p>
        Kişisel verilerinize erişme, düzeltme, silme ve işleme itiraz etme hakkına
        sahipsiniz. Detaylar için KVKK Aydınlatma Metnimizi inceleyebilirsiniz.
      </p>

      <h2>7. Politikadaki Değişiklikler</h2>
      <p>
        Bu politikayı zaman zaman güncelleyebiliriz. Önemli değişikliklerde sitemizde
        uygun bir bildirim yaparız.
      </p>
    </LegalPageShell>
  );
}
