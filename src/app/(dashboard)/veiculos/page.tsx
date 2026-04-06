import { getVehicles } from "@/actions/vehicles"
import { getCustomers } from "@/actions/customers"
import { VehiclesList } from "@/components/vehicles/vehicles-list"

export default async function VeiculosPage() {
    const vehiclesRaw = await getVehicles()
    const vehicles = vehiclesRaw.map((v: any) => ({
        ...v,
        customer: { id: v.customer.id, name: v.customer.name },
    }))
    const customers = (await getCustomers()).map((c: any) => ({ id: c.id, name: c.name }))

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Veículos</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {vehicles.length} veículo{vehicles.length !== 1 ? "s" : ""} cadastrado{vehicles.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            <VehiclesList initialVehicles={vehicles} customers={customers} />
        </div>
    )
}
