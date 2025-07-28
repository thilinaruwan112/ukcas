'use server'
import {
  analyzeComplianceGaps,
  type AnalyzeComplianceGapsInput,
} from '@/ai/flows/compliance-gap-analyzer'

export async function runComplianceAnalysis(input: AnalyzeComplianceGapsInput) {
  try {
    const result = await analyzeComplianceGaps(input)
    return { success: true, data: result }
  } catch (error) {
    console.error('Error in compliance analysis:', error)
    return { success: false, error: 'Failed to run analysis.' }
  }
}
