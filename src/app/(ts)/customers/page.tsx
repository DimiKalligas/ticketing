import CustomerSearch from "./CustomerSearch"
import { searchDBforCus } from "@/lib/queries/getCustomerSearchResults"
import CustomerTable from '@/app/(ts)/customers/CustomerTable'
import CustomerGrid from "./CustomerGrid"

export const metadata = {
  title: 'Customer Search'
}

export default async function Customers({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { searchText } = await searchParams

    if (!searchText) return <CustomerSearch />

    // Τo searchText θα μας το φέρει η φόρμα CustomerSearch που έχει για action εμάς..
    const results = await searchDBforCus(searchText)

    return(
      <>
        <CustomerSearch />
        {/* <p>{JSON.stringify(results)}</p> */}
        {results.length ? <CustomerGrid data={results} /> :(
        // {results.length ? <CustomerTable data={results} /> :(
          <p className="mt-4">No results found.</p>
        ) }
      </>
    )

  }
  