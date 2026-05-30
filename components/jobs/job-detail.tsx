'use client'

import { useState } from 'react'
import { useJobs, JobApplication } from '@/hooks/use-jobs'
import { useToast } from '@/components/providers/toast-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Save, Lightbulb, X } from 'lucide-react'

const STATUS_OPTIONS = ['applied', 'interviewing', 'offered', 'rejected', 'closed'] as const

interface JobDetailProps {
  readonly job: JobApplication
}

export default function JobDetail({ job }: JobDetailProps) {
  const { updateJob } = useJobs()
  const { success, error: toastError } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showAITips, setShowAITips] = useState(false)
  const [aiTips, setAiTips] = useState('')
  const [aiTipsLoading, setAiTipsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    company: job.company,
    position: job.position,
    status: job.status,
    description: job.description || '',
    requirements: job.requirements || '',
    salary: job.salary || '',
    location: job.location || '',
    appliedDate: job.appliedDate.split('T')[0],
    interviewDate: job.interviewDate ? job.interviewDate.split('T')[0] : '',
    notes: job.notes || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateJob(job.id, {
        ...formData,
        appliedDate: new Date(formData.appliedDate).toISOString(),
        interviewDate: formData.interviewDate ? new Date(formData.interviewDate).toISOString() : undefined,
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Save error:', error)
      toastError('Failed to save job application')
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

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Edit Application</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  disabled={loading}
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
                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950"
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={loading}
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
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="appliedDate">Applied Date</Label>
                <Input
                  id="appliedDate"
                  name="appliedDate"
                  type="date"
                  value={formData.appliedDate}
                  onChange={handleChange}
                  disabled={loading}
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
                rows={3}
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
                rows={3}
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
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? <Spinner /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleGetAITips}
                disabled={aiTipsLoading}
              >
                {aiTipsLoading ? <Spinner /> : <Lightbulb className="w-4 h-4 mr-2" />}
                Get Interview Tips
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>

            {showAITips && (
              <Card className="bg-blue-50 dark:bg-blue-950">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Interview Tips
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAITips(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="prose prose-sm dark:prose-invert whitespace-pre-line">
                    {aiTips}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">{job.position}</h1>
        <Badge>{job.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{job.company}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Position</h3>
            <p className="text-zinc-600 dark:text-zinc-400">{job.position}</p>
          </div>

          {job.location && (
            <div>
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{job.location}</p>
            </div>
          )}

          {job.salary && (
            <div>
              <h3 className="font-semibold mb-2">Salary</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{job.salary}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Applied Date</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              {new Date(job.appliedDate).toLocaleDateString()}
            </p>
          </div>

          {job.interviewDate && (
            <div>
              <h3 className="font-semibold mb-2">Interview Date</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {new Date(job.interviewDate).toLocaleDateString()}
              </p>
            </div>
          )}

          {job.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-line">{job.description}</p>
            </div>
          )}

          {job.requirements && (
            <div>
              <h3 className="font-semibold mb-2">Requirements</h3>
              <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-line">{job.requirements}</p>
            </div>
          )}

          {job.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-line">{job.notes}</p>
            </div>
          )}

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Button onClick={() => setIsEditing(true)}>
              Edit Application
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
