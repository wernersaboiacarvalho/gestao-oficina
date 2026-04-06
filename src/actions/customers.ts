"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getCustomers() {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: { name: "asc" },
        })
        return customers.map((c: any) => ({
            ...c,
            birthday: c.birthday ? c.birthday.toISOString() : null,
        }))
    } catch (error) {
        console.error("Error fetching customers:", error)
        return []
    }
}

export async function getCustomer(id: string) {
    try {
        const customer = await prisma.customer.findUnique({
            where: { id },
            include: { vehicles: true },
        })
        if (!customer) return null
        return {
            ...customer,
            birthday: customer.birthday ? customer.birthday.toISOString() : null,
            vehicles: customer.vehicles.map((v: any) => ({
                ...v,
            })),
        }
    } catch (error) {
        console.error("Error fetching customer:", error)
        return null
    }
}

export async function createCustomer(data: {
    name: string
    phone: string
    email?: string
    document?: string
    birthday?: string
}) {
    try {
        const customer = await prisma.customer.create({
            data: {
                name: data.name,
                phone: data.phone,
                email: data.email || null,
                document: data.document || null,
                birthday: data.birthday ? new Date(data.birthday) : null,
            },
        })
        revalidatePath("/clientes")
        return {
            ...customer,
            birthday: customer.birthday ? customer.birthday.toISOString() : null,
        }
    } catch (error) {
        console.error("Error creating customer:", error)
        throw error
    }
}

export async function updateCustomer(id: string, data: {
    name: string
    phone: string
    email?: string
    document?: string
    birthday?: string
}) {
    try {
        const customer = await prisma.customer.update({
            where: { id },
            data: {
                name: data.name,
                phone: data.phone,
                email: data.email || null,
                document: data.document || null,
                birthday: data.birthday ? new Date(data.birthday) : null,
            },
        })
        revalidatePath("/clientes")
        return {
            ...customer,
            birthday: customer.birthday ? customer.birthday.toISOString() : null,
        }
    } catch (error) {
        console.error("Error updating customer:", error)
        throw error
    }
}

export async function deleteCustomer(id: string) {
    try {
        const result = await prisma.customer.delete({
            where: { id },
        })
        revalidatePath("/clientes")
        return result
    } catch (error) {
        console.error("Error deleting customer:", error)
        throw error
    }
}

export async function searchCustomers(query: string) {
    try {
        const customers = await prisma.customer.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { phone: { contains: query } },
                    { document: { contains: query } },
                ],
            },
            take: 10,
        })
        return customers.map((c: any) => ({
            ...c,
            birthday: c.birthday ? c.birthday.toISOString() : null,
        }))
    } catch (error) {
        console.error("Error searching customers:", error)
        return []
    }
}
