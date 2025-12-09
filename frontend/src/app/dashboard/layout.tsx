'use client'

import { Tractor, Settings } from 'lucide-react'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition cursor-pointer">
                <Tractor className="h-8 w-8" />
                <span className="text-xl font-bold">CropGuard</span>
              </Link>
              
              <div className="flex space-x-4">
                <a href="/dashboard" className="hover:bg-green-700 px-3 py-2 rounded-md">
                  Übersicht
                </a>
                <a href="/dashboard/farms" className="hover:bg-green-700 px-3 py-2 rounded-md">
                  Felder
                </a>
                <a href="/dashboard/crops" className="hover:bg-green-700 px-3 py-2 rounded-md">
                  Kulturen
                </a>
                <a href="/dashboard/weather" className="hover:bg-green-700 px-3 py-2 rounded-md">
                  Wetter
                </a>
                <a href="/dashboard/getreidekarte" className="hover:bg-green-700 px-3 py-2 rounded-md">
                  Getreidekarte
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm">Willkommen, Carl</span>
              <button className="flex items-center space-x-1 hover:bg-green-700 px-3 py-2 rounded-md">
                <Settings className="h-4 w-4" />
                <span>Einstellungen</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}