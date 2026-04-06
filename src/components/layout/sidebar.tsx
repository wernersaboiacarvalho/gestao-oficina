"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "⬡" },
  { href: "/clientes", label: "Clientes", icon: "◎" },
  { href: "/veiculos", label: "Veículos", icon: "◇" },
  { href: "/os", label: "Ordens de Serviço", icon: "○" },
  { href: "/terceiros", label: "Terceiros", icon: "◈" },
  { href: "/estoque", label: "Estoque", icon: "▣" },
  { href: "/relatorios", label: "Relatórios", icon: "◐" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-sidebar border-r flex flex-col">
      <div className="p-5 border-b border-sidebar-border">
        <h1 className="text-base font-semibold tracking-tight">Gestão Oficina</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Sistema de Gestão</p>
      </div>
      <nav className="flex-1 p-3">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-[11px] text-muted-foreground">v1.0 MVP</p>
      </div>
    </aside>
  )
}
