"use client"
import type { LatLngBounds } from "leaflet"
import { useEffect, useRef, useState } from "react"
import { useMap } from "react-leaflet"
import { DomUtil, Control, latLngBounds } from "leaflet"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { createRoot, Root } from "react-dom/client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome } from "@fortawesome/free-solid-svg-icons"

export default function TopRightMarker({ bounds }: { bounds: LatLngBounds }) {
  const map = useMap()
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const rootRef = useRef<Root | null>(null)
  const lastFactor = useRef<number | null>(null)

  useEffect(() => {
    const control = new Control({ position: "topright" })

    control.onAdd = () => {
      const div = DomUtil.create("div", "custom-control")
      rootRef.current = createRoot(div)
      rootRef.current.render(null) // initially hidden
      return div
    }

    control.addTo(map)

    const handleZoom = () => {
      const shouldShow =
        window.innerWidth < 768 ? map.getZoom() > 12 : map.getZoom() > 13
      setIsVisible((prev) => {
        if (prev === shouldShow) return prev
        return shouldShow
      })
    }

    const resizeBoundary = () => {
      const zoom = map.getZoom()
      const factor = zoom > 13 ? 1.2 : 1.0 // increase freedom when zoomed in
      if (factor === lastFactor.current) return
      const sw = bounds.getSouthWest()
      const ne = bounds.getNorthEast()
      const expanded = latLngBounds(
        [sw.lat - 0.01 * factor, sw.lng - 0.01 * factor],
        [ne.lat + 0.01 * factor, ne.lng + 0.01 * factor]
      )
      map.setMaxBounds(expanded)
    }

    const onZoomEnd = () => {
      handleZoom()
      resizeBoundary()
    }

    map.on("zoomend", onZoomEnd)

    return () => {
      map.off("zoomend", onZoomEnd)
      control.remove()
    }
  }, [map])

  useEffect(() => {
    if (!rootRef.current) return
    rootRef.current.render(
      isVisible ? (
        <FontAwesomeIcon
          icon={faHome}
          size="2x"
          className="p-2 bg-white shadow-md border-2 border-gray-400 cursor-pointer hover:bg-slate-100"
          onClick={() => map.setZoom(window.innerWidth < 768 ? 12 : 13)}
        />
      ) : null
    )
  }, [isVisible, map])

  return null
}
