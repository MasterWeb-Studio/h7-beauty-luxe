// Bu standart placeholder metindir. Müşteri kendi şirket bilgileriyle güncellemeli. Admin panelden düzenlenebilir.

import type { Metadata } from 'next';
import { LegalPageShell } from '../../../components/LegalPageShell';
import { content } from '../../../lib/content';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni',
  description: `${content.meta.companyName} kişisel verilerin korunması hakkında aydınlatma metni.`,
};

export default function KvkkPage() {
  const company = content.meta.companyName;

  return (
    <LegalPageShell title="KVKK Aydınlatma Metni" lastUpdated="Son güncelleme: 2026">
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca, veri
        sorumlusu sıfatıyla {company} tarafından işlenen kişisel verileriniz, aşağıda
        açıklanan kapsamda mevzuata uygun olarak işlenmektedir.
      </p>

      <h2>1. Veri Sorumlusu</h2>
      <p>
        Kişisel verileriniz, KVKK kapsamında veri sorumlusu sıfatıyla {company} tarafından
        işlenmektedir. Kanun kapsamındaki haklarınızı kullanmak için aşağıdaki iletişim
        kanallarını kullanabilirsiniz.
      </p>

      <h2>2. İşlenen Kişisel Veriler</h2>
      <ul>
        <li>Kimlik bilgileri: ad, soyad</li>
        <li>İletişim bilgileri: e-posta, telefon, adres</li>
        <li>Müşteri işlem bilgileri: talep ve şikayet kayıtları</li>
        <li>İşlem güvenliği bilgileri: IP adresi, log kayıtları, çerez verileri</li>
      </ul>

      <h2>3. Kişisel Verilerin İşlenme Amaçları</h2>
      <ul>
        <li>Hizmetlerimizin sunulması ve iyileştirilmesi</li>
        <li>Müşteri iletişiminin sağlanması ve taleplerin yanıtlanması</li>
        <li>Sözleşmesel ve yasal yükümlülüklerin yerine getirilmesi</li>
        <li>Bilgi güvenliği süreçlerinin yürütülmesi</li>
        <li>Faaliyetlerin mevzuata uygun yürütülmesi</li>
      </ul>

      <h2>4. Kişisel Verilerin Aktarılması</h2>
      <p>
        Kişisel verileriniz; hizmet aldığımız tedarikçilere, iş ortaklarımıza ve yasal
        zorunluluk halinde yetkili kamu kurum ve kuruluşlarına KVKK&apos;nın 8. ve 9.
        maddelerine uygun olarak aktarılabilir.
      </p>

      <h2>5. Toplama Yöntemi ve Hukuki Sebep</h2>
      <p>
        Kişisel verileriniz; web sitemiz, iletişim formları, e-posta ve diğer yazılı/elektronik
        kanallar aracılığıyla; sözleşmenin kurulması, hukuki yükümlülüklerin yerine getirilmesi
        ve meşru menfaat hukuki sebeplerine dayanılarak toplanır.
      </p>

      <h2>6. KVKK Madde 11 Kapsamında Haklarınız</h2>
      <ul>
        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
        <li>İşlenmişse buna ilişkin bilgi talep etme</li>
        <li>İşleme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
        <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
        <li>Mevzuata uygun şekilde silinmesini veya yok edilmesini isteme</li>
        <li>İşleme itiraz etme</li>
        <li>Zarara uğranması halinde zararın giderilmesini talep etme</li>
      </ul>

      <h2>7. Başvuru</h2>
      <p>
        Haklarınızı kullanmak için {company} ile e-posta yoluyla iletişime geçebilirsiniz.
        Başvurunuz en geç otuz gün içinde sonuçlandırılacaktır.
      </p>
    </LegalPageShell>
  );
}
