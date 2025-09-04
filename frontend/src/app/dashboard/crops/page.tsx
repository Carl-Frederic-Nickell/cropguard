'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Filter, 
  Grid, 
  List, 
  Wheat, 
  Sprout, 
  TreePine,
  Apple,
  Carrot,
  Circle,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

interface Crop {
  id: string
  name: string
  type: string
  plantedDate: string
  farmId: string
  farm: {
    id: string
    name: string
    location: string
    latitude: number
    longitude: number
  }
  harvestStatus?: 'good' | 'caution' | 'avoid'
  nextHarvestDate?: string
  daysToHarvest?: number
}

interface CropType {
  id: string
  name: string
  category: string
  icon: React.ReactNode
  color: string
  harvestDuration: number // days from planting
  criteria: {
    minTemp: number
    maxTemp: number
    maxHumidity: number
    maxPrecip: number
    maxWind: number
  }
}

export default function CropsPage() {
  const [crops, setCrops] = useState<Crop[]>([])
  const [farms, setFarms] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedCrop, setSelectedCrop] = useState<string>('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const [newCrop, setNewCrop] = useState({
    name: '',
    type: '',
    plantedDate: '',
    farmId: ''
  })

  const cropTypes: CropType[] = [
    {
      id: 'weizen',
      name: 'Weizen',
      category: 'getreide',
      icon: <Wheat className="h-6 w-6" />,
      color: 'text-yellow-600 bg-yellow-100',
      harvestDuration: 120,
      criteria: { minTemp: 22, maxTemp: 26, maxHumidity: 60, maxPrecip: 1.5, maxWind: 8 }
    },
    {
      id: 'gerste',
      name: 'Gerste',
      category: 'getreide',
      icon: <Wheat className="h-6 w-6" />,
      color: 'text-amber-600 bg-amber-100',
      harvestDuration: 110,
      criteria: { minTemp: 18, maxTemp: 24, maxHumidity: 17, maxPrecip: 1.0, maxWind: 10 }
    },
    {
      id: 'raps',
      name: 'Raps',
      category: 'getreide',
      icon: <Sprout className="h-6 w-6" />,
      color: 'text-green-600 bg-green-100',
      harvestDuration: 90,
      criteria: { minTemp: 20, maxTemp: 25, maxHumidity: 40, maxPrecip: 0.5, maxWind: 12 }
    },
    {
      id: 'mais',
      name: 'Mais',
      category: 'getreide',
      icon: <Circle className="h-6 w-6" />,
      color: 'text-orange-600 bg-orange-100',
      harvestDuration: 100,
      criteria: { minTemp: 15, maxTemp: 30, maxHumidity: 20, maxPrecip: 1.0, maxWind: 15 }
    },
    {
      id: 'sonnenblumen',
      name: 'Sonnenblumen',
      category: 'getreide',
      icon: <Apple className="h-6 w-6" />,
      color: 'text-yellow-500 bg-yellow-50',
      harvestDuration: 120,
      criteria: { minTemp: 22, maxTemp: 28, maxHumidity: 15, maxPrecip: 0.5, maxWind: 8 }
    },
    {
      id: 'kartoffeln',
      name: 'Kartoffeln',
      category: 'gemüse',
      icon: <TreePine className="h-6 w-6" />,
      color: 'text-brown-600 bg-yellow-50',
      harvestDuration: 80,
      criteria: { minTemp: 10, maxTemp: 18, maxHumidity: 75, maxPrecip: 2.0, maxWind: 10 }
    },
    {
      id: 'zuckerrueben',
      name: 'Zuckerrüben',
      category: 'gemüse',
      icon: <TreePine className="h-6 w-6" />,
      color: 'text-purple-600 bg-purple-100',
      harvestDuration: 180,
      criteria: { minTemp: 8, maxTemp: 15, maxHumidity: 80, maxPrecip: 1.5, maxWind: 12 }
    },
    {
      id: 'tomaten',
      name: 'Tomaten',
      category: 'gemüse',
      icon: <Apple className="h-6 w-6" />,
      color: 'text-red-600 bg-red-100',
      harvestDuration: 75,
      criteria: { minTemp: 15, maxTemp: 28, maxHumidity: 80, maxPrecip: 1, maxWind: 8 }
    }
  ]

  const categories = [
    { id: 'all', name: 'Alle Kulturen', count: 0 },
    { id: 'getreide', name: 'Getreide', count: 0 },
    { id: 'gemüse', name: 'Gemüse', count: 0 }
  ]

  const fetchCrops = async () => {
    try {
      const response = await fetch('/api/farms')
      if (response.ok) {
        const farmsData = await response.json()
        setFarms(farmsData)
        
        // Extract all crops from farms with enhanced data
        const allCrops: Crop[] = []
        farmsData.forEach((farm: any) => {
          farm.crops.forEach((crop: any) => {
            const cropType = cropTypes.find(ct => ct.id === crop.type.toLowerCase())
            const plantedDate = new Date(crop.plantedDate)
            const harvestDate = new Date(plantedDate)
            harvestDate.setDate(harvestDate.getDate() + (cropType?.harvestDuration || 90))
            
            const today = new Date()
            const daysToHarvest = Math.ceil((harvestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
            
            // Simulate harvest status based on days to harvest
            let harvestStatus: 'good' | 'caution' | 'avoid' = 'good'
            if (daysToHarvest < 0) harvestStatus = 'avoid' // Overripe
            else if (daysToHarvest > 30) harvestStatus = 'caution' // Too early
            else if (daysToHarvest <= 7) harvestStatus = 'good' // Optimal

            allCrops.push({
              ...crop,
              farm,
              harvestStatus,
              nextHarvestDate: harvestDate.toISOString(),
              daysToHarvest
            })
          })
        })
        setCrops(allCrops)
      }
    } catch (error) {
      console.error('Error fetching crops:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCrop = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const selectedFarm = farms.find(f => f.id === newCrop.farmId)
      if (!selectedFarm) return

      const response = await fetch(`/api/farms/${newCrop.farmId}/crops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCrop)
      })

      if (response.ok) {
        setNewCrop({ name: '', type: '', plantedDate: '', farmId: '' })
        setShowAddForm(false)
        fetchCrops()
      }
    } catch (error) {
      console.error('Error adding crop:', error)
    }
  }

  const handleDeleteCrop = async (cropId: string, cropName: string, farmId: string) => {
    if (window.confirm(`Möchten Sie die Kultur "${cropName}" wirklich löschen?`)) {
      try {
        const response = await fetch(`/api/farms/${farmId}/crops/${cropId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          fetchCrops()
        } else {
          console.error('Error deleting crop')
        }
      } catch (error) {
        console.error('Error deleting crop:', error)
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'caution': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'avoid': return <XCircle className="h-5 w-5 text-red-500" />
      default: return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good': return 'Erntereif'
      case 'caution': return 'Bald bereit'
      case 'avoid': return 'Überfällig'
      default: return 'Unbekannt'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200'
      case 'caution': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'avoid': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredCrops = crops.filter(crop => {
    if (selectedCategory === 'all') return true
    const cropType = cropTypes.find(ct => ct.id === crop.type.toLowerCase())
    return cropType?.category === selectedCategory
  })

  const getCategoryCount = (category: string) => {
    if (category === 'all') return crops.length
    return crops.filter(crop => {
      const cropType = cropTypes.find(ct => ct.id === crop.type.toLowerCase())
      return cropType?.category === category
    }).length
  }

  useEffect(() => {
    fetchCrops()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Wheat className="h-8 w-8 animate-pulse text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Kulturen werden geladen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kulturen Management</h1>
            <p className="text-gray-600 mt-2">Verwalten Sie Ihre Pflanzen und überwachen Sie den Erntestatus</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Kultur hinzufügen</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>

            <div className="flex items-center space-x-2 border border-gray-300 rounded-md p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-600'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-600'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {filteredCrops.length} von {crops.length} Kulturen
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategorie
                </label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">
                        {category.name} ({getCategoryCount(category.id)})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kulturart
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 font-medium bg-white"
                >
                  <option value="">Alle Kulturarten</option>
                  {cropTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Crop Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Neue Kultur hinzufügen</h2>
          <form onSubmit={handleAddCrop} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kulturname
                </label>
                <input
                  type="text"
                  value={newCrop.name}
                  onChange={(e) => setNewCrop({...newCrop, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 font-medium placeholder-gray-500"
                  placeholder="z.B. Winterweizen Feld A"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kulturart
                </label>
                <select
                  value={newCrop.type}
                  onChange={(e) => setNewCrop({...newCrop, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 font-medium bg-white"
                  required
                >
                  <option value="">Kulturart wählen...</option>
                  {cropTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pflanzdatum
                </label>
                <input
                  type="date"
                  value={newCrop.plantedDate}
                  onChange={(e) => setNewCrop({...newCrop, plantedDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feld
                </label>
                <select
                  value={newCrop.farmId}
                  onChange={(e) => setNewCrop({...newCrop, farmId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 font-medium bg-white"
                  required
                >
                  <option value="">Feld wählen...</option>
                  {farms.map(farm => (
                    <option key={farm.id} value={farm.id}>
                      {farm.name} ({farm.location})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Kultur hinzufügen
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

      {/* Crops Display */}
      {filteredCrops.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <Wheat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Kulturen gefunden</h3>
          <p className="text-gray-600 mb-4">
            {selectedCategory === 'all' 
              ? 'Fügen Sie Ihre erste Kultur hinzu, um zu beginnen.'
              : `Keine Kulturen in der Kategorie "${categories.find(c => c.id === selectedCategory)?.name}" gefunden.`
            }
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {filteredCrops.map((crop) => {
            const cropType = cropTypes.find(ct => ct.id === crop.type.toLowerCase())
            
            if (viewMode === 'grid') {
              return (
                <div key={crop.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{crop.name}</h3>
                      <p className="text-sm text-gray-600">{cropType?.name || crop.type}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        {getStatusIcon(crop.harvestStatus || 'unknown')}
                        <span className={`text-xs font-medium ${getStatusColor(crop.harvestStatus || 'unknown').replace('bg-', 'text-').replace('-100', '-700')}`}>
                          {getStatusText(crop.harvestStatus || 'unknown')}
                        </span>
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg ${cropType?.color || 'text-gray-600 bg-gray-100'}`}>
                      {cropType?.icon || <Sprout className="h-6 w-6" />}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{crop.farm.name}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Gepflanzt: {new Date(crop.plantedDate).toLocaleDateString('de-DE')}</span>
                    </div>

                    {crop.daysToHarvest !== undefined && (
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-green-600" />
                        <span className={crop.daysToHarvest <= 0 
                          ? 'text-red-600 font-medium' 
                          : crop.daysToHarvest <= 7 
                          ? 'text-green-600 font-medium'
                          : 'text-gray-600'
                        }>
                          {crop.daysToHarvest <= 0 
                            ? `${Math.abs(crop.daysToHarvest)} Tage überfällig`
                            : `${crop.daysToHarvest} Tage bis zur Ernte`
                          }
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600">
                        <Eye className="h-4 w-4" />
                        <span>Details</span>
                      </button>
                      <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600">
                        <Edit className="h-4 w-4" />
                        <span>Bearbeiten</span>
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeleteCrop(crop.id, crop.name, crop.farm.id)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                      title="Kultur löschen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            } else {
              return (
                <div key={crop.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{crop.name}</p>
                      <p className="text-sm text-gray-600">{cropType?.name || crop.type}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {getStatusIcon(crop.harvestStatus || 'unknown')}
                        <span className={`text-xs font-medium ${getStatusColor(crop.harvestStatus || 'unknown').replace('bg-', 'text-').replace('-100', '-700')}`}>
                          {getStatusText(crop.harvestStatus || 'unknown')}
                        </span>
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg ${cropType?.color || 'text-gray-600 bg-gray-100'}`}>
                      {cropType?.icon || <Sprout className="h-5 w-5" />}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="grid grid-cols-3 gap-4 flex-1">
                        
                        <div>
                          <p className="text-sm text-gray-600">{crop.farm.name}</p>
                          <p className="text-xs text-gray-700 font-medium">{crop.farm.location}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">
                            {new Date(crop.plantedDate).toLocaleDateString('de-DE')}
                          </p>
                          <p className="text-xs text-gray-700 font-medium">Gepflanzt</p>
                        </div>
                        
                        <div>
                          {crop.daysToHarvest !== undefined && (
                            <p className={`text-sm font-medium ${
                              crop.daysToHarvest <= 0 
                                ? 'text-red-600' 
                                : crop.daysToHarvest <= 7 
                                ? 'text-green-600'
                                : 'text-gray-600'
                            }`}>
                              {crop.daysToHarvest <= 0 
                                ? `${Math.abs(crop.daysToHarvest)} Tage überfällig`
                                : `${crop.daysToHarvest} Tage`
                              }
                            </p>
                          )}
                          <p className="text-xs text-gray-700 font-medium">bis Ernte</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <button className="p-1 text-gray-600 hover:text-green-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-blue-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCrop(crop.id, crop.name, crop.farm.id)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                          title="Kultur löschen"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          })}
        </div>
      )}
    </div>
  )
}