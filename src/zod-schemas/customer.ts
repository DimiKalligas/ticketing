// Defines the shape of data queried from the database - can be used to validate API responses.
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod";
import { customers } from "@/db/schema"

// extending the customers db schema (αλλιώς, για το drizzle-zod αρκεί η πρώτη γραμμή)
export const insertCustomerSchema = createInsertSchema(customers, {
    // firstName: (schema) => schema.firstName.min(1, "First name is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    address1: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().length(2, "State must be exactly 2 characters"),
    email: z.string().email("Invalid email address"),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid Zip code. Use 5 digits or 5 digits followed by a hyphen and 4 digits"),
    phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, "Invalid phone number format. Use XXX-XXX-XXXX"),
})

// για το select διαβάζουμε το schema των customers
export const selectCustomerSchema = createSelectSchema(customers)

// για το insert το ορίζουμε εδώ - το _type είναι reference στο zod schema, για αυτό λέμε typeof
export type insertCustomerSchemaType = typeof insertCustomerSchema._type

export type selectCustomerSchemaType = typeof selectCustomerSchema._type 