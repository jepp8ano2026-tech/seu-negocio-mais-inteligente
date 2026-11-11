import React, { createContext, useContext, useState, useEffect } from 'react';
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
  EvolutionPlan,
  PlanType,
  PartialPayment
} from '../types';
import {
  DEMO_BUSINESS,
  DEMO_CUSTOMERS,
  DEMO_PRODUCTS,
  DEMO_SALES,
  DEMO_EXPENSES,
  DEMO_RECEIVABLES,
  DEMO_APPOINTMENTS,
  DEMO_TASKS,
  DEMO_CAMPAIGNS,
  DEMO_CREATIVE_ARTS,
  DEMO_SOCIAL_CONNECTIONS,
  DEMO_LOYALTY,
  DEMO_NOTIFICATIONS,
  DEMO_EVOLUTION_PLAN
} from '../data/initialData';

export type TabType =
  | 'overview'
  | 'assistant'
  | 'marketing'
  | 'studio'
  | 'social'
  | 'financial'
  | 'schedule'
  | 'fiado'
  | 'reports'
  | 'notifications'
  | 'settings'
  | 'pricing_plans';

interface AppContextType {
  // Navigation & View
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  showLandingPage: boolean;
  setShowLandingPage: (val: boolean) => void;

  // Theme (Claro / Escuro)
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Mode & Auth
  isSimplifiedMode: boolean;
  setIsSimplifiedMode: (val: boolean) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  onboardingCompleted: boolean;
  setOnboardingCompleted: (val: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (val: boolean) => void;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (val: boolean) => void;
  loginUser: (email: string, name?: string) => void;
  logoutUser: () => void;

  // Global Quick Action Modal
  quickActionModal: 'sale' | 'expense' | 'customer' | 'appointment' | 'fiado' | null;
  setQuickActionModal: (action: 'sale' | 'expense' | 'customer' | 'appointment' | 'fiado' | null) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Entities & CRUD
  business: BusinessProfile;
  updateBusiness: (updates: Partial<BusinessProfile>) => void;
  customers: Customer[];
  addCustomer: (cust: Omit<Customer, 'id' | 'createdAt' | 'totalPurchases' | 'loyaltyPoints'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  products: Product[];
  addProduct: (prod: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (id: string, amount: number, reason: string) => void;

  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id' | 'saleNumber' | 'createdAt'>) => Sale;

  expenses: Expense[];
  addExpense: (exp: Omit<Expense, 'id' | 'createdAt'>) => Expense;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  toggleExpensePaid: (id: string) => void;

  receivables: Receivable[];
  addReceivable: (rec: Omit<Receivable, 'id' | 'createdAt' | 'paidAmount' | 'remainingAmount' | 'partialPayments' | 'status'>) => Receivable;
  addPartialPayment: (receivableId: string, payment: Omit<PartialPayment, 'id'>) => void;
  deleteReceivable: (id: string) => void;

  appointments: Appointment[];
  addAppointment: (app: Omit<Appointment, 'id'>) => Appointment;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;

  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed'>) => Task;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  campaigns: Campaign[];
  addCampaign: (camp: Omit<Campaign, 'id' | 'createdAt'>) => Campaign;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  updateCampaignStatus: (id: string, status: 'gerado' | 'aprovado' | 'publicado') => void;
  deleteCampaign: (id: string) => void;

  creativeArts: CreativeArt[];
  addCreativeArt: (art: Omit<CreativeArt, 'id' | 'createdAt'>) => CreativeArt;
  deleteCreativeArt: (id: string) => void;

  socialConnections: SocialConnection[];
  toggleSocialConnection: (platform: string, connected: boolean, accountHandle?: string) => void;

  loyaltyProgram: LoyaltyProgram;
  updateLoyaltyProgram: (updates: Partial<LoyaltyProgram>) => void;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;

  evolutionPlan: EvolutionPlan;
  toggleEvolutionAction: (period: 'sevenDays' | 'thirtyDays' | 'ninetyDays', actionId: string) => void;
  setEvolutionPlan: (plan: EvolutionPlan) => void;

  // LGPD & Backup
  exportAllDataJson: () => void;
  resetAllData: () => void;
  switchPlan: (plan: PlanType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Modals
  const [currentTab, setCurrentTab] = useState<TabType>('overview');
  const [showLandingPage, setShowLandingPage] = useState<boolean>(() => {
    return localStorage.getItem('snmi_visited') !== 'true';
  });

  // Theme: padrão 'light' (branco) conforme pedido do usuário, com opção escuro
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('snmi_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('snmi_theme', newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  const [isSimplifiedMode, setIsSimplifiedModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('snmi_simplified_mode');
    return saved !== null ? saved === 'true' : true;
  });

  const setIsSimplifiedMode = (val: boolean) => {
    setIsSimplifiedModeState(val);
    localStorage.setItem('snmi_simplified_mode', val.toString());
  };

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('snmi_demo_mode');
    return saved !== null ? saved === 'true' : true;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('snmi_authenticated') === 'true' || true;
  });

  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(() => {
    return localStorage.getItem('snmi_onboarding_completed') === 'true' || true;
  });

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [quickActionModal, setQuickActionModal] = useState<'sale' | 'expense' | 'customer' | 'appointment' | 'fiado' | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persisted state keys prefixed by mode so real data is never overwritten by demo
  const prefix = isDemoMode ? 'snmi_demo_' : 'snmi_real_';

  const [business, setBusiness] = useState<BusinessProfile>(() => {
    const saved = localStorage.getItem(`${prefix}business`);
    return saved ? JSON.parse(saved) : (isDemoMode ? DEMO_BUSINESS : {
      id: 'biz-real-01',
      name: 'Meu Novo Negócio',
      ownerName: 'Empreendedor(a)',
      email: 'contato@meunegocio.com.br',
      phone: '',
      document: '',
      segment: 'Comércio / Varejo',
      businessType: 'both',
      businessModel: 'physical',
      city: 'São Paulo',
      state: 'SP',
      timeInBusiness: 'Menos de 1 ano',
      teamSize: '1 pessoa',
      mainGoal: 'Conquistar os primeiros clientes e organizar finanças',
      biggestDifficulty: 'Falta de tempo e fluxo de caixa',
      channels: ['WhatsApp', 'Instagram'],
      initialTools: ['Financeiro', 'Clientes', 'Marketing IA'],
      plan: 'gratuito',
      createdAt: new Date().toISOString()
    });
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(`${prefix}customers`);
    return saved ? JSON.parse(saved) : (isDemoMode ? DEMO_CUSTOMERS : []);
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${prefix}products`);
    return saved ? JSON.parse(saved) : (isDemoMode ? DEMO_PRODUCTS : []);
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem(`${prefix}sales`);
    return saved ? JSON.parse(saved) : (isDemoMode ? DEMO_SALES : []);
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(`${prefix}expenses`);
    return saved ? JSON.parse(saved) : (isDemoMode ? DEMO_EXPENSES : []);
  });

  const [receivables, setReceivables] = useState<Receivable[]>(() => {
    const saved = localStorage.getItem(`${prefix}receivables`);
    return saved ? JSON.parse(saved) : (isDemoMode ? DEMO_RECEIVABLES : []);
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(`${prefix}appointments`);
    return saved ? JSON.parse(saved) : (isDemoMode ? DEMO_APPOINTMENTS : []);
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(`${prefix}tasks`);
    return saved ? JSON.parse(saved) : (isDemoMode ? DEMO_TASKS : []);
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem(`${prefix}campaigns`);
    return saved ? JSON.parse(saved) : (isDemoMode ? DEMO_CAMPAIGNS : []);
  });

  const [creativeArts, setCreativeArts] = useState<CreativeArt[]>(() => {
    const saved = localStorage.getItem(`${prefix}creativeArts`);
    return saved ? JSON.parse(saved) : (isDemoMode ? DEMO_CREATIVE_ARTS : []);
  });

  const [socialConnections, setSocialConnections] = useState<SocialConnection[]>(() => {
    const saved = localStorage.getItem(`${prefix}socialConnections`);
    return saved ? JSON.parse(saved) : (isDemoMode ? DEMO_SOCIAL_CONNECTIONS : DEMO_SOCIAL_CONNECTIONS.map(s => ({ ...s, connected: false })));
  });

  const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgram>(() => {
    const saved = localStorage.getItem(`${prefix}loyaltyProgram`);
    return saved ? JSON.parse(saved) : DEMO_LOYALTY;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${prefix}notifications`);
    return saved ? JSON.parse(saved) : (isDemoMode ? DEMO_NOTIFICATIONS : []);
  });

  const [evolutionPlan, setEvolutionPlanState] = useState<EvolutionPlan>(() => {
    const saved = localStorage.getItem(`${prefix}evolutionPlan`);
    return saved ? JSON.parse(saved) : (isDemoMode ? DEMO_EVOLUTION_PLAN : {
      diagnostic: 'Preencha o onboarding para a IA traçar seu plano de aceleração personalizado.',
      sevenDays: [],
      thirtyDays: [],
      ninetyDays: [],
      lastUpdated: new Date().toISOString()
    });
  });

  // Sync state when isDemoMode changes
  useEffect(() => {
    localStorage.setItem('snmi_demo_mode', isDemoMode.toString());
    const currentPrefix = isDemoMode ? 'snmi_demo_' : 'snmi_real_';

    const savedBiz = localStorage.getItem(`${currentPrefix}business`);
    setBusiness(savedBiz ? JSON.parse(savedBiz) : (isDemoMode ? DEMO_BUSINESS : {
      id: 'biz-real-01',
      name: 'Meu Negócio',
      ownerName: 'Empreendedor(a)',
      email: 'contato@meunegocio.com.br',
      phone: '',
      document: '',
      segment: 'Comércio / Varejo',
      businessType: 'both',
      businessModel: 'physical',
      city: 'São Paulo',
      state: 'SP',
      timeInBusiness: 'Menos de 1 ano',
      teamSize: '1 pessoa',
      mainGoal: 'Conquistar clientes e organizar finanças',
      biggestDifficulty: 'Falta de tempo e fluxo de caixa',
      channels: ['WhatsApp', 'Instagram'],
      initialTools: ['Financeiro', 'Clientes', 'Marketing IA'],
      plan: 'gratuito',
      createdAt: new Date().toISOString()
    }));

    const savedCust = localStorage.getItem(`${currentPrefix}customers`);
    setCustomers(savedCust ? JSON.parse(savedCust) : (isDemoMode ? DEMO_CUSTOMERS : []));

    const savedProd = localStorage.getItem(`${currentPrefix}products`);
    setProducts(savedProd ? JSON.parse(savedProd) : (isDemoMode ? DEMO_PRODUCTS : []));

    const savedSales = localStorage.getItem(`${currentPrefix}sales`);
    setSales(savedSales ? JSON.parse(savedSales) : (isDemoMode ? DEMO_SALES : []));

    const savedExp = localStorage.getItem(`${currentPrefix}expenses`);
    setExpenses(savedExp ? JSON.parse(savedExp) : (isDemoMode ? DEMO_EXPENSES : []));

    const savedRec = localStorage.getItem(`${currentPrefix}receivables`);
    setReceivables(savedRec ? JSON.parse(savedRec) : (isDemoMode ? DEMO_RECEIVABLES : []));

    const savedApp = localStorage.getItem(`${currentPrefix}appointments`);
    setAppointments(savedApp ? JSON.parse(savedApp) : (isDemoMode ? DEMO_APPOINTMENTS : []));

    const savedTasks = localStorage.getItem(`${currentPrefix}tasks`);
    setTasks(savedTasks ? JSON.parse(savedTasks) : (isDemoMode ? DEMO_TASKS : []));

    const savedCamps = localStorage.getItem(`${currentPrefix}campaigns`);
    setCampaigns(savedCamps ? JSON.parse(savedCamps) : (isDemoMode ? DEMO_CAMPAIGNS : []));

    const savedArts = localStorage.getItem(`${currentPrefix}creativeArts`);
    setCreativeArts(savedArts ? JSON.parse(savedArts) : (isDemoMode ? DEMO_CREATIVE_ARTS : []));

    const savedSoc = localStorage.getItem(`${currentPrefix}socialConnections`);
    setSocialConnections(savedSoc ? JSON.parse(savedSoc) : (isDemoMode ? DEMO_SOCIAL_CONNECTIONS : DEMO_SOCIAL_CONNECTIONS.map(s => ({ ...s, connected: false }))));

    const savedNotifs = localStorage.getItem(`${currentPrefix}notifications`);
    setNotifications(savedNotifs ? JSON.parse(savedNotifs) : (isDemoMode ? DEMO_NOTIFICATIONS : []));

    const savedPlan = localStorage.getItem(`${currentPrefix}evolutionPlan`);
    setEvolutionPlanState(savedPlan ? JSON.parse(savedPlan) : (isDemoMode ? DEMO_EVOLUTION_PLAN : {
      diagnostic: 'Preencha o onboarding para a IA traçar seu plano de aceleração personalizado.',
      sevenDays: [],
      thirtyDays: [],
      ninetyDays: [],
      lastUpdated: new Date().toISOString()
    }));
  }, [isDemoMode]);

  // Persist items
  useEffect(() => {
    localStorage.setItem(`${prefix}business`, JSON.stringify(business));
  }, [business, prefix]);

  useEffect(() => {
    localStorage.setItem(`${prefix}customers`, JSON.stringify(customers));
  }, [customers, prefix]);

  useEffect(() => {
    localStorage.setItem(`${prefix}products`, JSON.stringify(products));
  }, [products, prefix]);

  useEffect(() => {
    localStorage.setItem(`${prefix}sales`, JSON.stringify(sales));
  }, [sales, prefix]);

  useEffect(() => {
    localStorage.setItem(`${prefix}expenses`, JSON.stringify(expenses));
  }, [expenses, prefix]);

  useEffect(() => {
    localStorage.setItem(`${prefix}receivables`, JSON.stringify(receivables));
  }, [receivables, prefix]);

  useEffect(() => {
    localStorage.setItem(`${prefix}appointments`, JSON.stringify(appointments));
  }, [appointments, prefix]);

  useEffect(() => {
    localStorage.setItem(`${prefix}tasks`, JSON.stringify(tasks));
  }, [tasks, prefix]);

  useEffect(() => {
    localStorage.setItem(`${prefix}campaigns`, JSON.stringify(campaigns));
  }, [campaigns, prefix]);

  useEffect(() => {
    localStorage.setItem(`${prefix}creativeArts`, JSON.stringify(creativeArts));
  }, [creativeArts, prefix]);

  useEffect(() => {
    localStorage.setItem(`${prefix}socialConnections`, JSON.stringify(socialConnections));
  }, [socialConnections, prefix]);

  useEffect(() => {
    localStorage.setItem(`${prefix}notifications`, JSON.stringify(notifications));
  }, [notifications, prefix]);

  useEffect(() => {
    localStorage.setItem(`${prefix}evolutionPlan`, JSON.stringify(evolutionPlan));
  }, [evolutionPlan, prefix]);

  // Login / Logout
  const loginUser = (email: string, name?: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('snmi_authenticated', 'true');
    setShowAuthModal(false);
    setShowLandingPage(false);
    localStorage.setItem('snmi_visited', 'true');
    if (name) {
      setBusiness(prev => ({ ...prev, ownerName: name, email }));
    }
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('snmi_authenticated');
    setShowLandingPage(true);
  };

  // Business CRUD
  const updateBusiness = (updates: Partial<BusinessProfile>) => {
    setBusiness(prev => ({ ...prev, ...updates }));
  };

  // Customers CRUD
  const addCustomer = (cust: Omit<Customer, 'id' | 'createdAt' | 'totalPurchases' | 'loyaltyPoints'>): Customer => {
    const newCust: Customer = {
      ...cust,
      id: `cust-${Date.now()}`,
      totalPurchases: 0,
      loyaltyPoints: 0,
      createdAt: new Date().toISOString()
    };
    setCustomers(prev => [newCust, ...prev]);
    return newCust;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  // Products CRUD & Stock
  const addProduct = (prod: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProd: Product = {
      ...prod,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const adjustStock = (id: string, amount: number, reason: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + amount);
        // Alert if low stock
        if (newStock <= p.minStock) {
          const alertNotif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: `Estoque Baixo: ${p.name}`,
            message: `Restam ${newStock} ${p.unit}. Mínimo recomendado: ${p.minStock}.`,
            type: 'warning',
            read: false,
            linkTab: 'inventory',
            createdAt: new Date().toISOString()
          };
          setNotifications(n => [alertNotif, ...n]);
        }
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  // Sales (Transactional: deducts stock, creates receivable if fiado, adds loyalty points)
  const addSale = (saleData: Omit<Sale, 'id' | 'saleNumber' | 'createdAt'>): Sale => {
    const saleId = `sale-${Date.now()}`;
    const saleNumber = `PED-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newSale: Sale = {
      ...saleData,
      id: saleId,
      saleNumber,
      createdAt: new Date().toISOString()
    };

    // 1. Save sale
    setSales(prev => [newSale, ...prev]);

    // 2. Decrement stock for sold products
    newSale.items.forEach(item => {
      adjustStock(item.productId, -item.quantity, `Venda #${saleNumber}`);
    });

    // 3. Update customer total purchases and loyalty points
    if (newSale.customerId) {
      const pointsEarned = Math.floor(newSale.total * (loyaltyProgram.pointsPerReal || 0.1));
      setCustomers(prev => prev.map(c => {
        if (c.id === newSale.customerId) {
          return {
            ...c,
            totalPurchases: (c.totalPurchases || 0) + newSale.total,
            lastPurchaseDate: new Date().toISOString().split('T')[0],
            loyaltyPoints: (c.loyaltyPoints || 0) + pointsEarned
          };
        }
        return c;
      }));
    }

    // 4. If payment method is fiado, automatically create a Receivable!
    if (newSale.paymentMethod === 'fiado') {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30); // 30 days default for fiado
      const newRec: Receivable = {
        id: `rec-${Date.now()}`,
        customerId: newSale.customerId || 'cust-generic',
        customerName: newSale.customerName,
        customerPhone: customers.find(c => c.id === newSale.customerId)?.phone || '',
        description: newSale.items.map(i => `${i.quantity}x ${i.productName}`).join(', '),
        totalAmount: newSale.total,
        paidAmount: 0,
        remainingAmount: newSale.total,
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'pendente',
        partialPayments: [],
        createdAt: new Date().toISOString(),
        saleId: newSale.id
      };
      setReceivables(prev => [newRec, ...prev]);
    }

    return newSale;
  };

  // Expenses CRUD
  const addExpense = (exp: Omit<Expense, 'id' | 'createdAt'>): Expense => {
    const newExp: Expense = {
      ...exp,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [newExp, ...prev]);
    return newExp;
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const toggleExpensePaid = (id: string) => {
    setExpenses(prev => prev.map(e => {
      if (e.id === id) {
        const nextPaid = !e.isPaid;
        return {
          ...e,
          isPaid: nextPaid,
          paymentDate: nextPaid ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return e;
    }));
  };

  // Receivables & Fiados
  const addReceivable = (rec: Omit<Receivable, 'id' | 'createdAt' | 'paidAmount' | 'remainingAmount' | 'partialPayments' | 'status'>): Receivable => {
    const newRec: Receivable = {
      ...rec,
      id: `rec-${Date.now()}`,
      paidAmount: 0,
      remainingAmount: rec.totalAmount,
      status: 'pendente',
      partialPayments: [],
      createdAt: new Date().toISOString()
    };
    setReceivables(prev => [newRec, ...prev]);
    return newRec;
  };

  const addPartialPayment = (receivableId: string, payment: Omit<PartialPayment, 'id'>) => {
    setReceivables(prev => prev.map(r => {
      if (r.id === receivableId) {
        const newPartials = [...r.partialPayments, { ...payment, id: `pay-${Date.now()}` }];
        const newPaid = newPartials.reduce((acc, curr) => acc + curr.amount, 0);
        const newRemaining = Math.max(0, r.totalAmount - newPaid);
        const newStatus = newRemaining === 0 ? 'quitado' : 'parcial';
        return {
          ...r,
          paidAmount: newPaid,
          remainingAmount: newRemaining,
          status: newStatus,
          partialPayments: newPartials
        };
      }
      return r;
    }));
  };

  const deleteReceivable = (id: string) => {
    setReceivables(prev => prev.filter(r => r.id !== id));
  };

  // Appointments CRUD
  const addAppointment = (app: Omit<Appointment, 'id'>): Appointment => {
    const newApp: Appointment = {
      ...app,
      id: `app-${Date.now()}`
    };
    setAppointments(prev => [newApp, ...prev]);
    return newApp;
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  // Tasks CRUD
  const addTask = (task: Omit<Task, 'id' | 'completed'>): Task => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      completed: false
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Campaigns CRUD
  const addCampaign = (camp: Omit<Campaign, 'id' | 'createdAt'>): Campaign => {
    const newCamp: Campaign = {
      ...camp,
      id: `camp-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setCampaigns(prev => [newCamp, ...prev]);
    return newCamp;
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const updateCampaignStatus = (id: string, status: 'gerado' | 'aprovado' | 'publicado') => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  // Creative Arts
  const addCreativeArt = (art: Omit<CreativeArt, 'id' | 'createdAt'>): CreativeArt => {
    const newArt: CreativeArt = {
      ...art,
      id: `art-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setCreativeArts(prev => [newArt, ...prev]);
    return newArt;
  };

  const deleteCreativeArt = (id: string) => {
    setCreativeArts(prev => prev.filter(a => a.id !== id));
  };

  // Social Connections
  const toggleSocialConnection = (platform: string, connected: boolean, accountHandle?: string) => {
    setSocialConnections(prev => prev.map(s => {
      if (s.platform === platform) {
        return {
          ...s,
          connected,
          accountHandle: accountHandle || s.accountHandle,
          connectedAt: connected ? new Date().toISOString() : undefined
        };
      }
      return s;
    }));
  };

  // Loyalty Program
  const updateLoyaltyProgram = (updates: Partial<LoyaltyProgram>) => {
    setLoyaltyProgram(prev => ({ ...prev, ...updates }));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Evolution Plan
  const toggleEvolutionAction = (period: 'sevenDays' | 'thirtyDays' | 'ninetyDays', actionId: string) => {
    setEvolutionPlanState(prev => {
      const updatedList = prev[period].map(item => item.id === actionId ? { ...item, completed: !item.completed } : item);
      return {
        ...prev,
        [period]: updatedList
      };
    });
  };

  const setEvolutionPlan = (plan: EvolutionPlan) => {
    setEvolutionPlanState(plan);
  };

  // Export JSON (LGPD compliance)
  const exportAllDataJson = () => {
    const fullBackup = {
      business,
      customers,
      products,
      sales,
      expenses,
      receivables,
      appointments,
      tasks,
      campaigns,
      creativeArts,
      socialConnections,
      loyaltyProgram,
      notifications,
      evolutionPlan,
      exportedAt: new Date().toISOString(),
      platform: 'SEU NEGÓCIO. MAIS INTELIGENTE.',
      version: '1.0.0'
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `backup-seu-negocio-mas-inteligente-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Reset data (LGPD exclusion of data)
  const resetAllData = () => {
    if (window.confirm('Atenção: Todos os dados salvos serão apagados permanentemente conforme as diretrizes da LGPD. Deseja continuar?')) {
      const keys = Object.keys(localStorage);
      keys.forEach(k => {
        if (k.startsWith('snmi_')) {
          localStorage.removeItem(k);
        }
      });
      window.location.reload();
    }
  };

  const switchPlan = (plan: PlanType) => {
    setBusiness(prev => ({ ...prev, plan }));
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        showLandingPage,
        setShowLandingPage,
        theme,
        setTheme,
        toggleTheme,
        isSimplifiedMode,
        setIsSimplifiedMode,
        isDemoMode,
        setIsDemoMode,
        isAuthenticated,
        setIsAuthenticated,
        onboardingCompleted,
        setOnboardingCompleted,
        showAuthModal,
        setShowAuthModal,
        showOnboardingModal,
        setShowOnboardingModal,
        loginUser,
        logoutUser,
        quickActionModal,
        setQuickActionModal,
        searchQuery,
        setSearchQuery,
        business,
        updateBusiness,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        sales,
        addSale,
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        toggleExpensePaid,
        receivables,
        addReceivable,
        addPartialPayment,
        deleteReceivable,
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        campaigns,
        addCampaign,
        updateCampaign,
        updateCampaignStatus,
        deleteCampaign,
        creativeArts,
        addCreativeArt,
        deleteCreativeArt,
        socialConnections,
        toggleSocialConnection,
        loyaltyProgram,
        updateLoyaltyProgram,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationsCount,
        evolutionPlan,
        toggleEvolutionAction,
        setEvolutionPlan,
        exportAllDataJson,
        resetAllData,
        switchPlan,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};
