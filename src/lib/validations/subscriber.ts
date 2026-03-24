import { z } from "zod/v4";

export const subscribeSchema = z.object({
    email: z.email("Invalid email address"),
    name: z.string().max(100).optional(),
    source: z.string().max(50).default("blog"),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
