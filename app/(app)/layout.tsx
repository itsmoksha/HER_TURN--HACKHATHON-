"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  Bell,
  Calendar,
  X,
  Info,
  RotateCcw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DemoModeProvider,
  useDemoMode,
} from "@/components/providers/demo-mode-provider"
import { Sidebar } from "@/components/shared/sidebar"
import { Navbar } from "@/components/shared/navbar"
import { RoleSelectionDialog } from "@/components/shared/role-selection-dialog"

// Bottom navigation items for mobile thumbs
const MOBILE_BOTTOM_NAV = [
  { name: "Today", href: "/dashboard", icon: LayoutDashboard },
  { name: "Records", href: "/records", icon: FolderOpen },
  { name: "Assistant", href: "/assistant", icon: MessageSquare, highlight: true },
  { name: "Reminders", href: "/reminders", icon: Bell },
  { name: "Visits", href: "/appointments", icon: Calendar },
]

function AppLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isDemoMode, isBannerDismissed, dismissBanner, resetDemoData } = useDemoMode()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      {/* Demo Mode Banner (Amber, Dismissible) */}
      {isDemoMode && !isBannerDismissed && (
        <div className="relative z-40 bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 sm:px-6 text-xs text-amber-950 dark:text-amber-200 transition-all">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/25 text-amber-900 dark:text-amber-200">
                <Info className="h-3.5 w-3.5" />
              </span>
              <p className="font-sans font-medium">
                <strong className="font-semibold">Interactive Demo Mode:</strong> Viewing
                health profile for Priya Sharma (Managing Hypothyroidism & Bone Density).
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={resetDemoData}
                className="inline-flex items-center gap-1 font-semibold text-amber-900 dark:text-amber-200 hover:underline text-[11px]"
              >
                <RotateCcw className="h-3 w-3" />
                Reset Data
              </button>
              <button
                type="button"
                onClick={dismissBanner}
                className="rounded p-1 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300"
                aria-label="Dismiss banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main App Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar & Mobile Slide-Out Drawer */}
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Content Shell */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Top Navbar */}
          <Navbar
            isMobileSidebarOpen={isMobileSidebarOpen}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          />

          {/* Page Main Content */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 pb-24 md:pb-10">
            {children}
          </main>
        </div>
      </div>

      {/* Role Selection Modal (Self vs Caretaker) */}
      <RoleSelectionDialog />

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 flex md:hidden h-16 items-center justify-around border-t border-border/80 bg-background/95 backdrop-blur-md px-2 shadow-lg"
        aria-label="Mobile Navigation"
      >
        {MOBILE_BOTTOM_NAV.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center py-1 text-center transition-colors focus:outline-none",
                isActive
                  ? "text-plum-950 dark:text-sand-100 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                  item.highlight && !isActive && "bg-plum-100 dark:bg-plum-900/40 text-plum-900",
                  isActive && "bg-plum-950 text-white dark:bg-plum-900 shadow-xs"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoModeProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </DemoModeProvider>
  )
}
