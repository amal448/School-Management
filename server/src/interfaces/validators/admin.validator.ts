import { z } from 'zod';

export const WhitelistEmailSchema = z.object({
  email: z.string().email('Must be a valid email address'),
});