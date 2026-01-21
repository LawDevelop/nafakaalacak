# 🚀 Vercel Deployment Kılavuzu

## ✅ EVET! Vercel Python'u Destekliyor (Ama Dikkat!)

Vercel, Python Flask uygulamalarını **serverless functions** olarak destekliyor. Ancak Render veya PythonAnywhere'den farklı çalışır.

---

## ⚠️ ÖNEMLİ: Vercel vs Geleneksel Hosting

### Vercel Özellikleri:
- ✅ **Serverless** - Her istek bir fonksiyon çağırır
- ✅ **Global CDN** - Çok hızlı
- ✅ **Otomatik scaling** - Sınırsız trafik
- ⚠️ **Cold start** - İlk istek ~2-5 saniye sürebilir
- ⚠️ **10 saniye timeout** (Hobby plan)
- ⚠️ **Stateless** - Session saklanamaz
- ⚠️ **Biraz daha teknik**

### Sizin Projeniz İçin Uygunluk:
- ✅ **Stateless** - Her hesaplama bağımsız (UYGUN!)
- ✅ **Hızlı işlemler** - Faiz hesaplama hızlı (UYGUN!)
- ✅ **Excel/CSV export** - Çalışır (UYGUN!)
- ⚠️ **Excel dosyası** - openpyxl büyük paket (~2MB)

**SONUÇ:** Projeniz Vercel'de çalışır ama Render.com daha basit ve güvenilir olacaktır.

---

## 🎯 Vercel vs Diğerleri

| Özellik | Vercel | Render | PythonAnywhere |
|---------|--------|--------|----------------|
| **Kurulum** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Hız** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Python Flask** | ⚠️ Serverless | ✅ Native | ✅ Native |
| **Timeout** | 10 sn | ∞ | ∞ |
| **Uyku Modu** | ❌ Yok | 15 dk | Günlük |
| **Önerim** | 🌐 CDN gerekirse | 🏆 En iyi | 👍 Öğrenme |

---

## 📋 Adım 1: Vercel İçin Dosyaları Hazırlama

### 1.1. vercel.json Oluşturun (YENİ DOSYA)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.py"
    }
  ]
}
```

### 1.2. api/index.py Oluşturun (YENİ DOSYA)

`api` klasörü oluşturun ve içine `index.py` dosyası ekleyin:

```python
# api/index.py
import sys
import os

# Ana dizini Python path'e ekle
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app import app

# Vercel için handler
def handler(request):
    return app(request.environ, request.start_response)

# Flask app'i export et
app = app
```

### 1.3. requirements.txt Kontrol

Vercel için requirements.txt zaten hazır:
```
Flask==3.0.0
python-dateutil==2.8.2
openpyxl==3.1.2
```

**Not:** gunicorn'a gerek yok (Vercel kendi runtime'ını kullanır)

### 1.4. Dosya Yapısı

```
nafakaalacak/
├── api/
│   └── index.py          ✅ YENİ OLUŞTURUN
├── app.py
├── vercel.json           ✅ YENİ OLUŞTURUN
├── requirements.txt
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js
```

---

## 🌐 Adım 2: Vercel'e Deploy

### 2.1. Vercel Hesabı Oluşturma

1. https://vercel.com adresine gidin
2. **"Sign Up"** tıklayın
3. **GitHub ile giriş** yapın (en kolay)
4. Authorization'ı onaylayın

### 2.2. Proje Import Etme

1. Dashboard'da **"Add New Project"** tıklayın
2. **"Import Git Repository"** seçin
3. `nafakaalacak` repository'yi bulun
4. **"Import"** tıklayın

### 2.3. Proje Ayarları

**Project Name:** `nafakaalacak` (veya istediğiniz)

**Framework Preset:** `Other` (Flask yok, manuel seçin)

**Root Directory:** `./` (default)

**Build Command:** (Boş bırakın)

**Output Directory:** (Boş bırakın)

**Install Command:** (Otomatik)

### 2.4. Environment Variables (İsteğe Bağlı)

Şimdilik gerek yok, ama ekleyebilirsiniz:
```
FLASK_ENV=production
```

### 2.5. Deploy!

1. **"Deploy"** butonuna tıklayın
2. ⏳ Build başlayacak (2-3 dakika)
3. ✅ "Deployment Ready" yazdığında hazır!

---

## 🎉 Adım 3: Sitenize Erişim

**URL:** `https://nafakaalacak.vercel.app`

(veya seçtiğiniz isim)

---

## ⚙️ İleri Seviye

### Custom Domain

1. **Settings** → **Domains**
2. Domain'inizi ekleyin
3. DNS ayarları yapın
4. ✅ Otomatik SSL!

### Environment Variables

1. **Settings** → **Environment Variables**
2. Key-Value ekleyin
3. Redeploy gerekir

---

## 🐛 Sorun Giderme

### Hata: "Function Execution Timeout"

**Neden:** İşlem 10 saniyeden uzun sürdü

**Çözüm:** Render.com kullanın (timeout yok)

### Hata: "Module not found"

**Çözüm 1:** requirements.txt'i kontrol edin

**Çözüm 2:** api/index.py'de path import'u doğru mu?

### Static Files Yüklenmiyor

**Çözüm:** vercel.json'a static route ekleyin:

```json
{
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "api/index.py"
    }
  ]
}
```

### Excel İndirme Çalışmıyor

**Neden:** openpyxl paketi büyük olabilir

**Çözüm:** Vercel Pro hesap ($20/ay) veya Render kullanın

---

## 💰 Vercel Ücretsiz Limitleri

- ✅ **Bandwidth:** 100 GB/ay
- ✅ **Executions:** 100 GB-Hours/ay
- ✅ **Build Time:** 6000 dakika/ay
- ✅ **Serverless Functions:** 12
- ⚠️ **Timeout:** 10 saniye (Hobby)
- ✅ **Custom Domain:** ✅ Sınırsız!
- ✅ **SSL:** ✅ Otomatik!

---

## 🔄 Güncelleme

Vercel otomatik deploy yapar:

1. Dosyalarınızı değiştirin
2. GitHub'a push yapın
3. ✅ Vercel otomatik deploy eder!

```bash
git add .
git commit -m "Güncelleme"
git push origin main
```

---

## ⚠️ Vercel'in Dezavantajları (Bu Proje İçin)

1. **Serverless Architecture** - Her istek cold start
2. **10 Saniye Timeout** - Uzun işlemler için uygun değil
3. **Paket Boyutu Limiti** - openpyxl ~2MB (sorun olabilir)
4. **Debugging Zor** - Loglar daha karmaşık
5. **Session Yok** - Stateful işlemler yapılamaz

---

## 💡 Önerim

### Vercel Kullanın Eğer:
- ✅ Global CDN gerekiyorsa
- ✅ Çok yüksek trafik bekleniyorsa
- ✅ Serverless architecture istiyorsanız
- ✅ Next.js gibi framework'lerle entegre ediyorsanız

### Render Kullanın Eğer:
- ✅ Flask ile kolay deployment istiyorsanız (ÖNERİLİR)
- ✅ Timeout problemi olmasın istiyorsanız
- ✅ Daha az teknik iş istiyorsanız
- ✅ Her zaman aktif kalmasını istiyorsanız

### PythonAnywhere Kullanın Eğer:
- ✅ Python öğreniyorsanız
- ✅ Bash console gerekiyorsa
- ✅ Scheduled tasks istiyorsanız

---

## 🆚 SONUÇ: Hangisi Sizin İçin?

**Bu Proje İçin En İyi:** 🏆 **Render.com**

**Neden:**
1. Flask native destekliyor
2. Kurulum daha kolay
3. Timeout yok
4. Daha güvenilir
5. openpyxl sorunsuz çalışır

**Vercel Ne Zaman:**
- Next.js/React projeleri için
- Global CDN gerçekten gerekiyorsa
- Serverless architecture avantajlı olacaksa

---

## 📞 Destek

**Vercel Docs:** https://vercel.com/docs

**Flask on Vercel:** https://vercel.com/guides/using-flask-with-vercel

**Community:** https://github.com/vercel/community

---

## ✨ Alternatif: Kolay Yol

Eğer Vercel'in serverless yapısı karmaşık geliyorsa:

### 🏆 Render.com Kullanın (5 dakika)
1. Render.com'a gidin
2. GitHub bağlayın
3. Deploy butonuna basın
4. Hazır!

**Detaylar:** RENDER_DEPLOYMENT.md

---

## 🎓 Vercel Deneyimi

Eğer yine de Vercel'i denemek isterseniz, ben size adımları hazırlayabilirim:

1. `vercel.json` oluşturalım
2. `api/index.py` oluşturalım
3. GitHub'a push yapalım
4. Vercel'e bağlayalım

**Ama tavsiyem:** İlk önce Render.com deneyin. Daha kolay ve Flask için daha uygun! 😊

---

🎯 **Karar Verdiniz mi?**
- Vercel denemek isterseniz → Dosyaları hazırlayayım
- Kolay yolu seçerseniz → RENDER_DEPLOYMENT.md'ye bakın
