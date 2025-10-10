"use client"

import { useMapEvents } from "react-leaflet"
import { useEffect, useState } from "react"
import "leaflet/dist/leaflet.css"

type Coord = [number, number]

export default function TraceTool() {
  const [points, setPoints] = useState<Coord[]>([])

  useMapEvents({
    click(e) {
      const latlng: Coord = [e.latlng.lat, e.latlng.lng]
      setPoints((prev) => [...prev, latlng])
      console.clear()
      console.log("Current Points:", [...points, latlng])
    },
  })

  // Reset with "r" key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r") {
        setPoints([])
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  return null
}
