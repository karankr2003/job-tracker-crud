'use client'

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string }
  reset: () => void
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-white">
              Something went wrong
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              An unexpected error occurred. Please try again later.
            </p>
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
