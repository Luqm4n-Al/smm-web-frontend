'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  FiLogOut,
  FiSettings,
  FiUser,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export function AdminMenu() {
  const [isOpen, setIsOpen] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  const pathname =
    usePathname();

  /**
   * CLOSE WHEN ROUTE CHANGES
   */
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  /**
   * CLOSE ON OUTSIDE CLICK
   */
  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  /**
   * LOGOUT
   */
  const handleLogout = () => {
    toast.success(
      'Berhasil logout'
    );

    signOut({
      callbackUrl: '/',
    });
  };

  return (
    <div
      className="relative"
      ref={menuRef}
    >
      {/* AVATAR */}
      <button
        onClick={() =>
          setIsOpen(
            (prev) => !prev
          )
        }
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-blue-100
          font-medium
          text-blue-700
          transition
          hover:bg-blue-200
        "
      >
        A
      </button>

      {/* MENU */}
      {isOpen && (
        <div
          className="
            absolute
            right-0
            mt-3
            z-50
            w-56
            overflow-hidden
            rounded-xl
            border
            border-gray-200
            bg-white
            shadow-xl
          "
        >

          {/* MENU ITEMS */}
          <div className="py-2">
            <Link
              href="/dashboard/profile"
              onClick={() =>
                setIsOpen(false)
              }
              className="
                flex
                items-center
                gap-3
                px-4
                py-2
                text-sm
                text-gray-700
                transition
                hover:bg-gray-50
              "
            >
              <FiUser className="h-4 w-4" />
              Profile
            </Link>

            <Link
              href="/dashboard/settings"
              onClick={() =>
                setIsOpen(false)
              }
              className="
                flex
                items-center
                gap-3
                px-4
                py-2
                text-sm
                text-gray-700
                transition
                hover:bg-gray-50
              "
            >
              <FiSettings className="h-4 w-4" />
              Settings
            </Link>

            <button
              onClick={
                handleLogout
              }
              className="
                flex
                w-full
                items-center
                gap-3
                px-4
                py-2
                text-left
                text-sm
                text-red-600
                transition
                hover:bg-red-50
              "
            >
              <FiLogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}