/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  country: string;
  whatsapp: string;
  passwordHash: string;
  referralCode: string;
  referredBy?: string; // Referral code of person who invited them
  role: 'User' | 'Admin';
  isBlocked: boolean;
  createdAt: string;
  balance: number;       // Solde principal
  dailyEarnings: number; // Revenus quotidiens
  totalEarnings: number; // Revenus totaux
  bonus: number;         // Solde Bonus
  lastCheckInDate?: string; // Date of last daily check-in (pointage)
}

export interface InvestmentProduct {
  id: string;
  name: string;
  price: number;
  dailyReturn: number;
  durationDays: number;
  totalReturn: number;
  iconName: string; // Key for lucide icon
  badge?: string; // e.g. "Populaire", "VIP"
}

export interface ActiveInvestment {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  investedAmount: number;
  dailyReturn: number;
  progressDays: number;
  durationDays: number;
  lastClaimDate: string; // For mock claim mechanics
  purchasedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  type: 'Dépôt' | 'Retrait';
  amount: number;
  method: string; // e.g. "MTN Mobile Money", "Orange Money", "Moov Money"
  phoneTarget: string; // Target number for receiving/sending
  reference: string; // Tx ref
  screenshotUrl?: string; // Captured proof
  status: 'En attente' | 'Approuvé' | 'Rejeté';
  createdAt: string;
  processedAt?: string;
}

export interface ReferralCommission {
  id: string;
  userId: string; // who got the commission
  fromUserId: string; // who bought the plan
  fromUserName: string;
  amount: number;
  level: 1 | 2;
  createdAt: string;
}

export interface BonusCode {
  id: string;
  code: string;
  amount: number;
  isUsed: boolean;
  usedBy?: string; // userId
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string; // "all" for global announcements
  title: string;
  message: string;
  type: 'deposit' | 'withdrawal' | 'bonus' | 'investment' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface LiveEarningFeed {
  id: string;
  userName: string;
  productName: string;
  amount: number;
  timeString: string;
}

export interface SupportMessage {
  id: string;
  userId: string;
  sender: 'User' | 'Admin';
  message: string;
  createdAt: string;
}
