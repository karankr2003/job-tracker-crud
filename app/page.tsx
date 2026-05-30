'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Sparkles, LogIn, UserPlus } from 'lucide-react'
import Footer from '@/components/footer'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [authLoading, isAuthenticated, router])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white px-8">
        <div className="max-w-3xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Job Application Tracker</span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
            Smart Job Application Management with AI Insights
          </h1>
          
          <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
            Track your job applications efficiently and get AI-powered interview preparation tips. 
            Stay organized, track progress, and land your dream job.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-zinc-100 text-lg px-8 h-14"
              onClick={() => router.push('/register')}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 h-14"
              onClick={() => router.push('/login')}
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
