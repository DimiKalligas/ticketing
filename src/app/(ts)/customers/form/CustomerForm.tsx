"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { InputWithLabel } from "@/components/inputs/InputWithLabel"
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel"
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel"
import { CheckboxWithLabel } from "@/components/inputs/CheckboxWithLabel"

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import { StatesArray } from "@/constants/StatesArray"
import { insertCustomerSchema, type insertCustomerSchemaType, type selectCustomerSchemaType } from "@/zod-schemas/customer"
import { useState } from "react"
import { toast } from "sonner"
import { saveCustomerAction } from "@/app/actions/saveCustomerAction"
import { useRouter } from "next/navigation"
import { upsertCustomer, deleteCustomer } from '@/app/actions/saveCustomerAction'
import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse"

type Props = {
    // customer?: selectCustomerSchemaType, ***
    customer?: insertCustomerSchemaType,
}

export default function CustomerForm({ customer }: Props) {
    const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter()
    const { getPermission, isLoading } = useKindeBrowserClient()
    // isManager could be Admin also
    const isManager = !isLoading && getPermission('manager')?.isGranted
    // getPermissions provides an array of permissions, so this could also work ->
    // const permObj = getPermissions()
    // const isAuthorized = !isLoading && permObj.permissions.some(perm => perm === 'manager' || perm === 'admin')

    const defaultValues: insertCustomerSchemaType = {
        id: customer?.id ?? 0,
        firstName: customer?.firstName ?? '',
        lastName: customer?.lastName ?? '',
        address1: customer?.address1 ?? '',
        address2: customer?.address2 ?? '',
        city: customer?.city ?? '',
        state: customer?.state ?? '',
        zip: customer?.zip ?? '',
        phone: customer?.phone ?? '',
        email: customer?.email ?? '',
        notes: customer?.notes ?? '',
        active: customer?.active ?? true,
    }
    
    // New Customer 
    // All new customers are active by default - no need to set active to true
    // createdAt and updatedAt are set by the database

    const form = useForm<insertCustomerSchemaType>({
        mode: 'onBlur', // user sees the validation as soon as they tab out
        resolver: zodResolver(insertCustomerSchema),
        defaultValues,
    })

    // ***** otan kanoume edit den kalei to server?
    async function submitForm(data: insertCustomerSchemaType) {
        setErrors(null);
        setSuccess(false);
        console.log('form submitted!');
            
        const result = await upsertCustomer(data)
        
        // Ensure we are handling only the correct response
        if (!result || typeof result !== "object") {
            toast.error("Unexpected error occurred.");
            return;
        }
        console.log("Server Response:", result);

        // Handle errors
        if (!result.success) {
            if (result.error && typeof result.error === "object") {
                // Handle validation errors - object containing strings
                // printing an an array of arrays
                const errorMessages = Object.values(result.error)
                // .map((messages) => (Array.isArray(messages) ? messages.join(", ") : messages))
                .flat()
                .join(", ");
                // .join("\n"); // Separate errors by new lines
        
                if (errorMessages) {
                    console.log("Toast triggered:", errorMessages)
                    toast.error(errorMessages); // Show a single toast for all validation errors
                  }
              } else {
                // Handle database errors                
                toast.error(result.message || "Something went wrong");
              }
            // else {
            //   toast.error("An unknown error occurred");
            // }
            return;
          }
      
          toast.success("Customer added successfully!");
          setSuccess(true);
        }   
            
    return (
        <div className="flex flex-col gap-1 sm:px-8">
            {/* <DisplayServerActionResponse result={result} /> */}
            <div>
                <h2 className="text-2xl font-bold">
                {customer?.id ? "Edit" : "New"} Customer {customer?.id ? `#${customer.id}` : "Form"}
                </h2>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submitForm)}
                    className="flex flex-col md:flex-row gap-4 md:gap-8"
                >
                    {/* 1st column in our form */}
                    <div className="flex flex-col gap-4 w-full max-w-xs">
                        <InputWithLabel<insertCustomerSchemaType>
                            fieldTitle='First Name'
                            nameInSchema='firstName' // firstName is in the Schema
                        />
                        <InputWithLabel<insertCustomerSchemaType>
                            fieldTitle='Last Name'
                            nameInSchema='lastName' // lastName is in the Schema
                        />
                        <InputWithLabel<insertCustomerSchemaType>
                            fieldTitle='Address 1'
                            nameInSchema='address1'
                        />
                        <InputWithLabel<insertCustomerSchemaType>
                            fieldTitle='Address 2'
                            nameInSchema='address2'
                        />
                        <InputWithLabel<insertCustomerSchemaType>
                            fieldTitle='City'
                            nameInSchema='city'
                        />
                        <SelectWithLabel<insertCustomerSchemaType>
                            fieldTitle='State'
                            nameInSchema='state'
                            data={StatesArray}
                        />
                    </div>

                    {/* 2nd column */}
                    <div className="flex flex-col gap-4 w-full max-w-xs">
                        <InputWithLabel<insertCustomerSchemaType>
                                fieldTitle='Zip Code'
                                nameInSchema='zip'
                        />
                        <InputWithLabel<insertCustomerSchemaType>
                                fieldTitle='Email'
                                nameInSchema='email'
                        />
                        <InputWithLabel<insertCustomerSchemaType>
                                fieldTitle='Phone'
                                nameInSchema='phone'
                        />

                        <TextAreaWithLabel<insertCustomerSchemaType>
                            fieldTitle='Notes'
                            nameInSchema='notes'
                            className="h-40"
                        />

                        {isLoading ? <p>Loading...</p> : isManager && customer?.id ? (
                            <CheckboxWithLabel<insertCustomerSchemaType>
                                fieldTitle="Active"
                                nameInSchema="active"
                                message="Yes"
                            />) : null}

                        <div className="flex gap-2">
                            <Button
                                type='submit'
                                className="w-3/4" // leave out a 1/4 for the Reset
                                variant='default'
                                title='Save'>
                                    Save
                            </Button>
                            <Button
                                type='button'
                                variant='destructive'
                                title='Reset'
                                onClick={() => form.reset(defaultValues)}>
                                Reset
                            </Button>
                        </div>
                    </div>

                    {/* <p>{JSON.stringify(form.getValues())}</p> */}

                </form>
            </Form>

        </div>
    )
}