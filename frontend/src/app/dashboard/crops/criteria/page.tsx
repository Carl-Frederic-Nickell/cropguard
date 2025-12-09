'use client'

import { useState } from 'react'
import { 
  Settings, 
  Thermometer, 
  Droplets, 
  Wind, 
  CloudRain,
  Clock,
  Save,
  RotateCcw,
  Wheat,
  Info
} from 'lucide-react'

interface CropCriteria {
  id: string
  name: string
  category: string
  criteria: {
    minTemp: number
    maxTemp: number
    maxHumidity: number
    maxPrecip: number
    maxWind: number
    harvestDuration: number
    optimalWindow: number
  }
  description: string
}

export default function CropCriteriaPage() {
  const [selectedCrop, setSelectedCrop] = useState<string>('')
  const [isModified, setIsModified] = useState(false)

  const [cropCriteria, setCropCriteria] = useState<CropCriteria[]>([
    {
      id: 'weizen',
      name: 'Weizen',
      category: 'getreide',
      criteria: {
        minTemp: 22,
        maxTemp: 26,
        maxHumidity: 60,
        maxPrecip: 1.5,
        maxWind: 8,
        harvestDuration: 120,
        optimalWindow: 14
      },
      description: 'Unter 18% Kornfeuchte, sonst Gefahr von Lager- und Qualitätsverlusten.'
    },
    {
      id: 'gerste',
      name: 'Gerste',
      category: 'getreide',
      criteria: {
        minTemp: 18,
        maxTemp: 24,
        maxHumidity: 17,
        maxPrecip: 1.0,
        maxWind: 10,
        harvestDuration: 110,
        optimalWindow: 12
      },
      description: 'Malzqualität leidet bei zu hoher Feuchtigkeit.'
    },
    {
      id: 'raps',
      name: 'Raps',
      category: 'getreide',
      criteria: {
        minTemp: 20,
        maxTemp: 25,
        maxHumidity: 40,
        maxPrecip: 0.5,
        maxWind: 12,
        harvestDuration: 90,
        optimalWindow: 10
      },
      description: 'Sehr empfindlich, zu feucht = Auswuchsgefahr.'
    },
    {
      id: 'mais',
      name: 'Mais',
      category: 'getreide',
      criteria: {
        minTemp: 15,
        maxTemp: 30,
        maxHumidity: 20,
        maxPrecip: 1.0,
        maxWind: 15,
        harvestDuration: 100,
        optimalWindow: 21
      },
      description: 'Bei zu hoher Luftfeuchte steigt Schimmelrisiko.'
    },
    {
      id: 'sonnenblumen',
      name: 'Sonnenblumen',
      category: 'getreide',
      criteria: {
        minTemp: 22,
        maxTemp: 28,
        maxHumidity: 15,
        maxPrecip: 0.5,
        maxWind: 8,
        harvestDuration: 120,
        optimalWindow: 14
      },
      description: 'Ölqualität sinkt bei zu hoher Kornfeuchte.'
    },
    {
      id: 'kartoffeln',
      name: 'Kartoffeln',
      category: 'gemüse',
      criteria: {
        minTemp: 10,
        maxTemp: 18,
        maxHumidity: 75,
        maxPrecip: 2.0,
        maxWind: 10,
        harvestDuration: 80,
        optimalWindow: 30
      },
      description: 'Schalenfestigkeit wichtig, zu heiß = Fäulnisrisiko (Feldluftfeuchte).'
    },
    {
      id: 'zuckerrueben',
      name: 'Zuckerrüben',
      category: 'gemüse',
      criteria: {
        minTemp: 8,
        maxTemp: 15,
        maxHumidity: 80,
        maxPrecip: 1.5,
        maxWind: 12,
        harvestDuration: 180,
        optimalWindow: 21
      },
      description: 'Müssen kühl geerntet werden, sonst Lagerverluste (Feldluftfeuchte).'
    },
    {
      id: 'tomaten',
      name: 'Tomaten',
      category: 'gemüse',
      criteria: {
        minTemp: 15,
        maxTemp: 28,
        maxHumidity: 80,
        maxPrecip: 1.0,
        maxWind: 8,
        harvestDuration: 75,
        optimalWindow: 14
      },
      description: 'Empfindlich gegen Nässe und starke Temperaturschwankungen.'
    }
  ])

  const selectedCropData = cropCriteria.find(c => c.id === selectedCrop)

  const updateCropCriteria = (field: string, value: number) => {
    if (!selectedCropData) return
    
    setCropCriteria(prev => prev.map(crop => 
      crop.id === selectedCrop 
        ? {
            ...crop,
            criteria: {
              ...crop.criteria,
              [field]: value
            }
          }
        : crop
    ))
    setIsModified(true)
  }

  const resetToDefaults = () => {
    // Reset logic would restore original values
    setIsModified(false)
  }

  const saveCriteria = () => {
    // Save logic would persist changes to backend
    console.log('Saving criteria for', selectedCrop, selectedCropData?.criteria)
    setIsModified(false)
  }

  const getCriteriaColor = (value: number, min: number, max: number) => {
    if (value < min * 0.8 || value > max * 1.2) return 'text-red-600'
    if (value < min * 0.9 || value > max * 1.1) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Settings className="h-7 w-7 mr-3" />
              Erntekriterien verwalten
            </h1>
            <p className="text-gray-600 mt-2">
              Anpassen der kulturspezifischen Wetter- und Erntekriterien für optimale Empfehlungen
            </p>
          </div>
          
          {isModified && (
            <div className="flex space-x-2">
              <button
                onClick={resetToDefaults}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Zurücksetzen</span>
              </button>
              <button
                onClick={saveCriteria}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                <Save className="h-4 w-4" />
                <span>Speichern</span>
              </button>
            </div>
          )}
        </div>

        {/* Crop Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kultur auswählen
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Kultur zum Bearbeiten wählen...</option>
              <optgroup label="Getreide">
                {cropCriteria.filter(c => c.category === 'getreide').map(crop => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Gemüse">
                {cropCriteria.filter(c => c.category === 'gemüse').map(crop => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {selectedCropData && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Info className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Kulturbeschreibung</span>
              </div>
              <p className="text-sm text-blue-800">{selectedCropData.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Criteria Editor */}
      {selectedCropData && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Wheat className="h-5 w-5 mr-2" />
            Kriterien für {selectedCropData.name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Temperature Criteria */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Thermometer className="h-4 w-4 mr-2 text-red-500" />
                Temperaturbereich
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mindesttemperatur (°C)
                  </label>
                  <input
                    type="number"
                    value={selectedCropData.criteria.minTemp}
                    onChange={(e) => updateCropCriteria('minTemp', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    step="0.5"
                    min="-10"
                    max="40"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximaltemperatur (°C)
                  </label>
                  <input
                    type="number"
                    value={selectedCropData.criteria.maxTemp}
                    onChange={(e) => updateCropCriteria('maxTemp', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    step="0.5"
                    min="-10"
                    max="40"
                  />
                </div>
              </div>
            </div>

            {/* Humidity Criteria */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                Feuchtigkeit & Niederschlag
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max. Luftfeuchtigkeit (%)
                  </label>
                  <input
                    type="number"
                    value={selectedCropData.criteria.maxHumidity}
                    onChange={(e) => updateCropCriteria('maxHumidity', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    step="1"
                    min="0"
                    max="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max. Niederschlag (mm)
                  </label>
                  <input
                    type="number"
                    value={selectedCropData.criteria.maxPrecip}
                    onChange={(e) => updateCropCriteria('maxPrecip', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    step="0.1"
                    min="0"
                    max="20"
                  />
                </div>
              </div>
            </div>

            {/* Wind Criteria */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Wind className="h-4 w-4 mr-2 text-gray-500" />
                Windgeschwindigkeit
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max. Windgeschwindigkeit (m/s)
                </label>
                <input
                  type="number"
                  value={selectedCropData.criteria.maxWind}
                  onChange={(e) => updateCropCriteria('maxWind', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  step="0.5"
                  min="0"
                  max="30"
                />
              </div>
            </div>

            {/* Timing Criteria */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-green-500" />
                Erntezeiten
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wachstumsdauer (Tage)
                  </label>
                  <input
                    type="number"
                    value={selectedCropData.criteria.harvestDuration}
                    onChange={(e) => updateCropCriteria('harvestDuration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    step="1"
                    min="30"
                    max="365"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Optimales Erntefenster (Tage)
                  </label>
                  <input
                    type="number"
                    value={selectedCropData.criteria.optimalWindow}
                    onChange={(e) => updateCropCriteria('optimalWindow', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    step="1"
                    min="1"
                    max="60"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Kriterien-Übersicht</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Temperatur:</span>
                <div className="font-medium">
                  {selectedCropData.criteria.minTemp}°C - {selectedCropData.criteria.maxTemp}°C
                </div>
              </div>
              <div>
                <span className="text-gray-600">Luftfeuchtigkeit:</span>
                <div className="font-medium">max. {selectedCropData.criteria.maxHumidity}%</div>
              </div>
              <div>
                <span className="text-gray-600">Niederschlag:</span>
                <div className="font-medium">max. {selectedCropData.criteria.maxPrecip}mm</div>
              </div>
              <div>
                <span className="text-gray-600">Wind:</span>
                <div className="font-medium">max. {selectedCropData.criteria.maxWind}m/s</div>
              </div>
            </div>
          </div>

          {/* Impact Warning */}
          {isModified && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Hinweis</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Änderungen an den Erntekriterien beeinflussen alle zukünftigen Empfehlungen für diese Kultur. 
                Bestehende Bewertungen werden beim nächsten Update neu berechnet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Crop Overview */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Alle Kulturen im Überblick
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cropCriteria.map(crop => (
            <div 
              key={crop.id} 
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedCrop === crop.id 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedCrop(crop.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{crop.name}</h3>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded capitalize">
                  {crop.category}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>Temp: {crop.criteria.minTemp}-{crop.criteria.maxTemp}°C</div>
                <div>Feucht: {crop.criteria.maxHumidity}%</div>
                <div>Regen: {crop.criteria.maxPrecip}mm</div>
                <div>Wind: {crop.criteria.maxWind}m/s</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}