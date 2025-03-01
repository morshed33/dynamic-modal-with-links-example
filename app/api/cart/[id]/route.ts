import { NextResponse } from "next/server"
import { removeFromCart, updateCartItemQuantity } from "@/lib/data"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    await removeFromCart(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json({ error: "Failed to remove item from cart" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { quantity } = body

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: "Valid quantity is required" }, { status: 400 })
    }

    const updatedItem = await updateCartItemQuantity(id, quantity)

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Error updating cart item:", error)
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
  }
}

