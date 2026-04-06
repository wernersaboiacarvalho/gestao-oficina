import { getProducts } from "@/actions/products"
import { ProductsList } from "@/components/products/products-list"

export default async function EstoquePage() {
    const productsRaw = await getProducts()
    const products = productsRaw.map((p: any) => ({
        ...p,
        costPrice: Number(p.costPrice),
        salePrice: Number(p.salePrice),
    }))

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Estoque</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {products.length} produto{products.length !== 1 ? "s" : ""} cadastrado{products.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            <ProductsList initialProducts={products} />
        </div>
    )
}
