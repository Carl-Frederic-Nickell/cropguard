'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'

// Fix default markers in Leaflet for Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface Farm {
  id: string
  name: string
  location: string
  latitude: number
  longitude: number
  crops: Array<{
    id: string
    name: string
    type: string
    plantedDate: string
  }>
}

interface CropStatus {
  id: string
  name: string
  type: string
  farm: {
    name: string
    location: string
    latitude: number
    longitude: number
  }
  plantedDate: string
  harvestStatus: 'good' | 'caution' | 'avoid'
  nextHarvestDate: string
  daysToHarvest: number
  weatherConditions: {
    temperature: number
    humidity: number
    precipitation: number
    windSpeed: number
    condition: string
  }
  harvestRecommendation: {
    status: 'good' | 'caution' | 'avoid'
    reason: string
    confidence: number
  }
  riskFactors: Array<{
    type: 'weather' | 'timing' | 'conditions'
    severity: 'low' | 'medium' | 'high'
    description: string
  }>
}

interface InteractiveMapProps {
  farms: Farm[]
  cropStatuses: CropStatus[]
  onFarmClick?: (farm: Farm) => void
  selectedFarmId?: string | null
}

export default function InteractiveMap({ farms, cropStatuses, onFarmClick, selectedFarmId }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  const getRiskStatus = (farm: Farm): 'good' | 'caution' | 'avoid' => {
    // Get crops for this farm from cropStatuses
    const farmCrops = cropStatuses.filter(crop => crop.farm.name === farm.name)
    
    if (farmCrops.length === 0) return 'avoid'
    
    // Determine worst status across all crops
    const hasAvoidCrops = farmCrops.some(crop => crop.harvestStatus === 'avoid')
    const hasCautionCrops = farmCrops.some(crop => crop.harvestStatus === 'caution')
    
    if (hasAvoidCrops) return 'avoid'
    if (hasCautionCrops) return 'caution'
    return 'good'
  }

  const getRiskDetails = (farm: Farm) => {
    const farmCrops = cropStatuses.filter(crop => crop.farm.name === farm.name)
    
    const riskCounts = {
      good: farmCrops.filter(crop => crop.harvestStatus === 'good').length,
      caution: farmCrops.filter(crop => crop.harvestStatus === 'caution').length,
      avoid: farmCrops.filter(crop => crop.harvestStatus === 'avoid').length
    }
    
    const totalRiskFactors = farmCrops.reduce((sum, crop) => sum + crop.riskFactors.length, 0)
    
    return { riskCounts, totalRiskFactors, farmCrops }
  }

  const createCustomIcon = (status: 'good' | 'caution' | 'avoid', isSelected: boolean = false) => {
    const colors = {
      good: '#10b981',
      caution: '#f59e0b',
      avoid: '#ef4444'
    }
    
    const size = isSelected ? 32 : 24
    const borderWidth = isSelected ? 4 : 2
    
    const svgIcon = `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" fill="${colors[status]}" stroke="white" stroke-width="${borderWidth}"/>
        <circle cx="12" cy="12" r="4" fill="white"/>
      </svg>
    `
    
    return L.divIcon({
      html: svgIcon,
      className: 'custom-div-icon',
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    })
  }

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([51.1657, 10.4515], 6) // Center on Germany

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current)
    }

    const map = mapInstanceRef.current

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add markers for each farm
    farms.forEach((farm) => {
      const riskStatus = getRiskStatus(farm)
      const riskDetails = getRiskDetails(farm)
      const isSelected = selectedFarmId === farm.id
      const icon = createCustomIcon(riskStatus, isSelected)
      
      const statusEmoji = {
        good: '🟢',
        caution: '🟡', 
        avoid: '🔴'
      }
      
      const statusText = {
        good: 'OPTIMAL',
        caution: 'VORSICHT',
        avoid: 'RISIKO'
      }
      
      const marker = L.marker([farm.latitude, farm.longitude], { icon })
        .addTo(map)
        .bindPopup(`
          <div class="p-3 min-w-64">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-lg text-gray-900">${farm.name}</h3>
              <span class="text-sm font-medium">${statusEmoji[riskStatus]} ${statusText[riskStatus]}</span>
            </div>
            <p class="text-sm text-gray-600 mb-3">${farm.location}</p>
            
            <div class="space-y-2 mb-3">
              <div class="text-sm font-medium text-gray-700">Status-Übersicht:</div>
              <div class="grid grid-cols-3 gap-2 text-xs">
                <div class="text-center p-1 bg-green-50 rounded">
                  <div class="font-semibold text-green-600">${riskDetails.riskCounts.good}</div>
                  <div class="text-green-600">Optimal</div>
                </div>
                <div class="text-center p-1 bg-yellow-50 rounded">
                  <div class="font-semibold text-yellow-600">${riskDetails.riskCounts.caution}</div>
                  <div class="text-yellow-600">Vorsicht</div>
                </div>
                <div class="text-center p-1 bg-red-50 rounded">
                  <div class="font-semibold text-red-600">${riskDetails.riskCounts.avoid}</div>
                  <div class="text-red-600">Risiko</div>
                </div>
              </div>
            </div>
            
            <div class="space-y-1 mb-3">
              <div class="text-sm font-medium text-gray-700">${farm.crops.length} Kulturen:</div>
              ${riskDetails.farmCrops.map(crop => {
                const statusColor = {
                  good: 'text-green-600',
                  caution: 'text-yellow-600',
                  avoid: 'text-red-600'
                }
                return `
                  <div class="text-xs flex items-center justify-between">
                    <span class="text-gray-600">• ${crop.name} (${crop.type})</span>
                    <span class="${statusColor[crop.harvestStatus]} font-medium">${statusEmoji[crop.harvestStatus]}</span>
                  </div>
                `
              }).join('')}
            </div>
            
            ${riskDetails.totalRiskFactors > 0 ? `
              <div class="p-2 bg-orange-50 rounded text-xs">
                <div class="font-medium text-orange-800">⚠️ ${riskDetails.totalRiskFactors} Risikofaktoren identifiziert</div>
                <div class="text-orange-700">Klicken für Details</div>
              </div>
            ` : `
              <div class="p-2 bg-green-50 rounded text-xs">
                <div class="font-medium text-green-800">✅ Keine akuten Risiken</div>
              </div>
            `}
            
            <div class="mt-2 pt-2 border-t border-gray-200">
              <div class="text-xs text-gray-500">Koordinaten: ${farm.latitude.toFixed(4)}, ${farm.longitude.toFixed(4)}</div>
            </div>
          </div>
        `, { maxWidth: 300 })

      marker.on('click', () => {
        if (onFarmClick) {
          onFarmClick(farm)
        }
      })

      markersRef.current.push(marker)
    })

    // Fit map to show all markers if farms exist
    if (farms.length > 0) {
      const group = new L.FeatureGroup(markersRef.current)
      map.fitBounds(group.getBounds().pad(0.1))
    }

    return () => {
      // Cleanup markers on unmount
      markersRef.current.forEach(marker => marker.remove())
    }
  }, [farms, selectedFarmId, onFarmClick])

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-96 rounded-lg shadow-md" />
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md z-[1000]">
        <div className="text-sm font-medium text-gray-900 mb-2">Risiko-Status</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-700">Optimal</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-gray-700">Vorsicht</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-700">Risiko</span>
          </div>
        </div>
      </div>
    </div>
  )
}