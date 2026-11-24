# Деплой Frontend на Cloudflare Pages

## Шаг 1: Подключите к Git репозиторию

Выполните эти команды в PowerShell/CMD:

```powershell
cd C:\Users\Hewlett Packard\Desktop\fl.ru\orthodent

# Инициализируйте git (если ещё не сделано)
git init

# Добавьте все файлы frontend в коммит
git add frontend/
git commit -m "Initial frontend setup - OrthoDent"

# Добавьте удалённый репозиторий (уже существует https://github.com/zigih-1212/demo-work.git)
# Проверьте существующие remote:
git remote -v

# Если remote нет — добавьте:
# git remote add origin https://github.com/zigih-1212/demo-work.git

# Push в main ветку
git push -u origin main
```

## Шаг 2: Настройте Cloudflare Pages

1. Откройте https://dash.cloudflare.com
2. Перейдите → **Workers & Pages**
3. Нажмите **Create application** → **Connect to Git**
4. Выберите ваш GitHub аккаунт и репозиторий `demo-work`
5. Настройте параметры сборки:

   ```
   Framework preset: Vite
   Build command: cd frontend && npm run build
   Build directory: frontend/dist
   Root directory: frontend
   ```

6. Нажмите **Save and Deploy**

## Шаг 3: Проверьте deploy

После успешного деплоя получите URL вида:
```
https://demo-work.your-subdomain.workers.dev
```

---

## Дополнительная настройка переменной окружения (для API вызовов)

В Cloudflare Pages:
1. Settings → Environment variables → Add variable
2. Добавьте:
   - **NAME**: BACKEND_URL
   - **VALUE**: http://localhost:8000 (или production URL когда будет)

Используйте в фронтенде через `import.meta.env.VITE_BACKEND_URL`
