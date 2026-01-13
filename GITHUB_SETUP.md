# 📤 Інструкція: Завантаження на GitHub

## Крок 1: Налаштуйте Git (якщо ще не зробили)

Відкрийте термінал та виконайте (замініть на ваші дані):

```bash
git config --global user.name "Ваше Ім'я"
git config --global user.email "ваш.email@example.com"
```

Або тільки для цього проекту:

```bash
git config user.name "Ваше Ім'я"
git config user.email "ваш.email@example.com"
```

## Крок 2: Створіть репозиторій на GitHub

1. Перейдіть на [github.com](https://github.com) та увійдіть
2. Натисніть **"+"** в правому верхньому куті → **"New repository"**
3. Заповніть форму:
   - **Repository name**: `powerbi-shop` (або інша назва)
   - **Description**: "Power BI Shop with Stripe integration"
   - **Visibility**: Public або Private (на ваш вибір)
   - **НЕ** ставлять галочки на "Add a README file", "Add .gitignore", "Choose a license"
4. Натисніть **"Create repository"**

## Крок 3: Зробіть перший коміт

У терміналі виконайте:

```bash
# Зробіть коміт (якщо ще не зробили)
git commit -m "Initial commit: Power BI Shop with Stripe integration"

# Перейменуйте гілку на main (якщо потрібно)
git branch -M main
```

## Крок 4: Підключіть до GitHub

Скопіюйте URL вашого репозиторію з GitHub (наприклад: `https://github.com/your-username/powerbi-shop.git`)

Потім виконайте:

```bash
# Видаліть старий remote (якщо є)
git remote remove origin

# Додайте ваш GitHub репозиторій
git remote add origin https://github.com/YOUR-USERNAME/powerbi-shop.git

# Перевірте, що все правильно
git remote -v
```

## Крок 5: Завантажте код на GitHub

```bash
# Завантажте код
git push -u origin main
```

Якщо GitHub попросить автентифікацію:
- Використовуйте **Personal Access Token** замість пароля
- Створіть токен: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
- Дозволи: `repo` (повний доступ до репозиторіїв)

## ✅ Готово!

Після успішного завантаження ваш код буде на GitHub, і ви зможете:
- Деплоїти на Vercel (Vercel автоматично підхопить репозиторій)
- Працювати з командою
- Зберігати історію змін

## 🔄 Оновлення коду в майбутньому

Після змін у коді:

```bash
git add .
git commit -m "Опис змін"
git push
```



