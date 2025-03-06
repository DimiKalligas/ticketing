"use client"

import { useFormContext } from "react-hook-form"

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { InputHTMLAttributes } from "react" // needed to extend the props

type Props<S> = { // <S> is for schema
    fieldTitle: string,
    nameInSchema: keyof S & string,
    className?: string, // classname is optional
} & InputHTMLAttributes<HTMLInputElement> // any other props natural to input

export function InputWithLabel<S>({
    fieldTitle, nameInSchema, className, ...props
}: Props<S>) {
    const form = useFormContext()

    return (
        <FormField
            control={form.control}
            name={nameInSchema}
            render={({ field }) => (
                <FormItem>
                    <FormLabel
                        className="text-base"
                        htmlFor={nameInSchema}
                    >
                        {fieldTitle}
                    </FormLabel>

                    <FormControl>
                        <Input
                            id={nameInSchema}
                            className={`w-full max-w-xs disabled:text-blue-500 dark:disabled:text-yellow-300 disabled:opacity-75 ${className}`}
                            {...props}
                            {...field} // handles the onChange and anything else that happens in react-hook-form
                        />
                    </FormControl>
                    
                    <FormMessage /> {/* the validation message */}
                </FormItem>
            )}
        />
    )
}