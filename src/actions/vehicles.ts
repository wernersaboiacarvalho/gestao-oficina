"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getVehicles() {
    const vehicles = await prisma.vehicle.findMany({
        include: { customer: true },
    })
    return vehicles.map((v: any) => ({
        ...v,
    }))
}

export async function getVehicle(id: string) {
    const vehicle = await prisma.vehicle.findUnique({
        where: { id },
        include: { customer: true },
    })
    if (!vehicle) return null
    return { ...vehicle }
}

export async function getVehiclesByCustomer(customerId: string) {
    return await prisma.vehicle.findMany({
        where: { customerId },
    })
}

export async function createVehicle(data: {
    customerId: string
    plate: string
    model: string
    brand: string
    year?: number
    color?: string
    km?: number
}) {
    return await prisma.vehicle.create({
        data: {
            customerId: data.customerId,
            plate: data.plate.toUpperCase(),
            model: data.model,
            brand: data.brand,
            year: data.year || null,
            color: data.color || null,
            km: data.km || null,
        },
    })
}

export async function updateVehicle(id: string, data: {
    customerId: string
    plate: string
    model: string
    brand: string
    year?: number
    color?: string
    km?: number
}) {
    return await prisma.vehicle.update({
        where: { id },
        data: {
            customerId: data.customerId,
            plate: data.plate.toUpperCase(),
            model: data.model,
            brand: data.brand,
            year: data.year || null,
            color: data.color || null,
            km: data.km || null,
        },
    })
}

export async function deleteVehicle(id: string) {
    await prisma.vehicle.delete({
        where: { id },
    })
}

export async function searchVehicles(query: string) {
    const vehicles = await prisma.vehicle.findMany({
        where: {
            OR: [
                { plate: { contains: query, mode: "insensitive" } },
                { model: { contains: query, mode: "insensitive" } },
                { brand: { contains: query, mode: "insensitive" } },
            ],
        },
        include: { customer: true },
        take: 10,
    })
    return vehicles.map((v: any) => ({
        ...v,
    }))
}
