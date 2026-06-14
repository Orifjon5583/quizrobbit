# Attestatsiya Quiz Platform

AWS server uchun React, Tailwind CSS, Node.js va PostgreSQL asosidagi quiz platformasi.

## Imkoniyatlar

- Umumiy server bazasida userlar, natijalar va reyting
- `bcrypt` bilan hash qilingan parollar
- JWT tokenli login
- Server tekshiradigan 20 soniyalik timer
- Server tomonidan random savollar va variantlar
- Natijani faqat bir marta saqlash
- Admin panelda barcha ro'yxatdan o'tgan foydalanuvchilar
- Mobil va desktop responsive dizayn
- Savollarni `data/questions` orqali boshqarish

## Lokal Ishga Tushirish

PostgreSQL baza yarating va `.env.example` nusxasidan `.env` fayl tayyorlang:

```bash
cp .env.example .env
npm install
npm run build
npm start
```

Frontend va API birgalikda `http://127.0.0.1:3001` da ishlaydi.

Frontend ustida ishlash uchun alohida terminalda:

```bash
npm run server:dev
npm run dev
```

Vite `/api` so'rovlarini `127.0.0.1:3001` portga yo'naltiradi.

## Savol Manbasi

Savollar `data/questions` papkasida saqlanadi. Server ishga tushganda JSON fayllarni o'qiydi. Har bir bo'lim uchun alohida `.json` fayl ishlatiladi.

Savol formati:

```text
category, question, option1, option2, option3, option4, correctAnswer, difficulty
```

Admin panel orqali savol qo'shsangiz, server avtomatik ravishda tegishli JSON faylni yangilaydi.

Bo'limlar uchun namuna fayl nomi:

```bash
data/questions/scratch.json
```

## AWS Deploy

Server talablari:

```text
Ubuntu
Node.js 20+
PostgreSQL
Nginx
PM2
```

AWS Security Group inbound portlari:

```text
22    SSH    faqat administrator IP
80    HTTP   0.0.0.0/0
443   HTTPS  0.0.0.0/0
```

`3001` portni internetga ochmang. Nginx ichki `127.0.0.1:3001` portga proxy qiladi.

PostgreSQL tayyorlash:

```bash
sudo -u postgres psql
CREATE USER attestatsiya WITH PASSWORD 'KUCHLI_PAROL';
CREATE DATABASE attestatsiya OWNER attestatsiya;
\q
```

Server `.env` fayli:

```env
PORT=3001
DATABASE_URL=postgresql://attestatsiya:KUCHLI_PAROL@127.0.0.1:5432/attestatsiya
JWT_SECRET=UZUN_RANDOM_SECRET
ADMIN_LOGIN=admin
ADMIN_PASSWORD=KUCHLI_ADMIN_PAROL
```

Deploy:

```bash
cd /var/www/Attestatsiya-Robbit
git pull origin main
npm install
npm run build
pm2 delete attestatsiya || true
pm2 start ecosystem.config.cjs
pm2 save
```
