'use server';
/**
 * @fileOverview A Genkit flow for suggesting optimal pricing and value-added uses for agricultural waste.
 *
 * - aiWasteValorizationSuggestion - A function that suggests optimal pricing and value-added uses for agricultural waste.
 * - AiWasteValorizationSuggestionInput - The input type for the aiWasteValorizationSuggestion function.
 * - AiWasteValorizationSuggestionOutput - The return type for the aiWasteValorizationSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const AiWasteValorizationSuggestionInputSchema = z.object({
  wasteTypeLabel: z.string().describe('The human-readable label of the agricultural waste type.'),
  condition: z.enum(['fresh', 'dried', 'mixed']).describe('The condition of the agricultural waste.'),
  quantityKg: z.number().int().positive().describe('The total quantity of waste in kilograms.'),
  qualityGrade: z.enum(['premium', 'standard', 'mixed']).describe('The quality grade of the waste.'),
  locationAddress: z.string().describe('The physical address where the waste is located (e.g., Abeokuta Expressway, Ogun State).'),
  description: z.string().optional().describe('An optional detailed description of the waste.'),
});
export type AiWasteValorizationSuggestionInput = z.infer<typeof AiWasteValorizationSuggestionInputSchema>;

// Output Schema
const AiWasteValorizationSuggestionOutputSchema = z.object({
  suggestedPriceRangePerKg: z.string().describe('The suggested optimal price range per kilogram for the waste, in NGN (e.g., "NGN 40 - NGN 50").'),
  valueAddedUses: z.array(z.string()).describe('A list of potential value-added uses for this specific waste type based on market trends.'),
  marketTrendsSummary: z.string().describe('A summary of current market trends and demand influencing the suggestions.'),
});
export type AiWasteValorizationSuggestionOutput = z.infer<typeof AiWasteValorizationSuggestionOutputSchema>;

// Define the prompt
const aiWasteValorizationSuggestionPrompt = ai.definePrompt({
  name: 'aiWasteValorizationSuggestionPrompt',
  input: { schema: AiWasteValorizationSuggestionInputSchema },
  output: { schema: AiWasteValorizationSuggestionOutputSchema },
  prompt: `You are an expert market analyst specializing in agricultural waste valorization in Nigeria.\nYour task is to provide an optimal price range per kilogram and potential value-added uses for a given agricultural waste listing, based on current market trends and demand.\n\nConsider the following details about the agricultural waste listing:\nWaste Type: {{{wasteTypeLabel}}}\nCondition: {{{condition}}}\nQuantity: {{{quantityKg}}} kg\nQuality Grade: {{{qualityGrade}}}\nLocation: {{{locationAddress}}}\nDescription: {{#if description}}{{{description}}}{{else}}No additional description provided.{{/if}}\n\nBased on this information, and assuming current Nigerian market conditions:\n1. Suggest an optimal price range per kilogram (in NGN) that a seller could ask for this waste to maximize revenue and attract buyers.\n2. List 3-5 distinct and actionable value-added uses for this specific waste type. These should be practical applications relevant to the Nigerian context (e.g., for organic farming, bioenergy, construction materials, etc.).\n3. Provide a brief summary of the market trends and demand that support your pricing and usage suggestions.\n\nEnsure your response is formatted as a JSON object strictly adhering to the output schema provided. Do not include any additional text or formatting outside the JSON.`
});

// Define the flow
const aiWasteValorizationSuggestionFlow = ai.defineFlow(
  {
    name: 'aiWasteValorizationSuggestionFlow',
    inputSchema: AiWasteValorizationSuggestionInputSchema,
    outputSchema: AiWasteValorizationSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await aiWasteValorizationSuggestionPrompt(input);
    if (!output) {
      throw new Error('AI failed to generate a suggestion.');
    }
    return output;
  }
);

// Wrapper function for external calls
export async function aiWasteValorizationSuggestion(input: AiWasteValorizationSuggestionInput): Promise<AiWasteValorizationSuggestionOutput> {
  return aiWasteValorizationSuggestionFlow(input);
}
