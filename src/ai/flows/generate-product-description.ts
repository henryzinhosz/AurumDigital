'use server';
/**
 * @fileOverview A GenAI agent for generating elegant and detailed product descriptions for jewelry.
 *
 * - generateProductDescription - A function that handles the product description generation process.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  material: z.string().describe('The primary material of the jewelry (e.g., "gold", "silver", "rose gold", "pearls").'),
  style: z.string().describe('The style or design of the jewelry (e.g., "minimalist", "vintage", "boho chic", "art deco").'),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

const GenerateProductDescriptionOutputSchema = z.object({
  description: z.string().describe('An elegant and detailed product description for the jewelry.'),
});
export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

export async function generateProductDescription(input: GenerateProductDescriptionInput): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `You are an expert copywriter for a delicate and authentic fine jewelry brand. Your goal is to create elegant, detailed, and enticing product descriptions.

Craft a product description for a piece of jewelry with the following characteristics:

Material: {{{material}}}
Style: {{{style}}}

The description should evoke a sense of luxury, craftsmanship, and the unique beauty of the piece, aligning with a clean, minimalist, and authentic brand identity. Focus on the emotional connection and the aesthetic appeal, without explicitly mentioning price or promotional offers.

Ensure the description is suitable for a high-end digital catalog.`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
