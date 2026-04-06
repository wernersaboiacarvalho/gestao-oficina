// src/app/(dashboard)/dashboard/page.tsx

import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Bem-vindo, {user?.email}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                    <p className="text-sm text-muted-foreground">OS Abertas</p>
                    <p className="text-3xl font-semibold mt-1">0</p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                    <p className="text-sm text-muted-foreground">Faturamento Hoje</p>
                    <p className="text-3xl font-semibold mt-1">R$ 0,00</p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                    <p className="text-sm text-muted-foreground">Veículos na Oficina</p>
                    <p className="text-3xl font-semibold mt-1">0</p>
                </div>
            </div>

            <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5 text-center">
                <h3 className="text-lg font-medium">Sistema Pronto</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Autenticação funcionando. Próximo passo: Criar Clientes e Veículos.
                </p>
            </div>
        </div>
    )
}
