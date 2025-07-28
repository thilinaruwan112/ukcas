'use client'

import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Loader2,
  ShieldCheck,
  AlertTriangle,
  FileWarning,
  Sparkles,
  Lightbulb,
} from 'lucide-react'
import { runComplianceAnalysis } from './actions'
import { type AnalyzeComplianceGapsOutput } from '@/ai/flows/compliance-gap-analyzer'

type Inputs = {
  document: FileList
  documentDescription: string
  relevantStandards: string
}

const fileToDataUri = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      resolve(event.target?.result as string)
    }
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })

export default function ComplianceAssistantPage() {
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeComplianceGapsOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true)
    setError(null)
    setAnalysisResult(null)

    if (data.document.length === 0) {
      setError('Please upload a document.')
      setIsLoading(false)
      return
    }

    try {
      const documentFile = data.document[0]
      const documentDataUri = await fileToDataUri(documentFile)

      const result = await runComplianceAnalysis({
        documentDataUri,
        documentDescription: data.documentDescription,
        relevantStandards: data.relevantStandards,
      })

      if (result.success) {
        setAnalysisResult(result.data)
      } else {
        setError(result.error || 'An unknown error occurred.')
      }
    } catch (e) {
      setError('Failed to process the document. Please try again.')
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Sparkles className="w-6 h-6 text-accent" />
              AI-Powered Compliance Assistant
            </CardTitle>
            <CardDescription>
              Upload an application document to identify potential compliance
              gaps and receive suggestions for relevant standards.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="document">Document Upload</Label>
              <Input
                id="document"
                type="file"
                {...register('document', { required: 'A document is required.' })}
              />
              {errors.document && (
                <p className="text-sm text-destructive">
                  {errors.document.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentDescription">Document Description</Label>
              <Textarea
                id="documentDescription"
                placeholder="e.g., 'Our company's quality manual for Q1 2024.'"
                {...register('documentDescription', {
                  required: 'Description is required.',
                })}
              />
              {errors.documentDescription && (
                <p className="text-sm text-destructive">
                  {errors.documentDescription.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="relevantStandards">Relevant Standards</Label>
              <Input
                id="relevantStandards"
                placeholder="e.g., 'ISO 9001, ISO 14001'"
                {...register('relevantStandards', {
                  required: 'At least one standard is required.',
                })}
              />
              {errors.relevantStandards && (
                <p className="text-sm text-destructive">
                  {errors.relevantStandards.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="mr-2 h-4 w-4" />
              )}
              Analyze Document
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="space-y-6">
        {isLoading && (
          <Card className="flex flex-col items-center justify-center p-10">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">
              Analyzing your document...
            </p>
            <p className="text-sm text-muted-foreground">
              This may take a moment.
            </p>
          </Card>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {analysisResult && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <FileWarning className="w-5 h-5 text-destructive" />
                  Potential Compliance Gaps
                </CardTitle>
                <CardDescription>
                  The AI has identified the following potential areas of
                  non-compliance.
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-card-foreground">
                <p>{analysisResult.complianceGaps}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Suggested Standards
                </CardTitle>
                <CardDescription>
                  Consider these standards for further review based on the
                  document content.
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-card-foreground">
                <p>{analysisResult.suggestedStandards}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
