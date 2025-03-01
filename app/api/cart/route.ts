import { NextResponse } from "next/server"
import { addToCart } from "@/lib/data"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, quantity } = body

    if (!productId || !quantity) {
      return NextResponse.json({ error: "Product ID and quantity are required" }, { status: 400 })
    }

    const cartItem = await addToCart(productId, quantity)

    return NextResponse.json(cartItem)
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 })
  }
}

