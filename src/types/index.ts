export type PlanType = 'gratuito' | 'pro' | 'premium';

export interface BusinessProfile {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  document: string; // CNPJ ou CPF
  segment: string;
  businessType: 'products' | 'services' | 'both';
  businessModel: 'physical' | 'digital' | 'both';
  city: string;
  state: string;
  timeInBusiness: string;
  teamSize: string;
  mainGoal: string;
  biggestDifficulty: string;
  channels: string[];
  monthlyRevenue?: string;
  initialTools: string[];
  logoUrl?: string;
  brandPrimaryColor?: string;
  brandSecondaryColor?: string;
  plan: PlanType;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes?: string;
  tags: string[];
  birthDate?: string;
  address?: string;
  totalPurchases: number;
  lastPurchaseDate?: string;
  loyaltyPoints: number;
  createdAt: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: string;
  cost: number;
  price: number;
  stock: number;
  minStock: number;
  supplier?: string;
  unit: string;
  active: boolean;
  createdAt: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  date: string;
  previousStock: number;
  newStock: number;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  saleNumber: string;
  customerId?: string;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro' | 'fiado';
  isPaid: boolean;
  installments?: number;
  createdAt: string;
  notes?: string;
}

export interface Expense {
  id: string;
  description: string;
  category: 'fornecedores' | 'aluguel' | 'marketing' | 'impostos' | 'salarios' | 'utilidades' | 'outros';
  amount: number;
  dueDate: string;
  paymentDate?: string;
  isPaid: boolean;
  recurring: boolean;
  createdAt: string;
}

export interface PartialPayment {
  id: string;
  amount: number;
  date: string;
  method: string;
  notes?: string;
}

export interface Receivable {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  description: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: 'pendente' | 'vencido' | 'quitado' | 'parcial';
  partialPayments: PartialPayment[];
  createdAt: string;
  saleId?: string;
}

export interface Appointment {
  id: string;
  title: string;
  type: 'atendimento' | 'entrega' | 'reuniao' | 'retorno' | 'lembrete';
  customerName?: string;
  date: string;
  time: string;
  durationMinutes: number;
  status: 'pendente' | 'concluido' | 'cancelado';
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  priority: 'alta' | 'media' | 'baixa';
  dueDate?: string;
  completed: boolean;
  category: string;
}

export interface Campaign {
  id: string;
  title: string;
  objective: string;
  brief: string;
  status: 'gerado' | 'aprovado' | 'publicado';
  instagramPost: string;
  instagramCaption: string;
  artIdea: string;
  imageUrl?: string;
  imagePrompt?: string;
  imageModel?: string;
  whatsappMessage: string;
  facebookPost?: string;
  videoScript: string;
  targetAudience: string;
  bestTimes: string;
  editorialCalendar?: string;
  hashtags: string[];
  createdAt: string;
}

export interface CreativeArt {
  id: string;
  title: string;
  format: 'instagram_feed' | 'stories' | 'banner' | 'cartaz' | 'whatsapp' | 'anuncio';
  headline: string;
  subheadline: string;
  ctaText: string;
  style: 'moderno' | 'minimalista' | 'elegante' | 'vibrante' | 'artesanal';
  bgColor: string;
  textColor: string;
  accentColor: string;
  imageUrl?: string;
  imagePrompt?: string;
  imageModel?: string;
  badge?: string;
  createdAt: string;
}

export interface SocialConnection {
  platform: 'instagram' | 'facebook' | 'whatsapp_business' | 'tiktok';
  name: string;
  connected: boolean;
  accountHandle?: string;
  connectedAt?: string;
  scheduledPostsCount?: number;
  notes?: string;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  pointsRequired: number;
  discountValue: number;
  description: string;
  active: boolean;
}

export interface LoyaltyProgram {
  pointsPerReal: number; // Ex: 1 ponto para cada R$ 10 gastos
  minPointsToRedeem: number;
  rewards: LoyaltyReward[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success' | 'alert';
  read: boolean;
  linkTab?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionPlan?: string[];
}

export interface EvolutionAction {
  id: string;
  action: string;
  description: string;
  category: string;
  completed: boolean;
}

export interface EvolutionPlan {
  diagnostic: string;
  sevenDays: EvolutionAction[];
  thirtyDays: EvolutionAction[];
  ninetyDays: EvolutionAction[];
  lastUpdated: string;
}
