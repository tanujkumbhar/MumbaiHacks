import { z } from 'zod'

// Registration validation
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
})

// Login validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Onboarding step 1 - Personal Information
export const personalInfoSchema = z.object({
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  panCard: z.string().optional(),
  aadharCard: z.string().optional(),
})

// Onboarding step 2 - Financial Information
export const financialInfoSchema = z.object({
  annualIncome: z.number().positive().optional(),
  monthlyIncome: z.number().positive().optional(),
  occupation: z.string().optional(),
  employer: z.string().optional(),
  workExperience: z.number().int().min(0).optional(),
})

// Onboarding step 3 - Financial Goals
export const financialGoalsSchema = z.object({
  shortTermGoals: z.array(z.string()).optional(),
  longTermGoals: z.array(z.string()).optional(),
  riskTolerance: z.enum(['Conservative', 'Moderate', 'Aggressive']).optional(),
  investmentExperience: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
})

// Document upload schema
export const documentUploadSchema = z.object({
  documentType: z.enum(['panCard', 'aadharCard', 'bankStatement', 'salarySlip']),
  documentData: z.string(), // Base64 encoded file
  fileName: z.string(),
  fileType: z.string(),
})

// Complete onboarding schema
export const completeOnboardingSchema = z.object({
  personalInfo: personalInfoSchema.optional(),
  financialInfo: financialInfoSchema.optional(),
  financialGoals: financialGoalsSchema.optional(),
  documents: z.array(documentUploadSchema).optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>
export type FinancialInfoInput = z.infer<typeof financialInfoSchema>
export type FinancialGoalsInput = z.infer<typeof financialGoalsSchema>
export type DocumentUploadInput = z.infer<typeof documentUploadSchema>
export type CompleteOnboardingInput = z.infer<typeof completeOnboardingSchema>
