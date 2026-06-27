import React from 'react'

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
      <p>&copy; {year} AquaMind-AI. All rights reserved.</p>
    </footer>
  )
}
