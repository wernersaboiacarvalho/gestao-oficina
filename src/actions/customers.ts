"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getCustomers() {
    return prisma.customer.findMany({
        orderBy: { name: "asc" },
    })
}

export async function getCustomer(id: string) {
    return prisma.customer.findUnique({
        where: { id },
        include: { vehicles: true },
    })
}

export async function createCustomer(data: {
    name: string
    phone: string
    email?: string
    document?: string
    birthday?: string
}) {
    return prisma.customer.create({
        data: {
            name: data.name,
            phone: data.phone,
            email: data.email || null,
            document: data.document || null,
            birthday: data.birthday ? new Date(data.birthday) : null,
        },
    })
}

export async function updateCustomer(id: string, data: {
    name: string
    phone: string
    email?: string
    document?: string
    birthday?: string
}) {
    return prisma.customer.update({
        where: { id },
        data: {
            name: data.name,
            phone: data.phone,
            email: data.email || null,
            document: data.document || null,
            birthday: data.birthday ? new Date(data.birthday) : null,
        },
    })
}

export async function deleteCustomer(id: string) {
    return prisma.customer.delete({
        where: { id },
    })
}

export async function searchCustomers(query: string) {
    return prisma.customer.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { phone: { contains: query } },
                { document: { contains: query } },
            ],
        },
        take: 10,
    })
}
