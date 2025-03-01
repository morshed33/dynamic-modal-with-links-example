"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import ModalManager from "./modal-manager"

type ModalType = "product" | "cart" | null
type ModalContextType = {
  openModal: (type: ModalType, id?: string) => void
  closeModal: () => void
  modalType: ModalType
  modalId: string | null
  isOpen: boolean
}

const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
  modalType: null,
  modalId: null,
  isOpen: false,
})

export const useModal = () => useContext(ModalContext)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalType, setModalType] = useState<ModalType>(null)
  const [modalId, setModalId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Check URL for modal parameters on initial load and when URL changes
  useEffect(() => {
    const modal = searchParams.get("modal")
    const id = searchParams.get("id")

    if (modal) {
      setModalType(modal as ModalType)
      setModalId(id)
      setIsOpen(true)
    } else {
      setModalType(null)
      setModalId(null)
      setIsOpen(false)
    }
  }, [searchParams])

  const openModal = useCallback(
    (type: ModalType, id?: string) => {
      // Create a new URLSearchParams instance
      const params = new URLSearchParams(searchParams.toString())

      // Update the parameters
      if (type) {
        params.set("modal", type)
        if (id) params.set("id", id)
      } else {
        params.delete("modal")
        params.delete("id")
      }

      // Update the URL
      const newUrl = `${pathname}?${params.toString()}`
      router.push(newUrl)

      // Update state
      setModalType(type)
      setModalId(id || null)
      setIsOpen(!!type)
    },
    [pathname, router, searchParams],
  )

  const closeModal = useCallback(() => {
    // Create a new URLSearchParams instance
    const params = new URLSearchParams(searchParams.toString())

    // Remove modal parameters
    params.delete("modal")
    params.delete("id")

    // Update the URL
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.push(newUrl)

    // Update state
    setModalType(null)
    setModalId(null)
    setIsOpen(false)
  }, [pathname, router, searchParams])

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalType, modalId, isOpen }}>
      {children}
      <ModalManager />
    </ModalContext.Provider>
  )
}

