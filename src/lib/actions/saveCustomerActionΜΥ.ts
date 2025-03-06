"use server"

import { eq } from 'drizzle-orm'
// import { flattenValidationErrors } from 'next-safe-action'
import { redirect } from 'next/navigation'
import * as z from "zod"

import { db } from '@/db'
import { customers } from '@/db/schema' // του Drizzle
// import { actionClient } from '@/lib/safe-action'
import { insertCustomerSchema, type insertCustomerSchemaType } from '@/zod-schemas/customer'

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

// ******** ΠΡΕΠΕΙ ΝΑ ΔΟΥΜΕ ΤΙ ΕΡΧΕΤΑΙ ΕΔΩ, formData??
export const saveCustomerAction = async (prevState: { message: string } ,formData: FormData) => {
// export const saveCustomerAction = async (values: z.infer < typeof insertCustomerSchema > ) => {
const data = Object.fromEntries(formData)
const customer = insertCustomerSchema.safeParse(data);

// export const saveCustomerAction = actionClient
    // .metadata({ actionName: 'saveCustomerAction' })
    // .schema(insertCustomerSchema, {
    //     handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
    // })
    // .action(async ({
    //     parsedInput: customer
    // }: { parsedInput: insertCustomerSchemaType }) => {

        const { isAuthenticated } = getKindeServerSession()

        const isAuth = await isAuthenticated()

        if (!isAuth) redirect('/login')

        // New Customer 
        // All new customers are active by default - no need to set active to true
        // createdAt and updatedAt are set by the database
        // to insertCustomerSchemaType EXEI id
        if (customer.id === 0) {
            const result = await db.insert(customers).values({
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phone: customer.phone,
                address1: customer.address1,
                ...(customer.address2?.trim() ? { address2: customer.address2 } : {}),
                city: customer.city,
                state: customer.state,
                zip: customer.zip,
                ...(customer.notes?.trim() ? { notes: customer.notes } : {}),
            }).returning({ insertedId: customers.id })

            return { message: `Customer ID #${result[0].insertedId} created successfully` }
        }

        // Existing customer 
        // updatedAt is set by the database
        const result = await db.update(customers)
            .set({
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phone: customer.phone,
                address1: customer.address1,
                address2: customer.address2?.trim() ?? null,
                city: customer.city,
                state: customer.state,
                zip: customer.zip,
                notes: customer.notes?.trim() ?? null,
                active: customer.active,
            })
            .where(eq(customers.id, customer.id!))
            .returning({ updatedId: customers.id })

        return { message: `Customer ID #${result[0].updatedId} updated successfully` }
    })
    
// "use server";
  
// import { formSchema } from "@/lib/schema"
// import * as z from "zod"

// // μόνο form validation για την ώρα.. 
// // export const onFormSubmit = async (prevState: { message: string } ,formData: FormData) => {

// export const onFormSubmit = async (values: z.infer < typeof formSchema > ) => {
// // const data = Object.fromEntries(formData)
// // const parsed = formSchema.safeParse(data);
//     console.log('Server received values', values);
//     const parsed = formSchema.safeParse(values);

// if (parsed.success) {
    
//     // console.log("Data: ", data);
//     console.log("User registered2", values.username );
//     return { message: "User registered", user: parsed.data };
// } else {
//     console.log(parsed.error.issues);
    
//     return {
//         message: "Invalid server data",
//         issues: parsed.error.issues.map((issue) => issue.path + " " + issue.message + '\n'),
//     }
//    }
// }