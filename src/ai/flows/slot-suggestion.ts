// src/ai/flows/slot-suggestion.ts
'use server';
/**
 * @fileOverview Suggests optimal appointment slots based on historical booking data and availability.
 *
 * - suggestOptimalAppointmentSlots - A function that suggests optimal appointment slots.
 * - SuggestOptimalAppointmentSlotsInput - The input type for the suggestOptimalAppointmentSlots function.
 * - SuggestOptimalAppointmentSlotsOutput - The return type for the suggestOptimalAppointmentSlots function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestOptimalAppointmentSlotsInputSchema = z.object({
  fullName: z.string().describe('The full name of the user.'),
  email: z.string().email().describe('The email address of the user.'),
  phoneNumber: z.string().describe('The phone number of the user.'),
  preferredDate: z.string().describe('The preferred date for the appointment (YYYY-MM-DD).'),
});
export type SuggestOptimalAppointmentSlotsInput = z.infer<typeof SuggestOptimalAppointmentSlotsInputSchema>;

const SuggestOptimalAppointmentSlotsOutputSchema = z.object({
  suggestedSlots: z.array(
    z.object({
      date: z.string().describe('The suggested date for the appointment (YYYY-MM-DD).'),
      time: z.string().describe('The suggested time for the appointment (HH:mm).'),
    })
  ).describe('An array of suggested appointment slots.'),
});
export type SuggestOptimalAppointmentSlotsOutput = z.infer<typeof SuggestOptimalAppointmentSlotsOutputSchema>;

export async function suggestOptimalAppointmentSlots(input: SuggestOptimalAppointmentSlotsInput): Promise<SuggestOptimalAppointmentSlotsOutput> {
  return suggestOptimalAppointmentSlotsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalAppointmentSlotsPrompt',
  input: {
    schema: z.object({
      fullName: z.string().describe('The full name of the user.'),
      email: z.string().email().describe('The email address of the user.'),
      phoneNumber: z.string().describe('The phone number of the user.'),
      preferredDate: z.string().describe('The preferred date for the appointment (YYYY-MM-DD).'),
    }),
  },
  output: {
    schema: z.object({
      suggestedSlots: z.array(
        z.object({
          date: z.string().describe('The suggested date for the appointment (YYYY-MM-DD).'),
          time: z.string().describe('The suggested time for the appointment (HH:mm).'),
        })
      ).describe('An array of suggested appointment slots.'),
    }),
  },
  prompt: `Suggest three optimal appointment slots (date and time) based on historical booking data and availability, considering the user's preferred date of {{{preferredDate}}}. The slots should be on or around the preferred date.  Format dates as YYYY-MM-DD and times as HH:mm. Return a JSON array. Be as concise as possible. Consider the user's details (name: {{{fullName}}}, email: {{{email}}}, phone: {{{phoneNumber}}}) to avoid duplicates.`, // Ensure Handlebars syntax is correctly used
});

const suggestOptimalAppointmentSlotsFlow = ai.defineFlow<
  typeof SuggestOptimalAppointmentSlotsInputSchema,
  typeof SuggestOptimalAppointmentSlotsOutputSchema
>(
  {
    name: 'suggestOptimalAppointmentSlotsFlow',
    inputSchema: SuggestOptimalAppointmentSlotsInputSchema,
    outputSchema: SuggestOptimalAppointmentSlotsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
