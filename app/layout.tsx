import type { Metadata } from "next";
import "./globals.css";

// make sure this import points to where your CartContext file actually lives:
import { CartProvider } from "@/app/cart/CartContext"; 
// If you move it to components/cart, this becomes:
// import { CartProvider } from "@/components/cart/CartContext";

export const metadata: Metadata = {
  title: "Maya's Cake Cafe",
  description: "Fresh cakes, cupcakes, and custom orders.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
