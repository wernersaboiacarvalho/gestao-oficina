import { getServiceOrders, getMechanics, getThirdParties } from "@/actions/service-orders"
import { getVehicles } from "@/actions/vehicles"
import { getProducts } from "@/actions/products"
import { ServiceOrdersList } from "@/components/service-orders/service-orders-list"

export default async function OSPage() {
    const ordersRaw = await getServiceOrders()
    const vehiclesRaw = await getVehicles()
    const mechanics = await getMechanics()
    const thirdParties = await getThirdParties()
    const productsRaw = await getProducts()

    const orders = ordersRaw.map((o: any) => ({
        ...o,
        createdAt: o.createdAt.toISOString(),
        totalAmount: Number(o.totalAmount),
        vehicle: {
            ...o.vehicle,
            customer: { id: o.vehicle.customer.id, name: o.vehicle.customer.name },
        },
        mechanics: (o.mechanics || []).map((m: any) => ({ mechanic: { id: m.mechanic.id, name: m.mechanic.name } })),
        items: (o.items || []).map((i: any) => ({ ...i, quantity: Number(i.quantity), unitPrice: Number(i.unitPrice) })),
    }))

    const vehicles = vehiclesRaw.map((v: any) => ({
        id: v.id,
        plate: v.plate,
        model: v.model,
        brand: v.brand,
        customer: { id: v.customer.id, name: v.customer.name },
    }))

    const products = productsRaw.map((p: any) => ({
        id: p.id,
        name: p.name,
        code: p.code,
        salePrice: Number(p.salePrice),
        stockQuantity: p.stockQuantity,
    }))

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Ordens de Serviço</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {orders.length} OS{orders.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            <ServiceOrdersList
                initialOrders={orders}
                vehicles={vehicles}
                mechanics={mechanics}
                thirdParties={thirdParties}
                products={products}
            />
        </div>
    )
}
