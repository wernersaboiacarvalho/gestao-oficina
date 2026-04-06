import { getThirdParties } from "@/actions/third-parties"
import { ThirdPartiesList } from "@/components/third-parties/third-parties-list"

export default async function TerceirosPage() {
    const thirdParties = await getThirdParties()

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Terceiros</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {thirdParties.length} terceiro{thirdParties.length !== 1 ? "s" : ""} cadastrado{thirdParties.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            <ThirdPartiesList initialThirdParties={thirdParties} />
        </div>
    )
}
