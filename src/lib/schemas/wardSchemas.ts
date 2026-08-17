import { z } from "zod";

// Ward Form Schema
export const wardSchema = z.object({
  name: z.string().min(1, "Ward name is required"),
  code: z.string().min(1, "Ward code is required"),
  description: z.string().optional(),
});

export type WardFormData = z.infer<typeof wardSchema>;

// Councillor Form Schema
export const councillorSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.enum(["ward_councillor"]),
  wardId: z.string().optional(),
});

export type CouncillorFormData = z.infer<typeof councillorSchema>;
