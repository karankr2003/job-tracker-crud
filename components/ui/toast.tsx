'use client'

import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastProps {
  readonly toast: Toast
  onRemove: (id: string) => void
}

export function Toast({ toast, onRemove }: Readonly<ToastProps>) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, toast.duration || 3000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  }

  const bgColors = {
    success: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
    error: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
  }

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${bgColors[toast.type]} shadow-lg min-w-[300px]`}>
      {icons[toast.type]}
      <p className="flex-1 text-sm text-zinc-900 dark:text-zinc-100">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
