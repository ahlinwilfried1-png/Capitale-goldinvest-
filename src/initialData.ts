/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InvestmentProduct, UserProfile, LiveEarningFeed, Transaction } from './types';

export const INITIAL_PRODUCTS: InvestmentProduct[] = [
  {
    id: 'vip-1',
    name: 'VIP 1 — Starter Gold',
    price: 3000,
    dailyReturn: 600,
    durationDays: 10,
    totalReturn: 6000,
    iconName: 'TrendingUp',
    badge: 'Populaire'
  },
  {
    id: 'vip-2',
    name: 'VIP 2 — Builder Gold',
    price: 10000,
    dailyReturn: 2500,
    durationDays: 10,
    totalReturn: 25000,
    iconName: 'ShieldAlert',
    badge: 'Rentable'
  },
  {
    id: 'vip-3',
    name: 'VIP 3 — Premium Gold',
    price: 25000,
    dailyReturn: 6800,
    durationDays: 12,
    totalReturn: 81600,
    iconName: 'Zap',
    badge: 'Recommandé'
  },
  {
    id: 'vip-4',
    name: 'VIP 4 — Elite Wealth',
    price: 50000,
    dailyReturn: 15000,
    durationDays: 12,
    totalReturn: 180000,
    iconName: 'Award',
    badge: 'Haute Performance'
  },
  {
    id: 'vip-5',
    name: 'VIP 5 — Master Investor',
    price: 100000,
    dailyReturn: 33000,
    durationDays: 15,
    totalReturn: 495000,
    iconName: 'Crown',
    badge: 'VIP Club'
  },
  {
    id: 'vip-6',
    name: 'VIP 6 — Sovereign Gold',
    price: 250000,
    dailyReturn: 90000,
    durationDays: 15,
    totalReturn: 1350000,
    iconName: 'Gem',
    badge: 'Exclusif'
  }
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'admin-id',
    name: 'Direction Générale',
    phone: '2250102030405',
    email: 'contact@capitalgold.com',
    country: 'Côte d’Ivoire',
    whatsapp: '2250102030405',
    passwordHash: 'admin', // Simple password for simulation
    referralCode: 'GOLDADMIN',
    role: 'Admin',
    isBlocked: false,
    createdAt: '2026-05-01T12:00:00Z',
    balance: 1500000,
    dailyEarnings: 0,
    totalEarnings: 0,
    bonus: 50000
  },
  {
    id: 'user-demo-id',
    name: 'Wilfried Ahlin',
    phone: '2250707070707',
    email: 'wilfried@investisseur.com',
    country: 'Côte d’Ivoire',
    whatsapp: '2250707070707',
    passwordHash: 'invest', // Simple password for simulation
    referralCode: 'WILF777',
    referredBy: 'GOLDADMIN',
    role: 'User',
    isBlocked: false,
    createdAt: '2026-06-01T08:30:00Z',
    balance: 5500, // Enought for VIP 1
    dailyEarnings: 1200,
    totalEarnings: 3600,
    bonus: 1000
  },
  {
    id: 'ref-l1-id',
    name: 'Koffi Blaise (Niveau 1)',
    phone: '2250505050505',
    whatsapp: '2250505050505',
    country: 'Sénégal',
    passwordHash: 'koffi123',
    referralCode: 'KOFFI88',
    referredBy: 'WILF777',
    role: 'User',
    isBlocked: false,
    createdAt: '2026-06-02T10:15:00Z',
    balance: 1500,
    dailyEarnings: 600,
    totalEarnings: 1200,
    bonus: 500
  },
  {
    id: 'ref-l2-id',
    name: 'Awa Diallo (Niveau 2)',
    phone: '221771234567',
    whatsapp: '221771234567',
    country: 'Sénégal',
    passwordHash: 'awa123',
    referralCode: 'AWAD22',
    referredBy: 'KOFFI88',
    role: 'User',
    isBlocked: false,
    createdAt: '2026-06-03T09:00:00Z',
    balance: 0,
    dailyEarnings: 0,
    totalEarnings: 0,
    bonus: 500
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    userId: 'user-demo-id',
    userName: 'Wilfried Ahlin',
    userPhone: '2250707070707',
    type: 'Dépôt',
    amount: 15000,
    method: 'MTN Mobile Money',
    phoneTarget: '2250707070707',
    reference: 'REF-MTN-98421033',
    status: 'Approuvé',
    createdAt: '2026-06-01T09:00:00Z',
    processedAt: '2026-06-01T09:12:00Z'
  },
  {
    id: 'tx-2',
    userId: 'user-demo-id',
    userName: 'Wilfried Ahlin',
    userPhone: '2250707070707',
    type: 'Dépôt',
    amount: 3000,
    method: 'Orange Money',
    phoneTarget: '2250707070707',
    reference: 'REF-OM-11224599',
    status: 'En attente',
    createdAt: '2026-06-04T10:15:00Z'
  },
  {
    id: 'tx-3',
    userId: 'user-demo-id',
    userName: 'Wilfried Ahlin',
    userPhone: '2250707070707',
    type: 'Retrait',
    amount: 5000,
    method: 'Moov Money',
    phoneTarget: '2250707070707',
    reference: 'REF-RET-73932822',
    status: 'Approuvé',
    createdAt: '2026-06-03T18:30:00Z',
    processedAt: '2026-06-03T19:00:00Z'
  },
  {
    id: 'tx-4',
    userId: 'ref-l1-id',
    userName: 'Koffi Blaise (Niveau 1)',
    userPhone: '2250505050505',
    type: 'Dépôt',
    amount: 3000,
    method: 'Wave',
    phoneTarget: '2250505050505',
    reference: 'REF-WAVE-8271034',
    status: 'Approuvé',
    createdAt: '2026-06-02T11:00:00Z',
    processedAt: '2026-06-02T11:15:00Z'
  }
];

export const MOCK_LIVE_FEEDS: LiveEarningFeed[] = [
  { id: '1', userName: 'Oumar K.', productName: 'VIP 4 — Elite Wealth', amount: 15000, timeString: 'À l\'instant' },
  { id: '2', userName: 'Aminata T.', productName: 'VIP 1 — Starter Gold', amount: 600, timeString: 'Il y a 1 min' },
  { id: '3', userName: 'Jean-Pierre S.', productName: 'VIP 5 — Master Investor', amount: 33000, timeString: 'Il y a 2 min' },
  { id: '4', userName: 'Fatou B.', productName: 'VIP 2 — Builder Gold', amount: 2500, timeString: 'Il y a 4 min' },
  { id: '5', userName: 'Koffi A.', productName: 'VIP 6 — Sovereign Gold', amount: 90000, timeString: 'Il y a 5 min' },
  { id: '6', userName: 'Yao M.', productName: 'VIP 3 — Premium Gold', amount: 6800, timeString: 'Il y a 7 min' },
  { id: '7', userName: 'Clarisse D.', productName: 'VIP 2 — Builder Gold', amount: 2500, timeString: 'Il y a 9 min' }
];

export const MOCK_FAQS = [
  {
    q: "Comment fonctionne Capital Gold Invest ?",
    a: "Capital Gold Invest vous permet d'acquérir des plans d'investissement VIP miniers et financiers à haute performance. Chaque plan génère des revenus réguliers versés quotidiennement dans votre solde principal, de façon entièrement passive."
  },
  {
    q: "Quelle est la durée d'un cycle d'investissement ?",
    a: "Chaque plan a sa propre durée de validité (entre 10 et 15 jours). Une fois le cycle terminé, l'investissement expire et vous encaissez l'équivalent de l'intégralité de votre rendement estimé, soit de gros profits accumulés."
  },
  {
    q: "Comment s'effectuent les Dépôts et Retraits ?",
    a: "Les transactions sont instantanées grâce aux systèmes de paiement Mobile Money africains et internationaux (MTN, Orange, Moov, Wave, etc.). Saisissez la référence du paiement, capturez le reçu et un administrateur validera sous 10 à 30 minutes."
  },
  {
    q: "Quel est le seuil de retrait minimum ?",
    a: "Le seuil de retrait minimum est de seulement 1 000 FCFA. Les retraits sont traités et envoyés directement sur votre numéro Mobile Money."
  },
  {
    q: "Quel est l'avantage du système de parrainage (MLM) ?",
    a: "Vous gagnez automatiquement 30% sur les dépôts de vos invités de Niveau 1, 2% sur ceux de Niveau 2, et 1% de commission sur ceux de Niveau 3. Cela vous permet d'amasser d'énormes gains passifs partagés par votre réseau d'affiliation."
  }
];

export const MOCK_TESTIMONIALS = [
  {
    name: "Alain Koné",
    role: "Investisseur VIP 4",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    text: "Une expérience incroyable ! J'ai débuté avec le VIP 2 puis j'ai rapidement débloqué le VIP 4. Mes retraits Orange Money arrivent en moins de 15 minutes. Je recommande !"
  },
  {
    name: "Aissatou Barry",
    role: "Partenaire MLM Niveau 3",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
    text: "Le système de parrainage à double niveau est fantastique. J'ai déjà cumulé plus de 250 000 FCFA de commissions en invitant mes collègues de bureau."
  },
  {
    name: "Dr. Marc Sow",
    role: "Membre VIP 5",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80",
    text: "Interface hyper clean et intuitive sur mobile. On sent le professionnalisme de la fintech internationale. Mes gains journaliers tombent à l'heure."
  }
];
