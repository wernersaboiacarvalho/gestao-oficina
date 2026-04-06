const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  console.log("🗑️ Limpando banco de dados...")
  
  await prisma.media.deleteMany()
  await prisma.serviceOrderItem.deleteMany()
  await prisma.serviceOrderMechanic.deleteMany()
  await prisma.serviceOrder.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.thirdParty.deleteMany()
  await prisma.product.deleteMany()
  await prisma.profile.deleteMany()

  console.log("✅ Banco limpo!")

  console.log("👥 Criando mecânicos...")
  const mechanics = await Promise.all([
    prisma.profile.create({
      data: {
        id: "mech-001",
        name: "Paulo Mecânico",
        role: "MECHANIC",
        isActive: true,
      },
    }),
    prisma.profile.create({
      data: {
        id: "mech-002",
        name: "Ricardo Funileiro",
        role: "MECHANIC",
        isActive: true,
      },
    }),
    prisma.profile.create({
      data: {
        id: "mech-003",
        name: "Carlos Eletricista",
        role: "MECHANIC",
        isActive: true,
      },
    }),
  ])
  console.log(`   ${mechanics.length} mecânicos criados`)

  console.log("🏢 Criando terceiros...")
  const thirdParties = await Promise.all([
    prisma.thirdParty.create({
      data: {
        id: "tp-001",
        name: "Funilaria Express",
        phone: "(11) 3333-4444",
        cnpj: "12.345.678/0001-90",
        serviceType: "Funilaria e Pintura",
      },
    }),
    prisma.thirdParty.create({
      data: {
        id: "tp-002",
        name: "Elétrica Silva",
        phone: "(11) 4444-5555",
        cnpj: "23.456.789/0001-01",
        serviceType: "Elétrica Automotiva",
      },
    }),
    prisma.thirdParty.create({
      data: {
        id: "tp-003",
        name: "Motor Turbo",
        phone: "(11) 5555-6666",
        cnpj: "34.567.890/0001-12",
        serviceType: "Motor e Transmissão",
      },
    }),
    prisma.thirdParty.create({
      data: {
        id: "tp-004",
        name: "Vidros & CIA",
        phone: "(11) 6666-7777",
        serviceType: "Vidros e Parabrisa",
      },
    }),
  ])
  console.log(`   ${thirdParties.length} terceiros criados`)

  console.log("📦 Criando produtos...")
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Óleo Sintético 5W30 4L",
        code: "OLEO-5W30-4L",
        stockQuantity: 15,
        costPrice: 120.00,
        salePrice: 189.90,
      },
    }),
    prisma.product.create({
      data: {
        name: "Filtro de Ar",
        code: "FILTRO-AR-001",
        stockQuantity: 20,
        costPrice: 35.00,
        salePrice: 59.90,
      },
    }),
    prisma.product.create({
      data: {
        name: "Pastilha de Freio Dianteira",
        code: "PAST-FREIO-D",
        stockQuantity: 8,
        costPrice: 45.00,
        salePrice: 89.90,
      },
    }),
    prisma.product.create({
      data: {
        name: "Vela de Ignição NGK",
        code: "VELA-NGK-001",
        stockQuantity: 25,
        costPrice: 25.00,
        salePrice: 45.00,
      },
    }),
    prisma.product.create({
      data: {
        name: "Correia Dentada",
        code: "CORREIA-DENT",
        stockQuantity: 5,
        costPrice: 85.00,
        salePrice: 149.90,
      },
    }),
    prisma.product.create({
      data: {
        name: "Filtro de Óleo",
        code: "FILTRO-OLEO",
        stockQuantity: 30,
        costPrice: 15.00,
        salePrice: 29.90,
      },
    }),
    prisma.product.create({
      data: {
        name: "Amortecedor Dianteiro",
        code: "AMORT-D",
        stockQuantity: 4,
        costPrice: 180.00,
        salePrice: 299.90,
      },
    }),
    prisma.product.create({
      data: {
        name: "Bateria 60Ah",
        code: "BATERIA-60AH",
        stockQuantity: 6,
        costPrice: 220.00,
        salePrice: 379.90,
      },
    }),
    prisma.product.create({
      data: {
        name: "Lâmpada H7 12V 55W",
        code: "LAMP-H7-55W",
        stockQuantity: 40,
        costPrice: 8.00,
        salePrice: 18.90,
      },
    }),
    prisma.product.create({
      data: {
        name: "Fluido de Freio DOT 4 500ml",
        code: "FLUIDO-FREIO",
        stockQuantity: 20,
        costPrice: 18.00,
        salePrice: 35.00,
      },
    }),
    prisma.product.create({
      data: {
        name: "Radiador Completo",
        code: "RADIADOR-001",
        stockQuantity: 2,
        costPrice: 350.00,
        salePrice: 549.90,
      },
    }),
    prisma.product.create({
      data: {
        name: "Jogo de juntas motor",
        code: "JUNTAS-MOTOR",
        stockQuantity: 3,
        costPrice: 120.00,
        salePrice: 199.90,
      },
    }),
  ])
  console.log(`   ${products.length} produtos criados`)

  console.log("👤 Criando clientes...")
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        id: "cust-001",
        name: "Maria Silva",
        phone: "(11) 99999-1111",
        email: "maria.silva@email.com",
        document: "123.456.789-00",
        birthday: new Date("1985-03-15"),
      },
    }),
    prisma.customer.create({
      data: {
        id: "cust-002",
        name: "João Santos",
        phone: "(11) 88888-2222",
        email: "joao.santos@email.com",
        document: "234.567.890-12",
      },
    }),
    prisma.customer.create({
      data: {
        id: "cust-003",
        name: "Carlos Oliveira",
        phone: "(11) 77777-3333",
        email: "carlos.oliveira@email.com",
        document: "345.678.901-23",
      },
    }),
    prisma.customer.create({
      data: {
        id: "cust-004",
        name: "Ana Ferreira",
        phone: "(11) 66666-4444",
        email: "ana.ferreira@email.com",
      },
    }),
    prisma.customer.create({
      data: {
        id: "cust-005",
        name: "Pedro Costa",
        phone: "(11) 55555-5555",
        email: "pedro.costa@email.com",
        document: "456.789.012-34",
      },
    }),
    prisma.customer.create({
      data: {
        id: "cust-006",
        name: "Lúcia Mendes",
        phone: "(11) 44444-6666",
      },
    }),
    prisma.customer.create({
      data: {
        id: "cust-007",
        name: "Roberto Almeida",
        phone: "(11) 33333-7777",
        email: "roberto.almeida@email.com",
      },
    }),
    prisma.customer.create({
      data: {
        id: "cust-008",
        name: "Fernanda Lima",
        phone: "(11) 22222-8888",
        email: "fernanda.lima@email.com",
      },
    }),
  ])
  console.log(`   ${customers.length} clientes criados`)

  console.log("🚗 Criando veículos...")
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        id: "veh-001",
        customerId: "cust-001",
        plate: "ABC-1234",
        model: "Gol",
        brand: "Volkswagen",
        year: 2019,
        color: "Prata",
        km: 45000,
      },
    }),
    prisma.vehicle.create({
      data: {
        id: "veh-002",
        customerId: "cust-001",
        plate: "DEF-5678",
        model: "Civic",
        brand: "Honda",
        year: 2020,
        color: "Preto",
        km: 32000,
      },
    }),
    prisma.vehicle.create({
      data: {
        id: "veh-003",
        customerId: "cust-002",
        plate: "GHI-9012",
        model: "Onix",
        brand: "Chevrolet",
        year: 2022,
        color: "Branco",
        km: 18000,
      },
    }),
    prisma.vehicle.create({
      data: {
        id: "veh-004",
        customerId: "cust-003",
        plate: "JKL-3456",
        model: "Fiesta",
        brand: "Ford",
        year: 2017,
        color: "Vermelho",
        km: 78000,
      },
    }),
    prisma.vehicle.create({
      data: {
        id: "veh-005",
        customerId: "cust-003",
        plate: "MNO-7890",
        model: "Corolla",
        brand: "Toyota",
        year: 2021,
        color: "Cinza",
        km: 25000,
      },
    }),
    prisma.vehicle.create({
      data: {
        id: "veh-006",
        customerId: "cust-004",
        plate: "PQR-1234",
        model: "HB20",
        brand: "Hyundai",
        year: 2023,
        color: "Azul",
        km: 8000,
      },
    }),
    prisma.vehicle.create({
      data: {
        id: "veh-007",
        customerId: "cust-005",
        plate: "STU-5678",
        model: "Polo",
        brand: "Volkswagen",
        year: 2020,
        color: "Branco",
        km: 38000,
      },
    }),
    prisma.vehicle.create({
      data: {
        id: "veh-008",
        customerId: "cust-006",
        plate: "VWX-9012",
        model: "Cruze",
        brand: "Chevrolet",
        year: 2018,
        color: "Preto",
        km: 62000,
      },
    }),
    prisma.vehicle.create({
      data: {
        id: "veh-009",
        customerId: "cust-007",
        plate: "YZA-3456",
        model: "Compass",
        brand: "Jeep",
        year: 2022,
        color: "Branco",
        km: 15000,
      },
    }),
    prisma.vehicle.create({
      data: {
        id: "veh-010",
        customerId: "cust-008",
        plate: "BCD-7890",
        model: "Renegade",
        brand: "Jeep",
        year: 2021,
        color: "Vermelho",
        km: 28000,
      },
    }),
    prisma.vehicle.create({
      data: {
        id: "veh-011",
        customerId: "cust-002",
        plate: "EFG-1111",
        model: "Ka",
        brand: "Ford",
        year: 2016,
        color: "Azul",
        km: 95000,
      },
    }),
    prisma.vehicle.create({
      data: {
        id: "veh-012",
        customerId: "cust-004",
        plate: "HIJ-2222",
        model: "Argo",
        brand: "Fiat",
        year: 2023,
        color: "Cinza",
        km: 5000,
      },
    }),
  ])
  console.log(`   ${vehicles.length} veículos criados`)

  console.log("📋 Criando Ordens de Serviço...")

  await prisma.serviceOrder.create({
    data: {
      id: "os-001",
      vehicleId: "veh-001",
      status: "OPEN",
      description: "Cliente relata que o carro está fazendo barulho no motor ao acelerar. Necessário verificar.",
      isOutsourced: false,
      totalAmount: 350.00,
      mechanics: {
        create: [{ mechanicId: "mech-001" }],
      },
      items: {
        create: [
          { type: "SERVICE", description: "Diagnóstico do motor", quantity: 1, unitPrice: 150.00 },
          { type: "PART", productId: products[3].id, description: "Vela de Ignição NGK", quantity: 4, unitPrice: 45.00 },
        ],
      },
    },
  })

  await prisma.serviceOrder.create({
    data: {
      id: "os-002",
      vehicleId: "veh-003",
      status: "OPEN",
      description: "Revisão de freios. Cliente mencionou que está freando devagar.",
      isOutsourced: false,
      totalAmount: 459.70,
      mechanics: {
        create: [{ mechanicId: "mech-002" }],
      },
      items: {
        create: [
          { type: "PART", productId: products[2].id, description: "Pastilha de Freio Dianteira", quantity: 2, unitPrice: 89.90 },
          { type: "PART", productId: products[9].id, description: "Fluido de Freio DOT 4", quantity: 2, unitPrice: 35.00 },
          { type: "SERVICE", description: "Troca de pastilhas e sangria do freio", quantity: 1, unitPrice: 150.00 },
        ],
      },
    },
  })

  await prisma.serviceOrder.create({
    data: {
      id: "os-003",
      vehicleId: "veh-005",
      status: "IN_PROGRESS",
      description: "Revisão completa de 50.000 km. Trocar óleo, filtros e verificar correias.",
      isOutsourced: false,
      totalAmount: 689.60,
      mechanics: {
        create: [{ mechanicId: "mech-001" }, { mechanicId: "mech-003" }],
      },
      items: {
        create: [
          { type: "PART", productId: products[0].id, description: "Óleo Sintético 5W30 4L", quantity: 1, unitPrice: 189.90 },
          { type: "PART", productId: products[1].id, description: "Filtro de Ar", quantity: 1, unitPrice: 59.90 },
          { type: "PART", productId: products[5].id, description: "Filtro de Óleo", quantity: 1, unitPrice: 29.90 },
          { type: "SERVICE", description: "Mão de obra revisão 50k", quantity: 1, unitPrice: 200.00 },
        ],
      },
    },
  })

  await prisma.serviceOrder.create({
    data: {
      id: "os-004",
      vehicleId: "veh-004",
      status: "IN_PROGRESS",
      description: "Carro não está ligando de manhã. Suspeita de bateria ou partida.",
      isOutsourced: false,
      totalAmount: 549.90,
      mechanics: {
        create: [{ mechanicId: "mech-003" }],
      },
      items: {
        create: [
          { type: "PART", productId: products[7].id, description: "Bateria 60Ah", quantity: 1, unitPrice: 379.90 },
          { type: "SERVICE", description: "Teste de partida e alternador", quantity: 1, unitPrice: 100.00 },
        ],
      },
    },
  })

  await prisma.serviceOrder.create({
    data: {
      id: "os-005",
      vehicleId: "veh-006",
      status: "IN_PROGRESS",
      description: "Pneu furou na estrada. Cliente trocou pelo step mas precisa de reparo.",
      isOutsourced: false,
      totalAmount: 95.00,
      mechanics: {
        create: [{ mechanicId: "mech-001" }],
      },
      items: {
        create: [
          { type: "SERVICE", description: "Reparo de pneu", quantity: 1, unitPrice: 50.00 },
          { type: "SERVICE", description: "Balanceamento", quantity: 1, unitPrice: 45.00 },
        ],
      },
    },
  })

  await prisma.serviceOrder.create({
    data: {
      id: "os-006",
      vehicleId: "veh-008",
      status: "WAITING_PARTS_THIRD_PARTY",
      description: "Para-brisa trincado. Necessita troca completa.",
      isOutsourced: true,
      thirdPartyId: "tp-004",
      totalAmount: 850.00,
      mechanics: {
        create: [{ mechanicId: "mech-002" }],
      },
      items: {
        create: [
          { type: "SERVICE", description: "Remoção do para-brisa danificado", quantity: 1, unitPrice: 150.00 },
          { type: "SERVICE", description: "Instalação novo para-brisa (Terceiro)", quantity: 1, unitPrice: 500.00 },
          { type: "SERVICE", description: "Calibração câmera de ré", quantity: 1, unitPrice: 200.00 },
        ],
      },
    },
  })

  await prisma.serviceOrder.create({
    data: {
      id: "os-007",
      vehicleId: "veh-009",
      status: "DONE",
      description: "Revisão de 15.000 km + troca de lâmpada do farol.",
      isOutsourced: false,
      totalAmount: 428.70,
      mechanics: {
        create: [{ mechanicId: "mech-001" }],
      },
      items: {
        create: [
          { type: "PART", productId: products[0].id, description: "Óleo Sintético 5W30 4L", quantity: 1, unitPrice: 189.90 },
          { type: "PART", productId: products[5].id, description: "Filtro de Óleo", quantity: 1, unitPrice: 29.90 },
          { type: "PART", productId: products[8].id, description: "Lâmpada H7", quantity: 2, unitPrice: 18.90 },
          { type: "SERVICE", description: "Revisão 15.000 km", quantity: 1, unitPrice: 150.00 },
        ],
      },
    },
  })

  await prisma.serviceOrder.create({
    data: {
      id: "os-008",
      vehicleId: "veh-002",
      status: "DONE",
      description: "Troca de correia dentada e inspeção completa.",
      isOutsourced: false,
      totalAmount: 899.60,
      mechanics: {
        create: [{ mechanicId: "mech-001" }, { mechanicId: "mech-002" }],
      },
      items: {
        create: [
          { type: "PART", productId: products[4].id, description: "Correia Dentada", quantity: 1, unitPrice: 149.90 },
          { type: "PART", productId: products[11].id, description: "Jogo de juntas motor", quantity: 1, unitPrice: 199.90 },
          { type: "SERVICE", description: "Troca correia dentada", quantity: 1, unitPrice: 350.00 },
          { type: "SERVICE", description: "Mão de obra adicional", quantity: 1, unitPrice: 200.00 },
        ],
      },
    },
  })

  await prisma.serviceOrder.create({
    data: {
      id: "os-009",
      vehicleId: "veh-010",
      status: "BILLED",
      description: "Revisão completa de 25.000 km + troca de fluido de freio.",
      isOutsourced: false,
      totalAmount: 614.70,
      mechanics: {
        create: [{ mechanicId: "mech-001" }],
      },
      items: {
        create: [
          { type: "PART", productId: products[0].id, description: "Óleo Sintético 5W30 4L", quantity: 1, unitPrice: 189.90 },
          { type: "PART", productId: products[1].id, description: "Filtro de Ar", quantity: 1, unitPrice: 59.90 },
          { type: "PART", productId: products[5].id, description: "Filtro de Óleo", quantity: 1, unitPrice: 29.90 },
          { type: "PART", productId: products[9].id, description: "Fluido de Freio DOT 4", quantity: 1, unitPrice: 35.00 },
          { type: "SERVICE", description: "Revisão 25.000 km", quantity: 1, unitPrice: 180.00 },
          { type: "SERVICE", description: "Sangria do freio", quantity: 1, unitPrice: 120.00 },
        ],
      },
    },
  })

  await prisma.serviceOrder.create({
    data: {
      id: "os-010",
      vehicleId: "veh-007",
      status: "CANCELLED",
      description: "Cliente desistiu do serviço de troca de radiador.",
      isOutsourced: false,
      totalAmount: 0,
      mechanics: {
        create: [],
      },
      items: {
        create: [],
      },
    },
  })

  console.log("   10 Ordens de Serviço criadas")
  console.log("   - 2 Abertas (OPEN)")
  console.log("   - 3 Em Andamento (IN_PROGRESS)")
  console.log("   - 1 Aguardando Terceiro (WAITING_PARTS)")
  console.log("   - 2 Concluídas (DONE)")
  console.log("   - 1 Faturada (BILLED)")
  console.log("   - 1 Cancelada (CANCELLED)")

  console.log("")
  console.log("🎉 Seed concluído com sucesso!")
  console.log("")
  console.log("📊 Resumo:")
  console.log(`   • ${customers.length} clientes`)
  console.log(`   • ${vehicles.length} veículos`)
  console.log(`   • ${mechanics.length} mecânicos`)
  console.log(`   • ${thirdParties.length} terceiros`)
  console.log(`   • ${products.length} produtos`)
  console.log(`   • 10 Ordens de Serviço`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
