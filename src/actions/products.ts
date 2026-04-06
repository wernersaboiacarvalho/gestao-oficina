"use server"

import { prisma } from "@/lib/prisma"

export async function getProducts() {
    const products = await prisma.product.findMany({
        orderBy: { name: "asc" },
    })
    return products.map((p: any) => ({
        ...p,
        costPrice: Number(p.costPrice),
        salePrice: Number(p.salePrice),
    }))
}

export async function getProduct(id: string) {
    const product = await prisma.product.findUnique({
        where: { id },
    })
    if (!product) return null
    return {
        ...product,
        costPrice: Number(product.costPrice),
        salePrice: Number(product.salePrice),
    }
}

export async function createProduct(data: {
    name: string
    code?: string
    stockQuantity?: number
    costPrice: number
    salePrice: number
}) {
    const product = await prisma.product.create({
        data: {
            name: data.name,
            code: data.code || null,
            stockQuantity: data.stockQuantity || 0,
            costPrice: data.costPrice,
            salePrice: data.salePrice,
        },
    })
    return {
        ...product,
        costPrice: Number(product.costPrice),
        salePrice: Number(product.salePrice),
    }
}

export async function updateProduct(id: string, data: {
    name: string
    code?: string
    stockQuantity?: number
    costPrice: number
    salePrice: number
}) {
    const product = await prisma.product.update({
        where: { id },
        data: {
            name: data.name,
            code: data.code || null,
            stockQuantity: data.stockQuantity || 0,
            costPrice: data.costPrice,
            salePrice: data.salePrice,
        },
    })
    return {
        ...product,
        costPrice: Number(product.costPrice),
        salePrice: Number(product.salePrice),
    }
}

export async function deleteProduct(id: string) {
    const product = await prisma.product.delete({
        where: { id },
    })
    return {
        ...product,
        costPrice: Number(product.costPrice),
        salePrice: Number(product.salePrice),
    }
}

export async function searchProducts(query: string) {
    const products = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { code: { contains: query, mode: "insensitive" } },
            ],
        },
        take: 10,
    })
    return products.map((p: any) => ({
        ...p,
        costPrice: Number(p.costPrice),
        salePrice: Number(p.salePrice),
    }))
}

export async function updateStock(id: string, quantity: number) {
    const product = await prisma.product.update({
        where: { id },
        data: {
            stockQuantity: { increment: quantity },
        },
    })
    return {
        ...product,
        costPrice: Number(product.costPrice),
        salePrice: Number(product.salePrice),
    }
}
