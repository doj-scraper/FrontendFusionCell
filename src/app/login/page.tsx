import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

type LoginPageProps = {
  searchParams?: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const callbackUrl = typeof params.callbackUrl === "string" ? params.callbackUrl : "/account";

  return (
    <main className="container px-4 py-10 md:px-6">
      <Card className="mx-auto max-w-md border-yellow-900/30">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Access your wholesale account.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm callbackUrl={callbackUrl} />
          <p className="mt-4 text-sm text-muted-foreground">
            New here?{" "}
            <Link href="/register" className="font-medium text-violet-700 hover:underline">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
