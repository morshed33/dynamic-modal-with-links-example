"use client"

import { useState, useEffect } from "react"
import { useModal } from "./modal-provider"
import { getProductById } from "@/lib/data"
import Image from "next/image"
import type { Product } from "@/lib/types"

export default function ProductModal({ id }: { id: string | null }) {
  const { closeModal } = useModal()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    async function loadProduct() {
      if (!id) {
        setError("Product ID is missing")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await getProductById(id)
        setProduct(data)
        setError(null)
      } catch (err) {
        setError("Failed to load product")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  const addToCart = async () => {
    if (!product) return

    try {
      // Here you would call your API to add the product to cart
      await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      })

      // Show success message or redirect
      closeModal()
    } catch (err) {
      console.error("Failed to add to cart:", err)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4">Loading product...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Error</h2>
        <p className="text-red-500">{error || "Product not found"}</p>
        <button onClick={closeModal} className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">
          Close
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold">{product.name}</h2>
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

      <div className="mb-4 relative h-64 w-full">
        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain" />
      </div>

      <p className="text-lg font-bold mb-2">${product.price.toFixed(2)}</p>
      <p className="mb-4">{product.description}</p>

      <div className="flex items-center mb-4">
        <label htmlFor="quantity" className="mr-2">
          Quantity:
        </label>
        <div className="flex items-center border rounded">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 border-r">
            -
          </button>
          <span className="px-3 py-1">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 border-l">
            +
          </button>
        </div>
      </div>

      <button
        onClick={addToCart}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Add to Cart
      </button>
    </div>
  )
}

