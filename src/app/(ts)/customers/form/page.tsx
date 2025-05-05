// DATA layer
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { getCustomer } from "@/lib/queries/getCustomer";
import { ToastClient } from "@/components/ToastClient";
import { getTicket } from "@/lib/queries/getTicket";
import { getUser } from "@/lib/queries/getUser";
import { BackButton } from "@/components/BackButton";
import CustomerForm from "@/app/(ts)/customers/form/CustomerForm";

// Not needed now
// export async function generateMetadata({
//     searchParams,
// }: {
//     searchParams: Promise<{ [key: string]: string | undefined }>
// }) {
//     const { customerId } = await searchParams

//     if (!customerId) return { title: "New Customer"}

// }

// use: localhost:3000/customers/form?customerId=4
// searchParams are Promises, so, async ->
export default async function CustomerFormPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    // 1. βρίσκω το userId από το session
        const cookie = (await cookies()).get("session")?.value;
        
        const session = await decrypt(cookie);
        console.log("session", session)
        // 2. ο χρήστης με αυτό το userId είναι admin? 
        const user = await getUser(session!.userId as string); // string θα πάει έτσι κι αλλιώς
        
        const canEdit = user.role === "admin";

    try {
        const { customerId } = await searchParams

        if(!canEdit) {
            return (
                <>
                    <ToastClient message="You need Admin rights to edit Customer." />
                    <h2 className="text-2xl mb-2">Access Denied</h2>
                    <BackButton title="Go Back" variant="default" />
                </>
            )
        }

        // βρίσκει τον customer
        if (customerId) {
            const customer = await getCustomer(parseInt(customerId))

            if (!customer) {
                return (
                    <>
                        <h2 className="text-2xl mb-2">Customer ID #{customerId} not found</h2>
                        {/* BackButton needs to be a client component, as it works with the browser's history */}
                        <BackButton title="Go Back" variant="default" />
                    </>
                )
            }
            console.log("user", user)

            // customer exists, so edit
            return <CustomerForm customer={customer}/>
        } else {
            // new customer
            return <CustomerForm />
        }

    } catch (e) {
        if (e instanceof Error) {
            throw e
        }
    }
}