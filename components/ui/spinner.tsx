export function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <output className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" aria-live="polite" aria-label="Loading">
        <span className="sr-only">Loading...</span>
      </output>
    </div>
  )
}
