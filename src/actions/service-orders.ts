"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

type OSStatusType = "ORCAMENTO" | "OPEN" | "IN_PROGRESS" | "WAITING_PARTS_THIRD_PARTY" | "DONE" | "BILLED" | "CANCELLED"

export async function getServiceOrders() {
    const orders = await prisma.serviceOrder.findMany({
        include: {
            vehicle: { include: { customer: true } },
            mechanics: { include: { mechanic: true } },
            thirdParty: true,
        },
        orderBy: { createdAt: "desc" },
    })

    return orders.map((o: any) => ({
        ...o,
        totalAmount: Number(o.totalAmount),
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
        items: (o.items || []).map((i: any) => ({
            ...i,
            quantity: Number(i.quantity),
            unitPrice: Number(i.unitPrice),
        })),
    }))
}

export async function getServiceOrder(id: string) {
    const order = await prisma.serviceOrder.findUnique({
        where: { id },
        include: {
            vehicle: { include: { customer: true } },
            mechanics: { include: { mechanic: true } },
            items: { include: { product: true } },
            thirdParty: true,
        },
    })

    if (!order) return null

    return {
        ...order,
        totalAmount: Number(order.totalAmount),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        items: order.items.map((i: any) => ({
            ...i,
            quantity: Number(i.quantity),
            unitPrice: Number(i.unitPrice),
            product: i.product ? {
                ...i.product,
                costPrice: Number(i.product.costPrice),
                salePrice: Number(i.product.salePrice),
            } : null,
        })),
    }
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

    const order = await prisma.serviceOrder.create({
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

    revalidatePath("/os")
    revalidatePath("/dashboard")

    return {
        ...order,
        totalAmount: Number(order.totalAmount),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        items: order.items.map((i: any) => ({
            ...i,
            quantity: Number(i.quantity),
            unitPrice: Number(i.unitPrice),
        })),
    }
}

export async function updateServiceOrder(id: string, data: {
    vehicleId: string
    status: OSStatusType
    description: string
    isOutsourced: boolean
    thirdPartyId?: string
    mechanicIds: string[]
    items: { type: "PART" | "SERVICE"; productId?: string; description: string; quantity: number; unitPrice: number }[]
}) {
    const totalAmount = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)

    await prisma.serviceOrderMechanic.deleteMany({ where: { serviceOrderId: id } })
    await prisma.serviceOrderItem.deleteMany({ where: { serviceOrderId: id } })

    const order = await prisma.serviceOrder.update({
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

    revalidatePath("/os")
    revalidatePath("/dashboard")

    return {
        ...order,
        totalAmount: Number(order.totalAmount),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        items: order.items.map((i: any) => ({
            ...i,
            quantity: Number(i.quantity),
            unitPrice: Number(i.unitPrice),
        })),
    }
}

export async function updateServiceOrderStatus(id: string, status: OSStatusType) {
    await prisma.serviceOrder.update({
        where: { id },
        data: { status },
    })
    revalidatePath("/os")
    revalidatePath("/dashboard")
}

export async function deleteServiceOrder(id: string) {
    await prisma.serviceOrder.delete({
        where: { id },
    })
    revalidatePath("/os")
    revalidatePath("/dashboard")
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
