# Attestatsiya Quiz Platform

API key talab qilmaydigan React va Tailwind CSS quiz platformasi.

## Ishga tushirish

```bash
npm install
npm run dev
```

`.env`, Firebase va alohida baza sozlash kerak emas. Savollar loyiha ichidagi `savollar.xlsx` faylidan olinadi.

## Savollarni Excel orqali o'zgartirish

`savollar.xlsx` faylini Excel dasturida oching va savollarni tahrirlang. Ustun nomlarini o'zgartirmang:

```text
category, question, option1, option2, option3, option4, correctAnswer, difficulty
```

Keyin dev serverni qayta ishga tushiring:

```bash
npm run dev
```

`npm run dev` va `npm run build` oldidan Excel fayl avtomatik o'qilib, sayt uchun JSON yangilanadi.

Excel o'zgarganidan keyin sayt qayta ishga tushirilsa, brauzerdagi savollar ham avtomatik yangilanadi.

## Foydalanuvchi

Oddiy foydalanuvchi `/register` orqali ro'yxatdan o'tadi va `/login` orqali kiradi. Quiz natijalari, profil va reyting shu brauzerda saqlanadi.

## Admin

Admin uchun alohida sahifa:

```text
/admin-login
```

Standart lokal kirish ma'lumotlari:

```text
login: admin
parol: admin123
```

Admin panel faqat ro'yxatdan o'tgan foydalanuvchilarni ko'rsatadi.

## Muhim

Bu API keysiz lokal variant. Ma'lumotlar serverda emas, foydalanuvchining brauzerida saqlanadi. Boshqa kompyuterdagi foydalanuvchilar umumiy ro'yxatda ko'rinmaydi. Umumiy internet sayti uchun keyinchalik backend yoki Firebase ulash kerak bo'ladi.
