"use server"

import { prisma } from "@/lib/prisma"

export async function getProducts() {
    return prisma.product.findMany({
        orderBy: { name: "asc" },
    })
}

export async function getProduct(id: string) {
    return prisma.product.findUnique({
        where: { id },
    })
}

export async function createProduct(data: {
    name: string
    code?: string
    stockQuantity?: number
    costPrice: number
    salePrice: number
}) {
    return prisma.product.create({
        data: {
            name: data.name,
            code: data.code || null,
            stockQuantity: data.stockQuantity || 0,
            costPrice: data.costPrice,
            salePrice: data.salePrice,
        },
    })
}

export async function updateProduct(id: string, data: {
    name: string
    code?: string
    stockQuantity?: number
    costPrice: number
    salePrice: number
}) {
    return prisma.product.update({
        where: { id },
        data: {
            name: data.name,
            code: data.code || null,
            stockQuantity: data.stockQuantity || 0,
            costPrice: data.costPrice,
            salePrice: data.salePrice,
        },
    })
}

export async function deleteProduct(id: string) {
    return prisma.product.delete({
        where: { id },
    })
}

export async function searchProducts(query: string) {
    return prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { code: { contains: query, mode: "insensitive" } },
            ],
        },
        take: 10,
    })
}

export async function updateStock(id: string, quantity: number) {
    return prisma.product.update({
        where: { id },
        data: {
            stockQuantity: { increment: quantity },
        },
    })
}
