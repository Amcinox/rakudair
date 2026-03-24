import { z } from "zod/v4";

export const contactFormSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    email: z.email("Invalid email address"),
    subject: z.string().max(255).optional(),
    message: z.string().min(1, "Message is required").max(5000),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
