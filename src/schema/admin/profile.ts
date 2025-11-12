import { z } from "zod";

export const ProfileFormSchema = z.object({
  id: z.number().optional(), // Optional field for editing
  username: z.string().min(1, { message: "Username is required" }),
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
});

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;
