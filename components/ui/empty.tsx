import { Briefcase } from 'lucide-react'

interface EmptyProps {
  title: string
  description: string
  action?: React.ReactNode
}

export function Empty({ title, description, action }: Readonly<EmptyProps>) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center shadow-lg">
        <Briefcase className="w-10 h-10 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md">{description}</p>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  )
}
