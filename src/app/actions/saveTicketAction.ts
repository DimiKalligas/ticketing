'use server'

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { db } from '@/db'
import { tickets } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { insertTicketSchema, type insertTicketSchemaType } from '@/zod-schemas/ticket'
import { redirect } from 'next/navigation'

export async function upsertTicket(formData: insertTicketSchemaType) {
    const { isAuthenticated } = getKindeServerSession()
    
    // Check if user is authenticated
    const isAuth = await isAuthenticated()
    if (!isAuth) {
    //   throw new Error('Unauthorized: Please log in')
      redirect('/login')
    }

    // Πως γράφουμε sql
    // const query = sql.raw("select * from tickets")
    // const data = await db.execute(query)

    // Validate the form data - Does not check for db constraints
    const parsed = insertTicketSchema.safeParse(formData)
    // Return early if validation fails
    if (!parsed.success) {
       // Handle validation errors
      return { success: false, message: "Validation failed", error: parsed.error.format() };
    }
    
    const ticket = parsed.data;

    // New ticket 
    // All new tickets are active by default - no need to set active to true
    // createdAt and updatedAt are set by the database
    try {
        if (ticket.id === '(New)') {
        const result = await db.insert(tickets).values({
            customerId: ticket.customerId,
            title: ticket.title,
            description: ticket.description,
            tech: ticket.tech,
            }).returning({ insertedId: tickets.id })

            return { message: `ticket ID #${result[0].insertedId} created successfully` }
        }

        // Update ticket
        const result = await db.update(tickets)
            .set({
                customerId: ticket.customerId,
                title: ticket.title,
                description: ticket.description,
                completed: ticket.completed,
                tech: ticket.tech,
            })
            .where(eq(tickets.id, ticket.id!))
            .returning({ updatedId: tickets.id })

        return { success: true, message: `ticket ID #${result[0].updatedId} updated successfully` }
    } catch (error: any) {
        // if (error.code === 23505) { // 23505 for constraint violation
        //   return { success: false, error: error.detail || "A unique constraint was violated." };
        // }
        return { 
            success: false, 
            message: error.message, // η error.detail
            error: error.message || "Something went wrong" 
        };
    }
}