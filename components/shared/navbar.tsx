"use client"

import React, { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  Search,
  Menu,
  X,
  Sparkles,
  Calendar,
  CheckCircle,
  FileText,
  User,
  HeartHandshake,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useDemoMode } from "@/components/providers/demo-mode-provider"

export interface NavbarProps {
  onToggleMobileSidebar?: () => void
  isMobileSidebarOpen?: boolean
  className?: string
}

export function Navbar({
  onToggleMobileSidebar,
  isMobileSidebarOpen = false,
  className,
}: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { userRole, caretakerDetails, setIsRoleModalOpen } = useDemoMode()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Dynamic page title based on route
  const getPageTitle = (path: string) => {
    if (path.startsWith("/dashboard")) return { title: "Today", subtitle: "Your Daily Routine & Care" }
    if (path.startsWith("/records")) return { title: "Health Records", subtitle: "Lab Reports, Scans & Prescriptions" }
    if (path.startsWith("/assistant")) return { title: "AI Health Assistant", subtitle: "Ask HER TURN in Plain Language" }
    if (path.startsWith("/reminders")) return { title: "Reminders", subtitle: "Medicines & Daily Routines" }
    if (path.startsWith("/appointments")) return { title: "Appointments", subtitle: "Upcoming Doctor Visits & Reviews" }
    if (path.startsWith("/trusted")) return { title: "Trusted Access", subtitle: "Family & Caregiver Sharing" }
    if (path.startsWith("/privacy")) return { title: "Privacy & Control", subtitle: "Consent, Encryption & Data Rights" }
    return { title: "HER TURN", subtitle: "Your Health, Your Way" }
  }

  const { title } = getPageTitle(pathname)

  const notifications = [
    {
      id: "notif-1",
      title: "Appointment with Dr. Sunita tomorrow",
      detail: "11:30 AM at Manipal Hospital. Remember to carry your thyroid panel.",
      time: "20m ago",
      icon: Calendar,
      unread: true,
      href: "/appointments",
    },
    {
      id: "notif-2",
      title: "Shelcal 500 scheduled for 1:30 PM",
      detail: "Take with or right after lunch for optimal calcium absorption.",
      time: "1h ago",
      icon: CheckCircle,
      unread: true,
      href: "/dashboard",
    },
    {
      id: "notif-3",
      title: "Thyroid report analyzed",
      detail: "TSH 2.45 mIU/L is within optimal range. Click to view plain English summary.",
      time: "Yesterday",
      icon: FileText,
      unread: false,
      href: "/records",
    },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setShowSearchModal(false)
    router.push(`/assistant?q=${encodeURIComponent(searchQuery)}`)
    setSearchQuery("")
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/70 bg-background/85 px-4 backdrop-blur-md transition-all sm:px-6 lg:px-8",
          className
        )}
      >
        {/* Left: Mobile Drawer Trigger + Page Title */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-card text-foreground hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-900"
              aria-label="Toggle navigation menu"
            >
              {isMobileSidebarOpen ? (
                <X className="h-5 w-5 text-plum-950 dark:text-sand-100" />
              ) : (
                <Menu className="h-5 w-5 text-plum-950 dark:text-sand-100" />
              )}
            </button>
          )}

          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: Quick Search, Notifications, Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Switcher Pill */}
          <button
            type="button"
            onClick={() => setIsRoleModalOpen(true)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border transition-all shadow-xs hover:opacity-90",
              userRole === 'caretaker'
                ? "bg-purple-50 text-purple-900 border-purple-200 dark:bg-purple-950/60 dark:text-purple-200 dark:border-purple-800"
                : "bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800"
            )}
            title="Click to switch between Self and Caretaker modes"
          >
            {userRole === 'caretaker' ? (
              <>
                <HeartHandshake className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                <span className="hidden sm:inline font-semibold">Caretaker for {caretakerDetails.patientName}</span>
                <span className="sm:hidden font-semibold">Caretaker</span>
              </>
            ) : (
              <>
                <User className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                <span className="font-semibold">Self Mode</span>
              </>
            )}
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>

          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-900"
            aria-label="Search records and questions"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="hidden sm:inline font-sans">Search health records or ask AI...</span>
            <kbd className="hidden sm:inline-block rounded bg-background px-1.5 py-0.5 text-[10px] font-mono border border-border">
              ⌘K
            </kbd>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-card text-foreground hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-900"
              aria-label="View notifications"
            >
              <Bell className="h-4 w-4 text-foreground/80" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Menu Popover */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 z-50 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-card p-4 shadow-xl"
                  >
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-semibold text-foreground">
                          Notifications
                        </span>
                        {unreadCount > 0 && (
                          <span className="rounded-full bg-plum-100 dark:bg-plum-900/60 px-2 py-0.5 text-[11px] font-medium text-plum-950 dark:text-plum-200">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <Link
                        href="/reminders"
                        onClick={() => setShowNotifications(false)}
                        className="text-xs text-plum-950 dark:text-sand-200 hover:underline font-medium"
                      >
                        All reminders
                      </Link>
                    </div>

                    <div className="mt-3 divide-y divide-border/40 max-h-80 overflow-y-auto">
                      {notifications.map((notif) => {
                        const Icon = notif.icon
                        return (
                          <Link
                            key={notif.id}
                            href={notif.href}
                            onClick={() => setShowNotifications(false)}
                            className={cn(
                              "flex items-start gap-3 p-2.5 rounded-xl transition-colors hover:bg-muted/60",
                              notif.unread && "bg-plum-50/50 dark:bg-plum-950/20"
                            )}
                          >
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-plum-100 text-plum-950 dark:bg-plum-900 dark:text-sand-200">
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex-1 space-y-0.5">
                              <p className="text-xs font-semibold text-foreground leading-snug">
                                {notif.title}
                              </p>
                              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                                {notif.detail}
                              </p>
                              <span className="text-[10px] text-muted-foreground/70">
                                {notif.time}
                              </span>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Avatar */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-full p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-900"
            title="Priya Sharma"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-plum-950 text-white font-serif text-sm font-semibold shadow-sm ring-2 ring-rose-soft/40">
              P
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>
          </Link>
        </div>
      </header>

      {/* Quick Search Dialog Modal */}
      <AnimatePresence>
        {showSearchModal && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-xl rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-2xl"
            >
              <form onSubmit={handleSearchSubmit}>
                <div className="relative flex items-center">
                  <Search className="absolute left-3.5 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search documents, medicines, or ask an AI question..."
                    autoFocus
                    className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-10 text-sm placeholder:text-muted-foreground focus:border-plum-950 focus:outline-none focus:ring-1 focus:ring-plum-950"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSearchModal(false)}
                    className="absolute right-3 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </form>

              <div className="mt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Quick AI Prompts
                </p>
                <div className="mt-2 flex flex-col gap-1.5">
                  {[
                    "Can I take Thyronorm with milk or tea?",
                    "What did my latest DEXA bone density scan conclude?",
                    "What questions should I ask Dr. Sunita tomorrow?",
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        setShowSearchModal(false)
                        router.push(`/assistant?q=${encodeURIComponent(chip)}`)
                      }}
                      className="flex items-center gap-2 rounded-lg p-2 text-left text-xs text-foreground hover:bg-muted transition-colors"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-plum-950 dark:text-rose-soft shrink-0" />
                      <span>{chip}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
