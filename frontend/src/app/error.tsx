'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-16 w-16 text-red-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Etwas ist schiefgelaufen!
        </h2>

        <p className="text-gray-600 mb-6">
          Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
        </p>

        {error.message && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6 text-left">
            <p className="text-sm text-red-800 font-mono">{error.message}</p>
          </div>
        )}

        <button
          onClick={reset}
          className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors mx-auto"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Erneut versuchen</span>
        </button>

        <a
          href="/dashboard"
          className="block mt-4 text-sm text-green-600 hover:text-green-700"
        >
          Zurück zum Dashboard
        </a>
      </div>
    </div>
  )
}
