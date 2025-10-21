"use client"
import type { MapCords } from "@/types"
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet"
import { useEffect, useMemo, useRef, useState } from "react"
import leaflet, { latLngBounds } from "leaflet"
import "leaflet/dist/leaflet.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX, faHouseFire } from "@fortawesome/free-solid-svg-icons"
import rt7Json from "@/public/road_cords/rt_7.json"
import algonkianPkyJson from "@/public/road_cords/algonkian_parkway.json"
import sterlingBlvdJson from "@/public/road_cords/sterling_blvd.json"
import churchRdJson from "@/public/road_cords/church_road.json"
import va28Json from "@/public/road_cords/rt_28.json"
import cascadesPkwyJson from "@/public/road_cords/cascades_parkway.json"
import atlanticBlvdJson from "@/public/road_cords/atlantic_blvd.json"
import potomacViewRdJson from "@/public/road_cords/potomac_view_road.json"
import nokesBlvdJson from "@/public/road_cords/nokes_blvd.json"
import loudounCountyPkwyJson from "@/public/road_cords/loudoun_county_pkwy.json"
import russelBranchPkwyJson from "@/public/road_cords/russel_branch_pkwy.json"
import pacificBlvdJson from "@/public/road_cords/pacific_blvd.json"
import countrysideBlvdJson from "@/public/road_cords/countryside_blvd.json"
import middlefieldDriveJson from "@/public/road_cords/middlefield_drive.json"
import palisadeParkwayJson from "@/public/road_cords/palisade_parkway.json"
import waxpoolRoadJson from "@/public/road_cords/waxpool_rd.json"
import GloucesterPkwyJson from "@/public/road_cords/gloucester_parkway.json"
import TopRightMarker from "./TopRightMarker"
import { renderToString } from "react-dom/server"

export default function Map({
  level,
  reset,
  onSubmit,
}: {
  level: number
  reset: boolean
  onSubmit: () => void
}) {
  const roads = [
    rt7Json,
    algonkianPkyJson,
    sterlingBlvdJson,
    churchRdJson,
    va28Json,
    cascadesPkwyJson,
    atlanticBlvdJson,
    potomacViewRdJson,
    nokesBlvdJson,
    loudounCountyPkwyJson,
    russelBranchPkwyJson,
    pacificBlvdJson,
    countrysideBlvdJson,
    middlefieldDriveJson,
    palisadeParkwayJson,
    waxpoolRoadJson,
    GloucesterPkwyJson,
  ] as Array<MapCords>
  const fireStations: Record<string, [number, number]> = {
    "Station 15": [38.999650950874056, -77.40200221538545],
    "Station 25": [39.048452363279445, -77.3823482003563],
    "Station 35": [39.03007633604696, -77.43296606488684],
  }
  const locations: Record<string, string[]> = {
    "Station 15": ["Station 15", "station15"],
    "Station 25": ["Station 25", "station25"],
    "Station 35": ["Station 35", "station35"],
    "Rt 7 (Harry Byrd Hwy)": [
      "Rt 7 (Harry Byrd Hwy)",
      "rt7(harrybyrdhwy)",
      "rt7(harrybyrdhighway)",
      "rt7harrybyrdhighway",
      "harrybyrdhwy",
      "harrybyrdhighway",
      "harrybyrd",
      "rt7",
      "route7",
    ],
    "Algonkian Parkway": [
      "Algonkian Parkway",
      "algonkianparkway",
      "algonkianpkwy",
      "algonkian",
    ],
    "Sterling Blvd": [
      "Sterling Blvd",
      "sterlingblvd",
      "sterlingboulevard",
      "sterling",
    ],
    "Church Road": ["Church Road", "churchroad", "churchrd", "church"],
    "Rt 28 (Sully Road)": [
      "Rt 28 (Sully Road)",
      "rt28sullyroad",
      "route28sullyroad",
      "rt28(sullyroad)",
      "route28(sullyroad)",
      "rt28",
      "route28",
      "sullyroad",
      "sullyrd",
      "sully",
    ],
    "Cascades Parkway": [
      "Cascades Parkway",
      "cascadesparkway",
      "cascadespkwy",
      "cascades",
    ],
    "Atlantic Blvd": [
      "Atlantic Blvd",
      "atlanticblvd",
      "atlanticboulevard",
      "atlantic",
    ],
    "Potomac View Road": [
      "Potomac View Road",
      "potomacviewroad",
      "potomacviewrd",
      "potomac",
    ],
    "Nokes Blvd": ["Nokes Blvd", "nokesblvd", "nokesboulevard", "nokes"],
    "Loudoun County Pkwy": [
      "Loudoun County Pkwy",
      "loudouncountypkwy",
      "loudouncountyparkway",
    ],
    "Russell Branch Pkwy": [
      "Russell Branch Pkwy",
      "russellbranchpkwy",
      "russellbranchparkway",
      "russellbranch",
    ],
    "Pacific Blvd": [
      "Pacific Blvd",
      "pacificblvd",
      "pacificboulevard",
      "pacific",
    ],
    "Countryside Boulevard": [
      "Countryside Boulevard",
      "countrysideboulevard",
      "countrysideblvd",
      "countryside",
    ],
    "Middlefield Drive": [
      "Middlefield Drive",
      "middlefielddrive",
      "middlefielddr",
      "middlefield",
    ],
    "Palisade Parkway": [
      "Palisade Parkway",
      "palisadeparkway",
      "palisadepkwy",
      "palisade",
    ],
    "Waxpool Road": ["Waxpool Road", "waxpoolroad", "waxpoolrd", "waxpool"],
    "Gloucester Parkway": [
      "Gloucester Parkway",
      "gloucesterparkway",
      "gloucester",
      "gloucesterpkwy",
    ],
  }

  const bounds = latLngBounds(
    [39.00264390508013, -77.52862930297853],
    [39.05571756241876, -77.33997344970703]
  )

  const [locationChoices, setLocationChoices] = useState<
    Record<string, string>
  >({})
  const [modal, showModal] = useState<{
    action: "open" | "close" | null
    selectedLocation: string | null
  }>({ action: null, selectedLocation: null })
  const modalRef = useRef<HTMLDivElement>(null)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [hoveredLocation, setHoveredLocation] = useState<string | null>()
  const mapRef = useRef<leaflet.Map>(null)
  const totalLocations = Object.keys(locations).length
  const correctLocations =
    level === 1
      ? Object.keys(locations).filter(
          (loc) => locationChoices[loc] === locations[loc][0]
        ).length
      : Object.keys(locations).filter((loc) =>
          locations[loc].some(
            (l) =>
              l.toLowerCase() ===
              locationChoices[loc]?.replace(/\s/g, "")?.toLowerCase()
          )
        ).length

  const lineCanvas = useMemo(
    () => leaflet.canvas({ padding: 0.5, tolerance: 5 }),
    []
  )

  const handleLocationClick = (location: string) => {
    if (!mapRef.current) return
    if (mapRef.current.dragging.enabled()) mapRef.current.dragging.disable()
    if (mapRef.current.doubleClickZoom.enabled())
      mapRef.current.doubleClickZoom.disable()
    if (mapRef.current.scrollWheelZoom.enabled())
      mapRef.current.scrollWheelZoom.disable()
    if (mapRef.current.touchZoom.enabled()) mapRef.current.touchZoom.disable()
    mapRef.current?.zoomControl.remove()

    if (location !== modal.selectedLocation)
      showModal((prev) =>
        prev.action === "open"
          ? { ...prev, selectedLocation: location }
          : { action: "open", selectedLocation: location }
      )
  }

  const handleModalClose = () => {
    if (!mapRef.current) return
    mapRef.current.dragging.enable()
    mapRef.current.doubleClickZoom.enable()
    mapRef.current.scrollWheelZoom.enable()
    mapRef.current.touchZoom.enable()
    mapRef.current?.zoomControl.addTo(mapRef.current)
    showModal({ action: "close", selectedLocation: null })
    setHoveredLocation(null)
  }

  useEffect(() => {
    if (level === 2 || reset) {
      showModal({ action: null, selectedLocation: null })
      setLocationChoices({})
      setSubmitted(false)
    }
  }, [level, reset])

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth
      const newZoom = width < 768 ? 12 : 13
      const currentZoom = mapRef.current?.getZoom()

      if (currentZoom !== newZoom) {
        mapRef.current?.setMinZoom(newZoom)
        mapRef.current?.setZoom(newZoom)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="w-full h-full flex flex-col relative gap-3">
      <span
        className={`pl-2 pr-2 pt-3 ${
          !submitted
            ? "text-black"
            : correctLocations === totalLocations
            ? "text-[#008000]"
            : "text-red-500"
        }`}
      >
        {!submitted
          ? level === 1
            ? "Click each location and select the specific name."
            : "Click each location and type the specific name."
          : `You answered ${correctLocations} / ${totalLocations} correct`}
      </span>

      <div className="flex gap-2">
        {!submitted && (
          <button
            type="button"
            onClick={() => {
              if (!submitted) {
                setSubmitted(true)
                onSubmit()
              }
            }}
            className="bg-slate-600 hover:bg-slate-300 cursor-pointer text-white w-fit p-3 ml-2"
          >
            Submit
          </button>
        )}
        {(Object.keys(locationChoices).length > 0 || submitted) && (
          <button
            type="button"
            onClick={() => {
              showModal({ action: null, selectedLocation: null })
              setLocationChoices({})
              setSubmitted(false)
            }}
            className="bg-slate-600 hover:bg-slate-300 cursor-pointer text-white w-fit p-3 ml-2"
          >
            Restart Question
          </button>
        )}
      </div>

      <MapContainer
        center={[38.998, -77.419]}
        className="w-full flex-1"
        ref={mapRef}
        zoom={window.innerWidth < 768 ? 12 : 13}
        minZoom={window.innerWidth < 768 ? 12 : 13}
        maxBounds={bounds}
        maxBoundsViscosity={1}
      >
        <TopRightMarker bounds={bounds} />
        {modal.action === "open" && (
          <div
            ref={modalRef}
            className="p-5 hover:cursor-default flex flex-col gap-2 z-[999] absolute z top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 lg:w-[600px] bg-slate-300 "
          >
            <FontAwesomeIcon
              icon={faX}
              size="xl"
              className="ml-auto cursor-pointer hover:text-gray-500"
              onClick={handleModalClose}
            />
            <span className=" text-xl">
              {level === 1 ? "Select location" : "Enter location"}
            </span>
            <div className="relative w-full h-10">
              {level === 1 ? (
                <select
                  className="w-full border-2 p-2 bg-white"
                  value={
                    modal.selectedLocation
                      ? locationChoices[modal.selectedLocation] ||
                        "select_location"
                      : "select_location"
                  }
                  onChange={(e) => {
                    const location = modal.selectedLocation
                    if (!location) return
                    setLocationChoices((prev) => ({
                      ...prev,
                      [location]: e.target.value,
                    }))
                  }}
                >
                  <option
                    key="select_location"
                    disabled
                    value="select_location"
                  >
                    Select location
                  </option>
                  {Object.keys(locations).map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="w-full border-2 p-2 bg-white"
                  value={
                    modal.selectedLocation
                      ? locationChoices[modal.selectedLocation] ?? ""
                      : ""
                  }
                  onChange={(e) => {
                    const location = modal.selectedLocation
                    if (!location) return
                    setLocationChoices((prev) => ({
                      ...prev,
                      [location]: e.target.value,
                    }))
                  }}
                />
              )}
            </div>
          </div>
        )}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
        />
        {roads.map((road, roadIndex) =>
          road.cordinates.map((coords, i) => {
            const isHovered = hoveredLocation === road.name
            return (
              <Polyline
                key={`${road.name}_${roadIndex}_${i}`}
                renderer={lineCanvas}
                positions={coords}
                pathOptions={{
                  color: submitted
                    ? level === 1
                      ? locationChoices[road.name] === road.name
                        ? "green"
                        : "red"
                      : locations[road.name].some(
                          (loc) =>
                            loc.toLowerCase() ===
                            locationChoices?.[road.name]
                              ?.replace(/\s/g, "")
                              ?.toLowerCase()
                        )
                      ? "green"
                      : "red"
                    : isHovered
                    ? "blue"
                    : locationChoices[road.name]
                    ? "green"
                    : "black",
                }}
                eventHandlers={{
                  mouseover: () => setHoveredLocation(road.name),
                  mouseout: () => setHoveredLocation(null),
                  click: () => {
                    if (hoveredLocation !== road.name)
                      setHoveredLocation(road.name)
                    if (!submitted) {
                      handleLocationClick(road.name)
                    }
                  },
                }}
              >
                {submitted && <Popup>{road.name}</Popup>}
              </Polyline>
            )
          })
        )}

        {Object.entries(fireStations).map(([name, coords]) => {
          const isHovered = hoveredLocation === name
          const firehouseIcon = leaflet.divIcon({
            html: renderToString(
              <FontAwesomeIcon
                icon={faHouseFire}
                size="xl"
                className={`${
                  submitted
                    ? level === 1
                      ? locationChoices[name] === name
                        ? "text-[#008000]"
                        : "text-red-500"
                      : locations[name].some(
                          (loc) =>
                            loc.toLowerCase() ===
                            locationChoices?.[name]
                              ?.replace(/\s/g, "")
                              ?.toLowerCase()
                        )
                      ? "text-[#008000]"
                      : "text-red-500"
                    : !submitted && isHovered
                    ? "text-blue-700"
                    : locationChoices[name]
                    ? "text-[#008000]"
                    : "text-black"
                } `}
              />
            ),
            className: "",
          })

          return (
            <Marker
              position={coords}
              icon={firehouseIcon}
              key={
                submitted
                  ? `${name}__${coords.join()}_submitted`
                  : locationChoices[name]
                  ? `${name}_${locationChoices[name]}_${coords.join()}`
                  : `${name}_${coords.join()}`
              }
              eventHandlers={{
                mouseover: () => setHoveredLocation(name),
                mouseout: () => setHoveredLocation(null),
                click: () => {
                  if (!submitted) {
                    setHoveredLocation(name)
                    handleLocationClick(name)
                  }
                },
              }}
            >
              {submitted && <Popup>{name}</Popup>}
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
