"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getServiceOrders() {
    return prisma.serviceOrder.findMany({
        include: {
            vehicle: { include: { customer: true } },
            mechanics: { include: { mechanic: true } },
            thirdParty: true,
        },
        orderBy: { createdAt: "desc" },
    })
}

export async function getServiceOrder(id: string) {
    return prisma.serviceOrder.findUnique({
        where: { id },
        include: {
            vehicle: { include: { customer: true } },
            mechanics: { include: { mechanic: true } },
            items: { include: { product: true } },
            thirdParty: true,
        },
    })
}

export async function createServiceOrder(data: {
    vehicleId: string
    status: string
    description: string
    isOutsourced: boolean
    thirdPartyId?: string
    mechanicIds: string[]
    items: { type: "PART" | "SERVICE"; productId?: string; description: string; quantity: number; unitPrice: number }[]
}) {
    const totalAmount = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)

    return prisma.serviceOrder.create({
        data: {
            vehicleId: data.vehicleId,
            status: data.status as any,
            description: data.description,
            isOutsourced: data.isOutsourced,
            thirdPartyId: data.thirdPartyId || null,
            totalAmount,
            mechanics: {
                create: data.mechanicIds.map((id) => ({ mechanicId: id })),
            },
            items: {
                create: data.items.map((item) => ({
                    type: item.type,
                    productId: item.productId || null,
                    description: item.description,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                })),
            },
        },
        include: {
            vehicle: { include: { customer: true } },
            mechanics: { include: { mechanic: true } },
            items: true,
        },
    })
}

export async function updateServiceOrder(id: string, data: {
    vehicleId: string
    status: "OPEN" | "IN_PROGRESS" | "WAITING_PARTS_THIRD_PARTY" | "DONE" | "BILLED" | "CANCELLED"
    description: string
    isOutsourced: boolean
    thirdPartyId?: string
    mechanicIds: string[]
    items: { type: "PART" | "SERVICE"; productId?: string; description: string; quantity: number; unitPrice: number }[]
}) {
    const totalAmount = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)

    await prisma.serviceOrderMechanic.deleteMany({ where: { serviceOrderId: id } })
    await prisma.serviceOrderItem.deleteMany({ where: { serviceOrderId: id } })

    return prisma.serviceOrder.update({
        where: { id },
        data: {
            vehicleId: data.vehicleId,
            status: data.status,
            description: data.description,
            isOutsourced: data.isOutsourced,
            thirdPartyId: data.isOutsourced ? (data.thirdPartyId || null) : null,
            totalAmount,
            mechanics: {
                create: data.mechanicIds.map((mid) => ({ mechanicId: mid })),
            },
            items: {
                create: data.items.map((item) => ({
                    type: item.type,
                    productId: item.productId || null,
                    description: item.description,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                })),
            },
        },
        include: {
            vehicle: { include: { customer: true } },
            mechanics: { include: { mechanic: true } },
            items: true,
        },
    })
}

export async function updateServiceOrderStatus(id: string, status: "OPEN" | "IN_PROGRESS" | "WAITING_PARTS_THIRD_PARTY" | "DONE" | "BILLED" | "CANCELLED") {
    return prisma.serviceOrder.update({
        where: { id },
        data: { status },
    })
}

export async function deleteServiceOrder(id: string) {
    await prisma.serviceOrder.delete({
        where: { id },
    })
}

export async function getMechanics() {
    return prisma.profile.findMany({
        where: { role: { in: ["MECHANIC", "ADMIN"] }, isActive: true },
        orderBy: { name: "asc" },
    })
}

export async function getThirdParties() {
    return prisma.thirdParty.findMany({
        orderBy: { name: "asc" },
    })
}

export async function getOSStats() {
    const [open, inProgress, waitingParts, done, billed] = await Promise.all([
        prisma.serviceOrder.count({ where: { status: "OPEN" } }),
        prisma.serviceOrder.count({ where: { status: "IN_PROGRESS" } }),
        prisma.serviceOrder.count({ where: { status: "WAITING_PARTS_THIRD_PARTY" } }),
        prisma.serviceOrder.count({ where: { status: "DONE" } }),
        prisma.serviceOrder.findMany({
            where: { status: "BILLED" },
            select: { totalAmount: true },
        }),
    ])

    const totalBilled = billed.reduce((sum: number, os: any) => sum + Number(os.totalAmount), 0)

    return { open, inProgress, waitingParts, done, totalBilled }
}
