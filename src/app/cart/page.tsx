import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  Package,
  CreditCard,
  Truck
} from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  // Placeholder cart - in real app this would come from state/database
  const hasItems = false;

  return (
    <main className="container py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <ShoppingCart className="h-8 w-8" />
          Shopping Cart
        </h1>

        {hasItems ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">iPhone 13 Pro OLED Screen Assembly - Black</h3>
                      <p className="text-sm text-muted-foreground">SKU: FC-IP13P-SCR-OLED-BLK</p>
                      <p className="text-sm text-muted-foreground">Quality: OEM</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" disabled>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">1</span>
                      <Button variant="outline" size="icon" disabled>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">$89.99</p>
                      <Button variant="ghost" size="sm" className="text-destructive" disabled>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal (1 item)</span>
                    <span>$89.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>$89.99</span>
                  </div>
                  <Button className="w-full" disabled>
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Link href="/" className="block">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven&apos;t added any parts to your cart yet.
              </p>
              <Link href="/">
                <Button size="lg">
                  Browse Our Catalog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Truck className="h-8 w-8 mx-auto text-primary mb-4" />
              <h3 className="font-semibold mb-2">Fast Shipping</h3>
              <p className="text-sm text-muted-foreground">
                Same-day shipping on orders placed before 3 PM EST
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CreditCard className="h-8 w-8 mx-auto text-primary mb-4" />
              <h3 className="font-semibold mb-2">Secure Checkout</h3>
              <p className="text-sm text-muted-foreground">
                Your payment information is always safe and secure
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 mx-auto text-primary mb-4" />
              <h3 className="font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-sm text-muted-foreground">
                30-day return policy on all parts
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
