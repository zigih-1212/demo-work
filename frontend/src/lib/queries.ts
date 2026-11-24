import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient, extractApiError } from './apiClient'
import { setToken } from './auth'
import type {
  Patient,
  PatientCreate,
  PatientPage,
  RobotJob,
  Scan,
  Stage,
  StageCreate,
  TokenResponse,
  User,
} from '../types'

/* ---------------------------------------------------------------- auth --- */

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: { email: string; password: string; full_name: string }) => {
      const { data } = await apiClient.post<User>('/auth/register', payload)
      return data
    },
  })
}

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const { data } = await apiClient.post<TokenResponse>('/auth/login', payload)
      setToken(data.access_token)
      return data
    },
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await apiClient.get<User>('/auth/me')
      return data
    },
    retry: false,
    staleTime: 1000 * 60 * 10,
  })
}

/* ------------------------------------------------------------ patients --- */

export function usePatients(params: { limit?: number; offset?: number; status?: string } = {}) {
  return useQuery({
    queryKey: ['patients', params],
    queryFn: async () => {
      const { data } = await apiClient.get<PatientPage>('/patients', { params })
      return data
    },
  })
}

export function usePatient(patientId: string | undefined) {
  return useQuery({
    queryKey: ['patients', patientId],
    queryFn: async () => {
      const { data } = await apiClient.get<Patient>(`/patients/${patientId}`)
      return data
    },
    enabled: Boolean(patientId),
  })
}

export function useCreatePatient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: PatientCreate) => {
      const { data } = await apiClient.post<Patient>('/patients', payload)
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })
}

/* -------------------------------------------------------------- stages --- */

export function useStages(patientId: string | undefined) {
  return useQuery({
    queryKey: ['patients', patientId, 'stages'],
    queryFn: async () => {
      const { data } = await apiClient.get<Stage[]>(`/patients/${patientId}/stages`)
      return data
    },
    enabled: Boolean(patientId),
  })
}

export function useCreateStage(patientId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: StageCreate) => {
      const { data } = await apiClient.post<Stage>(`/patients/${patientId}/stages`, payload)
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['patients', patientId, 'stages'] })
    },
  })
}

/* --------------------------------------------------------------- scans --- */

export function useScans(patientId: string | undefined) {
  return useQuery({
    queryKey: ['patients', patientId, 'scans'],
    queryFn: async () => {
      const { data } = await apiClient.get<Scan[]>(`/patients/${patientId}/scans`)
      return data
    },
    enabled: Boolean(patientId),
  })
}

export function useUploadScan(patientId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData()
      form.append('file', file)
      const { data } = await apiClient.post<Scan>(`/patients/${patientId}/scans`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['patients', patientId, 'scans'] })
    },
  })
}

/* ----------------------------------------------------------- robot jobs --- */

export function useCreateRobotJob(patientId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (stageId: string) => {
      const { data } = await apiClient.post<RobotJob>(
        `/patients/${patientId}/stages/${stageId}/robot-jobs`,
      )
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['patients', patientId, 'stages'] })
    },
  })
}

export { extractApiError }
