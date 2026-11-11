import {
  BusinessProfile,
  Customer,
  Product,
  Sale,
  Expense,
  Receivable,
  Appointment,
  Task,
  Campaign,
  CreativeArt,
  SocialConnection,
  LoyaltyProgram,
  NotificationItem,
  EvolutionPlan
} from '../types';

export const DEMO_BUSINESS: BusinessProfile = {
  id: 'biz-demo-01',
  name: 'Bella Modas & Estilo',
  ownerName: 'Mariana Silveira',
  email: 'mariana.silveira@bellamodas.com.br',
  phone: '(11) 98765-4321',
  document: '42.123.456/0001-89',
  segment: 'Moda Feminina & Acessórios',
  businessType: 'products',
  businessModel: 'both',
  city: 'São Paulo',
  state: 'SP',
  timeInBusiness: '2 anos',
  teamSize: '2 pessoas',
  mainGoal: 'Aumentar faturamento e fidelizar clientes recorrentes',
  biggestDifficulty: 'Organizar cobranças de fiado e manter postagens diárias nas redes',
  channels: ['Instagram', 'WhatsApp', 'Loja Física'],
  monthlyRevenue: 'R$ 15.000 a R$ 25.000',
  initialTools: ['Financeiro', 'Fiado', 'Marketing IA', 'Clientes'],
  brandPrimaryColor: '#4f46e5',
  brandSecondaryColor: '#8b5cf6',
  plan: 'pro',
  createdAt: '2025-01-15T10:00:00Z',
};

export const DEMO_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Camila Rodrigues',
    phone: '(11) 99123-4567',
    email: 'camila.rodrigues@email.com',
    notes: 'Cliente VIP, prefere vestidos estampados e peças tamanho M.',
    tags: ['VIP', 'Recorrente', 'WhatsApp'],
    birthDate: '1992-05-14',
    address: 'Rua das Flores, 142 - Moema, SP',
    totalPurchases: 2840.50,
    lastPurchaseDate: '2026-10-28',
    loyaltyPoints: 284,
    createdAt: '2025-02-10T14:30:00Z',
  },
  {
    id: 'cust-2',
    name: 'Juliana Mendes',
    phone: '(11) 98234-5678',
    email: 'ju.mendes@email.com',
    notes: 'Compra fiado todo mês e quita no 5º dia útil pontualmente.',
    tags: ['Fiado Bom Pagador', 'Fiel'],
    birthDate: '1988-11-20',
    address: 'Av. Paulista, 800 - Bela Vista, SP',
    totalPurchases: 1950.00,
    lastPurchaseDate: '2026-10-25',
    loyaltyPoints: 195,
    createdAt: '2025-03-05T09:15:00Z',
  },
  {
    id: 'cust-3',
    name: 'Fernanda Lima',
    phone: '(11) 97345-6789',
    email: 'fernanda.lima@email.com',
    notes: 'Não compra há 42 dias. Costumava vir quinzenalmente.',
    tags: ['Inativo', 'Atenção Retorno'],
    birthDate: '1995-03-08',
    address: 'Rua Augusta, 1200 - Consolação, SP',
    totalPurchases: 780.00,
    lastPurchaseDate: '2026-09-22',
    loyaltyPoints: 78,
    createdAt: '2025-04-12T16:00:00Z',
  },
  {
    id: 'cust-4',
    name: 'Patrícia Souza',
    phone: '(11) 96456-7890',
    email: 'paty.souza@email.com',
    notes: 'Possui saldo em aberto com vencimento recente.',
    tags: ['Fiado Pendente', 'WhatsApp'],
    birthDate: '1990-08-30',
    address: 'Rua Pamplona, 450 - Jardins, SP',
    totalPurchases: 1240.00,
    lastPurchaseDate: '2026-10-10',
    loyaltyPoints: 124,
    createdAt: '2025-05-18T11:20:00Z',
  },
  {
    id: 'cust-5',
    name: 'Renata Albuquerque',
    phone: '(11) 95567-8901',
    email: 'renata.alb@email.com',
    notes: 'Nova cliente trazida por indicação da Camila.',
    tags: ['Nova Cliente', 'Indicação'],
    birthDate: '1998-12-05',
    address: 'Rua Oscar Freire, 310 - Pinheiros, SP',
    totalPurchases: 320.00,
    lastPurchaseDate: '2026-11-01',
    loyaltyPoints: 32,
    createdAt: '2026-11-01T15:40:00Z',
  }
];

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    code: 'VEST-001',
    name: 'Vestido Midi Floral Primavera',
    description: 'Vestido em crepe com forro suave e caimento perfeito.',
    category: 'Vestidos',
    cost: 58.00,
    price: 159.90,
    stock: 14,
    minStock: 5,
    supplier: 'Tecidos & Confecções Brás',
    unit: 'un',
    active: true,
    createdAt: '2025-01-20T10:00:00Z',
  },
  {
    id: 'prod-2',
    code: 'BLUS-002',
    name: 'Blusa Crepe Seda Gola Laço',
    description: 'Elegante para ambiente de trabalho e eventos sociais.',
    category: 'Blusas',
    cost: 35.00,
    price: 99.90,
    stock: 3, // Low stock alert!
    minStock: 6,
    supplier: 'Confecções Bom Retiro',
    unit: 'un',
    active: true,
    createdAt: '2025-02-10T11:00:00Z',
  },
  {
    id: 'prod-3',
    code: 'CALC-003',
    name: 'Calça Alfaiataria Wide Leg',
    description: 'Corte reto de alta costura com bolsos laterais.',
    category: 'Calças',
    cost: 72.00,
    price: 189.90,
    stock: 9,
    minStock: 4,
    supplier: 'Moda Sul Têxtil',
    unit: 'un',
    active: true,
    createdAt: '2025-03-01T09:30:00Z',
  },
  {
    id: 'prod-4',
    code: 'ACES-004',
    name: 'Cinto Couro Fivela Dourada',
    description: 'Acessório coringa para finalizar looks refinados.',
    category: 'Acessórios',
    cost: 18.00,
    price: 49.90,
    stock: 22,
    minStock: 8,
    supplier: 'Acessórios SP Express',
    unit: 'un',
    active: true,
    createdAt: '2025-04-05T14:00:00Z',
  },
  {
    id: 'prod-5',
    code: 'BLAZ-005',
    name: 'Blazer Estruturado Premium',
    description: 'Blazer forrado com ombreira sutil e tecido alfaiataria encorpado.',
    category: 'Blazers',
    cost: 110.00,
    price: 269.90,
    stock: 2, // Low stock alert!
    minStock: 4,
    supplier: 'Confecções Bom Retiro',
    unit: 'un',
    active: true,
    createdAt: '2025-05-15T16:20:00Z',
  }
];

export const DEMO_SALES: Sale[] = [
  {
    id: 'sale-1',
    saleNumber: 'PED-2026-104',
    customerId: 'cust-1',
    customerName: 'Camila Rodrigues',
    items: [
      { productId: 'prod-1', productName: 'Vestido Midi Floral Primavera', quantity: 1, unitPrice: 159.90, total: 159.90 },
      { productId: 'prod-4', productName: 'Cinto Couro Fivela Dourada', quantity: 1, unitPrice: 49.90, total: 49.90 }
    ],
    subtotal: 209.80,
    discount: 10.00,
    total: 199.80,
    paymentMethod: 'pix',
    isPaid: true,
    createdAt: '2026-10-28T15:30:00Z',
    notes: 'Cliente pagou à vista via Pix.'
  },
  {
    id: 'sale-2',
    saleNumber: 'PED-2026-103',
    customerId: 'cust-2',
    customerName: 'Juliana Mendes',
    items: [
      { productId: 'prod-3', productName: 'Calça Alfaiataria Wide Leg', quantity: 1, unitPrice: 189.90, total: 189.90 }
    ],
    subtotal: 189.90,
    discount: 0,
    total: 189.90,
    paymentMethod: 'fiado',
    isPaid: false,
    createdAt: '2026-10-25T11:15:00Z',
    notes: 'Anotado no fiado para pagar dia 05/11.'
  },
  {
    id: 'sale-3',
    saleNumber: 'PED-2026-102',
    customerId: 'cust-5',
    customerName: 'Renata Albuquerque',
    items: [
      { productId: 'prod-2', productName: 'Blusa Crepe Seda Gola Laço', quantity: 2, unitPrice: 99.90, total: 199.80 },
      { productId: 'prod-4', productName: 'Cinto Couro Fivela Dourada', quantity: 1, unitPrice: 49.90, total: 49.90 }
    ],
    subtotal: 249.70,
    discount: 0,
    total: 249.70,
    paymentMethod: 'cartao_credito',
    isPaid: true,
    installments: 2,
    createdAt: '2026-11-01T14:40:00Z',
  },
  {
    id: 'sale-4',
    saleNumber: 'PED-2026-101',
    customerName: 'Consumidor Balcão',
    items: [
      { productId: 'prod-1', productName: 'Vestido Midi Floral Primavera', quantity: 1, unitPrice: 159.90, total: 159.90 }
    ],
    subtotal: 159.90,
    discount: 0,
    total: 159.90,
    paymentMethod: 'cartao_debito',
    isPaid: true,
    createdAt: '2026-11-02T16:00:00Z',
  }
];

export const DEMO_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    description: 'Aluguel do Espaço Comercial',
    category: 'aluguel',
    amount: 1800.00,
    dueDate: '2026-11-10',
    isPaid: false,
    recurring: true,
    createdAt: '2026-10-01T08:00:00Z',
  },
  {
    id: 'exp-2',
    description: 'Fornecedor Brás Tecidos (Lote de Vestidos)',
    category: 'fornecedores',
    amount: 1160.00,
    dueDate: '2026-11-05',
    isPaid: false,
    recurring: false,
    createdAt: '2026-10-15T10:00:00Z',
  },
  {
    id: 'exp-3',
    description: 'Conta de Energia Elétrica (Enel)',
    category: 'utilidades',
    amount: 245.80,
    dueDate: '2026-11-12',
    isPaid: false,
    recurring: true,
    createdAt: '2026-10-25T09:00:00Z',
  },
  {
    id: 'exp-4',
    description: 'Anúncios Instagram (Meta Ads)',
    category: 'marketing',
    amount: 350.00,
    dueDate: '2026-10-31',
    paymentDate: '2026-10-31',
    isPaid: true,
    recurring: false,
    createdAt: '2026-10-20T14:00:00Z',
  },
  {
    id: 'exp-5',
    description: 'Guia DAS MEI (Simples Nacional)',
    category: 'impostos',
    amount: 75.00,
    dueDate: '2026-11-20',
    isPaid: false,
    recurring: true,
    createdAt: '2026-11-01T08:00:00Z',
  }
];

export const DEMO_RECEIVABLES: Receivable[] = [
  {
    id: 'rec-1',
    customerId: 'cust-2',
    customerName: 'Juliana Mendes',
    customerPhone: '(11) 98234-5678',
    description: '1x Calça Alfaiataria Wide Leg',
    totalAmount: 189.90,
    paidAmount: 0,
    remainingAmount: 189.90,
    dueDate: '2026-11-05',
    status: 'pendente',
    partialPayments: [],
    createdAt: '2026-10-25T11:15:00Z',
  },
  {
    id: 'rec-2',
    customerId: 'cust-4',
    customerName: 'Patrícia Souza',
    customerPhone: '(11) 96456-7890',
    description: '2x Blusas Crepe + Cinto',
    totalAmount: 249.70,
    paidAmount: 100.00,
    remainingAmount: 149.70,
    dueDate: '2026-10-20',
    status: 'vencido',
    partialPayments: [
      { id: 'pay-1', amount: 100.00, date: '2026-10-20', method: 'Pix', notes: 'Pagamento de entrada' }
    ],
    createdAt: '2026-10-10T12:00:00Z',
  }
];

export const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    title: 'Prova de Look e Consultoria VIP',
    type: 'atendimento',
    customerName: 'Camila Rodrigues',
    date: '2026-11-04',
    time: '14:30',
    durationMinutes: 45,
    status: 'pendente',
    notes: 'Separar modelos em tamanho M e vestidos de festa.'
  },
  {
    id: 'app-2',
    title: 'Recebimento de Mercadoria - Confecções Bom Retiro',
    type: 'entrega',
    date: '2026-11-05',
    time: '10:00',
    durationMinutes: 30,
    status: 'pendente',
    notes: 'Conferir nota fiscal e quantidades de blusas.'
  },
  {
    id: 'app-3',
    title: 'Mensagem de Pós-Venda para Clientes de Outubro',
    type: 'retorno',
    date: '2026-11-06',
    time: '11:00',
    durationMinutes: 20,
    status: 'pendente',
    notes: 'Perguntar como ficou o caimento e enviar cupom de 10%.'
  }
];

export const DEMO_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Cobrar fiado vencido da Patrícia Souza com mensagem educada',
    priority: 'alta',
    dueDate: '2026-11-04',
    completed: false,
    category: 'Financeiro'
  },
  {
    id: 'task-2',
    title: 'Fazer pedido de reposição da Blusa Crepe (restam apenas 3)',
    priority: 'alta',
    dueDate: '2026-11-04',
    completed: false,
    category: 'Estoque'
  },
  {
    id: 'task-3',
    title: 'Postar carrossel da nova coleção no Instagram e Stories',
    priority: 'media',
    dueDate: '2026-11-05',
    completed: false,
    category: 'Marketing'
  },
  {
    id: 'task-4',
    title: 'Pagar boleto do fornecedor Tecidos Brás (R$ 1.160,00)',
    priority: 'alta',
    dueDate: '2026-11-05',
    completed: false,
    category: 'Financeiro'
  }
];

export const DEMO_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    title: 'Lançamento Coleção Primavera & Oferta Sexta-Feira',
    objective: 'Atrair clientes e aumentar vendas',
    brief: 'Quero divulgar uma promoção de sexta-feira com desconto especial no Pix para minha loja de moda feminina.',
    status: 'aprovado',
    instagramPost: '✨ SEXTA-FEIRA ESPECIAL NA BELLA MODAS! ✨\n\nMeninas, preparamos uma condição única para renovar o look com elegância: toda a linha floral e alfaiataria com 15% OFF no Pix nesta sexta!\n\n🛍️ Peças exclusivas e limitadas.\n📍 Atendimento presencial ou envio rápido via motoboy.\n\nComente QUERO ou chame no WhatsApp para garantir o seu tamanho!',
    instagramCaption: 'Sexta-feira é dia de se presentear! Nossa seleção primavera une conforto, sofisticação e caimento impecável para mulheres que não abrem mão de estilo. Toque no link da bio para reservar antes que seu tamanho esgote!',
    artIdea: 'Fundo lilás suave com fotos em moldura moderna, tipografia elegante dourada com a chamada: "SEXTA VIP - 15% OFF NO PIX" e selo de edição limitada.',
    imageUrl: '/src/assets/images/promo_fashion_banner_1793796392178.jpg',
    imageModel: 'Criador de Imagens Promocionais',
    imagePrompt: 'Coleção de moda contemporânea elegante com modelo em estúdio e luz suave',
    whatsappMessage: '🌸 *Oi, linda! Tudo bem?* 🌸\n\nPassando aqui da *Bella Modas* para te dar um spoiler exclusivo: amanhã é nossa Sexta VIP!\n\nVocê tem *15% de desconto no Pix* em vestidos e alfaiataria selecionados. Como você é nossa cliente especial, já reservei seu atendimento antecipado! Quer que eu te envie as fotos das novidades? 👗📲',
    videoScript: '[00-03s] Gancho na câmera: "Se você ama look elegante sem pagar caro, pausa esse vídeo!"\n[03-15s] Mostre 3 composições de look com o Vestido Midi Floral.\n[15-30s] "Nesta sexta, todas essas peças estão com condição especial no Pix. Link no perfil para garantir o seu!"',
    targetAudience: 'Mulheres de 24 a 50 anos, residentes em São Paulo, interessadas em moda, elegância casual e trabalho.',
    bestTimes: 'Quinta às 19h (teaser) e Sexta às 11h30 (horário de almoço).',
    editorialCalendar: 'Fase 1: Stories revelando as novidades; Fase 2: Feed e disparo no WhatsApp na sexta às 10h.',
    hashtags: ['#modafeminina', '#lookdodia', '#alfaiatariafeminina', '#vestidofloral', '#promocaosp'],
    createdAt: '2026-10-30T10:00:00Z',
  }
];

export const DEMO_CREATIVE_ARTS: CreativeArt[] = [
  {
    id: 'art-1',
    title: 'Banner Sexta VIP 15% OFF',
    format: 'instagram_feed',
    headline: 'SEXTA VIP NA BELLA',
    subheadline: '15% de desconto especial em toda a linha primavera',
    ctaText: 'CHAME NO WHATSAPP',
    style: 'elegante',
    bgColor: '#1e1b4b',
    textColor: '#ffffff',
    accentColor: '#c084fc',
    badge: 'OFERTA EXCLUSIVA',
    imageUrl: '/src/assets/images/promo_fashion_banner_1793796392178.jpg',
    imageModel: 'Criador de Imagens Promocionais',
    imagePrompt: 'Coleção de moda contemporânea elegante com modelo em estúdio e luz suave',
    createdAt: '2026-10-30T11:00:00Z'
  },
  {
    id: 'art-2',
    title: 'Stories Lembrete de Novidades',
    format: 'stories',
    headline: 'CHEGARAM NOVIDADES!',
    subheadline: 'Vestidos com caimento impecável e tecidos nobres',
    ctaText: 'ARRASTE PARA VER',
    style: 'moderno',
    bgColor: '#0f172a',
    textColor: '#ffffff',
    accentColor: '#38bdf8',
    badge: 'NOVA COLEÇÃO',
    createdAt: '2026-11-01T09:00:00Z'
  }
];

export const DEMO_SOCIAL_CONNECTIONS: SocialConnection[] = [
  {
    platform: 'instagram',
    name: 'Instagram Profissional',
    connected: false,
    accountHandle: '@bellamodas.oficial',
    notes: 'Requer vincular à Página do Facebook via Meta Graph API Oficial.'
  },
  {
    platform: 'facebook',
    name: 'Página Facebook',
    connected: false,
    accountHandle: 'Bella Modas SP',
    notes: 'Requer autorização com escopos pages_manage_posts via Meta Business.'
  },
  {
    platform: 'whatsapp_business',
    name: 'WhatsApp Business Cloud API',
    connected: false,
    accountHandle: '+55 11 98765-4321',
    notes: 'Permite disparo de mensagens homologadas via Meta Cloud API.'
  },
  {
    platform: 'tiktok',
    name: 'TikTok for Business',
    connected: false,
    accountHandle: '@bellamodas',
    notes: 'Requer TikTok Developer App para agendamento de vídeos.'
  }
];

export const DEMO_LOYALTY: LoyaltyProgram = {
  pointsPerReal: 0.1, // R$ 10 = 1 ponto
  minPointsToRedeem: 50,
  rewards: [
    {
      id: 'rew-1',
      name: 'Cupom de R$ 20 de Desconto',
      pointsRequired: 50,
      discountValue: 20,
      description: 'Válido para compras acima de R$ 100 na loja ou WhatsApp.',
      active: true
    },
    {
      id: 'rew-2',
      name: 'Cupom de R$ 50 de Desconto',
      pointsRequired: 100,
      discountValue: 50,
      description: 'Válido em qualquer produto da coleção vigente.',
      active: true
    },
    {
      id: 'rew-3',
      name: 'Mimo Surpresa Exclusivo (Acessório)',
      pointsRequired: 150,
      discountValue: 40,
      description: 'Acessório surpresa embalado para presente.',
      active: true
    }
  ]
};

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Estoque Baixo: Blusa Crepe Seda',
    message: 'Restam apenas 3 unidades no estoque. O estoque mínimo recomendado é 6.',
    type: 'warning',
    read: false,
    linkTab: 'inventory',
    createdAt: '2026-11-03T08:00:00Z',
  },
  {
    id: 'notif-2',
    title: 'Fiado Vencido: Patrícia Souza',
    message: 'Saldo restante de R$ 149,70 venceu em 20/10. Use a cobrança educada por IA.',
    type: 'alert',
    read: false,
    linkTab: 'fiado',
    createdAt: '2026-11-02T10:00:00Z',
  },
  {
    id: 'notif-3',
    title: 'Boleto de Aluguel Vencendo em Breve',
    message: 'Aluguel do espaço comercial vence no dia 10/11 (R$ 1.800,00).',
    type: 'info',
    read: true,
    linkTab: 'financial',
    createdAt: '2026-11-01T09:00:00Z',
  },
  {
    id: 'notif-4',
    title: 'Cliente sem Retorno há 40+ dias',
    message: 'Fernanda Lima costumava vir todo mês e não compra desde setembro. Que tal mandar um mimo?',
    type: 'info',
    read: false,
    linkTab: 'crm',
    createdAt: '2026-11-03T07:30:00Z',
  }
];

export const DEMO_EVOLUTION_PLAN: EvolutionPlan = {
  diagnostic: 'Seu negócio possui base sólida e clientes fiéis, mas precisa reduzir a inadimplência nos fiados e automatizar a reposição de estoque para não perder vendas.',
  sevenDays: [
    {
      id: 'ev-7-1',
      action: 'Enviar Lembrete Educado para Patrícia Souza',
      description: 'Utilize o gerador de mensagem amigável via IA no módulo de Fiados para negociar o saldo restante com chave Pix.',
      category: 'Financeiro',
      completed: false
    },
    {
      id: 'ev-7-2',
      action: 'Repor Blusas Crepe e Blazers Estruturados',
      description: 'Emitir pedido aos fornecedores do Bom Retiro antes do final de semana para não ficar sem itens mais vendidos.',
      category: 'Estoque',
      completed: false
    },
    {
      id: 'ev-7-3',
      action: 'Disparar Campanha de Sexta VIP no WhatsApp',
      description: 'Copiar a mensagem aprovada na área de Marketing e enviar para as clientes VIP cadastradas no CRM.',
      category: 'Marketing',
      completed: true
    }
  ],
  thirtyDays: [
    {
      id: 'ev-30-1',
      action: 'Implantar Regra de Limite de Fiado por Cliente',
      description: 'Definir teto de R$ 250 em fiado para novos clientes e exigir entrada de 50% para proteger o fluxo de caixa.',
      category: 'Financeiro',
      completed: false
    },
    {
      id: 'ev-30-2',
      action: 'Ativar Programa de Pontos e Cupons no Balcão',
      description: 'Apresentar aos clientes que a cada R$ 100 em compras eles ganham pontos para resgatar brindes e descontos.',
      category: 'Fidelização',
      completed: false
    }
  ],
  ninetyDays: [
    {
      id: 'ev-90-1',
      action: 'Criar Canal Digital de Vendas com Catálogo Online',
      description: 'Integrar fotos do Estúdio Criativo em catálogo no WhatsApp Business para atender cidades vizinhas.',
      category: 'Vendas',
      completed: false
    },
    {
      id: 'ev-90-2',
      action: 'Atingir Meta de Faturamento Mensal de R$ 25.000',
      description: 'Aumentar o ticket médio de R$ 180 para R$ 240 através de combos e acessórios adicionais no fechamento.',
      category: 'Vendas',
      completed: false
    }
  ],
  lastUpdated: '2026-11-03T08:00:00Z'
};
