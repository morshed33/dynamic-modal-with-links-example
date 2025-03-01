import type { Product, CartItem } from "./types"

// Mock data for products
const products: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
    price: 199.99,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "2",
    name: "Smart Watch",
    description: "Track your fitness, receive notifications, and more with this sleek smart watch.",
    price: 249.99,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "3",
    name: "Bluetooth Speaker",
    description: "Portable speaker with amazing sound quality and 12-hour battery life.",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "4",
    name: "Laptop Backpack",
    description: "Durable backpack with padded compartments for your laptop and accessories.",
    price: 59.99,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "5",
    name: "Wireless Charger",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "6",
    name: "Mechanical Keyboard",
    description: "Tactile mechanical keyboard with RGB lighting and programmable keys.",
    price: 129.99,
    image: "/placeholder.svg?height=300&width=300",
  },
]

// Mock cart data
let cartItems: CartItem[] = [
  {
    id: "cart1",
    productId: "1",
    name: "Wireless Headphones",
    price: 199.99,
    quantity: 1,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "cart2",
    productId: "3",
    name: "Bluetooth Speaker",
    price: 89.99,
    quantity: 2,
    image: "/placeholder.svg?height=300&width=300",
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Get all products
export async function getProducts(): Promise<Product[]> {
  await delay(500) // Simulate network delay
  return [...products]
}

// Get a product by ID
export async function getProductById(id: string): Promise<Product> {
  await delay(500) // Simulate network delay
  const product = products.find((p) => p.id === id)

  if (!product) {
    throw new Error(`Product with ID ${id} not found`)
  }

  return { ...product }
}

// Get cart items
export async function getCartItems(): Promise<CartItem[]> {
  await delay(500) // Simulate network delay
  return [...cartItems]
}

// Add item to cart
export async function addToCart(productId: string, quantity: number): Promise<CartItem> {
  await delay(500) // Simulate network delay

  const product = await getProductById(productId)

  // Check if product already in cart
  const existingItemIndex = cartItems.findIndex((item) => item.productId === productId)

  if (existingItemIndex >= 0) {
    // Update quantity if already in cart
    cartItems[existingItemIndex].quantity += quantity
    return { ...cartItems[existingItemIndex] }
  } else {
    // Add new item to cart
    const newItem: CartItem = {
      id: `cart${Date.now()}`,
      productId,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    }

    cartItems.push(newItem)
    return { ...newItem }
  }
}

// Remove item from cart
export async function removeFromCart(itemId: string): Promise<void> {
  await delay(500) // Simulate network delay
  cartItems = cartItems.filter((item) => item.id !== itemId)
}

// Update cart item quantity
export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<CartItem> {
  await delay(500) // Simulate network delay

  const itemIndex = cartItems.findIndex((item) => item.id === itemId)

  if (itemIndex < 0) {
    throw new Error(`Cart item with ID ${itemId} not found`)
  }

  cartItems[itemIndex].quantity = quantity
  return { ...cartItems[itemIndex] }
}

