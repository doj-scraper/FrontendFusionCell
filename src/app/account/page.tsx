import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Package, Settings, Heart, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";

const accountFeatureCards = [
  {
    title: "Order History",
    description: "Track and review your past wholesale orders.",
    icon: Package,
  },
  {
    title: "Saved Items",
    description: "Keep commonly ordered parts ready for faster checkout.",
    icon: Heart,
  },
  {
    title: "Account Settings",
    description: "Maintain contact info and business details in one place.",
    icon: Settings,
  },
  {
    title: "Wholesale Profile",
    description: "Manage your repair shop profile and purchasing preferences.",
    icon: Building2,
  },
];

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  return (
    <main className="container px-4 py-10 md:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card className="border-yellow-900/30">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Signed in as {session.user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{session.user.name || "Not set"}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium">{session.user.role}</p>
            </div>
            <div className="flex items-center justify-between">
              <Link href="/cart" className="text-sm font-medium text-violet-700 hover:underline">
                Continue to cart
              </Link>
              <SignOutButton />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account features</CardTitle>
            <CardDescription>Capabilities available in your wholesale account experience.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {accountFeatureCards.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="flex items-start gap-3 rounded-lg border border-border p-4">
                    <div className="rounded-md bg-violet-100 p-2 text-violet-800">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{feature.title}</p>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
