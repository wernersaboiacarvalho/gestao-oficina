"use server"

import { prisma } from "@/lib/prisma"

export async function getDashboardStats() {
    const [
        totalCustomers,
        totalVehicles,
        openOS,
        inProgressOS,
        waitingOS,
        doneOS,
        billedOS,
        allOS,
    ] = await Promise.all([
        prisma.customer.count(),
        prisma.vehicle.count(),
        prisma.serviceOrder.count({ where: { status: "OPEN" } }),
        prisma.serviceOrder.count({ where: { status: "IN_PROGRESS" } }),
        prisma.serviceOrder.count({ where: { status: "WAITING_PARTS_THIRD_PARTY" } }),
        prisma.serviceOrder.count({ where: { status: "DONE" } }),
        prisma.serviceOrder.findMany({
            where: { status: "BILLED" },
            select: { totalAmount: true },
        }),
        prisma.serviceOrder.findMany({
            select: { status: true, totalAmount: true },
        }),
    ])

    const totalBilled = billedOS.reduce((sum: number, os: any) => sum + Number(os.totalAmount), 0)
    const totalOpenAmount = allOS
        .filter((os: any) => ["OPEN", "IN_PROGRESS", "WAITING_PARTS_THIRD_PARTY"].includes(os.status))
        .reduce((sum: number, os: any) => sum + Number(os.totalAmount), 0)
    const totalDoneNotBilled = allOS
        .filter((os: any) => os.status === "DONE")
        .reduce((sum: number, os: any) => sum + Number(os.totalAmount), 0)

    return {
        totalCustomers,
        totalVehicles,
        openOS,
        inProgressOS,
        waitingOS,
        doneOS,
        billedCount: billedOS.length,
        totalBilled,
        totalOpenAmount,
        totalDoneNotBilled,
    }
}

export async function getOSByStatus() {
    const orders = await prisma.serviceOrder.findMany({
        select: {
            status: true,
            totalAmount: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    })

    const byStatus: Record<string, { count: number; amount: number }> = {
        OPEN: { count: 0, amount: 0 },
        IN_PROGRESS: { count: 0, amount: 0 },
        WAITING_PARTS_THIRD_PARTY: { count: 0, amount: 0 },
        DONE: { count: 0, amount: 0 },
        BILLED: { count: 0, amount: 0 },
        CANCELLED: { count: 0, amount: 0 },
    }

    orders.forEach((os: any) => {
        if (byStatus[os.status as keyof typeof byStatus]) {
            byStatus[os.status as keyof typeof byStatus].count++
            byStatus[os.status as keyof typeof byStatus].amount += Number(os.totalAmount)
        }
    })

    return byStatus
}

export async function getThirdPartyReport() {
    const thirdParties = await prisma.thirdParty.findMany({
        include: {
            serviceOrders: {
                select: {
                    id: true,
                    totalAmount: true,
                    status: true,
                },
            },
        },
    })

    return thirdParties.map((tp: any) => ({
        id: tp.id,
        name: tp.name,
        serviceType: tp.serviceType,
        osCount: tp.serviceOrders.length,
        osPending: tp.serviceOrders.filter((os: any) => !["DONE", "BILLED", "CANCELLED"].includes(os.status)).length,
        totalAmount: tp.serviceOrders.reduce((sum: number, os: any) => sum + Number(os.totalAmount), 0),
    }))
}

export async function getMechanicReport() {
    const mechanics = await prisma.profile.findMany({
        where: { role: { in: ["MECHANIC", "ADMIN"] } },
        include: {
            serviceOrders: {
                include: {
                    serviceOrder: {
                        select: { status: true, totalAmount: true, createdAt: true },
                    },
                },
            },
        },
    })

    return mechanics.map((m: any) => ({
        id: m.id,
        name: m.name,
        osCount: m.serviceOrders.length,
        osDone: m.serviceOrders.filter((so: any) => so.serviceOrder.status === "DONE").length,
        totalAmount: m.serviceOrders.reduce((sum: number, so: any) => sum + Number(so.serviceOrder.totalAmount), 0),
    }))
}
