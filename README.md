# 🍪 Bakery Tracker — Vercel Deploy Rehberi
# (Windows için adım adım)

## Klasör yapısı şöyle olmalı:
#
#   bakery-tracker/
#   ├── index.html
#   ├── vercel.json
#   ├── README.md
#   └── api/
#       └── proxy.js

=============================================
ADIM 1 — GitHub hesabı aç (varsa geç)
=============================================

→ https://github.com adresine git
→ "Sign up" ile ücretsiz hesap oluştur
→ E-posta doğrulamasını yap

=============================================
ADIM 2 — Vercel hesabı aç (varsa geç)
=============================================

→ https://vercel.com adresine git
→ "Sign Up" → "Continue with GitHub" seç
→ GitHub hesabınla giriş yap

=============================================
ADIM 3 — Dosyaları GitHub'a yükle
=============================================

GitHub'da yeni repo oluştur:
→ GitHub'da sağ üstte "+" → "New repository"
→ Repository name: bakery-tracker
→ "Public" seç
→ "Create repository" tıkla

Dosyaları yükle:
→ "uploading an existing file" linkine tıkla
→ ZIP'i aç, içindeki TÜM dosyaları sürükle bırak
   (api klasörünü de dahil et!)
→ "Commit changes" tıkla

ÖNEMLI: api/proxy.js dosyası api klasörünün
içinde olmalı, dışarıda değil!

=============================================
ADIM 4 — Vercel'e deploy et
=============================================

→ vercel.com'a git, giriş yap
→ "Add New Project" tıkla
→ "Import Git Repository" → bakery-tracker seç
→ "Import" tıkla
→ Hiçbir şeyi değiştirme, direkt "Deploy" tıkla
→ 1-2 dakika bekle...
→ "Congratulations!" ekranı çıkar
→ Verilen linke tıkla → site canlı!

=============================================
ADIM 5 — Linki paylaş
=============================================

Vercel sana şuna benzer bir URL verir:
→ bakery-tracker-abc123.vercel.app

Bu linki herkesle paylaşabilirsin!
Ücretsiz, sunucu gerekmez, 7/24 çalışır.

=============================================
GÜNCELLEME YAPMAK İSTERSEN
=============================================

→ GitHub'da dosyayı aç → düzenle → "Commit"
→ Vercel otomatik yeniden deploy eder (1-2 dk)

=============================================
SORUN MU VAR?
=============================================

"404 Not Found" hatası:
→ api/proxy.js dosyası doğru klasörde mi? Kontrol et.

"Function Error" hatası:
→ Vercel dashboard → projen → "Functions" sekmesi
→ Hata loglarını buradan görebilirsin

Site açılıyor ama veri gelmiyor:
→ Vercel dashboard → projen → "Deployments"
→ Son deployment'a tıkla → "Functions" → proxy.js loglarına bak
