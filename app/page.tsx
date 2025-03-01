import Link from "next/link"
import ProductList from "@/components/product/product-list"
import { getProducts } from "@/lib/data"

export default async function Home() {
  const products = await getProducts()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Next.js Modal System</h1>

        <div className="mb-8">
          <Link href="/cart" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            View Cart
          </Link>
        </div>

        <ProductList products={products} />
      </div>
    </main>
  )
}

