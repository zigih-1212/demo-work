# OrthoDent — Система управления ортодонтическим лечением

Демонстрационный проект для портфолио: FastAPI + SQLAlchemy async + Celery + React/TS + Vite + Tailwind, с честно проверенным E2E-сценарием.

## ✅ Статус проверки (25.11.2026)

| Что | Результат |
| --- | --- |
| Backend API-смоук (22 проверки) | 22/22 passed: регистрация, логин, JWT, BOLA-защита (404 чужим врачам), CRUD пациентов, этапы, загрузка STL, robot jobs, валидация |
| Обработка STL | Реальный парсер (binary + ASCII): число треугольников, bbox, объём по теореме о дивергенции |
| Frontend production build | `npm run build` — успешно (tsc + vite) |
| Браузерный E2E | Регистрация → логин → создание пациента → этап → «На производство» (статус produced) → загрузка STL (статус ready) |
| Визуальная проверка | Скриншоты 1440×900, 1024×768, 390×844 (desktop / laptop / mobile) |
| Docker Compose | Конфигурация есть; в текущем окружении Docker не установлен → **не проверено** |
| Celery/Redis | Код есть; локально задачи выполняются синхронно (см. `app/services/queue.py`) → **не проверено под нагрузкой** |

Локальный запуск бэкенда без PostgreSQL (SQLite):

```bash
cd backend
set ORTHODENT_DATABASE_URL=sqlite+aiosqlite:///./orthodent.db
set ORTHODENT_SECRET_KEY=dev-only-change-me
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
python smoke_test.py
```

## 🏥 Описание

OrthoDent — это современная платформа для управления ортодонтическим лечением пациентов. Система включает:

- **Клинический трекинг**: ведение истории пациентов, этапов лечения
- **3D визуализация**: просмотр STL сканов зубов в браузере (в разработке)
- **Интеграция с производством**: отправка планов лечения на 3D-принтеры (роботы, симуляция)
- **AI-native подход**: интеллектуальный анализ снимков, рекомендации по лечению (план)

## 🚀 Технологический стек

### Backend
- **FastAPI** 0.115.6 — современный REST API фреймворк
- **SQLAlchemy 2.0** (async) — ORM для работы с БД
- **Celery** 5.4 — распределённая очередь задач
- **PostgreSQL** — основная БД (для локальной разработки поддерживается SQLite)
- **Redis** — брокер сообщений для Celery
- **Pydantic v2** — валидация данных
- **PyJWT** — JWT аутентификация
- **Собственный STL-парсер** — метрики меша без внешних зависимостей

### Frontend
- **React 19** — UI библиотека
- **TypeScript** — типизация
- **Vite 8** — сборщик
- **Tailwind CSS** — утилитарный CSS
- **React Router 7** — роутинг
- **TanStack Query** — управление серверным состоянием
- **Three.js / R3F** — 3D визуализация (планируется)

### Инфраструктура
- **Docker Compose** — локальная разработка
- **Kubernetes** — продакшен деплой (в разработке)
- **GitHub Actions** — CI/CD pipeline (в разработке)

## 📁 Структура проекта

```
orthodent/
├── backend/
│   ├── app/
│   │   ├── api/              # REST endpoints
│   │   │   ├── auth.py       # POST /register, POST /login, GET /me
│   │   │   ├── patients.py   # CRUD пациентов
│   │   │   ├── scans.py      # Загрузка/скачивание STL
│   │   │   └── jobs.py       # Оркестрация роботов
│   │   ├── core/             # Ядро приложения
│   │   │   ├── config.py     # Pydantic settings
│   │   │   └── security.py   # JWT helpers
│   │   ├── models.py         # SQLAlchemy ORM модели
│   │   ├── schemas.py        # Pydantic схемы
│   │   ├── db.py             # Async session factory
│   │   └── services/         # Бизнес-логика
│   │       ├── queue.py      # Sync queue execution
│   │       ├── robot.py      # Robot simulation stub
│   │       └── scan_processing.py # STL processing
│   ├── worker/               # Celery workers
│   │   ├── celery_app.py     # Celery configuration
│   │   └── tasks.py          # Background tasks
│   ├── docker-compose.dev.yaml
│   ├── requirements.txt
│   └── README.md
├── frontend/                 # React + TypeScript SPA
│   ├── src/
│   │   ├── components/       # Переиспользуемые компоненты
│   │   ├── pages/            # Страницы приложения
│   │   └── App.tsx           # Роутинг
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── README.md                 # Этот файл
```

## 🛠 Установка и запуск

### Предварительные требования

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- npm или yarn

### Backend setup

1. **Создайте виртуальную среду**:
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # Или source .venv/bin/activate  # Linux/Mac
   ```

2. **Установите зависимости**:
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt
   ```

3. **Скопируйте пример окружения**:
   ```bash
   cp .env.example .env
   # Отредактируйте .env с вашими значениями
   ```

4. **Запустите PostgreSQL и Redis через Docker**:
   ```bash
   docker-compose -f docker-compose.dev.yaml up -d
   ```

5. **Выполните миграции базы данных**:
   ```bash
   alembic upgrade head
   ```

6. **Запустите FastAPI сервер**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend setup

1. **Перейдите в директорию frontend**:
   ```bash
   cd frontend
   ```

2. **Установите npm зависимости**:
   ```bash
   npm install
   ```

3. **Запустите dev-сервер**:
   ```bash
   npm run dev
   ```

4. **Откройте браузер**: http://localhost:3000

## 🔑 API Документация

После запуска бэкенда Swagger UI доступен по адресу: http://localhost:8000/docs

### Основные эндпоинты

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/v1/auth/register` | Регистрация пользователя |
| POST | `/api/v1/auth/login` | Вход, получение JWT токена |
| GET | `/api/v1/auth/me` | Текущий пользователь |
| GET | `/api/v1/patients` | Список пациентов (пагинация) |
| POST | `/api/v1/patients` | Создание пациента |
| GET | `/api/v1/patients/{id}` | Данные пациента |
| PATCH | `/api/v1/patients/{id}` | Обновление пациента |
| DELETE | `/api/v1/patients/{id}` | Удаление пациента |
| GET | `/api/v1/patients/{patient_id}/stages` | Этапы лечения |
| POST | `/api/v1/patients/{patient_id}/stages` | Создание этапа |
| GET | `/api/v1/patients/{patient_id}/scans` | Сканы пациента |
| POST | `/api/v1/patients/{patient_id}/scans` | Загрузка .stl файла |
| GET | `/api/v1/scans/{scan_id}` | Данные скана |
| GET | `/api/v1/scans/{scan_id}/file` | Скачивание STL |
| POST | `/api/v1/stages/{stage_id}/robot-jobs` | Отправить на производство |
| GET | `/api/v1/robot-jobs/{job_id}` | Статус робота |

## 📊 Модели данных

### User
```python
class User(Base):
    id: UUID
    email: str              # Уникальный email
    full_name: str          # ФИО врача
    password_hash: str      # Хэш пароля
    role: str               # doctor / admin
```

### Patient
```python
class Patient(Base):
    id: UUID
    doctor_id: UUID         # Владелец (врач)
    full_name: str          # ФИО пациента
    birth_year: int         # Год рождения
    diagnosis: str          # Диагноз
    status: str             # active / completed / archived
```

### Scan
```python
class Scan(Base):
    id: UUID
    patient_id: UUID
    filename: str           # Имя файла .stl
    storage_path: str       # Путь к файлу
    size_bytes: int         # Размер
    status: str             # pending / processing / ready / failed
    metrics_json: dict      # Метрики обработки
```

### TreatmentStage
```python
class TreatmentStage(Base):
    id: UUID
    patient_id: UUID
    position: int           # Номер этапа
    description: str        # Описание этапа
    wear_days: int          # Плановый срок носки
    status: str             # planned / in_production / produced / in_treatment / done
```

### RobotJob
```python
class RobotJob(Base):
    id: UUID
    stage_id: UUID
    status: str             # queued / running / completed / failed
    attempts: int           # Количество попыток
    log_json: dict          # Лог выполнения
    error: str | None       # Сообщение об ошибке
```

## 🧪 Тестирование

### Backend tests

```bash
cd backend
pytest tests/ -v --cov=app --cov-report=html
```

Откройте `backend/htmlcov/index.html` для просмотра покрытия.

### E2E tests (планируется)

Используется Playwright для тестирования критических пользовательских сценариев.

## 📋 Roadmap

### ✅ Фаза 1: Core Backend (завершена)
- [x] FastAPI scaffold с правильными эндпоинтами
- [x] SQLAlchemy async ORM модели
- [x] JWT аутентификация (PyJWT)
- [x] BOLA authorization guard
- [x] Scan upload with CSV validation
- [x] Robot job orchestration (stub implementation)
- [x] Test framework setup
- [x] Docker Compose for dev environment
- [x] Documentation (README.md with API docs)

### 🔜 Фаза 2: Frontend Development (в работе)
- [x] React + TypeScript scaffold
- [x] Auth UI (login/register pages)
- [x] Patient list & detail views
- [ ] Scan upload interface
- [ ] Treatment plan editor UI
- [ ] 3D STL viewer with Three.js/R3F
- [ ] Job status dashboard

### ⏳ Фаза 3: Production Readiness
- [ ] Celery workers production integration
- [ ] Real STL parsing with numpy-stl
- [ ] Cloud storage (S3/R2) integration
- [ ] Kubernetes manifests
- [ ] GitHub Actions CI/CD pipeline
- [ ] Load testing with k6
- [ ] OpenAPI/Swagger documentation generation
- [ ] Monitoring & logging setup

### ⏳ Фаза 4: AI Integration
- [ ] Tooth segmentation (SimpleITK)
- [ ] Автоматический extraction измерений
- [ ] Treatment planning suggestions
- [ ] Quality validation metrics

## 🔒 Безопасность

### BOLA (Broken Object Level Authorization)

Все эндпоинты защищены от доступа к чужим объектам:
- Врачи видят только своих пациентов
- Администраторы имеют полный доступ
- При отсутствии объекта возвращается 404 (не 403) для защиты от утечки информации

### JWT Authentication

- Token expires после авторизации
- Все защищённые эндпоинты требуют valid JWT в header
- Пароли хешируются с помощью bcrypt

## 🤝 Вклад

Для contributions:
1. Создайте feature branch (`git checkout -b feature/amazing-feature`)
2. Сделайте ваши изменения
3. Коммитьте (`git commit -m 'Add amazing feature'`)
4. Push ветки (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект создан для демонстрационных целей в рамках портфолио.

---

Разработано с использованием FastAPI, React, TypeScript, Docker и Kubernetes.
