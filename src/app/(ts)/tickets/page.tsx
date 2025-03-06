import TicketSearch from '@/app/(ts)/tickets/TicketSearch'
import { getOpenTickets } from '@/lib/queries/getOpenTickets'
import { getTicketSearchResults } from '@/lib/queries/getTicketSearchResults'
import TicketTable from '@/app/(ts)/tickets/TicketTable'

export const metadata = {
    title: "Ticket Search",
}

export default async function Tickets({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { searchText } = await searchParams

    // get me all open tickets
    if (!searchText) {
        const results = await getOpenTickets()
        return (
            <>
                <TicketSearch />
                {/* <p>{JSON.stringify(results)}</p> */}
                {results.length ? <TicketTable data={results} /> : <p className="mt-4">No open tickets found</p>}
            </>
        )
    }

    // get me the tickets based on my Search
    const results = await getTicketSearchResults(searchText)

    return (
        <>
            <TicketSearch />
            {/* <p>{JSON.stringify(results)}</p> */}
            {results.length ? <TicketTable data={results} /> : <p className="mt-4">No results found</p>}
        </>
    )
}