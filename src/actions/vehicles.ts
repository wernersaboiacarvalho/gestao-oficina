"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getVehicles() {
    try {
        const vehicles = await prisma.vehicle.findMany({
            include: { customer: true },
        })
        return vehicles.map((v: any) => ({
            ...v,
        }))
    } catch (error) {
        console.error("Error fetching vehicles:", error)
        return []
    }
}

export async function getVehicle(id: string) {
    try {
        const vehicle = await prisma.vehicle.findUnique({
            where: { id },
            include: { customer: true },
        })
        if (!vehicle) return null
        return { ...vehicle }
    } catch (error) {
        console.error("Error fetching vehicle:", error)
        return null
    }
}

export async function getVehiclesByCustomer(customerId: string) {
    try {
        return await prisma.vehicle.findMany({
            where: { customerId },
        })
    } catch (error) {
        console.error("Error fetching vehicles by customer:", error)
        return []
    }
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
    try {
        const vehicle = await prisma.vehicle.create({
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
        revalidatePath("/veiculos")
        return vehicle
    } catch (error) {
        console.error("Error creating vehicle:", error)
        throw error
    }
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
    try {
        const vehicle = await prisma.vehicle.update({
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
        revalidatePath("/veiculos")
        return vehicle
    } catch (error) {
        console.error("Error updating vehicle:", error)
        throw error
    }
}

export async function deleteVehicle(id: string) {
    try {
        await prisma.vehicle.delete({
            where: { id },
        })
        revalidatePath("/veiculos")
    } catch (error) {
        console.error("Error deleting vehicle:", error)
        throw error
    }
}

export async function searchVehicles(query: string) {
    try {
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
    } catch (error) {
        console.error("Error searching vehicles:", error)
        return []
    }
}
