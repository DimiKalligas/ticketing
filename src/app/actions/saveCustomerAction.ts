'use server'

import { db } from '@/db'
import { customers } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { insertCustomerSchema, type insertCustomerSchemaType } from '@/zod-schemas/customer'
import { redirect } from 'next/navigation'

export async function upsertCustomer(formData: insertCustomerSchemaType) {
    // const { isAuthenticated } = getKindeServerSession()
    
    console.log('in saveCustomerAction..');
    
    // Check if user is authenticated
    // const isAuth = await isAuthenticated()
    // if (!isAuth) {
    //   // throw new Error('Unauthorized: Please log in')
    //   redirect('/login')
    // }

    // Πως γράφουμε sql
    // const query = sql.raw("select * from Customers")
    // const data = await db.execute(query)

    // Validate the form data - Does not check for db constraints
    const parsed = insertCustomerSchema.safeParse(formData)
    // Return early if validation fails
    if (!parsed.success) {
       // Handle validation errors
      return { success: false, message: "Validation failed", error: parsed.error.format() };
    }
    
    const customer = parsed.data;

    // Check if user has manager or admin permission ΔΕΝ ΠΑΙΖΕΙ
    // const isAuthorized = permissions?.permissions.some(
    //   perm => perm === 'manager' || perm === 'admin'
    // )
    // console.log('permissions:', permissions);

    // New Customer 
    // All new customers are active by default - no need to set active to true
    // createdAt and updatedAt are set by the database
    try {
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

        // Existing customer *** OK ***
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

        return { success: true, message: `Customer ID #${result[0].updatedId} updated successfully` }
    } catch (error: any) {
      // console.log(error.code, typeof(error.code))
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
// Action to delete a customer (soft delete = make inactive)
// export async function deleteCustomer(customerId: number) {
//   try {
//     const { getUser, getPermissions } = getKindeServerSession()
//     const user = await getUser()
//     const permissions = await getPermissions()

//     if (!user) {
//       throw new Error('Unauthorized: Please log in')
//     }

//     const isAuthorized = permissions?.permissions.some(
//       perm => perm === 'manager' || perm === 'admin'
//     )
//     if (!isAuthorized) {
//       throw new Error('Unauthorized: Insufficient permissions')
//     }

//     await db.update(customers)
//       .set({ 
//         active: false, 
//         // updatedBy: user.id,
//         updatedAt: new Date()
//       })
//       .where(eq(customers.id, customerId))

//     revalidatePath('/customers')
//     return { success: true, message: 'Customer deleted successfully' }
//   } catch (error) {
//     console.error('Customer delete error:', error)
//     return {
//       success: false,
//       message: error instanceof Error ? error.message : 'Failed to delete customer',
//     }
//   }
// }