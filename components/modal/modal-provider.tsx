"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import ModalManager from "./modal-manager";

type ModalType = "product" | "cart" | null;
type ModalContextType = {
  openModal: (type: ModalType, id?: string) => void;
  closeModal: () => void;
  modalType: ModalType;
  modalId: string | null;
  isOpen: boolean;
};

const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
  modalType: null,
  modalId: null,
  isOpen: false,
});

export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalId, setModalId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Use window.location.search to get query params (only on client)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const modal = params.get("modal");
    const id = params.get("id");

    if (modal) {
      setModalType(modal as ModalType);
      setModalId(id);
      setIsOpen(true);
    } else {
      setModalType(null);
      setModalId(null);
      setIsOpen(false);
    }
  }, [pathname]); // re-run when the pathname changes

  const openModal = useCallback(
    (type: ModalType, id?: string) => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("scrollPosition", window.scrollY.toString());
      }

      // Use the current window.location.search as a starting point
      const params = new URLSearchParams(window.location.search);

      if (type) {
        params.set("modal", type);
        if (id) params.set("id", id);
      } else {
        params.delete("modal");
        params.delete("id");
      }

      const newUrl = `${pathname}?${params.toString()}`;
      router.push(newUrl, { scroll: false });

      setModalType(type);
      setModalId(id || null);
      setIsOpen(!!type);
    },
    [pathname, router]
  );

  const closeModal = useCallback(() => {
    const params = new URLSearchParams(window.location.search);

    params.delete("modal");
    params.delete("id");

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(newUrl, { scroll: false });

    setModalType(null);
    setModalId(null);
    setIsOpen(false);

    // Restore scroll position after modal closes
    setTimeout(() => {
      if (typeof window !== "undefined") {
        const scrollY = sessionStorage.getItem("scrollPosition");
        if (scrollY) {
          window.scrollTo(0, Number.parseInt(scrollY));
        }
      }
    }, 0);
  }, [pathname, router]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalType, modalId, isOpen }}>
      {children}
      <ModalManager />
    </ModalContext.Provider>
  );
}
