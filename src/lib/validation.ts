import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(3, "Username must be 3+ chars"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be 8+ chars"),
});