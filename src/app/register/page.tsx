import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="container px-4 py-10 md:px-6">
      <Card className="mx-auto max-w-md border-yellow-900/30">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Set up your FusionCell wholesale profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <p className="mt-4 text-sm text-muted-foreground">
            Already registered? <Link href="/login" className="font-medium text-violet-700 hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
