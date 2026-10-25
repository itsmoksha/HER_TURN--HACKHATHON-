"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  Bell,
  Calendar,
  Users,
  Shield,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  Settings,
  User,
  Heart,
  X,
  Sparkles,
} from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useDemoMode } from "@/components/providers/demo-mode-provider"

export interface SidebarProps {
  isMobileOpen?: boolean
  onMobileClose?: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  className?: string
}

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Records", href: "/records", icon: FolderOpen },
  { name: "AI Assistant", href: "/assistant", icon: MessageSquare, badge: "AI" },
  { name: "Reminders", href: "/reminders", icon: Bell },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Trusted Access", href: "/trusted", icon: Users },
  { name: "Privacy & Control", href: "/privacy", icon: Shield },
]

export function Sidebar({
  isMobileOpen = false,
  onMobileClose,
  isCollapsed = false,
  onToggleCollapse,
  className,
}: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { patient, language, setLanguage } = useDemoMode()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  const handleSignOut = () => {
    setShowUserMenu(false)
    if (onMobileClose) onMobileClose()
    router.push("/dashboard")
  }

  // Sidebar content rendered for both desktop and mobile
  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto overflow-x-hidden p-4">
      {/* Top Header & Brand Logo */}
      <div>
        <div className="flex items-center justify-between gap-3 px-2 py-2 mb-6">
          <Link
            href="/dashboard"
            onClick={onMobileClose}
            className="flex items-center gap-2.5 focus:outline-none"
          >
            {/* Logo Mark */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-plum-950 text-white shadow-md dark:bg-plum-900">
              <Heart className="h-5 w-5 fill-rose-soft text-rose-soft transition-transform group-hover:scale-110" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-tight text-plum-950 dark:text-sand-100 leading-none">
                  HER TURN
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">
                  Healthcare Companion
                </span>
              </div>
            )}
          </Link>

          {/* Close button for mobile drawer */}
          {onMobileClose && (
            <button
              type="button"
              onClick={onMobileClose}
              className="inline-flex md:hidden rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Desktop collapse toggle */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden md:inline-flex rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-900",
                  isActive
                    ? "bg-plum-950 text-white shadow-sm dark:bg-plum-900"
                    : "text-muted-foreground hover:bg-plum-50/80 hover:text-plum-950 dark:hover:bg-muted dark:hover:text-foreground"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform group-hover:scale-105",
                    isActive
                      ? "text-rose-soft"
                      : "text-muted-foreground group-hover:text-plum-950 dark:group-hover:text-sand-100"
                  )}
                />

                {!isCollapsed && (
                  <span className="flex-1 truncate">{item.name}</span>
                )}

                {!isCollapsed && item.badge && (
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-sand-100 text-plum-950 dark:bg-sand-200/20 dark:text-sand-200"
                    )}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Subtle active pill indicator on left for collapsed mode */}
                {isCollapsed && isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-rose-soft" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Footer Controls: Language, Theme, User Avatar */}
      <div className="space-y-3 pt-4 border-t border-border/60">
        {/* Language & Theme Strip */}
        <div
          className={cn(
            "flex items-center gap-2",
            isCollapsed ? "flex-col justify-center" : "justify-between"
          )}
        >
          {/* Language Selector */}
          {!isCollapsed ? (
            <div className="inline-flex rounded-xl bg-muted/60 p-1 border border-border/50 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={cn(
                  "rounded-lg px-2 py-1 transition-all",
                  language === "en"
                    ? "bg-plum-950 text-white shadow-xs dark:bg-plum-800"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                className={cn(
                  "rounded-lg px-2 py-1 transition-all",
                  language === "hi"
                    ? "bg-plum-950 text-white shadow-xs dark:bg-plum-800"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                हि
              </button>
              <button
                type="button"
                onClick={() => setLanguage("kn")}
                className={cn(
                  "rounded-lg px-2 py-1 transition-all",
                  language === "kn"
                    ? "bg-plum-950 text-white shadow-xs dark:bg-plum-800"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                ಕ
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                setLanguage(language === "en" ? "hi" : language === "hi" ? "kn" : "en")
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-xs font-bold text-foreground"
              title={`Current language: ${language.toUpperCase()}`}
            >
              {language === "en" ? "EN" : language === "hi" ? "हि" : "ಕ"}
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-900"
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            title={isDark ? "Light theme" : "Dark theme"}
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-plum-950" />
            )}
          </button>
        </div>

        {/* User Profile Card & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors hover:bg-muted/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-900",
              isCollapsed && "justify-center"
            )}
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-plum-950 font-serif text-sm font-semibold text-white shadow-sm ring-2 ring-rose-soft/40">
              {patient.preferredName.charAt(0)}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>

            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-foreground">
                  {patient.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {patient.primaryCondition.split("&")[0]}
                </p>
              </div>
            )}
          </button>

          {/* User Profile Dropdown */}
          <AnimatePresence>
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "absolute bottom-full mb-2 z-50 rounded-2xl border border-border bg-card p-2 shadow-xl",
                    isCollapsed ? "left-12 w-56" : "left-0 right-0 w-full"
                  )}
                >
                  <div className="px-3 py-2 border-b border-border/50">
                    <p className="text-xs font-semibold text-foreground">
                      {patient.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      priya.sharma@example.com
                    </p>
                    <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-plum-900 dark:text-rose-soft font-semibold">
                      <Sparkles className="h-3 w-3" />
                      Care Plan Active
                    </span>
                  </div>

                  <div className="mt-1 space-y-0.5">
                    <Link
                      href="/privacy"
                      onClick={() => {
                        setShowUserMenu(false)
                        if (onMobileClose) onMobileClose()
                      }}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Health Profile</span>
                    </Link>

                    <Link
                      href="/privacy"
                      onClick={() => {
                        setShowUserMenu(false)
                        if (onMobileClose) onMobileClose()
                      }}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Account Settings</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col shrink-0 border-r border-border/70 bg-card transition-all duration-300 z-20",
          isCollapsed ? "w-20" : "w-64",
          className
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Out Drawer with Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="relative flex h-full w-4/5 max-w-xs flex-col border-r border-border bg-card shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
