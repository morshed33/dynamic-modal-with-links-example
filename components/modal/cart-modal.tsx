"use client"

import { useState, useEffect } from "react"
import { useModal } from "./modal-provider"
import { getCartItems } from "@/lib/data"
import Image from "next/image"
import type { CartItem } from "@/lib/types"
import Link from "next/link"

export default function CartModal({ id }: { id: string | null }) {
  const { closeModal } = useModal()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCartItems() {
      try {
        setLoading(true)
        const data = await getCartItems()
        setCartItems(data)
        setError(null)
      } catch (err) {
        setError("Failed to load cart items")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadCartItems()
  }, [])

  const removeItem = async (itemId: string) => {
    try {
      // Here you would call your API to remove the item from cart
      await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      })

      // Update local state
      setCartItems(cartItems.filter((item) => item.id !== itemId))
    } catch (err) {
      console.error("Failed to remove item:", err)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      // Here you would call your API to update the quantity
      await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      })

      // Update local state
      setCartItems(cartItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
    } catch (err) {
      console.error("Failed to update quantity:", err)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4">Loading cart...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Error</h2>
        <p className="text-red-500">{error}</p>
        <button onClick={closeModal} className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">
          Close
        </button>
      </div>
    )
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="p-6 w-full max-w-lg">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold">Your Cart</h2>
        <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {cartItems.length === 0 ? (
        <p className="py-4">Your cart is empty.</p>
      ) : (
        <>
          <div className="divide-y">
            {cartItems.map((item) => (
              <div key={item.id} className="py-4 flex">
                <div className="relative h-20 w-20 flex-shrink-0">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 border rounded-l"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-t border-b">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 border rounded-r"
                    >
                      +
                    </button>
                    <button onClick={() => removeItem(item.id)} className="ml-4 text-red-500 text-sm">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <div className="mt-4 flex space-x-4">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Continue Shopping
              </button>
              <Link
                href="/checkout"
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-center"
                onClick={closeModal}
              >
                Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

