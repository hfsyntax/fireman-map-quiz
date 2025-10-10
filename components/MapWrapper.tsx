"use client"
import dynamic from "next/dynamic"
const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-300 animate-pulse rounded-md flex items-center justify-center">
      <span className="text-gray-500">Loading map...</span>
    </div>
  ),
})

export default function MapWrapper({
  level,
  reset,
  onSubmit,
}: {
  level: number
  reset: boolean
  onSubmit: () => void
}) {
  return <MapComponent level={level} reset={reset} onSubmit={onSubmit} />
}
