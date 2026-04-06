// prisma/seed.js

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log("🗑️ Limpando banco de dados...")

  // Comentado porque o banco está vazio
  // await prisma.serviceOrderItem.deleteMany()
  // await prisma.serviceOrderMechanic.deleteMany()
  // await prisma.serviceOrder.deleteMany()
  // await prisma.vehicle.deleteMany()
  // await prisma.customer.deleteMany()
  // await prisma.thirdParty.deleteMany()
  // await prisma.product.deleteMany()
  // await prisma.profile.deleteMany()

  console.log("👤 Criando profiles...")

  const admin = await prisma.profile.create({
    data: {
      id: "550e8400-e29b-41d4-a716-446655440001",
      name: "Admin",
      role: "ADMIN",
      isActive: true,
    },
  })

  const mechanic1 = await prisma.profile.create({
    data: {
      id: "550e8400-e29b-41d4-a716-446655440002",
      name: "João Mecânico",
      role: "MECHANIC",
      isActive: true,
    },
  })

  const mechanic2 = await prisma.profile.create({
    data: {
      id: "550e8400-e29b-41d4-a716-446655440003",
      name: "Maria Mecânica",
      role: "MECHANIC",
      isActive: true,
    },
  })

  console.log("🏢 Criando terceiros...")

  const thirdParty = await prisma.thirdParty.create({
    data: {
      name: "Retífica Motors",
      phone: "(11) 98765-4321",
      cnpj: "12.345.678/0001-99",
      serviceType: "Retífica de Motor",
    },
  })

  console.log("📦 Criando produtos...")

  const product1 = await prisma.product.create({
    data: {
      name: "Óleo 5W30",
      code: "OL-5W30",
      stockQuantity: 50,
      costPrice: 25.00,
      salePrice: 45.00,
    },
  })

  const product2 = await prisma.product.create({
    data: {
      name: "Filtro de Óleo",
      code: "FO-001",
      stockQuantity: 30,
      costPrice: 15.00,
      salePrice: 28.00,
    },
  })

  const product3 = await prisma.product.create({
    data: {
      name: "Pastilha de Freio",
      code: "PF-DIA",
      stockQuantity: 20,
      costPrice: 80.00,
      salePrice: 150.00,
    },
  })

  console.log("👥 Criando clientes...")

  const customer1 = await prisma.customer.create({
    data: {
      name: "Carlos Silva",
      phone: "(11) 99999-1111",
      email: "carlos@email.com",
      document: "123.456.789-00",
      birthday: new Date("1985-05-15"),
    },
  })

  const customer2 = await prisma.customer.create({
    data: {
      name: "Ana Santos",
      phone: "(11) 99999-2222",
      email: "ana@email.com",
      document: "987.654.321-00",
      birthday: new Date("1990-08-20"),
    },
  })

  console.log("🚗 Criando veículos...")

  const vehicle1 = await prisma.vehicle.create({
    data: {
      customerId: customer1.id,
      plate: "ABC-1234",
      model: "Civic",
      brand: "Honda",
      year: 2020,
      color: "Preto",
      km: 45000,
    },
  })

  const vehicle2 = await prisma.vehicle.create({
    data: {
      customerId: customer2.id,
      plate: "XYZ-5678",
      model: "Corolla",
      brand: "Toyota",
      year: 2021,
      color: "Prata",
      km: 32000,
    },
  })

  console.log("📋 Criando ordens de serviço...")

  const os1 = await prisma.serviceOrder.create({
    data: {
      vehicleId: vehicle1.id,
      status: "OPEN",
      description: "Troca de óleo e filtro",
      totalAmount: 0,
      mechanics: {
        create: [
          { mechanicId: mechanic1.id }
        ]
      },
      items: {
        create: [
          {
            type: "PART",
            productId: product1.id,
            description: "Óleo 5W30",
            quantity: 4,
            unitPrice: 45.00,
          },
          {
            type: "PART",
            productId: product2.id,
            description: "Filtro de Óleo",
            quantity: 1,
            unitPrice: 28.00,
          },
          {
            type: "SERVICE",
            description: "Mão de obra - Troca de óleo",
            quantity: 1,
            unitPrice: 80.00,
          },
        ]
      }
    },
  })

  // Atualizar totalAmount da OS1
  const os1Items = await prisma.serviceOrderItem.findMany({
    where: { serviceOrderId: os1.id }
  })
  const os1Total = os1Items.reduce((sum, item) =>
      sum + (Number(item.quantity) * Number(item.unitPrice)), 0
  )
  await prisma.serviceOrder.update({
    where: { id: os1.id },
    data: { totalAmount: os1Total }
  })

  const os2 = await prisma.serviceOrder.create({
    data: {
      vehicleId: vehicle2.id,
      status: "ORCAMENTO",
      description: "Troca de pastilhas de freio",
      totalAmount: 0,
      mechanics: {
        create: [
          { mechanicId: mechanic2.id }
        ]
      },
      items: {
        create: [
          {
            type: "PART",
            productId: product3.id,
            description: "Pastilha de Freio Dianteira",
            quantity: 1,
            unitPrice: 150.00,
          },
          {
            type: "SERVICE",
            description: "Mão de obra - Troca de pastilhas",
            quantity: 1,
            unitPrice: 120.00,
          },
        ]
      }
    },
  })

  // Atualizar totalAmount da OS2
  const os2Items = await prisma.serviceOrderItem.findMany({
    where: { serviceOrderId: os2.id }
  })
  const os2Total = os2Items.reduce((sum, item) =>
      sum + (Number(item.quantity) * Number(item.unitPrice)), 0
  )
  await prisma.serviceOrder.update({
    where: { id: os2.id },
    data: { totalAmount: os2Total }
  })

  console.log("✅ Seed concluído com sucesso!")
  console.log(`   - 2 Clientes criados`)
  console.log(`   - 2 Veículos criados`)
  console.log(`   - 3 Produtos criados`)
  console.log(`   - 3 Mecânicos criados`)
  console.log(`   - 2 Ordens de Serviço criadas`)
}

main()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })