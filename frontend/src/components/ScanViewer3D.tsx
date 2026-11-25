import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Grid } from '@react-three/drei'
import { useEffect, useState } from 'react'

interface Scan {
  id: string
  filename: string
  size_bytes: number
  status: string
  metrics_json: string | null
}

interface ScanViewer3DProps {
  scan: Scan
}

export function ScanViewer3D({ scan }: ScanViewer3DProps) {
  const [metrics, setMetrics] = useState<{
    triangles?: number
    volume?: number
    bbox?: [number, number, number, number, number, number]
  }>({})

  useEffect(() => {
    if (scan.metrics_json) {
      try {
        const parsed = JSON.parse(scan.metrics_json)
        setMetrics({
          triangles: parsed.triangles,
          volume: parsed.volume_mm3,
          bbox: parsed.bbox_mm
            ? [
                parsed.bbox_mm.min[0],
                parsed.bbox_mm.min[1],
                parsed.bbox_mm.min[2],
                parsed.bbox_mm.max[0],
                parsed.bbox_mm.max[1],
                parsed.bbox_mm.max[2],
              ]
            : undefined,
        })
      } catch {
        // ignore parse errors
      }
    }
  }, [scan.metrics_json])

  return (
    <div className="w-full h-full flex items-center justify-center p-4 relative">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
        <span className="text-xs font-medium text-medical-slate-400 bg-medical-slate-900/80 px-2 py-1 rounded backdrop-blur">
          {scan.filename}
        </span>
        {metrics.triangles !== undefined && (
          <span className="text-xs font-medium text-medical-slate-400 bg-medical-slate-900/80 px-2 py-1 rounded backdrop-blur">
            {metrics.triangles.toLocaleString()} треугольников
          </span>
        )}
        {metrics.volume !== undefined && (
          <span className="text-xs font-medium text-medical-slate-400 bg-medical-slate-900/80 px-2 py-1 rounded backdrop-blur">
            Объём: {metrics.volume.toFixed(0)} мм³
          </span>
        )}
      </div>

      <Canvas shadows camera={{ position: [5, 5, 5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#0ea5e9" />
        <OrbitControls makeDefault />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <Grid args={[20, 20]} cellColor="medical-slate-800" sectionColor="medical-slate-700" />

        <group>
          <mesh castShadow receiveShadow>
            <icosahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial
              color="medical-sky-500"
              metalness={0.3}
              roughness={0.4}
              wireframe
            />
          </mesh>
        </group>
      </Canvas>
    </div>
  )
}
