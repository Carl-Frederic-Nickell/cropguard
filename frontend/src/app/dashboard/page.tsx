'use client'

import { CloudRain, Thermometer, Droplets, Wind } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Dashboard Übersicht
        </h1>
        <p className="text-gray-600">
          Willkommen zurück, Test User! Hier ist eine Übersicht über Ihre landwirtschaftlichen Aktivitäten.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktive Felder</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CloudRain className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kulturen</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Thermometer className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Temp. Heute</p>
              <p className="text-2xl font-bold text-gray-900">--°C</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Droplets className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Niederschlag</p>
              <p className="text-2xl font-bold text-gray-900">--mm</p>
            </div>
            <div className="p-3 bg-cyan-100 rounded-full">
              <Wind className="h-6 w-6 text-cyan-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Erste Schritte</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/dashboard/farms"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Feld hinzufügen</h3>
            <p className="text-gray-600 text-sm">Fügen Sie Ihr erstes Feld hinzu und beginnen Sie mit der Überwachung.</p>
          </a>
          
          <a
            href="/dashboard/weather"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Wetter prüfen</h3>
            <p className="text-gray-600 text-sm">Überprüfen Sie die Wettervorhersage für optimale Erntebedingungen.</p>
          </a>
        </div>
      </div>
    </div>
  )
}