'use server'

import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { z } from 'zod'
import { getUser } from '@/lib/queries/getUser';

const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address'}).trim(),
    password:z
    .string()
    .min(3, { message: 'Password must be at least 3 characters'})
    .trim(),
})

// κάνει check τα email & password αν ταιριάζουν με αυτά του καρφωτού testUser
export async function login(prevState: any, formData: FormData) {
    // convert formData into Object and safe parsing it into loginschema
    const result = loginSchema.safeParse(Object.fromEntries(formData));
  
    if (!result.success) {
      console.log('failed in safeParse');
      
      return {
        errors: result.error.flatten().fieldErrors,
      };
    }
  
    const { email, password } = result.data;
    const user = await getUser({ id: session!.userId as number });
  
    if (email !== user.email || password !== user.password) {
      return {
        errors: {
          email: ["Invalid email or password"],
        },
      };
    }
  
  // create session for user & store it in cookie
    await createSession(user.id.toString());
  
    redirect("/tickets");
  }
  
  export async function logout() {
    await deleteSession();
    redirect("/login");
  }