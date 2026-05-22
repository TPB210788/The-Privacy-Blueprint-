'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

const NAV = [
  {
    href:  '/agency',
    label: 'Client Workspaces',
    icon:  (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="1" y="1" width="5.5" height="5.5" rx="1" />
        <rect x="8.5" y="1" width="5.5" height="5.5" rx="1" />
        <rect x="1" y="8.5" width="5.5" height="5.5" rx="1" />
        <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" />
      </svg>
    ),
    exact: true,
  },
  {
    href:  '/agency/reports',
    label: 'Reports',
    icon:  (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M2 13V5l5-4 5 4v8H2Z" />
        <path d="M5.5 13V9h4v4" />
      </svg>
    ),
  },
  {
    href:  '/agency/dpa-register',
    label: 'DPA Register',
    icon:  (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M4 1h7l3 3v10H1V1h3Z" />
        <path d="M4 8h7M4 11h5M7 1v4h4" />
      </svg>
    ),
  },
  {
    href:  '/agency/settings',
    label: 'Settings',
    icon:  (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="7.5" cy="7.5" r="2" />
        <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M2.9 2.9l1 1M11.1 11.1l1 1M11.1 2.9l-1 1M3.9 11.1l-1 1" />
      </svg>
    ),
  },
]

interface Props {
  orgName: string
  brandName?: string | null
}

export default function AgencySidebar({ orgName, brandName }: Props) {
  const pathname = usePathname()

  return (
    <aside
      className="w-56 min-h-screen border-r flex flex-col flex-shrink-0"
      style={{ backgroundColor: '#EDE8E1', borderColor: 'rgba(139,115,85,0.15)' }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(139,115,85,0.12)' }}>
        <span className="font-playfair text-base font-semibold block leading-tight" style={{ color: '#8B7355' }}>
          {brandName || orgName || 'The Privacy Blueprint'}
        </span>
        <span className="text-xs mt-0.5 block" style={{ color: 'rgba(44,44,44,0.4)' }}>
          Agency Platform
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(item => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors"
              style={{
                backgroundColor: active ? '#8B7355' : 'transparent',
                color: active ? '#fff' : 'rgba(44,44,44,0.6)',
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div
        className="p-4 border-t flex items-center gap-3"
        style={{ borderColor: 'rgba(139,115,85,0.12)' }}
      >
        <UserButton afterSignOutUrl="/" />
        <span className="text-xs truncate" style={{ color: 'rgba(44,44,44,0.5)' }}>Account</span>
      </div>
    </aside>
  )
}
