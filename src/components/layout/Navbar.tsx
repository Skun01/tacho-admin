import { useState, useEffect } from 'react'
import { Link } from 'react-router'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-surface/80 backdrop-blur-[12px] shadow-[0_4px_32px_0_rgba(29,28,19,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-8 py-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-['Kiwi_Maru'] text-xl font-medium text-primary">
            太
          </span>
          <span className="text-lg font-semibold tracking-wide text-primary">
            Tacho
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <Link
            to="/login"
            className="text-sm font-medium text-secondary transition-colors hover:text-primary"
          >
            Đăng nhập
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-gradient-to-r from-primary to-primary-container px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Bắt đầu miễn phí
          </Link>
        </div>
      </nav>
    </header>
  )
}
