import { z } from "zod";

export const signupSchema = z
    .object({
        username: z.string().min(3, "Name must be at least 3 characters"),
        email: z.string().email("Invalid email address").trim().toLowerCase(),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Must contain one uppercase letter")
            .regex(/[a-z]/, "Must contain one lowercase letter")
            .regex(/[0-9]/, "Must contain one number")
            .regex(/[@$!%*?&]/, "Must contain one special character"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    // profilePic: z.string().optional().or(z.literal("")).default(""),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const loginSchema = z.object({
    email: z.string().email("Invalid email address").trim().toLowerCase(),
    password: z.string().min(1, "Password is required"),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;