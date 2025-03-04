"use client";

import type React from "react";

import { useModal } from "./modal-provider";
import ProductModal from "./product-modal";
import CartModal from "./cart-modal";
import { useEffect } from "react";

export default function ModalManager() {
  const { modalType, modalId, isOpen, closeModal } = useModal();

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, closeModal]);

  useEffect(() => {
    let scrollPosition = 0;

    if (isOpen) {
      // Store the current scroll position
      scrollPosition = window.scrollY;

      // Add a class to the body to prevent scrolling but maintain position
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = "100%";
    }

    return () => {
      // Restore scrolling and position when modal closes
      if (isOpen) {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollPosition);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Backdrop click handler
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeModal();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto"
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
      }}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] m-auto my-8 overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {modalType === "product" && <ProductModal id={modalId} />}
        {modalType === "cart" && <CartModal id={modalId} />}
      </div>
    </div>
  );
}
