import { getCustomers } from "@/actions/customers"
import { CustomersList } from "@/components/customers/customers-list"

export default async function ClientesPage() {
    const customersRaw = await getCustomers()
    const customers = customersRaw.map((c: any) => ({
        ...c,
        birthday: c.birthday ? c.birthday.split("T")[0] : null,
    }))

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {customers.length} cliente{customers.length !== 1 ? "s" : ""} cadastrado{customers.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            <CustomersList initialCustomers={customers} />
        </div>
    )
}
