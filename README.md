# پلتفرم جامع مدیریت و مشاوره تحصیلی کنکور

## درباره پروژه

این پلتفرم یک سیستم جامع برای مدیریت فرآیند مشاوره تحصیلی است که شامل:

- 📚 مدیریت برنامه مطالعاتی
- 📊 گزارش‌دهی روزانه
- 📝 آزمون‌های آنلاین
- 💰 مدیریت مالی و پرداخت
- 👥 سیستم نقش‌های کاربری (RBAC)

## تکنولوژی‌های استفاده شده

### Backend
- Laravel 11
- MySQL 8.0
- Redis
- Laravel Sanctum (Authentication)
- Spatie Permission (RBAC)

### Frontend
- React 18
- Vite
- Tailwind CSS
- Shadcn/ui

## نصب و راه‌اندازی

### پیش‌نیازها
- PHP 8.2+
- Composer
- MySQL 8.0+
- Redis
- Node.js 18+

### مراحل نصب

1. نصب Dependencies:
```bash
composer install
npm install
```

2. تنظیم Environment:
```bash
cp .env.example .env
php artisan key:generate
```

3. ایجاد دیتابیس:
```bash
php artisan migrate
php artisan db:seed
```

4. اجرای سرور:
```bash
php artisan serve
npm run dev
```

## مستندات

برای اطلاعات بیشتر به فایل‌های زیر مراجعه کنید:
- [Implementation Plan](docs/implementation_plan.md)
- [API Documentation](docs/api.md)
- [Database Schema](docs/database.md)

## لایسنس

MIT License
