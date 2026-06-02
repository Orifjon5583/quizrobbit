# AWS Deploy: attestatsiya.orifdev.uz

Mavjud server holati:

```text
Ubuntu
Nginx -> http://127.0.0.1:3001
PM2 app name -> attestatsiya
Project path -> /var/www/Attestatsiya-Robbit
PostgreSQL -> 127.0.0.1:5432
SSL -> Certbot orqali tayyor
```

## 1. Eski sayt backup

```bash
cd /var/www
sudo mkdir -p /var/backups/attestatsiya
sudo tar -czf /var/backups/attestatsiya/backup-$(date +%Y%m%d-%H%M%S).tar.gz Attestatsiya-Robbit
pm2 stop attestatsiya
```

## 2. PostgreSQL baza

Kuchli parol tanlang. Parolda URL uchun maxsus belgilar ishlatsangiz `DATABASE_URL` ichida URL-encode qiling.

```bash
sudo -u postgres psql
```

```sql
CREATE USER attestatsiya WITH PASSWORD 'KUCHLI_DB_PAROL';
CREATE DATABASE attestatsiya OWNER attestatsiya;
\q
```

## 3. Yangi loyihani olish

```bash
cd /var/www
sudo mv Attestatsiya-Robbit Attestatsiya-Robbit-old-$(date +%Y%m%d-%H%M%S)
sudo git clone https://github.com/Orifjon5583/quizrobbit.git Attestatsiya-Robbit
sudo chown -R ubuntu:ubuntu /var/www/Attestatsiya-Robbit
cd /var/www/Attestatsiya-Robbit
npm install
```

## 4. Server environment

JWT secret yaratish:

```bash
openssl rand -hex 48
```

`.env` yaratish:

```bash
nano .env
```

```env
PORT=3001
DATABASE_URL=postgresql://attestatsiya:KUCHLI_DB_PAROL@127.0.0.1:5432/attestatsiya
JWT_SECRET=OPENSSL_BERGAN_SECRET
ADMIN_LOGIN=admin
ADMIN_PASSWORD=KUCHLI_ADMIN_PAROL
```

## 5. Build va PM2

```bash
npm run build
pm2 delete attestatsiya || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 status
```

## 6. Tekshirish

```bash
curl http://127.0.0.1:3001/api/health
curl https://attestatsiya.orifdev.uz/api/health
sudo nginx -t
```

Kutiladigan health javobi:

```json
{"ok":true,"questions":200}
```

## Portlar

AWS Security Group inbound:

```text
22    SSH    faqat administrator IP
80    HTTP   0.0.0.0/0
443   HTTPS  0.0.0.0/0
```

`3001` portni internetga ochmang. Nginx server ichida proxy qiladi.
