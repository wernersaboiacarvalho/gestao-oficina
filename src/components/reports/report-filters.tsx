"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Props {
    title: string
    type: "FINANCIAL" | "OS" | "THIRDPARTY" | "PRODUCTS"
    children: React.ReactNode
    data: any
}

export function ReportFilters({ title, type, children, data }: Props) {
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [showPrint, setShowPrint] = useState(false)

    const handlePrint = () => {
        setShowPrint(true)
        setTimeout(() => {
            window.print()
            setShowPrint(false)
        }, 100)
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                        <p className="text-sm text-muted-foreground mt-1">Filtros e exportação</p>
                    </div>
                    <Button onClick={handlePrint} className="h-9 rounded-lg bg-black text-white hover:bg-zinc-800">
                        📄 Imprimir / Exportar PDF
                    </Button>
                </div>

                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-4">
                    <div className="flex items-end gap-4 flex-wrap">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-700">Data Início</label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="h-9 rounded-lg bg-zinc-50 border-zinc-200"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-700">Data Fim</label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="h-9 rounded-lg bg-zinc-50 border-zinc-200"
                            />
                        </div>
                        <Button variant="outline" className="h-9 rounded-lg">
                            Aplicar Filtros
                        </Button>
                    </div>
                </div>

                <div className={showPrint ? "" : "rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden"}>
                    {children}
                </div>
            </div>

            {showPrint && (
                <div className="fixed inset-0 bg-white -z-50 p-8" id="report-print">
                    <ReportContent title={title} type={type} data={data} />
                </div>
            )}

            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #report-print, #report-print * {
                        visibility: visible;
                    }
                    #report-print {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 20px;
                    }
                    @page {
                        size: A4 landscape;
                        margin: 10mm;
                    }
                }
            `}</style>
        </>
    )
}

function ReportContent({ title, type, data }: { title: string; type: string; data: any }) {
    const formatCurrency = (value: number) => {
        return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    }
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("pt-BR")
    }

    const statusLabels: Record<string, string> = {
        ORCAMENTO: "Orçamento",
        OPEN: "Aberta",
        IN_PROGRESS: "Em Andamento",
        WAITING_PARTS_THIRD_PARTY: "Aguardando Peças/Terceiro",
        DONE: "Concluída",
        BILLED: "Faturada",
        CANCELLED: "Cancelada",
    }

    return (
        <div className="font-sans text-sm">
            <div className="flex items-start justify-between mb-8 border-b pb-4">
                <div>
                    <img src="/logo.jpg" alt="Logo" className="h-12 mb-2" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                    <h1 className="text-xl font-bold text-zinc-900">Martins Car</h1>
                    <p className="text-xs text-zinc-600">Serviço de Mecânica Automotiva</p>
                </div>
                <div className="text-right">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <p className="text-xs text-zinc-600">Gerado em: {formatDate(new Date().toISOString())}</p>
                </div>
            </div>

            {type === "FINANCIAL" && data && (
                <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="border rounded-lg p-4 bg-blue-50">
                            <p className="text-xs text-blue-600">Total Faturado</p>
                            <p className="text-xl font-bold text-blue-700">{formatCurrency(data.totalBilled)}</p>
                        </div>
                        <div className="border rounded-lg p-4 bg-yellow-50">
                            <p className="text-xs text-yellow-600">Em Aberto</p>
                            <p className="text-xl font-bold text-yellow-700">{formatCurrency(data.totalOpen)}</p>
                        </div>
                        <div className="border rounded-lg p-4 bg-green-50">
                            <p className="text-xs text-green-600">Concluídas (pagas)</p>
                            <p className="text-xl font-bold text-green-700">{formatCurrency(data.totalBilled)}</p>
                        </div>
                        <div className="border rounded-lg p-4 bg-orange-50">
                            <p className="text-xs text-orange-600">Pendentes</p>
                            <p className="text-xl font-bold text-orange-700">{data.pendingCount}</p>
                        </div>
                    </div>

                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-zinc-100">
                                <th className="border p-2 text-left">Status</th>
                                <th className="border p-2 text-right">Quantidade</th>
                                <th className="border p-2 text-right">Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(data.byStatus || {}).map(([status, info]: [string, any]) => (
                                <tr key={status}>
                                    <td className="border p-2">{statusLabels[status] || status}</td>
                                    <td className="border p-2 text-right">{info.count}</td>
                                    <td className="border p-2 text-right">{formatCurrency(info.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {type === "OS" && data && (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-zinc-100">
                            <th className="border p-2 text-left">N° OS</th>
                            <th className="border p-2 text-left">Data</th>
                            <th className="border p-2 text-left">Veículo</th>
                            <th className="border p-2 text-left">Cliente</th>
                            <th className="border p-2 text-left">Status</th>
                            <th className="border p-2 text-right">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(data.orders || []).map((order: any) => (
                            <tr key={order.id}>
                                <td className="border p-2">{order.id.slice(-6).toUpperCase()}</td>
                                <td className="border p-2">{formatDate(order.createdAt)}</td>
                                <td className="border p-2">{order.vehicle?.plate} - {order.vehicle?.brand} {order.vehicle?.model}</td>
                                <td className="border p-2">{order.vehicle?.customer?.name}</td>
                                <td className="border p-2">{statusLabels[order.status] || order.status}</td>
                                <td className="border p-2 text-right">{formatCurrency(Number(order.totalAmount))}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="font-bold bg-zinc-50">
                            <td colSpan={5} className="border p-2 text-right">Total:</td>
                            <td className="border p-2 text-right">
                                {formatCurrency((data.orders || []).reduce((sum: number, o: any) => sum + Number(o.totalAmount), 0))}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            )}

            {type === "THIRDPARTY" && data && (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-zinc-100">
                            <th className="border p-2 text-left">Terceiro</th>
                            <th className="border p-2 text-left">Tipo de Serviço</th>
                            <th className="border p-2 text-center">Qtd OS</th>
                            <th className="border p-2 text-center">Pendentes</th>
                            <th className="border p-2 text-right">Valor Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(data.thirdParties || []).map((tp: any) => (
                            <tr key={tp.id}>
                                <td className="border p-2">{tp.name}</td>
                                <td className="border p-2">{tp.serviceType || "-"}</td>
                                <td className="border p-2 text-center">{tp.osCount}</td>
                                <td className="border p-2 text-center">{tp.osPending}</td>
                                <td className="border p-2 text-right">{formatCurrency(tp.totalAmount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {type === "PRODUCTS" && data && (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-zinc-100">
                            <th className="border p-2 text-left">Produto</th>
                            <th className="border p-2 text-center">Estoque</th>
                            <th className="border p-2 text-right">Preço Custo</th>
                            <th className="border p-2 text-right">Preço Venda</th>
                            <th className="border p-2 text-right">Margem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(data.products || []).map((p: any) => (
                            <tr key={p.id}>
                                <td className="border p-2">{p.name}</td>
                                <td className="border p-2 text-center">
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                                        p.stockQuantity <= 0 ? "bg-red-100 text-red-700" :
                                        p.stockQuantity <= 5 ? "bg-yellow-100 text-yellow-700" :
                                        "bg-green-100 text-green-700"
                                    }`}>
                                        {p.stockQuantity}
                                    </span>
                                </td>
                                <td className="border p-2 text-right">{formatCurrency(Number(p.costPrice))}</td>
                                <td className="border p-2 text-right">{formatCurrency(Number(p.salePrice))}</td>
                                <td className="border p-2 text-right">
                                    {p.costPrice > 0 ? (((Number(p.salePrice) - Number(p.costPrice)) / Number(p.costPrice)) * 100).toFixed(0) : 0}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className="mt-8 pt-4 border-t text-center text-xs text-zinc-400">
                <p>Martins Car - Todos os direitos reservados</p>
            </div>
        </div>
    )
}
