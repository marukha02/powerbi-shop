# Power BI Shop

Професійний магазин шаблонів Power BI з інтеграцією Stripe для оплати.

## 🚀 Деплой на Vercel

### Крок 1: Підготовка проекту

1. Переконайтеся, що всі зміни закомічені в Git:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
```

2. Завантажте проект на GitHub (якщо ще не зробили):
```bash
git remote add origin https://github.com/your-username/powerbi-shop.git
git push -u origin main
```

### Крок 2: Деплой на Vercel

1. Перейдіть на [Vercel](https://vercel.com) та увійдіть через GitHub
2. Натисніть **"Add New Project"**
3. Імпортуйте ваш репозиторій з GitHub
4. Vercel автоматично визначить Next.js проект

### Крок 3: Налаштування змінних оточення

У налаштуваннях проекту на Vercel додайте наступні **Environment Variables**:

#### Обов'язкові змінні:

- **`STRIPE_SECRET_KEY`**
  - Значення: ваш секретний ключ Stripe (починається з `sk_live_` для production або `sk_test_` для тестування)
  - Отримати можна в [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

- **`NEXT_PUBLIC_BASE_URL`**
  - Значення: URL вашого Vercel проекту (наприклад, `https://your-project.vercel.app`)
  - Vercel автоматично надає URL після деплою

#### Як додати змінні:

1. У проекті на Vercel перейдіть в **Settings** → **Environment Variables**
2. Додайте кожну змінну окремо:
   - **Name**: `STRIPE_SECRET_KEY`
   - **Value**: ваш ключ
   - **Environment**: виберіть `Production`, `Preview`, та `Development`
3. Повторіть для `NEXT_PUBLIC_BASE_URL`

### Крок 4: Деплой

1. Після додавання змінних оточення, Vercel автоматично перезапустить деплой
2. Або натисніть **"Redeploy"** вручну

### Крок 5: Перевірка

1. Після успішного деплою перейдіть на ваш URL
2. Перевірте, що продукти завантажуються з Stripe
3. Протестуйте покупку (використовуйте тестову картку Stripe)

## 📁 Структура файлів

- `downloads/` - папка з файлами для завантаження (.pbix файли)
- `app/` - Next.js App Router сторінки та API routes
- `components/` - React компоненти
- `public/` - статичні файли

## 🔧 Локальна розробка

1. Встановіть залежності:
```bash
npm install
```

2. Створіть файл `.env.local`:
```env
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3. Запустіть dev server:
```bash
npm run dev
```

## 📝 Налаштування Stripe

### Продукти

1. Створіть продукти в [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Додайте metadata для кожного продукту:
   - **`downloadUrl`**: ім'я файлу (наприклад, `report2.pbix`)
   - **`demoUrl`**: URL для live demo (опціонально)
3. Додайте зображення продукту в Stripe
4. Створіть ціну для продукту

### Тестові картки

Для тестування використовуйте:
- **Номер картки**: `4242 4242 4242 4242`
- **Дата**: будь-яка майбутня дата
- **CVC**: будь-які 3 цифри
- **ZIP**: будь-який 5-значний код

## 🛠 Технології

- **Next.js 16** - React framework
- **Stripe** - платіжна система
- **TypeScript** - типізація
- **Tailwind CSS** - стилізація
- **Framer Motion** - анімації

## 📄 Ліцензія

Приватний проект
