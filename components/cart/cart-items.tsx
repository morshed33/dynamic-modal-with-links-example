"use client"

import type { CartItem } from "@/lib/types"
import { useModal } from "@/components/modal/modal-provider"
import Image from "next/image"
import Link from "next/link"

export default function CartItems({ items }: { items: CartItem[] }) {
  const { openModal } = useModal()

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="mb-4">Your cart is empty</p>
          <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="divide-y">
            {items.map((item) => (
              <div key={item.id} className="py-4 flex">
                <div className="relative h-24 w-24 flex-shrink-0">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  <p className="text-sm">Quantity: {item.quantity}</p>
                  <div className="mt-2">
                    <button
                      onClick={() => openModal("product", item.productId)}
                      className="text-blue-500 text-sm hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <div className="mt-6">
              <Link
                href="/checkout"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-center block"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={() => openModal("cart")}
                className="w-full mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Quick Cart View
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

