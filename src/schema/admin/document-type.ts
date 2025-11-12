import { z } from "zod";

export const documentTypeFormSchema = z.object({
  id: z.number().optional(), // Optional field for editing
  userTypes: z.array(z.string()).min(1, { message: "At least one user type is required" }),
  name: z.string().min(1, { message: "Document type name is required" }),
  isActive: z.boolean().default(true),
});

export type DocumentTypeFormValues = z.infer<typeof documentTypeFormSchema>;
