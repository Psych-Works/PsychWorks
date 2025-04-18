"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

interface AuthFormProps {
  defaultTab?: "signin" | "signup";
}

export function AuthForm({ defaultTab = "signin" }: AuthFormProps) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );

  // Check for the `confirmed` query parameter
  useEffect(() => {
    const confirmed = searchParams.get("confirmed");
    if (confirmed === "true") {
      setConfirmationMessage("Email confirmed successfully! Please log in.");
    }
  }, [searchParams]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(
    values: z.infer<typeof formSchema>,
    type: "signin" | "signup"
  ) {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint =
        type === "signin" ? "/api/auth/sign-in" : "/api/auth/sign-up";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Handle email confirmation message
      if (type === "signup" && data.message) {
        setConfirmationMessage(data.message);
        return;
      }

      // Force a full page reload to trigger middleware
      window.location.href = "/assessments";
    } catch (error) {
      console.error("Authentication error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Welcome to PsychWorks</CardTitle>
        <CardDescription>
          {defaultTab === "signin"
            ? "Sign In to your account"
            : "Create a new account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin" asChild>
              <Link href="/sign-in">Sign In</Link>
            </TabsTrigger>
            <TabsTrigger value="signup" asChild>
              <Link href="/sign-up">Sign Up</Link>
            </TabsTrigger>
          </TabsList>

          {/* Confirmation Message */}
          {confirmationMessage && (
            <div className="mt-4 text-sm text-green-600">
              {confirmationMessage}
            </div>
          )}

          {/* Error Message */}
          {error && <div className="mt-4 text-sm text-red-500">{error}</div>}

          <TabsContent value="signin">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((values) =>
                  onSubmit(values, "signin")
                )}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="text-right text-sm">
                  <Link
                    href="/forgot-password"
                    className="hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="signup">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((values) =>
                  onSubmit(values, "signup")
                )}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Create a password (min. 8 characters)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Sign Up"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}