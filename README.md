# Nafaka Geçmiş Faiz Hesaplama Sistemi

Modern ve kullanıcı dostu bir web uygulaması ile geçmiş nafaka alacaklarınızın faiz hesaplamasını yapın.

## 🌟 Özellikler

- **Otomatik Dönem Oluşturma**: Başlangıç ve bitiş tarihleri arasında otomatik olarak aylık dönemler oluşturur
- **Yıllık Artış Desteği**: Nafaka tutarlarında yıllık artış oranı tanımlayabilirsiniz
- **Esnek Düzenleme**: Oluşturulan dönemleri tek tek düzenleyebilir, silebilir veya yeni dönemler ekleyebilirsiniz
- **Manuel Dönem Ekleme**: İstediğiniz tarih ve tutarla manuel dönem ekleyebilirsiniz
- **Basit Faiz Hesaplama**: Her dönem için ayrı ayrı basit faiz hesaplaması yapar
- **Faiz Oranı Esnekliği**: Kullanıcı istediği faiz oranını girebilir
- **360/365 Gün Seçeneği**: Faize esas gün sayısını seçebilirsiniz
- **Detaylı Raporlama**: Her dönem için ayrıntılı hesaplama sonuçları ve genel özet
- **Yazdırma Özelliği**: Sonuçları yazdırabilir veya PDF olarak kaydedebilirsiniz
- **Modern Arayüz**: Responsive ve kullanıcı dostu tasarım

## 📋 Gereksinimler

- Python 3.7 veya üzeri
- Flask 3.0.0
- python-dateutil 2.8.2

## 🚀 Kurulum

1. Gerekli paketleri yükleyin:
```bash
pip install -r requirements.txt
```

2. Uygulamayı başlatın:
```bash
python app.py
```

3. Tarayıcınızda şu adresi açın:
```
http://localhost:5000
```

## 📖 Kullanım

### Adım 1: Nafaka Dönemlerini Oluştur

1. **Başlangıç Tarihi**: Nafaka alacağının başladığı tarih
2. **Bitiş Tarihi**: Son nafaka dönemi (varsayılan: bugün)
3. **Aylık Nafaka Tutarı**: Her ay için nafaka tutarı (TL)
4. **Muacceliyet Günü**: Nafakanın her ay hangi gününde muaccel olduğu (1-31)
5. **Yıllık Artış Oranı** (Opsiyonel): Nafaka tutarında yıllık artış varsa yüzde olarak
6. **Artış Ayı** (Opsiyonel): Artışın uygulanacağı ay

"Dönemleri Oluştur" butonuna tıklayın.

### Adım 2: Dönemleri Düzenle

- Tabloda gösterilen dönemleri gözden geçirin
- Tutar veya açıklama üzerine tıklayarak düzenleyin
- ✏️ Düzenle butonu ile detaylı düzenleme yapabilirsiniz
- 🗑️ Sil butonu ile dönemi silebilirsiniz
- "➕ Manuel Dönem Ekle" ile yeni dönem ekleyebilirsiniz

### Adım 3: Faiz Hesapla

1. **Hesaplama Bitiş Tarihi**: Faizin hangi tarihe kadar hesaplanacağı (varsayılan: bugün)
2. **Yıllık Faiz Oranı**: Uygulanacak faiz oranı (yüzde olarak, örn: 24)
3. **Faize Esas Gün**: 360 veya 365 gün seçin

"💰 Faiz Hesapla" butonuna tıklayın.

### Sonuçları Görüntüle

- **Toplam Anapara**: Tüm nafaka tutarlarının toplamı
- **Toplam Faiz**: Hesaplanan toplam faiz tutarı
- **Genel Toplam**: Anapara + Faiz
- **Detaylı Tablo**: Her dönem için ayrı ayrı hesaplama sonuçları

"🖨️ Yazdır" butonuna tıklayarak sonuçları yazdırabilir veya PDF olarak kaydedebilirsiniz.

## 💡 Faiz Hesaplama Formülü

Program **basit faiz** hesaplama yöntemini kullanır:

```
Faiz = Anapara × (Faiz Oranı / 100) × (Gün Sayısı / Faize Esas Gün)
```

### Örnek:
- Anapara: 5.000 TL
- Faiz Oranı: %24
- Gün Sayısı: 180 gün
- Faize Esas Gün: 360

```
Faiz = 5.000 × (24 / 100) × (180 / 360) = 600 TL
```

**Önemli**: Her nafaka dönemi için faiz ayrı ayrı hesaplanır ve birbirine eklenmez (bileşik faiz değil, basit faiz).

## 🎨 Ekran Görüntüleri

Program modern, gradient renkli ve kullanıcı dostu bir arayüze sahiptir. Tüm adımlar kart bazlı düzende organize edilmiştir.

## 🔧 Teknik Detaylar

### Backend (Python/Flask)
- `app.py`: Ana Flask uygulaması
- API endpoint'leri:
  - `/generate_periods`: Dönem oluşturma
  - `/calculate`: Faiz hesaplama

### Frontend
- `templates/index.html`: Ana HTML şablonu
- `static/style.css`: Modern CSS stilleri (gradient, animasyonlar)
- `static/script.js`: Dinamik JavaScript işlevleri

### Özellikler
- Responsive tasarım (mobil uyumlu)
- Animasyonlar ve geçişler
- Form validasyonu
- Hata yönetimi
- Yazdırma desteği

## 📝 Notlar

- Program tamamen tarayıcı tabanlıdır
- Tüm hesaplamalar sunucu tarafında (Python) yapılır
- Veriler oturum boyunca hafızada tutulur (veritabanı kullanılmaz)
- Türkçe dil desteği ve TL para birimi

## 🤝 Destek

Herhangi bir sorunla karşılaşırsanız veya öneriniz varsa lütfen bizimle iletişime geçin.

## 📄 Lisans

Bu proje açık kaynak kodludur ve özgürce kullanılabilir.
