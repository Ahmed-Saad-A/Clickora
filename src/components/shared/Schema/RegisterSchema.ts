import * as zod from "zod";

export const RegisterSchema = zod.object({
    name: zod
        .string()
        .nonempty("Name is required")
        .min(3, "Name must be at least 3 characters")
        .max(20, "Name is too long"),

    email: zod
        .string()
        .email("Please enter a valid email address")
        .nonempty("Email is required")
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'E-mail is invalid'),

    password: zod
        .string()
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters")
        .regex(/^[A-Z](?=.*[a-zA-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/, 'Password must contain at least one letter, one number and one special character'),

    rePassword: zod.string().nonempty("Password is required"),
    
    phone: zod
        .string()
        .nonempty('Phone is required')
        .regex(/^\+?[0-9]{8,15}$/, "Please enter a valid phone number"),
    })
    .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
});
