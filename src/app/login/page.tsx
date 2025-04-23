"use client";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "./actions";

export default function LoginPage() {
  const [state, loginAction] = useActionState(login, undefined);

  return (
    <div className="flex justify-center mt-20">
    <form action={loginAction} className="flex max-w-[300px] flex-col gap-2 justify-center">
      <Card className="max-w-md w-full mx-auto justify-center">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">. . . . . . . . . . . . . . . . . . . . . </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Please enter email and password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-2">
            <Input id="email" name="email" placeholder="Email" />
          </div>
          {state?.errors?.email && (
            <p className="text-red-500">{state.errors.email}</p>
          )}

          <div className="flex flex-col gap-2 my-5">
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
            />
          </div>
          {state?.errors?.password && (
            <p className="text-red-500">{state.errors.password}</p>
          )}
          <SubmitButton />
        </CardContent>
      </Card>
    </form>
    </div>
  );
}

// na valw to pending sth useActionState
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" variant="outline" className="w-full">
      Login
    </Button>
  );
}