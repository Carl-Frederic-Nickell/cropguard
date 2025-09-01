'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Plus, MapPin, Calendar, Wheat } from 'lucide-react'

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
  const { data: session } = useSession()
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
      const res = await fetch('/api/farms', {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        }
      })
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Felder vorhanden</h3>
            <p className="text-gray-600">Fügen Sie Ihr erstes Feld hinzu, um zu beginnen.</p>
          </div>
        ) : (
          farms.map((farm) => (
            <div key={farm.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{farm.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{farm.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Wheat className="h-4 w-4" />
                  <span>{farm.crops.length} Kulturen</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                
                  href={`/dashboard/farms/${farm.id}`}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Details anzeigen →
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
