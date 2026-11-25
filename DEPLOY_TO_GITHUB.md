# Деплой frontend на Cloudflare Pages

Репозиторий уже готов и запушен: <https://github.com/zigih-1212/demo-work>
(ветка `main`, frontend в каталоге `frontend/`, production-сборка проверена локально).

Ниже — три способа. Выберите один.

---

## Вариант A. Git-интеграция (рекомендуется, авто-деплой на каждый push)

1. Откройте <https://dash.cloudflare.com> → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Выберите репозиторий `zigih-1212/demo-work` и ветку `main`.
3. Настройки сборки (любой из двух наборов, они эквивалентны):

   **A1 — root = frontend (проще):**
   ```
   Framework preset:            None (или Vite)
   Root directory:              frontend
   Build command:               npm run build
   Build output directory:      dist
   ```

   **A2 — root = корень репозитория:**
   ```
   Framework preset:            None
   Root directory:              /  (оставить пустым)
   Build command:               npm run build --prefix frontend
   Build output directory:      frontend/dist
   ```

   > В репозитории лежит `package-lock.json`, поэтому Cloudflare выполнит
   > `npm ci` автоматически. Node.js: 20 или новее.

4. **Save and Deploy**. Первый билд занимает ~2 минуты.

---

## Вариант B. Прямая загрузка папки (быстро, без Git)

1. Соберите проект локально (уже собрано, но можно повторить):
   ```powershell
   cd C:\Users\Hewlett Packard\Desktop\fl.ru\orthodent\frontend
   npm run build
   ```
2. Откройте <https://dash.cloudflare.com> → **Workers & Pages** → **Create application** → **Pages** → **Upload assets**.
3. Укажите имя проекта, например `orthodent`, и перетащите **содержимое** папки
   `frontend\dist` (не саму папку).

SPA-роутинг уже настроен: файл `public/_redirects` попадает в сборку и
перенаправляет все пути на `index.html`.

---

## Вариант C. Wrangler CLI (нужна авторизация в браузере)

```powershell
cd C:\Users\Hewlett Packard\Desktop\fl.ru\orthodent\frontend
npx wrangler login          # откроется браузер — нажмите «Allow»
npx wrangler pages deploy dist --project-name=orthodent
```

`wrangler login` работает только если вы успеваете подтвердить доступ в
открывшемся окне браузера (сессия OAuth живёт несколько минут).

---

## Переменные окружения

Frontend читает **одну** переменную (см. `src/lib/apiClient.ts`):

| Переменная | Значение | Когда нужна |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `https://<адрес-бэкенда>/api/v1` | Если API развёрнут отдельно |

Если переменная не задана, запросы идут на относительный `/api/v1`, то есть
на тот же домен, что и статика. Это работает только когда frontend и backend
стоят за одним reverse-proxy.

Задаётся в Cloudflare Pages: **Settings → Environment variables → Add variable**
(для Production и Preview отдельно).

---

## Важное ограничение текущего стенда

Сейчас развёрнут **только frontend**. Backend (FastAPI + SQLite/PostgreSQL)
работает локально на `http://127.0.0.1:8000`.

Что это значит для задеплоенного сайта:

- страницы `/login`, `/register` и все состояния интерфейса отображаются;
- вход и загрузка данных **не работают**, пока не указан публичный адрес
  бэкенда в `VITE_API_BASE_URL`;
- чтобы демо было полностью живым, бэкенд нужно поднять на любом хостинге
  (Railway / Render / Fly.io / VPS) и прописать его URL.

---

## Проверка после деплоя

1. Откройте выданный URL `https://<project>.pages.dev`.
2. Убедитесь, что `/login` открывается и форма рендерится.
3. Прямой переход на `/patients/123` не должен давать 404 (проверка `_redirects`).
