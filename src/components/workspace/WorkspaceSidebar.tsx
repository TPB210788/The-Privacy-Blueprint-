'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

interface NavItem {
  suffix:  string
  label:   string
  live:    boolean
  icon:    React.ReactNode
}

function makeNav(base: string): NavItem[] {
  return [
    {
      suffix: '',
      label:  'Dashboard',
      live:   true,
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="1" y="1" width="5" height="5" rx="0.75" />
          <rect x="8" y="1" width="5" height="5" rx="0.75" />
          <rect x="1" y="8" width="5" height="5" rx="0.75" />
          <rect x="8" y="8" width="5" height="5" rx="0.75" />
        </svg>
      ),
    },
    {
      suffix: '/ropa',
      label:  'ROPA',
      live:   true,
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M2 3h10M2 7h10M2 11h6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      suffix: '/dpia',
      label:  'DPIAs',
      live:   false,
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M7 1v6l3.5 2" strokeLinecap="round" />
          <circle cx="7" cy="8" r="6" />
        </svg>
      ),
    },
    {
      suffix: '/dsr',
      label:  'DSR Inbox',
      live:   false,
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="1" y="3" width="12" height="9" rx="1" />
          <path d="M1 4l6 5 6-5" />
        </svg>
      ),
    },
    {
      suffix: '/vendors',
      label:  'Vendors',
      live:   false,
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M1 11V5l6-4 6 4v6H1Z" />
          <path d="M5 11V8h4v3" />
        </svg>
      ),
    },
    {
      suffix: '/data-assets',
      label:  'Data Assets',
      live:   false,
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
          <ellipse cx="7" cy="4" rx="5" ry="2" />
          <path d="M2 4v3c0 1.1 2.24 2 5 2s5-.9 5-2V4" />
          <path d="M2 7v3c0 1.1 2.24 2 5 2s5-.9 5-2V7" />
        </svg>
      ),
    },
    {
      suffix: '/policies',
      label:  'Policies',
      live:   false,
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M3 1h8l2 2v10H1V1h2Z" />
          <path d="M3 7h8M3 10h5M8 1v3h4" />
        </svg>
      ),
    },
    {
      suffix: '/cookie',
      label:  'Cookie Banner',
      live:   false,
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="7" cy="7" r="6" />
          <circle cx="5" cy="6" r="0.75" fill="currentColor" />
          <circle cx="9" cy="5" r="0.75" fill="currentColor" />
          <circle cx="8" cy="9" r="0.75" fill="currentColor" />
        </svg>
      ),
    },
    {
      suffix: '/reports',
      label:  'Reports',
      live:   false,
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M2 11V7h2.5V11M5.75 11V5H8.25V11M9.5 11V3H12V11" />
          <path d="M1 11h12" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      suffix: '/settings',
      label:  'Settings',
      live:   false,
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="7" cy="7" r="2" />
          <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.9 2.9l1 1M10.1 10.1l1 1M10.1 2.9l-1 1M3.9 10.1l-1 1" strokeLinecap="round" />
        </svg>
      ),
    },
  ]
}

interface Props {
  workspaceId:   string
  workspaceName: string
  orgType:       string
}

export default function WorkspaceSidebar({ workspaceId, workspaceName, orgType }: Props) {
  const pathname = usePathname()
  const base     = `/workspace/${workspaceId}`
  const nav      = makeNav(base)

  return (
    <aside
      className="w-56 min-h-screen border-r flex flex-col flex-shrink-0"
      style={{ backgroundColor: '#EDE8E1', borderColor: 'rgba(139,115,85,0.15)' }}
    >
      {/* Back link (agency only) */}
      {orgType === 'AGENCY' && (
        <div className="px-4 pt-4">
          <Link
            href="/agency"
            className="text-xs transition-colors hover:underline"
            style={{ color: 'rgba(44,44,44,0.45)' }}
          >
            ← All clients
          </Link>
        </div>
      )}

      {/* Workspace name */}
      <div className="px-5 py-4 border-b mt-2" style={{ borderColor: 'rgba(139,115,85,0.12)' }}>
        <span className="font-playfair text-sm font-semibold block leading-snug" style={{ color: '#2C2C2C' }}>
          {workspaceName}
        </span>
        <span className="text-xs mt-0.5 block" style={{ color: 'rgba(44,44,44,0.4)' }}>Workspace</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {nav.map(item => {
          const href     = `${base}${item.suffix}`
          const isActive = item.suffix === '' ? pathname === href : pathname.startsWith(href)

          if (!item.live) {
            return (
              <div
                key={item.suffix}
                className="flex items-center gap-2.5 px-3 py-2 rounded text-sm"
                style={{ color: 'rgba(44,44,44,0.32)' }}
              >
                {item.icon}
                <span>{item.label}</span>
                <span
                  className="ml-auto text-xs rounded px-1 py-0.5 border"
                  style={{ color: 'rgba(44,44,44,0.3)', borderColor: 'rgba(44,44,44,0.15)' }}
                >
                  Soon
                </span>
              </div>
            )
          }

          return (
            <Link
              key={item.suffix}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors"
              style={{
                backgroundColor: isActive ? '#8B7355' : 'transparent',
                color:           isActive ? '#fff'    : 'rgba(44,44,44,0.6)',
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t flex items-center gap-3" style={{ borderColor: 'rgba(139,115,85,0.12)' }}>
        <UserButton afterSignOutUrl="/" />
        <span className="text-xs truncate" style={{ color: 'rgba(44,44,44,0.5)' }}>Account</span>
      </div>
    </aside>
  )
}
