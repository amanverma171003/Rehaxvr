// Single source of truth for auth form schemas.
// Used by both client (zodResolver) and server actions (safeParse) so validation
// cannot be bypassed by a modified client request.
import { z } from "zod";

// password structure for auth 
const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/[0-9]/, "Include at least one number")
  .regex(/[^A-Za-z0-9]/, "Include at least one symbol");


// includes the expected signup schema for customer registrations 
export const signUpSchema = z
  .object({
    organizationName: z
      .string()
      .min(2, "Organization name must be at least 2 characters"),
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: passwordSchema,
    confirm: z.string(),
    terms: z.literal(true, "You must accept the terms to continue"),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Passwords don't match",
  });


// lncludes validation schemas 
export const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  // Length is enforced at signup; here we only require non-empty.
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

// includes things needed for the forget password part
export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

// reset password validations
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Passwords don't match",
  });

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
