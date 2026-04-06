// src/app/(dashboard)/dashboard/page.tsx

import { createClient } from "@/lib/supabase/server"
import { getOSStats } from "@/actions/service-orders"

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let stats = { open: 0, inProgress: 0, waitingParts: 0, done: 0, totalBilled: 0 }
    try {
        stats = await getOSStats()
    } catch (e) {
        console.error("Error fetching dashboard stats:", e)
    }

    const vehiclesInShop = stats.open + stats.inProgress + stats.waitingParts

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Bem-vindo, {user?.email}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                    <p className="text-sm text-muted-foreground">OS Abertas</p>
                    <p className="text-3xl font-semibold mt-1">{stats.open}</p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                    <p className="text-sm text-muted-foreground">Em Andamento</p>
                    <p className="text-3xl font-semibold mt-1">{stats.inProgress}</p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                    <p className="text-sm text-muted-foreground">Faturamento Total</p>
                    <p className="text-3xl font-semibold mt-1">
                        {stats.totalBilled.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                    <p className="text-sm text-muted-foreground">Veículos na Oficina</p>
                    <p className="text-3xl font-semibold mt-1">{vehiclesInShop}</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                    <p className="text-sm text-muted-foreground">Aguardando Peças/Terceiro</p>
                    <p className="text-3xl font-semibold mt-1">{stats.waitingParts}</p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                    <p className="text-sm text-muted-foreground">Concluídas</p>
                    <p className="text-3xl font-semibold mt-1">{stats.done}</p>
                </div>
            </div>
        </div>
    )
}
