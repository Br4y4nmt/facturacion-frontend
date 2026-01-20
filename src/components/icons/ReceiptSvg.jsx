import React from "react";

export default function ReceiptSvg({ className = "", strokeWidth = 2 }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
    >
      {/* Outline */}
      <path
        d="
          M6 2
          H18
          C19.1 2 20 2.9 20 4
          V20
          C20 21.1 19.1 22 18 22
          H6
          C4.9 22 4 21.1 4 20
          V4
          C4 2.9 4.9 2 6 2
          Z

          M6 2
          C7.2 3.2 8.8 3.2 10 2
          C11.2 0.8 12.8 0.8 14 2
          C15.2 3.2 16.8 3.2 18 2

          M6 22
          C7.2 20.8 8.8 20.8 10 22
          C11.2 23.2 12.8 23.2 14 22
          C15.2 20.8 16.8 20.8 18 22
        "
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Lines */}
      <path d="M8 8 H16" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M8 12 H16" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M8 16 H14" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}
