"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Chat Rooms</h1>
          <Link
            href="/"
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Back to Home
          </Link>
        </div>

        <nav className="mt-4">
          <ul className="flex space-x-1 border-b">
            <li>
              <Link
                href="/rooms"
                className={`inline-block px-4 py-2 ${
                  pathname === "/rooms"
                    ? "border-b-2 border-blue-500 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                All Rooms
              </Link>
            </li>
            {["room1", "room2", "room3"].map((room) => (
              <li key={room}>
                <Link
                  href={`/rooms/${room}`}
                  className={`inline-block px-4 py-2 ${
                    pathname === `/rooms/${room}`
                      ? "border-b-2 border-blue-500 font-medium"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {room}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
}
