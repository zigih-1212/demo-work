/**
 * Types mirroring the FastAPI schemas in `backend/app/schemas.py`.
 * Kept in one place so the API contract is visible at a glance.
 */

export type PatientStatus = 'active' | 'completed' | 'archived'

export type StageStatus =
  | 'planned'
  | 'in_production'
  | 'produced'
  | 'in_treatment'
  | 'done'

export type ScanStatus = 'pending' | 'processing' | 'ready' | 'failed'

export type RobotJobStatus = 'queued' | 'running' | 'completed' | 'failed'

export interface User {
  id: string
  email: string
  full_name: string
  role: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface Patient {
  id: string
  doctor_id: string
  full_name: string
  birth_year: number
  diagnosis: string
  status: string
  created_at: string
}

export interface PatientPage {
  items: Patient[]
  total: number
  limit: number
  offset: number
}

export interface PatientCreate {
  full_name: string
  birth_year: number
  diagnosis: string
}

export interface Stage {
  id: string
  patient_id: string
  position: number
  description: string
  wear_days: number
  status: string
  created_at: string
}

export interface StageCreate {
  position: number
  description: string
  wear_days: number
}

export interface Scan {
  id: string
  patient_id: string
  filename: string
  size_bytes: number
  status: string
  error: string | null
  metrics_json: string | null
  created_at: string
}

export interface RobotJob {
  id: string
  stage_id: string
  status: string
  attempts: number
  log_json: string | null
  error: string | null
  created_at: string
  updated_at: string
}
