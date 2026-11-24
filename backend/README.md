# OrthoDent Demo Project

**Orthodontics 3D Visualization & Clinical Tracking Platform**

This is a demonstration project based on the [KA Lucky Hunter](https://hirehi.ru/development/t-shaped-python-engineer-244700) vacancy for a T-shaped Python Engineer role. The platform provides:

- Patient scan management (STL files from intraoral scanners)
- Treatment planning with aligner stages
- Robot manufacturing integration
- AI-native approach to orthodontics

## Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.12)
- **Database**: PostgreSQL with SQLAlchemy 2.0+async
- **Async Engine**: psycopg3 driver
- **Background Tasks**: Celery + Redis broker
- **Migrations**: Alembic
- **Validation**: Pydantic v2
- **Auth**: JWT tokens

### Frontend
- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **3D Visualization**: Three.js / React Three Fiber
- **UI Components**: shadcn/ui

### DevOps
- **Containerization**: Docker Compose (local dev)
- **Production Deployment**: Kubernetes migration from Yii
- **CI/CD**: GitHub Actions
- **Frontend Hosting**: Cloudflare Pages + GitHub

## Project Structure

```
orthodent/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI endpoints (auth, patients, scans, jobs)
│   │   ├── core/         # Config, security utilities
│   │   ├── db.py         # Database session factory
│   │   ├── models.py     # SQLAlchemy ORM models
│   │   ├── schemas.py    # Pydantic schemas for request/response
│   │   └── services/     # Business logic (scan processing, robot ops)
│   │       └── queue.py  # Queue integration for Celery
│   ├── tests/            # Unit and integration tests
│   ├── docker-compose.dev.yaml
│   └── requirements.txt
├── frontend/             # React + TS client (create-vite scaffold)
└── README.md           # This file
```

## Running Locally

### Prerequisites
- Python 3.12+
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker Compose (optional)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables (.env)
ORTHODENT_DATABASE_URL=postgresql+psycopg://user:pass@localhost:5432/orthodent
ORTHODENT_REDIS_URL=redis://localhost:6379/0
ORTHODENT_SECRET_KEY=change-me-in-production

# Run migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

### Celery Workers (optional for testing)

```bash
celery -A app.worker.celery_app worker --loglevel=info
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT token
- `GET /api/v1/auth/me` - Get current user info

### Patients
- `GET /api/v1/patients` - List patients (paginated)
- `POST /api/v1/patients` - Create patient
- `GET /api/v1/patients/{id}` - Get patient details
- `PATCH /api/v1/patients/{id}` - Update patient
- `DELETE /api/v1/patients/{id}` - Delete patient

### Scans
- `GET /api/v1/patients/{patient_id}/scans` - List scans
- `POST /api/v1/patients/{patient_id}/scans` - Upload STL scan
- `GET /api/v1/scans/{scan_id}` - Get scan details
- `GET /api/v1/scans/{scan_id}/file` - Download scan file

### Stages
- `GET /api/v1/patients/{patient_id}/stages` - List treatment stages
- `POST /api/v1/patients/{patient_id}/stages` - Create stage
- `PATCH /api/v1/patients/{patient_id}/stages/{stage_id}` - Update stage

### Robot Jobs
- `POST /api/v1/patients/{patient_id}/stages/{stage_id}/robot-jobs` - Send to production
- `GET /api/v1/robot-jobs/{job_id}` - Get job status

## BOLA (Object-Level Authorization)

The API implements proper authorization:
- Doctors can only access their own patients
- Admins have full access
- Missing objects return 404 (not 403) to avoid information leakage

## Data Models

### User
- Email, password hash, full name, role (doctor/admin)

### Patient
- Doctor reference, name, birth year, diagnosis, status (active/completed/archived)

### Scan
- Patient reference, filename, storage path, size, status (pending/processing/ready/failed)
- Metadata: triangle count, bounding box, volume

### TreatmentStage
- Patient reference, position, description, wear days, status (planned/in_production/produced/in_treatment/done)

### RobotJob
- Stage reference, status (queued/running/completed/failed), retry attempts, error log

## Next Steps (Development Plan)

### Phase 1: Core Functionality ✅ (In Progress)
- [x] Backend scaffold with FastAPI
- [x] Database models and migrations
- [x] Authentication system (JWT)
- [x] Patient CRUD operations
- [x] Scan upload and processing (stub)
- [x] Robot job orchestration (stub)
- [x] Test framework setup

### Phase 2: Frontend Development (Next)
- [ ] React scaffold with TypeScript
- [ ] Auth UI (login/register)
- [ ] Patient list and detail views
- [ ] Scan upload interface
- [ ] Treatment plan editor
- [ ] 3D STL viewer with Three.js/R3F
- [ ] Job status dashboard

### Phase 3: Production Readiness
- [ ] Celery workers integration
- [ ] Real STL parsing (numpy-stl)
- [ ] Cloud storage (S3/R2) for uploads
- [ ] Kubernetes manifests
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Load testing (k6)
- [ ] Documentation (Swagger/OpenAPI)
- [ ] Monitoring and logging

### Phase 4: AI Integration
- [ ] Tooth segmentation (SimpleITK or similar)
- [ ] Automated measurement extraction
- [ ] Treatment planning suggestions
- [ ] Quality validation metrics

## Notes

- The real STL processing requires installing `numpy-stl`: `pip install numpy-stl`
- For production deployment: you'll need actual robot API integration
- Cloud deployment of frontend: provide GitHub repo access for Cloudflare Pages setup
- All secrets should be stored in environment variables, never committed to git
