
'use server';
/**
 * @fileOverview This file implements a Genkit flow to automatically generate a comprehensive and appealing listing description
 * for agricultural waste based on its type, condition, and quantity.
 *
 * - generateListingDescription - A function that generates the listing description.
 * - GenerateListingDescriptionInput - The input type for the generateListingDescription function.
 * - GenerateListingDescriptionOutput - The return type for the generateListingDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateListingDescriptionInputSchema = z.object({
  wasteType: z
    .string()
    .describe('The type of agricultural waste (e.g., cassava peels, rice husk, or any custom biological waste).'),
  condition: z
    .enum(['fresh', 'dried', 'mixed'])
    .describe('The condition of the agricultural waste.'),
  quantityKg: z.number().describe('The quantity of the waste in kilograms.'),
});
export type GenerateListingDescriptionInput = z.infer<
  typeof GenerateListingDescriptionInputSchema
>;

const GenerateListingDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated listing description.'),
});
export type GenerateListingDescriptionOutput = z.infer<
  typeof GenerateListingDescriptionOutputSchema
>;

export async function generateListingDescription(
  input: GenerateListingDescriptionInput
): Promise<GenerateListingDescriptionOutput> {
  return generateListingDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateListingDescriptionPrompt',
  input: {schema: GenerateListingDescriptionInputSchema},
  output: {schema: GenerateListingDescriptionOutputSchema},
  prompt: `You are an AI assistant specialized in creating compelling and informative descriptions for agricultural waste listings.

Generate a detailed and appealing description for an agricultural waste listing based on the following characteristics:

Waste Type: {{{wasteType}}}
Condition: {{{condition}}}
Quantity: {{{quantityKg}}} kg

The description should:
- Highlight the benefits and potential uses of this specific waste type.
- Emphasize its quality and condition.
- Be concise yet comprehensive, around 100-150 words.
- Use a professional and engaging tone.
- Avoid any specific pricing or location details as those will be added separately.

Provide the generated description in the following JSON format:
{{json out.schema}}`,
});

const generateListingDescriptionFlow = ai.defineFlow(
  {
    name: 'generateListingDescriptionFlow',
    inputSchema: GenerateListingDescriptionInputSchema,
    outputSchema: GenerateListingDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
