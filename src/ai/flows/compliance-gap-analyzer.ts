'use server';

/**
 * @fileOverview Analyzes application documents to identify potential compliance gaps and suggest relevant standards.
 *
 * - analyzeComplianceGaps - A function that handles the compliance gap analysis process.
 * - AnalyzeComplianceGapsInput - The input type for the analyzeComplianceGaps function.
 * - AnalyzeComplianceGapsOutput - The return type for the analyzeComplianceGaps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeComplianceGapsInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document to analyze for compliance gaps, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  documentDescription: z.string().describe('The description of the document.'),
  relevantStandards: z
    .string()
    .describe('A comma separated list of relevant accreditation standards.'),
});
export type AnalyzeComplianceGapsInput = z.infer<typeof AnalyzeComplianceGapsInputSchema>;

const AnalyzeComplianceGapsOutputSchema = z.object({
  complianceGaps: z
    .string()
    .describe('A summary of potential compliance gaps identified in the document.'),
  suggestedStandards: z
    .string()
    .describe('A list of suggested standards to consider, based on the document analysis.'),
});
export type AnalyzeComplianceGapsOutput = z.infer<typeof AnalyzeComplianceGapsOutputSchema>;

export async function analyzeComplianceGaps(
  input: AnalyzeComplianceGapsInput
): Promise<AnalyzeComplianceGapsOutput> {
  return analyzeComplianceGapsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'complianceGapAnalysisPrompt',
  input: {schema: AnalyzeComplianceGapsInputSchema},
  output: {schema: AnalyzeComplianceGapsOutputSchema},
  prompt: `You are an AI Compliance Assistant that specializes in identifying compliance gaps in documents. Given a document, its description, and a list of potentially relevant standards, analyze the document to identify potential compliance gaps and suggest relevant standards for consideration. 

Document Description: {{{documentDescription}}}
Relevant Standards: {{{relevantStandards}}}
Document: {{media url=documentDataUri}}

Compliance Gaps: 
Suggested Standards: `,
});

const analyzeComplianceGapsFlow = ai.defineFlow(
  {
    name: 'analyzeComplianceGapsFlow',
    inputSchema: AnalyzeComplianceGapsInputSchema,
    outputSchema: AnalyzeComplianceGapsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
