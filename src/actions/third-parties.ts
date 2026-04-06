"use server"

import { prisma } from "@/lib/prisma"

export async function getThirdParties() {
    return await prisma.thirdParty.findMany({
        orderBy: { name: "asc" },
    })
}

export async function getThirdParty(id: string) {
    return await prisma.thirdParty.findUnique({
        where: { id },
    })
}

export async function createThirdParty(data: {
    name: string
    phone?: string
    cnpj?: string
    serviceType?: string
}) {
    return await prisma.thirdParty.create({
        data: {
            name: data.name,
            phone: data.phone || null,
            cnpj: data.cnpj || null,
            serviceType: data.serviceType || null,
        },
    })
}

export async function updateThirdParty(id: string, data: {
    name: string
    phone?: string
    cnpj?: string
    serviceType?: string
}) {
    return await prisma.thirdParty.update({
        where: { id },
        data: {
            name: data.name,
            phone: data.phone || null,
            cnpj: data.cnpj || null,
            serviceType: data.serviceType || null,
        },
    })
}

export async function deleteThirdParty(id: string) {
    await prisma.thirdParty.delete({
        where: { id },
    })
}
