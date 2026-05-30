'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useJobs } from '@/hooks/use-jobs'
import { useToast } from '@/components/providers/toast-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Save, Lightbulb } from 'lucide-react'

const STATUS_OPTIONS = ['applied', 'interviewing', 'offered', 'rejected', 'closed'] as const

export default function NewJobPage() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { createJob } = useJobs()
  const { success, error: toastError } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [showAITips, setShowAITips] = useState(false)
  const [aiTips, setAiTips] = useState('')
  const [aiTipsLoading, setAiTipsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'applied',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    appliedDate: new Date().toISOString().split('T')[0],
    interviewDate: '',
    notes: '',
  })

  if (authLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center">
        <Spinner />
      </main>
    )
  }

  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createJob({
        ...formData,
        appliedDate: new Date(formData.appliedDate).toISOString(),
        interviewDate: formData.interviewDate ? new Date(formData.interviewDate).toISOString() : undefined,
      })
      router.push('/dashboard')
    } catch (error) {
      console.error('Create job error:', error)
      toastError('Failed to create job application')
    } finally {
      setLoading(false)
    }
  }

  const handleGetAITips = async () => {
    setAiTipsLoading(true)
    try {
      const response = await fetch('/api/ai/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: formData.company,
          position: formData.position,
          description: formData.description,
          requirements: formData.requirements,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setAiTips(data.tips)
        setShowAITips(true)
        success('Interview tips generated successfully')
      } else {
        const errorData = await response.json()
        toastError(errorData.error || 'Failed to generate tips')
      }
    } catch (error) {
      console.error('AI tips error:', error)
      toastError('Failed to generate interview tips')
    } finally {
      setAiTipsLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 max-w-4xl py-8">
          <div className="mb-8">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Add New Application
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    placeholder="Company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    placeholder="Job title"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={loading}
                  className="flex h-11 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-500"
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="City, State or Remote"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., $80,000 - $120,000"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="appliedDate">Applied Date *</Label>
                  <Input
                    id="appliedDate"
                    name="appliedDate"
                    type="date"
                    value={formData.appliedDate}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interviewDate">Interview Date</Label>
                  <Input
                    id="interviewDate"
                    name="interviewDate"
                    type="date"
                    value={formData.interviewDate}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={loading}
                  rows={4}
                  placeholder="Job description and key responsibilities"
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  disabled={loading}
                  rows={4}
                  placeholder="Required skills, experience, and qualifications"
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  disabled={loading}
                  rows={3}
                  placeholder="Personal notes about this application"
                  className="resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? <Spinner /> : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Application
                    </>
                  )}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => router.push('/dashboard')}
                  disabled={loading}
                  className="border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg mt-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              AI Interview Preparation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Get personalized interview tips based on the job description and requirements you enter above.
            </p>
            
            <Button 
              onClick={handleGetAITips}
              disabled={aiTipsLoading || !formData.company || !formData.position}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {aiTipsLoading ? <Spinner /> : (
                <>
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Generate Interview Tips
                </>
              )}
            </Button>

            {showAITips && aiTips && (
              <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200">Interview Tips</h4>
                  <button
                    onClick={() => setShowAITips(false)}
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="prose prose-sm max-w-none text-zinc-700 dark:text-zinc-300">
                  {aiTips.split('\n').map((line, index) => {
                    // Handle numbered points (1., 2., etc.)
                    if (line.match(/^\d+\.\s*\*\*.*\*\*/)) {
                      const parts = line.split('**')
                      const number = parts[0]
                      const title = parts[1]
                      const description = parts.slice(2).join('**')
                      return (
                        <div key={index} className="mb-4 p-4 bg-white/50 dark:bg-zinc-800/50 rounded-lg border border-purple-100 dark:border-purple-800/50">
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white text-sm font-bold rounded-full flex items-center justify-center">
                              {number.replace('.', '')}
                            </span>
                            <div>
                              <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">{title}</h5>
                              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{description.replace(/^\:\s*/, '')}</p>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    // Handle bold text
                    else if (line.includes('**')) {
                      const parts = line.split('**')
                      return (
                        <p key={index} className="mb-3 leading-relaxed">
                          {parts.map((part, i) => 
                            i % 2 === 1 ? 
                              <strong key={i} className="font-semibold text-purple-800 dark:text-purple-200">{part}</strong> : 
                              part
                          )}
                        </p>
                      )
                    }
                    // Handle regular paragraphs
                    else if (line.trim()) {
                      return (
                        <p key={index} className="mb-3 leading-relaxed">{line}</p>
                      )
                    }
                    // Handle empty lines
                    else {
                      return <div key={index} className="mb-2"></div>
                    }
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}
