import React from 'react'

const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <footer className="p-4 bg-gray-900 text-white text-center">
      <p>Copyright &copy; {year} HatchFund. All rights reserved.</p>
    </footer>
  )
}

export default Footer
