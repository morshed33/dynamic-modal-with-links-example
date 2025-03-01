import Link from "next/link"
import CartItems from "@/components/cart/cart-items"
import { getCartItems } from "@/lib/data"

export default async function CartPage() {
  const cartItems = await getCartItems()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Your Cart</h1>

        <div className="mb-8">
          <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Back to Products
          </Link>
        </div>

        <CartItems items={cartItems} />
      </div>
    </main>
  )
}

