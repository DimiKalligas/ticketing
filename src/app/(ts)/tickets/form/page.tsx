import { getCustomer } from "@/lib/queries/getCustomer";
import { getTicket } from "@/lib/queries/getTicket";
import { BackButton } from "@/components/BackButton";
import TicketForm from "@/app/(ts)/tickets/form/TicketForm";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { Users, init as kindeInit } from "@kinde/management-api-js"

// for reference 
// export async function generateMetadata({
//     searchParams,
// }: {
//     searchParams: Promise<{ [key: string]: string | undefined }>
// }) {
//     const { customerId, ticketId } = await searchParams

//     if (!customerId && !ticketId) return {
//         title: 'Missing Ticket ID or Customer ID'
//     }

//     if (customerId) return {
//         title: `New Ticket for Customer #${customerId}`
//     }

//     if (ticketId) return {
//         title: `Edit Ticket #${ticketId}`
//     }
// }

export default async function TicketFormPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    try {

        const { customerId, ticketId } = await searchParams

        // no customer & no ticket = go back!
        if (!customerId && !ticketId) {
            return (
                <>
                    <h2 className="text-2xl mb-2">Ticket ID or Customer ID required to load ticket form</h2>
                    <BackButton title="Go Back" variant="default" />
                </>
            )
        }

        const { getPermission, getUser } = getKindeServerSession()
        const [managerPermission, user] = await Promise.all([
            getPermission("manager"),
            getUser(),
        ])
        const isManager = managerPermission?.isGranted

        // getting a customer ID means new ticket
        if (customerId) {
            const customer = await getCustomer(parseInt(customerId))

            if (!customer) {
                return (
                    <>
                        <h2 className="text-2xl mb-2">Customer ID #{customerId} not found</h2>
                        <BackButton title="Go Back" variant="default" />
                    </>
                )
            }

            // do not return inactive customer
            if (!customer.active) {
                return (
                    <>
                        <h2 className="text-2xl mb-2">Customer ID #{customerId} is not active.</h2>
                        <BackButton title="Go Back" variant="default" />
                    </>
                )
            }

            // return ticket form 
            if (isManager) {
                kindeInit() // kinde Management API
                const { users } = await Users.getUsers() // the techs that are assigned to a ticket

                const techs = users ? users.map(user => ({ id: user.email!, description: user.email!})) : []

                return <TicketForm customer={customer} techs={techs} />
            } else {
                return <TicketForm customer={customer} />
            }
        }

        // getting a ticket ID means editing it
        if (ticketId) {
            const ticket = await getTicket(parseInt(ticketId))

            if (!ticket) {
                return (
                    <>
                        <h2 className="text-2xl mb-2">Ticket ID #{ticketId} not found</h2>
                        <BackButton title="Go Back" variant="default" />
                    </>
                )
            }

            const customer = await getCustomer(ticket.customerId)

            // return to edit ticket form 
            // console.log('ticket: ', ticket)
            // console.log('customer: ', customer)
            if (isManager) {
                kindeInit() // kinde Management API
                const { users } = await Users.getUsers() // the techs that are assigned to a ticket

                const techs = users ? users.map(user => ({ id: user.email!, description: user.email!})) : []

                return <TicketForm customer={customer} ticket={ticket} techs={techs} />
            } else {
                // αν δεν είσαι manager, πρέπει να είσαι ο ίδιος για να κάνεις edit
                const isEditable = user.email?.toLowerCase() === ticket.tech.toLowerCase()
                return <TicketForm customer={customer} ticket={ticket} isEditable={isEditable} />
            }
            // return <TicketForm customer={customer} ticket={ticket} />

        }

    } catch (e) {
        if (e instanceof Error) {
            throw e
        }
    }
}