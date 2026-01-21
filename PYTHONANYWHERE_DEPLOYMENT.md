# 🚀 PythonAnywhere Deployment Kılavuzu

Bu kılavuz, Nafaka Geçmiş Faiz Hesaplama uygulamasını PythonAnywhere'de nasıl yayınlayacağınızı adım adım anlatır.

## 📋 Gereksinimler

- PythonAnywhere hesabı (ücretsiz hesap yeterli)
- Git repository (opsiyonel ama önerilir)

## 🔧 Adım 1: PythonAnywhere Hesabı Oluşturma

1. https://www.pythonanywhere.com adresine gidin
2. "Pricing & signup" tıklayın
3. "Create a Beginner account" ile ücretsiz hesap oluşturun
4. Email adresinizi onaylayın

## 📁 Adım 2: Dosyaları Yükleme

### Yöntem A: Git ile (Önerilen)

1. PythonAnywhere'de **Bash console** açın
2. Şu komutları çalıştırın:

```bash
cd ~
git clone https://github.com/KULLANICI_ADINIZ/nafaka-hesaplama.git
cd nafaka-hesaplama
```

### Yöntem B: Manuel Yükleme

1. **Files** sekmesine gidin
2. Yeni bir klasör oluşturun: `nafaka-hesaplama`
3. Tüm dosyaları tek tek yükleyin:
   - app.py
   - wsgi.py
   - requirements.txt
   - templates/ klasörü ve içindeki dosyalar
   - static/ klasörü ve içindeki dosyalar

## 🐍 Adım 3: Virtual Environment Kurulumu

1. **Bash console** açın
2. Şu komutları çalıştırın:

```bash
cd ~/nafaka-hesaplama
python3.10 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

**Not:** Kurulum 2-3 dakika sürebilir.

## ⚙️ Adım 4: Web App Yapılandırması

1. PythonAnywhere dashboard'da **Web** sekmesine gidin
2. "Add a new web app" butonuna tıklayın
3. Domain adınızı seçin (örn: `kullanici_adi.pythonanywhere.com`)
4. "Manual configuration" seçin
5. **Python 3.10** seçin

## 🔧 Adım 5: WSGI Dosyası Düzenleme

1. Web sekmesinde "WSGI configuration file" linkine tıklayın
2. Dosyanın içeriğini tamamen silin
3. Şu kodu yapıştırın:

```python
import sys
import os

# Kullanıcı adınızı buraya yazın
project_home = '/home/KULLANICI_ADINIZ/nafaka-hesaplama'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Virtual environment
activate_this = '/home/KULLANICI_ADINIZ/nafaka-hesaplama/venv/bin/activate_this.py'
with open(activate_this) as file_:
    exec(file_.read(), dict(__file__=activate_this))

from app import app as application
```

4. **KULLANICI_ADINIZ** yazan yerleri kendi kullanıcı adınızla değiştirin
5. "Save" butonuna tıklayın

## 📂 Adım 6: Static ve Template Klasörlerini Ayarlama

1. Web sekmesinde aşağı kaydırın
2. **Static files** bölümünde:
   - URL: `/static/`
   - Directory: `/home/KULLANICI_ADINIZ/nafaka-hesaplama/static`

3. **Template files** (otomatik bulunur, kontrol edin):
   - `/home/KULLANICI_ADINIZ/nafaka-hesaplama/templates`

## 🎯 Adım 7: Uygulamayı Başlatma

1. Web sekmesinin en üstüne gidin
2. Yeşil **"Reload"** butonuna tıklayın
3. Web sitenizin linkine tıklayın: `kullanici_adi.pythonanywhere.com`

## ✅ Test Etme

1. Tarayıcıda sitenizi açın
2. Şu özellikleri test edin:
   - ✓ Dönem oluşturma
   - ✓ Manuel düzenleme
   - ✓ Faiz hesaplama
   - ✓ Excel indirme
   - ✓ CSV indirme
   - ✓ Takvim doğrulama

## 🐛 Sorun Giderme

### Hata: "Something went wrong"

1. Web sekmesinde **Error log** ve **Server log** kontrol edin
2. Virtual environment'in doğru yüklendiğinden emin olun
3. WSGI dosyasındaki kullanıcı adını kontrol edin

### Hata: "ModuleNotFoundError"

```bash
cd ~/nafaka-hesaplama
source venv/bin/activate
pip install -r requirements.txt
```

### Static dosyalar yüklenmiyor

1. Static files path'ini kontrol edin
2. Files sekmesinde dosyaların varlığını doğrulayın
3. Reload butonuna tekrar basın

### Excel indirme çalışmıyor

```bash
cd ~/nafaka-hesaplama
source venv/bin/activate
pip install openpyxl --upgrade
```

## 🔄 Güncellemeler

### Git ile:

```bash
cd ~/nafaka-hesaplama
git pull origin main
source venv/bin/activate
pip install -r requirements.txt --upgrade
```

Web sekmesinde "Reload" butonuna basın.

### Manuel:

1. Değiştirilen dosyaları Files sekmesinden yükleyin
2. Web sekmesinde "Reload" butonuna basın

## 🌐 Özel Domain Bağlama (Ücretli Hesap)

1. **Web** sekmesinde "Add a new web app"
2. Özel domain'inizi girin
3. DNS ayarlarınızı PythonAnywhere'in verdiği bilgilere göre yapın

## 📊 Performans İpuçları

### Ücretsiz Hesap Limitleri:

- ✓ CPU: 100 saniye/gün
- ✓ Web Apps: 1 adet
- ✓ Disk: 512 MB
- ✓ Bandwidth: Sınırsız

### Optimizasyon:

- Gereksiz log yazımını azaltın
- Static dosyaları minimize edin
- Cache kullanın (ücretli hesapta)

## 🔐 Güvenlik Önerileri

1. **app.py** dosyasında `debug=True` kaldırın (production için):

```python
if __name__ == '__main__':
    app.run(debug=False)  # False yapın
```

2. Hassas bilgileri environment variable olarak saklayın
3. HTTPS her zaman aktif (PythonAnywhere otomatik sağlar)

## 📝 Önemli Notlar

- **Ücretsiz hesaplar** 3 ay boyunca aktif kalır. Her 3 ayda bir giriş yapın.
- **Web app** her gün otomatik olarak durur, "Always on" özelliği ücretli.
- **Scheduled tasks** ücretsiz hesapta 1 adet günlük task mümkün.

## 💡 Ek Kaynaklar

- PythonAnywhere Help: https://help.pythonanywhere.com/
- Flask Documentation: https://flask.palletsprojects.com/
- PythonAnywhere Forums: https://www.pythonanywhere.com/forums/

## 🆘 Destek

Sorunlarınız için:

1. PythonAnywhere Forum: https://www.pythonanywhere.com/forums/
2. Error logları kontrol edin
3. Bash console'da debug yapın

---

## ✨ Başarılar!

Uygulamanız artık canlıda! 🎉

Site URL'niz: `https://kullanici_adiniz.pythonanywhere.com`
