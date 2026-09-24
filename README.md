# Переїзди у Варшаві — компактна збірка

Це готова production-збірка. Вона запускається без компіляції TypeScript або React.

## Локальний запуск

```bash
npm start
```

Відкрийте `http://localhost:10000`. Адмінка: `http://localhost:10000/admin`.

Початковий вхід: `admin` / `199325`.

Для локального запуску без `/var/data` програма автоматично створить `data/db.json` і папку `uploads`.

## Render

1. Завантажте вміст цієї папки в корінь GitHub-репозиторію.
2. У Render створіть Blueprint із `render.yaml` або Web Service вручну.
3. Build Command: `npm install`.
4. Start Command: `npm start`.
5. Додайте `MAPBOX_ACCESS_TOKEN` і `PUBLIC_BASE_URL`.
6. Для постійного збереження даних використовуйте платний instance і диск `/var/data`.

Не змінюйте структуру папок `public` і `data`: сервер очікує їх поруч із `server.mjs`.
