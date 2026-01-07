# 🚀 Швидкий гайд по деплою на Vercel

## Крок 1: Підготовка Git репозиторію

```bash
# Ініціалізуйте Git (якщо ще не зробили)
git init

# Додайте всі файли
git add .

# Зробіть перший коміт
git commit -m "Initial commit"

# Створіть репозиторій на GitHub та додайте remote
git remote add origin https://github.com/your-username/powerbi-shop.git
git branch -M main
git push -u origin main
```

## Крок 2: Деплой на Vercel

1. Перейдіть на [vercel.com](https://vercel.com)
2. Увійдіть через GitHub
3. Натисніть **"Add New Project"**
4. Виберіть ваш репозиторій `powerbi-shop`
5. Vercel автоматично визначить налаштування Next.js

## Крок 3: Додайте змінні оточення

У налаштуваннях проекту (**Settings** → **Environment Variables**) додайте:

### 1. STRIPE_SECRET_KEY
- **Значення**: ваш Stripe секретний ключ
- **Environment**: Production, Preview, Development
- Отримати: [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys)

### 2. NEXT_PUBLIC_BASE_URL
- **Значення**: `https://your-project.vercel.app` (Vercel надасть URL після першого деплою)
- **Environment**: Production, Preview, Development
- ⚠️ Після першого деплою оновіть це значення на ваш реальний URL

## Крок 4: Деплой

1. Натисніть **"Deploy"**
2. Дочекайтеся завершення білду
3. Скопіюйте URL вашого проекту
4. Оновіть `NEXT_PUBLIC_BASE_URL` на цей URL
5. Натисніть **"Redeploy"**

## ✅ Перевірка

1. Відкрийте ваш сайт на Vercel
2. Перевірте, що продукти завантажуються з Stripe
3. Протестуйте покупку з тестовою карткою:
   - **Картка**: `4242 4242 4242 4242`
   - **Дата**: будь-яка майбутня
   - **CVC**: 123

## 📁 Важливо про файли

- Файли з папки `downloads/` **мають бути** в Git репозиторії
- Вони будуть доступні на Vercel через API route `/api/download`
- Переконайтеся, що всі `.pbix` файли закомічені

## 🔄 Оновлення сайту

Після кожного `git push` на GitHub, Vercel автоматично:
- Визначить зміни
- Збудує нову версію
- Задеплоїть її

## 🐛 Проблеми?

### Файли не завантажуються
- Перевірте, що файли в папці `downloads/` закомічені в Git
- Перевірте, що в Stripe metadata вказано правильне ім'я файлу

### Помилки зі Stripe
- Перевірте, що `STRIPE_SECRET_KEY` правильний
- Перевірте, що використовуєте правильний ключ (test/live)

### Помилки з URL
- Переконайтеся, що `NEXT_PUBLIC_BASE_URL` вказує на правильний Vercel URL
- Перевірте, що URL не має слешу в кінці

