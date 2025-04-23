"use client"

import { useFormStatus } from "react-dom"
import { LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SearchButton() {
    const { pending } = useFormStatus() // gives status information of the last form submission

    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-20"
        >
            {pending ? (
                <LoaderCircle className="animate-spin" />
            ) : "Search"}
        </Button>
    )
}