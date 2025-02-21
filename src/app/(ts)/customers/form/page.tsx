// DATA layer
import { getCustomer } from "@/lib/queries/getCustomer";
import { BackButton } from "@/components/BackButton";
import CustomerForm from "@/app/(ts)/customers/form/CustomerForm";

// use: localhost:3000/customers/form?customerId=4
// searchParams are Promises, so, async ->
export default async function CustomerFormPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    try {
        const { customerId } = await searchParams

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
            console.log(customer)
            // edit customer form component 
            return <CustomerForm customer={customer}/>
        } else {
            // new customer form component 
            return <CustomerForm />
        }

    } catch (e) {
        if (e instanceof Error) {
            throw e
        }
    }
}