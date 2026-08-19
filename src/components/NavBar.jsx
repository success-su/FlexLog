import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Log', end: true },
  { to: '/history', label: 'History' },
  { to: '/progress', label: 'Progress' },
  { to: '/settings', label: 'Settings' },
]

export function NavBar() {
  const containerRef = useRef(null)
  const linkRefs = useRef({})
  const location = useLocation()
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 })

  useEffect(() => {
    function measure() {
      const activeLink = LINKS.find((link) =>
        link.end ? location.pathname === link.to : location.pathname.startsWith(link.to),
      )
      const el = activeLink && linkRefs.current[activeLink.to]
      if (el && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const rect = el.getBoundingClientRect()
        setIndicator({ left: rect.left - containerRect.left, width: rect.width, opacity: 1 })
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [location.pathname])

  return (
    <nav
      ref={containerRef}
      className="relative -mb-px flex gap-1.5 overflow-x-auto border-b border-neutral-200 pb-px dark:border-neutral-800"
    >
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          ref={(el) => {
            linkRefs.current[link.to] = el
          }}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            `focus-ring relative whitespace-nowrap rounded-t-lg px-3.5 py-2 text-sm font-medium transition active:scale-95 ${
              isActive
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
      <span
        className="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-blue-600 transition-all duration-300 ease-out dark:bg-blue-400"
        style={{ left: indicator.left, width: indicator.width, opacity: indicator.opacity }}
      />
    </nav>
  )
}
