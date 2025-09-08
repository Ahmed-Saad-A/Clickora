"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-background">
          <div className="text-center space-y-6 max-w-md">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
            </div>

            {/* Error Content */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Application Error
              </h1>
              <p className="text-gray-600">
                Something went wrong with the application. Please try refreshing the page.
              </p>
              {process.env.NODE_ENV === "development" && (
                <details className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
                  <summary className="cursor-pointer font-medium mb-2">
                    Error Details (Development)
                  </summary>
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap break-words">
                    {error.message}
                    {error.digest && `\nDigest: ${error.digest}`}
                  </pre>
                </details>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
