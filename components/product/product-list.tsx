"use client"

import type { Product } from "@/lib/types"
import { useModal } from "@/components/modal/modal-provider"
import Image from "next/image"

export default function ProductList({ products }: { products: Product[] }) {
  const { openModal } = useModal()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="relative h-48 w-full">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>
          <div className="p-4">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-600 mt-1">${product.price.toFixed(2)}</p>
            <button
              onClick={() => openModal("product", product.id)}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors w-full"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

