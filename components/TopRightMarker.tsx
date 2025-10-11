"use client"

import { useEffect, useRef, useState } from "react"
import { useMap } from "react-leaflet"
import { DomUtil, Control } from "leaflet"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { createRoot, Root } from "react-dom/client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome } from "@fortawesome/free-solid-svg-icons"

export default function TopRightMarker() {
  const map = useMap()
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const rootRef = useRef<Root | null>(null)

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
      setIsVisible(shouldShow)
    }

    map.on("zoomend", handleZoom)
    handleZoom()

    return () => {
      map.off("zoomend", handleZoom)
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
