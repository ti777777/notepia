import { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet'
import { DivIcon } from 'leaflet'
import { ViewObject, View, MapViewData } from '@/types/view'
import { useNavigate, useParams } from 'react-router-dom'
import { useTwoColumn } from '@/components/twocolumn/TwoColumn'

interface MapViewComponentProps {
    viewObjects?: ViewObject[]
    view?: View
    focusedObjectId?: string
    isPublic?: boolean
}

interface MapMarkerData {
    lat: number
    lng: number
    color?: string
}

const MapViewComponent = ({ viewObjects = [], view, focusedObjectId, isPublic = false }: MapViewComponentProps) => {
    const navigate = useNavigate()
    const { workspaceId, mapId } = useParams<{ workspaceId?: string; mapId: string }>()
    const { openBottomSheet } = useTwoColumn()

    const viewSettings = useMemo(() => {
        if (!view?.data) return null
        try {
            return JSON.parse(view.data) as MapViewData
        } catch {
            return null
        }
    }, [view?.data])

    const markers = useMemo(() => {
        return viewObjects
            .filter(obj => obj.type === 'map_marker')
            .map(obj => {
                if (!obj.data || typeof obj.data !== 'string') return null
                try {
                    const data: MapMarkerData = JSON.parse(obj.data)
                    if (data.lat && data.lng && !isNaN(data.lat) && !isNaN(data.lng)) {
                        return { id: obj.id, name: obj.name, lat: data.lat, lng: data.lng, color: data.color }
                    }
                } catch {
                    // skip invalid
                }
                return null
            })
            .filter((m): m is NonNullable<typeof m> => m !== null)
    }, [viewObjects])

    const mapCenter: [number, number] = useMemo(() => {
        if (focusedObjectId) {
            const focused = markers.find(m => m.id === focusedObjectId)
            if (focused) return [focused.lat, focused.lng]
        }
        if (viewSettings?.center) return [viewSettings.center.lat, viewSettings.center.lng]
        if (markers.length === 0) return [25.0330, 121.5654]
        const avgLat = markers.reduce((sum, m) => sum + m.lat, 0) / markers.length
        const avgLng = markers.reduce((sum, m) => sum + m.lng, 0) / markers.length
        return [avgLat, avgLng]
    }, [markers, viewSettings, focusedObjectId])

    const mapZoom = useMemo(() => {
        if (focusedObjectId) return 18
        return viewSettings?.zoom ?? (markers.length === 0 ? 10 : 12)
    }, [markers.length, viewSettings, focusedObjectId])

    const createMarkerIcon = (color?: string) => {
        const bg = color || '#3B82F6'
        const html = `
            <div style="
                width: 32px; height: 32px; border-radius: 50%;
                background: ${bg}; border: 2px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            "></div>
        `
        return new DivIcon({
            html,
            className: 'custom-marker-icon',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16]
        })
    }

    return (
        <div className="h-full w-full flex flex-col">
            <div className="flex-1 w-full relative">
                <MapContainer
                    key={`${mapCenter[0]}-${mapCenter[1]}-${focusedObjectId || 'default'}`}
                    center={mapCenter}
                    zoom={mapZoom}
                    className="h-full w-full"
                    scrollWheelZoom={true}
                    zoomControl={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {markers.map(marker => (
                        <Marker
                            key={marker.id}
                            position={[marker.lat, marker.lng]}
                            icon={createMarkerIcon(marker.color)}
                            eventHandlers={{
                                click: () => {
                                    openBottomSheet()
                                    const path = isPublic
                                        ? `/share/map/${mapId}/marker/${marker.id}`
                                        : `/workspaces/${workspaceId}/map/${mapId}/marker/${marker.id}`
                                    navigate(path)
                                }
                            }}
                        >
                            <Tooltip permanent direction="top" offset={[0, -12]} className="marker-label">
                                <div className="text-sm font-medium">{marker.name}</div>
                            </Tooltip>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    )
}

export default MapViewComponent
