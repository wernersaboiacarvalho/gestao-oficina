"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getCustomers() {
    const customers = await prisma.customer.findMany({
        orderBy: { name: "asc" },
    })
    return customers.map((c: any) => ({
        ...c,
        birthday: c.birthday ? c.birthday.toISOString() : null,
    }))
}

export async function getCustomer(id: string) {
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
}

export async function createCustomer(data: {
    name: string
    phone: string
    email?: string
    document?: string
    birthday?: string
}) {
    const customer = await prisma.customer.create({
        data: {
            name: data.name,
            phone: data.phone,
            email: data.email || null,
            document: data.document || null,
            birthday: data.birthday ? new Date(data.birthday) : null,
        },
    })
    return {
        ...customer,
        birthday: customer.birthday ? customer.birthday.toISOString() : null,
    }
}

export async function updateCustomer(id: string, data: {
    name: string
    phone: string
    email?: string
    document?: string
    birthday?: string
}) {
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
    return {
        ...customer,
        birthday: customer.birthday ? customer.birthday.toISOString() : null,
    }
}

export async function deleteCustomer(id: string) {
    return await prisma.customer.delete({
        where: { id },
    })
}

export async function searchCustomers(query: string) {
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
}
