import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Lock, 
  Building2, 
  Phone, 
  MapPin,
  Package,
  Heart,
  Settings,
  LogIn
} from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  return (
    <main className="container py-8 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Account</h1>
        
        <Tabs defaultValue="login" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Create Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Sign In to Your Account
                </CardTitle>
                <CardDescription>
                  Access your wholesale account and order history
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="your@email.com"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="login-password" 
                      type="password" 
                      placeholder="••••••••"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="link" className="px-0 text-primary">
                    Forgot password?
                  </Button>
                </div>
                <Button className="w-full" disabled>
                  Sign In (Coming Soon)
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Need a wholesale account?{" "}
                  <Link href="/contact" className="text-primary hover:underline">
                    Contact us
                  </Link>{" "}
                  to get started.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Create Wholesale Account
                </CardTitle>
                <CardDescription>
                  Register your repair shop or business for wholesale pricing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="register-name" 
                        placeholder="John Doe"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-company">Company Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="register-company" 
                        placeholder="Your Repair Shop"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="register-email" 
                        type="email" 
                        placeholder="your@email.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="register-phone" 
                        type="tel" 
                        placeholder="(555) 123-4567"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="register-password" 
                        type="password" 
                        placeholder="••••••••"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="register-confirm" 
                        type="password" 
                        placeholder="••••••••"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="register-address">Business Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="register-address" 
                      placeholder="123 Main Street, City, State, ZIP"
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button className="w-full" disabled>
                  Create Account (Coming Soon)
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  By creating an account, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Account Features Preview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What You Get With an Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Order History</h3>
                  <p className="text-sm text-muted-foreground">
                    Track all your past orders and reorder with ease
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Wishlist</h3>
                  <p className="text-sm text-muted-foreground">
                    Save your frequently ordered parts for quick access
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Account Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your profile, addresses, and preferences
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Wholesale Pricing</h3>
                  <p className="text-sm text-muted-foreground">
                    Exclusive access to wholesale prices and bulk discounts
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
