# Переїзди у Варшаві — Google Maps

Готова production-збірка. Адресні підказки використовують Google Places API (New), а відстань і маршрут — Google Routes API.

## Запуск на Render

1. Розпакуйте ZIP і завантажте весь його вміст у корінь GitHub-репозиторію.
2. У Render встановіть Build Command: `npm install`.
3. Встановіть Start Command: `npm start`.
4. У Google Cloud увімкніть **Places API (New)** і **Routes API** та підключіть billing.
5. Створіть API key і додайте його в Render як `GOOGLE_MAPS_API_KEY`.
6. Додайте `PUBLIC_BASE_URL` з адресою вашого сайту, наприклад `https://warszawa-ho18.onrender.com`.
7. Натисніть **Manual Deploy → Clear build cache & deploy**.

Без `GOOGLE_MAPS_API_KEY` офіційний пошук адрес Google працювати не буде.

## Вхід адміністратора

Адреса: `/admin`

Початковий логін: `admin`

Початковий пароль: `199325`
