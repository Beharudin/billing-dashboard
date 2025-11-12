import { z } from "zod";
import { emailRegex, phoneRegex } from "../../lib/utils";

export const userFormSchema = z.object({
  id: z.number().optional(), // Optional field for editing
  username: z.string().min(1, { message: "Username is required" }),
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .refine((value) => emailRegex.test(value), {
      message: "Invalid phone number",
    }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required" })
    .refine((value) => phoneRegex.test(value), {
      message: "Invalid phone number",
    }),
  roleId: z.coerce.number().min(1, { message: "User type is required" }),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
