"use client"

import { useRef, useActionState} from "react";
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {  Input} from "@/components/ui/input"
import { formSchema } from "@/lib/schema"
import { onFormSubmit } from "@/app/actions"

export default function MyForm() {
  const [state, formAction, pending] = useActionState(onFormSubmit, {
    message: "",
    issues: []
  });

  const form = useForm < z.infer < typeof formSchema >> ({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    }
  })

  // function onSubmit(values: z.infer < typeof formSchema > ) {
  const onSubmit = async (values: z.infer <typeof formSchema> ) => {
    try {
      console.log('Here are the values im sending', values);
      // ή το καλούμε από εδώ, ή από τη φόρμα action={formAction} 
      // για να έχουμε τα state & pending του hook
      // const response = await onFormSubmit(values);

      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Form {...form}>
      <div>{state?.message}</div>
      <div>{state?.issues}</div>
      <form 
        // ref={formRef}
        // client-side validation
        onSubmit={form.handleSubmit(onSubmit)}
        // client-side validation με useRef
        // onSubmit={form.handleSubmit(() => formRef?.current?.submit())}
        // server-side validation
        action={formAction} 
        className="space-y-4 max-w-3xl mx-auto py-10">
        
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input 
                placeholder="shadcn"
                
                type=""
                {...field} 
                value={field.value ?? ''} // για να μη βγάλει error / το '' είναι initial value
                />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input 
                placeholder="email" {...field}
                type="" {...field}  // email
                // 
                value={field.value ?? ''} // για να μη βγάλει error / το '' είναι initial value
                />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              {/* <FormMessage>{state?.issues?.email}</FormMessage> */}
            </FormItem>
          )}
        />
        {/* disabled={pending} */}
        <Button type="submit" >Submit</Button>
      </form>
    </Form>
  )
}