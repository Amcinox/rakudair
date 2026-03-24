import { z } from "zod/v4";

export const updateSettingsSchema = z.record(z.string(), z.unknown());

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
