'use client'

import { useState, useEffect } from 'react'
import { Plus, MapPin, Calendar, Wheat, Trash2, Sprout, Clock, TrendingUp, Thermometer, Droplets, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

interface Farm {
  id: string
  name: string
  location: string
  latitude: number
  longitude: number
  crops: Crop[]
}

interface Crop {
  id: string
  name: string
  type: string
  plantedDate: string
}

export default function FarmsPage() {
  const [farms, setFarms] = useState<Farm[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [newFarm, setNewFarm] = useState({
    name: '',
    location: '',
    latitude: '',
    longitude: ''
  })

  useEffect(() => {
    fetchFarms()
  }, [])

  const fetchFarms = async () => {
    try {
      const res = await fetch('/api/farms')
      if (res.ok) {
        const data = await res.json()
        setFarms(data)
      }
    } catch (error) {
      console.error('Error fetching farms:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/farms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFarm)
      })

      if (res.ok) {
        setNewFarm({ name: '', location: '', latitude: '', longitude: '' })
        setShowAddForm(false)
        fetchFarms()
      }
    } catch (error) {
      console.error('Error creating farm:', error)
    }
  }

  const handleDelete = async (farmId: string, farmName: string) => {
    if (window.confirm(`Möchten Sie das Feld "${farmName}" wirklich löschen?`)) {
      try {
        const res = await fetch(`/api/farms/${farmId}`, {
          method: 'DELETE'
        })

        if (res.ok) {
          fetchFarms()
        } else {
          console.error('Error deleting farm')
        }
      } catch (error) {
        console.error('Error deleting farm:', error)
      }
    }
  }

  if (isLoading) {
    return <div className="text-center">Loading farms...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Meine Felder</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Feld hinzufügen</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Neues Feld hinzufügen</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name des Feldes
                </label>
                <input
                  type="text"
                  value={newFarm.name}
                  onChange={(e) => setNewFarm({...newFarm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 font-medium placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Standort
                </label>
                <input
                  type="text"
                  value={newFarm.location}
                  onChange={(e) => setNewFarm({...newFarm, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 font-medium placeholder-gray-500"
                  placeholder="z.B. Münster, NRW"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Breitengrad
                </label>
                <input
                  type="number"
                  step="any"
                  value={newFarm.latitude}
                  onChange={(e) => setNewFarm({...newFarm, latitude: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 font-medium placeholder-gray-500"
                  placeholder="51.9607"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Längengrad
                </label>
                <input
                  type="number"
                  step="any"
                  value={newFarm.longitude}
                  onChange={(e) => setNewFarm({...newFarm, longitude: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 font-medium placeholder-gray-500"
                  placeholder="7.6261"
                  required
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Feld erstellen
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Legende */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
          <Info className="h-4 w-4" />
          <span>Legende</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <MapPin className="h-3 w-3 text-red-600" />
            <span className="text-gray-600">Standort (klickbar)</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span className="text-gray-600">Guter Zustand</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-3 w-3 text-yellow-500" />
            <span className="text-gray-600">Achtung erforderlich</span>
          </div>
          <div className="flex items-center space-x-2">
            <XCircle className="h-3 w-3 text-red-500" />
            <span className="text-gray-600">Kritischer Zustand</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-3 w-3 text-blue-500" />
            <span className="text-gray-600">Ertragsprognose</span>
          </div>
          <div className="flex items-center space-x-2">
            <Droplets className="h-3 w-3 text-blue-400" />
            <span className="text-gray-600">Bewässerungsstatus</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-3 w-3 text-gray-500" />
            <span className="text-gray-600">Letzte Aktivität</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sprout className="h-3 w-3 text-green-600" />
            <span className="text-gray-600">Angebaute Kulturen</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Felder vorhanden</h3>
            <p className="text-gray-600">Fügen Sie Ihr erstes Feld hinzu, um zu beginnen.</p>
          </div>
        ) : (
          farms.map((farm) => (
            <div key={farm.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{farm.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1 cursor-pointer hover:text-green-600 transition-colors" onClick={() => window.location.href = '/dashboard/getreidekarte'}>
                  <MapPin className="h-4 w-4 text-red-600" />
                  <span>{farm.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Wheat className="h-4 w-4" />
                  <span>{farm.crops.length} Kulturen</span>
                </div>
                {farm.crops.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {farm.crops.slice(0, 3).map((crop, index) => (
                      <div key={crop.id} className="text-xs text-gray-500 flex items-center space-x-1">
                        <Sprout className="h-3 w-3" />
                        <span>{crop.type} - gepflanzt am {new Date(crop.plantedDate).toLocaleDateString('de-DE')}</span>
                      </div>
                    ))}
                    {farm.crops.length > 3 && (
                      <div className="text-xs text-gray-400">... und {farm.crops.length - 3} weitere</div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Quick Stats */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>Ertrag: Gut</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Zustand: Gut</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Droplets className="h-3 w-3" />
                    <span>Bewässerung: OK</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Letzte Pflege: 2d</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <div className="flex space-x-2">
                  <a
                    href={`/dashboard/farms/${farm.id}`}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Details →
                  </a>
                  <button
                    onClick={() => window.location.href = '/dashboard/weather'}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Wetter →
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(farm.id, farm.name)}
                  className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
                  title="Feld löschen"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}