'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Tractor, CloudRain, Users, Settings, LogOut } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/login')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Tractor className="h-8 w-8" />
                <span className="text-xl font-bold">Agrar Dashboard</span>
              </div>
              
              <div className="flex space-x-4">
                <a href="/dashboard" className="hover:bg-green-700 px-3 py-2 rounded-md">
                  Übersicht
                </a>
                <a href="/dashboard/farms" className="hover:bg-green-700 px-3 py-2 rounded-md">
                  Felder
                </a>
                <a href="/dashboard/weather" className="hover:bg-green-700 px-3 py-2 rounded-md">
                  Wetter
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm">Willkommen, {session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-1 hover:bg-green-700 px-3 py-2 rounded-md"
              >
                <LogOut className="h-4 w-4" />
                <span>Abmelden</span>
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
