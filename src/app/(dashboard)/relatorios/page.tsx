import { getDashboardStats, getOSByStatus, getThirdPartyReport, getMechanicReport } from "@/actions/reports"
import { getServiceOrders } from "@/actions/service-orders"
import { getProducts } from "@/actions/products"
import { ReportFilters } from "@/components/reports/report-filters"

export default async function RelatoriosPage() {
    const stats = await getDashboardStats()
    const osByStatus = await getOSByStatus()
    const thirdPartyReport = await getThirdPartyReport()
    const mechanicReport = await getMechanicReport()
    const allOrdersRaw = await getServiceOrders()
    const productsRaw = await getProducts()

    const allOrders = allOrdersRaw.map((o: any) => ({
        ...o,
        totalAmount: Number(o.totalAmount),
    }))

    const products = productsRaw.map((p: any) => ({
        ...p,
        costPrice: Number(p.costPrice),
        salePrice: Number(p.salePrice),
    }))

    const statusLabels: Record<string, string> = {
        ORCAMENTO: "Orçamento",
        OPEN: "Abertas",
        IN_PROGRESS: "Em Andamento",
        WAITING_PARTS_THIRD_PARTY: "Aguardando",
        DONE: "Concluídas",
        BILLED: "Faturadas",
        CANCELLED: "Canceladas",
    }

    const statusColors: Record<string, string> = {
        ORCAMENTO: "bg-indigo-50 border-indigo-200",
        OPEN: "bg-blue-50 border-blue-200",
        IN_PROGRESS: "bg-yellow-50 border-yellow-200",
        WAITING_PARTS_THIRD_PARTY: "bg-orange-50 border-orange-200",
        DONE: "bg-green-50 border-green-200",
        BILLED: "bg-purple-50 border-purple-200",
        CANCELLED: "bg-red-50 border-red-200",
    }

    const formatCurrency = (value: number) => {
        return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    }

    const financialData = {
        totalBilled: Number(stats.totalBilled),
        totalOpen: Number(stats.totalOpenAmount),
        totalDoneNotBilled: Number(stats.totalDoneNotBilled),
        pendingCount: stats.openOS + stats.inProgressOS + stats.waitingOS,
        byStatus: osByStatus,
    }

    return (
        <div className="space-y-6">
            <ReportFilters title="Relatório Financeiro" type="FINANCIAL" data={financialData}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Resumo Financeiro</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
                            <p className="text-sm text-blue-600">Total Faturado</p>
                            <p className="text-2xl font-bold text-blue-700">{formatCurrency(Number(stats.totalBilled))}</p>
                        </div>
                        <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4">
                            <p className="text-sm text-yellow-600">Em Aberto</p>
                            <p className="text-2xl font-bold text-yellow-700">{formatCurrency(Number(stats.totalOpenAmount))}</p>
                        </div>
                        <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                            <p className="text-sm text-green-600">Concluídas (não faturadas)</p>
                            <p className="text-2xl font-bold text-green-700">{formatCurrency(Number(stats.totalDoneNotBilled))}</p>
                        </div>
                        <div className="rounded-xl bg-orange-50 border border-orange-200 p-4">
                            <p className="text-sm text-orange-600">OS em Andamento</p>
                            <p className="text-2xl font-bold text-orange-700">{stats.openOS + stats.inProgressOS + stats.waitingOS}</p>
                        </div>
                    </div>

                    <h2 className="text-lg font-semibold mb-4">Ordens de Serviço por Status</h2>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(osByStatus).map(([status, data]: [string, any]) => (
                            <div key={status} className={`rounded-xl p-4 border ${statusColors[status]}`}>
                                <p className="text-sm text-muted-foreground">{statusLabels[status] || status}</p>
                                <div className="flex items-end justify-between mt-1">
                                    <p className="text-2xl font-semibold">{data.count}</p>
                                    <p className="text-sm font-medium">{formatCurrency(Number(data.amount))}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </ReportFilters>

            <ReportFilters title="Ordens de Serviço" type="OS" data={{ orders: allOrders }}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b text-left text-xs text-muted-foreground">
                                <th className="px-4 py-3 font-medium">N° OS</th>
                                <th className="px-4 py-3 font-medium">Data</th>
                                <th className="px-4 py-3 font-medium">Veículo</th>
                                <th className="px-4 py-3 font-medium">Cliente</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allOrders.slice(0, 20).map((os: any) => (
                                <tr key={os.id} className="border-b last:border-0">
                                    <td className="px-4 py-3 font-mono text-sm">{os.id.slice(-6).toUpperCase()}</td>
                                    <td className="px-4 py-3 text-sm">{new Date(os.createdAt).toLocaleDateString("pt-BR")}</td>
                                    <td className="px-4 py-3 text-sm">{os.vehicle?.plate} - {os.vehicle?.brand} {os.vehicle?.model}</td>
                                    <td className="px-4 py-3 text-sm">{os.vehicle?.customer?.name}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[os.status]?.replace("border-", "bg-").replace("-200", "-100")}`}>
                                            {statusLabels[os.status] || os.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm font-medium">{formatCurrency(os.totalAmount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ReportFilters>

            <ReportFilters title="Terceiros" type="THIRDPARTY" data={{ thirdParties: thirdPartyReport }}>
                <div className="p-6">
                    {thirdPartyReport.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">Nenhum terceiro cadastrado</p>
                    ) : (
                        <div className="space-y-3">
                            {thirdPartyReport.map((tp: any) => (
                                <div key={tp.id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
                                    <div>
                                        <p className="font-medium">{tp.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {tp.serviceType || "Sem tipo"} • {tp.osCount} OS • {tp.osPending} pendente(s)
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{formatCurrency(tp.totalAmount)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </ReportFilters>

            <ReportFilters title="Estoque" type="PRODUCTS" data={{ products }}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b text-left text-xs text-muted-foreground">
                                <th className="px-4 py-3 font-medium">Produto</th>
                                <th className="px-4 py-3 font-medium">Código</th>
                                <th className="px-4 py-3 font-medium text-center">Estoque</th>
                                <th className="px-4 py-3 font-medium text-right">Custo</th>
                                <th className="px-4 py-3 font-medium text-right">Venda</th>
                                <th className="px-4 py-3 font-medium text-center">Margem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p: any) => (
                                <tr key={p.id} className="border-b last:border-0">
                                    <td className="px-4 py-3 font-medium">{p.name}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{p.code || "-"}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                                            p.stockQuantity <= 0 ? "bg-red-100 text-red-700" :
                                            p.stockQuantity <= 5 ? "bg-yellow-100 text-yellow-700" :
                                            "bg-green-100 text-green-700"
                                        }`}>
                                            {p.stockQuantity}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm">R$ {p.costPrice.toFixed(2).replace(".", ",")}</td>
                                    <td className="px-4 py-3 text-right text-sm font-medium">R$ {p.salePrice.toFixed(2).replace(".", ",")}</td>
                                    <td className="px-4 py-3 text-center text-sm text-muted-foreground">
                                        {p.costPrice > 0 ? (((p.salePrice - p.costPrice) / p.costPrice * 100).toFixed(0)) : 0}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ReportFilters>
        </div>
    )
}
