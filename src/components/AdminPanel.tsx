/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, CreditCard, ShoppingBag, Gift, Bell, Check, X, Shield, Plus, Trash, 
  TrendingUp, TrendingDown, RefreshCw, Smartphone, Key, Award, AlertCircle 
} from 'lucide-react';
import { UserProfile, Transaction, InvestmentProduct, BonusCode, Notification } from '../types';

interface AdminPanelProps {
  currentUser: UserProfile;
  users: UserProfile[];
  transactions: Transaction[];
  products: InvestmentProduct[];
  bonusCodes: BonusCode[];
  notifications: Notification[];
  onUpdateUsers: (newUsers: UserProfile[]) => void;
  onUpdateTransactions: (newTxs: Transaction[]) => void;
  onUpdateProducts: (newProducts: InvestmentProduct[]) => void;
  onUpdateBonusCodes: (newCodes: BonusCode[]) => void;
  onUpdateNotifications: (newNotifs: Notification[]) => void;
  lang: 'FR' | 'EN';
}

export function AdminPanel({
  users,
  transactions,
  products,
  bonusCodes,
  notifications,
  onUpdateUsers,
  onUpdateTransactions,
  onUpdateProducts,
  onUpdateBonusCodes,
  onUpdateNotifications,
  lang
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'finance' | 'products' | 'vouchers' | 'globals'>('users');
  
  // User Edit State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editBalance, setEditBalance] = useState<number>(0);
  const [editBonus, setEditBonus] = useState<number>(0);
  const [editName, setEditName] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  
  // Create Product State
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(3000);
  const [newProdDaily, setNewProdDaily] = useState<number>(600);
  const [newProdDuration, setNewProdDuration] = useState<number>(10);
  const [newProdBadge, setNewProdBadge] = useState('');

  // Create Bonus Code State
  const [newCodeText, setNewCodeText] = useState('');
  const [newCodeAmount, setNewCodeAmount] = useState<number>(1000);

  // Global Announcement state
  const [globalNotifTitle, setGlobalNotifTitle] = useState('');
  const [globalNotifMsg, setGlobalNotifMsg] = useState('');

  // Auto Calculations
  const rawApprovedDeposits = transactions
    .filter(t => t.type === 'Dépôt' && t.status === 'Approuvé')
    .reduce((sum, t) => sum + t.amount, 0);

  const rawApprovedWithdrawals = transactions
    .filter(t => t.type === 'Retrait' && t.status === 'Approuvé')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalApprovedDeposits = 1812500 + rawApprovedDeposits;
  const totalApprovedWithdrawals = 938200 + rawApprovedWithdrawals;

  const pendingDepositsCount = transactions.filter(t => t.type === 'Dépôt' && t.status === 'En attente').length;
  const pendingWithdrawalsCount = transactions.filter(t => t.type === 'Retrait' && t.status === 'En attente').length;

  const totalRegisteredUsers = 14248 + users.length;
  const platformVirtualProfit = totalApprovedDeposits - totalApprovedWithdrawals;

  // Actions
  const handleToggleBlockUser = (userId: string) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, isBlocked: !u.isBlocked };
      }
      return u;
    });
    onUpdateUsers(updated);
  };

  const handleStartEditUser = (user: UserProfile) => {
    setEditingUserId(user.id);
    setEditBalance(user.balance);
    setEditBonus(user.bonus);
    setEditName(user.name);
    setEditPhone(user.phone);
  };

  const handleSaveUserChanges = () => {
    if (!editingUserId) return;
    const updated = users.map(u => {
      if (u.id === editingUserId) {
        return { 
          ...u, 
          balance: Number(editBalance), 
          bonus: Number(editBonus),
          name: editName,
          phone: editPhone
        };
      }
      return u;
    });
    onUpdateUsers(updated);
    setEditingUserId(null);

    // Add alert notification
    const newNotif: Notification = {
      id: Math.random().toString(),
      userId: editingUserId,
      title: lang === 'FR' ? 'Compte Modifié par l\'Admin' : 'Account Adjusted by Admin',
      message: lang === 'FR' 
        ? `L'administrateur a actualisé vos paramètres de compte. Nouveau solde: ${editBalance} FCFA.` 
        : `Admin has modified your balance properties. New Balance: ${editBalance} FCFA.`,
      type: 'system',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    onUpdateNotifications([newNotif, ...notifications]);
  };

  // Finance Actions: Approve Deposit with MLM commissions!
  const handleApproveDeposit = (tx: Transaction) => {
    // 1. Mark transaction as Approuvé
    const updatedTxs = transactions.map(t => {
      if (t.id === tx.id) {
        return { ...t, status: 'Approuvé' as const, processedAt: new Date().toISOString() };
      }
      return t;
    });
    onUpdateTransactions(updatedTxs);

    // 2. Increase user balance
    let userWhoDeposited: UserProfile | null = null;
    const updatedUsers = users.map(u => {
      if (u.id === tx.userId) {
        userWhoDeposited = u;
        return { 
          ...u, 
          balance: u.balance + tx.amount,
        };
      }
      return u;
    });

    // 3. Process Multi-Level MLM Commissions!
    // Level 1: 30%
    // Level 2: 2%
    // Level 3: 1%
    let sponsorL1Id = userWhoDeposited ? (userWhoDeposited as UserProfile).referredBy : undefined;
    
    // Find who has this referral code
    let l1UserDoc = sponsorL1Id ? updatedUsers.find(u => u.referralCode === sponsorL1Id) : null;
    let l2UserDoc: UserProfile | null = null;
    if (l1UserDoc && l1UserDoc.referredBy) {
      l2UserDoc = updatedUsers.find(u => u.referralCode === l1UserDoc.referredBy) || null;
    }
    let l3UserDoc: UserProfile | null = null;
    if (l2UserDoc && l2UserDoc.referredBy) {
      l3UserDoc = updatedUsers.find(u => u.referralCode === l2UserDoc.referredBy) || null;
    }

    const commissionsToNotify: { userId: string, amt: number, lvl: 1 | 2 | 3 }[] = [];

    const finalUsersWithMLM = updatedUsers.map(u => {
      let updatedUser = { ...u };
      let updated = false;

      // Level 1
      if (l1UserDoc && u.id === l1UserDoc.id) {
        const commAmt = Math.round(tx.amount * 0.30); // 30%
        commissionsToNotify.push({ userId: u.id, amt: commAmt, lvl: 1 });
        updatedUser.bonus += commAmt;
        updatedUser.totalEarnings += commAmt;
        updated = true;
      }

      // Level 2
      if (l2UserDoc && u.id === l2UserDoc.id) {
        const commAmt = Math.round(tx.amount * 0.02); // 2%
        commissionsToNotify.push({ userId: u.id, amt: commAmt, lvl: 2 });
        updatedUser.bonus += commAmt;
        updatedUser.totalEarnings += commAmt;
        updated = true;
      }

      // Level 3
      if (l3UserDoc && u.id === l3UserDoc.id) {
        const commAmt = Math.round(tx.amount * 0.01); // 1%
        commissionsToNotify.push({ userId: u.id, amt: commAmt, lvl: 3 });
        updatedUser.bonus += commAmt;
        updatedUser.totalEarnings += commAmt;
        updated = true;
      }

      return updated ? updatedUser : u;
    });

    onUpdateUsers(finalUsersWithMLM);

    // Create system notification for Depositor
    const newNotifDep: Notification = {
      id: Math.random().toString(),
      userId: tx.userId,
      title: lang === 'FR' ? '✅ Dépôt Validé avec Succès !' : '✅ Deposit Confirmed!',
      message: lang === 'FR' 
        ? `Félicitations, votre dépôt de ${tx.amount.toLocaleString()} FCFA via ${tx.method} a été validé.`
        : `Congratulations, your deposit of ${tx.amount.toLocaleString()} FCFA via ${tx.method} has been authorized.`,
      type: 'deposit',
      isRead: false,
      createdAt: new Date().toISOString()
    };

    // Create notification for MLM referees
    const referralNotifs: Notification[] = commissionsToNotify.map(c => ({
      id: Math.random().toString(),
      userId: c.userId,
      title: lang === 'FR' ? '🎁 Commission Affilié Reçue !' : '🎁 Affiliate Commission Credited!',
      message: lang === 'FR'
        ? `Vous gagnez une commission de Niveau ${c.lvl} d'un montant de ${c.amt.toLocaleString()} FCFA grâce au dépôt de ${tx.userName}.`
        : `You received a Level ${c.lvl} referral bounty of ${c.amt.toLocaleString()} FCFA from ${tx.userName}'s active deposit.`,
      type: 'bonus',
      isRead: false,
      createdAt: new Date().toISOString()
    }));

    onUpdateNotifications([newNotifDep, ...referralNotifs, ...notifications]);
  };

  const handleRejectDeposit = (tx: Transaction) => {
    const updated = transactions.map(t => {
      if (t.id === tx.id) {
        return { ...t, status: 'Rejeté' as const, processedAt: new Date().toISOString() };
      }
      return t;
    });
    onUpdateTransactions(updated);

    const newNotif: Notification = {
      id: Math.random().toString(),
      userId: tx.userId,
      title: lang === 'FR' ? '❌ Dépôt Rejeté' : '❌ Deposit Rejected',
      message: lang === 'FR' 
        ? `Votre dépôt de ${tx.amount.toLocaleString()} FCFA a été refusé pour référence incorrecte ou capture invalide.`
        : `Your deposit query of ${tx.amount.toLocaleString()} FCFA has been declined due to incorrect transaction reference.`,
      type: 'system',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    onUpdateNotifications([newNotif, ...notifications]);
  };

  // Withdraw approvals
  const handleApproveWithdrawal = (tx: Transaction) => {
    const updated = transactions.map(t => {
      if (t.id === tx.id) {
        return { ...t, status: 'Approuvé' as const, processedAt: new Date().toISOString() };
      }
      return t;
    });
    onUpdateTransactions(updated);

    const newNotif: Notification = {
      id: Math.random().toString(),
      userId: tx.userId,
      title: lang === 'FR' ? '💸 Retrait Envoyé avec Succès !' : '💸 Withdrawal Paid!',
      message: lang === 'FR' 
        ? `L'administrateur a validé et expédié votre paiement de ${tx.amount.toLocaleString()} FCFA sur votre numéro ${tx.phoneTarget}.`
        : `The administrator has paid and confirmed your cashout of ${tx.amount.toLocaleString()} FCFA directly to ${tx.phoneTarget}.`,
      type: 'withdrawal',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    onUpdateNotifications([newNotif, ...notifications]);
  };

  const handleRejectWithdrawal = (tx: Transaction) => {
    // Return amount to balance
    const updatedUsers = users.map(u => {
      if (u.id === tx.userId) {
        return { ...u, balance: u.balance + tx.amount };
      }
      return u;
    });
    onUpdateUsers(updatedUsers);

    const updatedTxs = transactions.map(t => {
      if (t.id === tx.id) {
        return { ...t, status: 'Rejeté' as const, processedAt: new Date().toISOString() };
      }
      return t;
    });
    onUpdateTransactions(updatedTxs);

    const newNotif: Notification = {
      id: Math.random().toString(),
      userId: tx.userId,
      title: lang === 'FR' ? '⚠️ Demande de Retrait Rejetée' : '⚠️ Cashout Request Declined',
      message: lang === 'FR' 
        ? `Votre retrait de ${tx.amount.toLocaleString()} FCFA a été rejeté. Les fonds ont été crédités à nouveau dans votre solde principal.`
        : `Your claim of ${tx.amount.toLocaleString()} FCFA was rejected. Capital flows have been fully refunded to your profile balance.`,
      type: 'system',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    onUpdateNotifications([newNotif, ...notifications]);
  };

  // Product Actions
  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const newProd: InvestmentProduct = {
      id: 'custom-' + Math.random().toString(36).substr(2, 9),
      name: newProdName,
      price: Number(newProdPrice),
      dailyReturn: Number(newProdDaily),
      durationDays: Number(newProdDuration),
      totalReturn: Number(newProdDaily) * Number(newProdDuration),
      iconName: 'Crown',
      badge: newProdBadge || undefined
    };

    onUpdateProducts([...products, newProd]);
    setNewProdName('');
    setNewProdBadge('');
  };

  const handleDeleteProduct = (productId: string) => {
    onUpdateProducts(products.filter(p => p.id !== productId));
  };

  // Bonus vouchers
  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodeText.trim()) return;

    const newCode: BonusCode = {
      id: 'voucher-' + Math.random().toString(36).substr(2, 9),
      code: newCodeText.trim().toUpperCase(),
      amount: Number(newCodeAmount),
      isUsed: false,
      createdAt: new Date().toISOString()
    };

    onUpdateBonusCodes([newCode, ...bonusCodes]);
    setNewCodeText('');
  };

  // Global announcements
  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalNotifTitle.trim() || !globalNotifMsg.trim()) return;

    const newAnnounce: Notification = {
      id: 'broadcast-' + Math.random(),
      userId: 'all', // global
      title: `📣 ${globalNotifTitle}`,
      message: globalNotifMsg,
      type: 'system',
      isRead: false,
      createdAt: new Date().toISOString()
    };

    onUpdateNotifications([newAnnounce, ...notifications]);
    setGlobalNotifTitle('');
    setGlobalNotifMsg('');
    alert(lang === 'FR' ? 'Annonce diffusée à tous les investisseurs !' : 'Global announcement broadcasted successfully!');
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6" id="admin-panel-root">
      {/* Top Banner admin */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/40 rounded-2xl">
            <Shield className="w-6 h-6 text-amber-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-100 to-amber-500 font-sans tracking-tight">
              {lang === 'FR' ? 'Panneau Administratif Exclusif' : 'Exclusive Executive Dashboard'}
            </h2>
            <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-slate-900 border border-slate-850 rounded text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest">
                System Admin Mode
              </span>
              <span>• Zero Trust Architecture</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="admin-stats-grid">
        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3.5">
          <div className="p-2 sm:p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-mono font-bold text-slate-50">{totalRegisteredUsers}</div>
            <div className="text-[10px] sm:text-xs text-slate-400 font-medium">
              {lang === 'FR' ? 'Utilisateurs' : 'Total members'}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3.5">
          <div className="p-2 sm:p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-mono font-bold text-emerald-400">{totalApprovedDeposits.toLocaleString()} FF</div>
            <div className="text-[10px] sm:text-xs text-slate-400 font-medium">
              {lang === 'FR' ? 'Total Dépôts' : 'Total Capitalized'}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3.5">
          <div className="p-2 sm:p-3 bg-red-400/10 text-red-400 rounded-xl">
            <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-mono font-bold text-slate-50">{totalApprovedWithdrawals.toLocaleString()} FF</div>
            <div className="text-[10px] sm:text-xs text-slate-400 font-medium">
              {lang === 'FR' ? 'Total Retraits' : 'Withdrawn sum'}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3.5">
          <div className="p-2 sm:p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-mono font-bold text-amber-400">{platformVirtualProfit.toLocaleString()} FF</div>
            <div className="text-[10px] sm:text-xs text-slate-400 font-medium">
              {lang === 'FR' ? 'Bénéfice Net' : 'Platform Reserves'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-900 pb-3">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
            activeTab === 'users' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'bg-slate-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          {lang === 'FR' ? 'Membres' : 'Users'}
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 relative ${
            activeTab === 'finance' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'bg-slate-900 text-zinc-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          {lang === 'FR' ? 'Transactions' : 'Finance Logs'}
          {(pendingDepositsCount + pendingWithdrawalsCount) > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold animate-bounce shadow">
              {pendingDepositsCount + pendingWithdrawalsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
            activeTab === 'products' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'bg-slate-900 text-zinc-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          {lang === 'FR' ? 'Produits VIP' : 'Investment Plans'}
        </button>

        <button
          onClick={() => setActiveTab('vouchers')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
            activeTab === 'vouchers' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'bg-slate-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4" />
          {lang === 'FR' ? 'Vouchers' : 'Codes Bonus'}
        </button>

        <button
          onClick={() => setActiveTab('globals')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
            activeTab === 'globals' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'bg-slate-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          {lang === 'FR' ? 'Notifications Globales' : 'Announcements'}
        </button>
      </div>

      {/* Tabs Content */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-4 sm:p-5">
        
        {/* USERS TABS */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest font-mono">
                {lang === 'FR' ? 'Gestion complète des Comptes' : 'User Profiles Directories'}
              </h3>
              <span className="text-xs text-slate-400">{users.length} {lang === 'FR' ? 'comptes enregistrés' : 'profiles'}</span>
            </div>

            {/* Editing user panel */}
            {editingUserId && (
              <div className="bg-slate-950 border border-amber-500/30 p-4 rounded-2xl space-y-3 shadow-inner">
                <h4 className="text-xs sm:text-sm font-bold text-amber-400 uppercase flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {lang === 'FR' ? `Ajustement du compte : ${editName}` : `Adjust account properties: ${editName}`}
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] text-gray-400 font-semibold block mb-1">Nom Complet</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-xl text-xs border border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-semibold block mb-1">WhatsApp</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-xl text-xs border border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-semibold block mb-1">Solde Principal (FCFA)</label>
                    <input
                      type="number"
                      value={editBalance}
                      onChange={(e) => setEditBalance(Number(e.target.value))}
                      className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-xl text-xs font-mono border border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-semibold block mb-1">Solde Bonus (FCFA)</label>
                    <input
                      type="number"
                      value={editBonus}
                      onChange={(e) => setEditBonus(Number(e.target.value))}
                      className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-xl text-xs font-mono border border-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-900">
                  <button
                    onClick={() => setEditingUserId(null)}
                    className="px-3.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700 transition"
                  >
                    Annuller
                  </button>
                  <button
                    onClick={handleSaveUserChanges}
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs shadow transition"
                  >
                    {lang === 'FR' ? 'Sauvegarder les modifications' : 'Commit Changes'}
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/40 text-[10px] uppercase font-mono tracking-wider">
                    <th className="py-2.5 px-3">Membre / Id</th>
                    <th className="py-2.5 px-3">WhatsApp / Pays</th>
                    <th className="py-2.5 px-3 font-mono text-center">Solde Principal</th>
                    <th className="py-2.5 px-3 font-mono text-center">Solde Bonus</th>
                    <th className="py-2.5 px-3 text-center">Parrainé Par</th>
                    <th className="py-2.5 px-3 text-center">Statut</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {users.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-950/20">
                      <td className="py-3 px-3">
                        <div className="font-bold text-amber-50">{item.name}</div>
                        <div className="text-[10px] font-mono text-gray-500 mt-0.5">{item.id}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-mono text-gray-300">{item.phone}</div>
                        <div className="text-[10px] text-gray-400">{item.country}</div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-yellow-500 bg-amber-500/5">
                        {item.balance.toLocaleString()} FF
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-amber-300">
                        {item.bonus.toLocaleString()} FF
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[9px] text-gray-400 uppercase font-bold">
                          {item.referredBy || 'Organic'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {item.isBlocked ? (
                          <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 font-bold border border-red-500/20 text-[9px] tracking-wide uppercase">
                            Bloqué
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[9px] tracking-wide uppercase">
                            Actif
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleStartEditUser(item)}
                            className="bg-zinc-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 text-[10px] font-bold rounded-lg transition"
                          >
                            Éditer
                          </button>
                          <button
                            onClick={() => handleToggleBlockUser(item.id)}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${
                              item.isBlocked 
                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            }`}
                          >
                            {item.isBlocked ? 'Débloquer' : 'Bloquer'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TRANSACTIONS TABS */}
        {activeTab === 'finance' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest font-mono">
                {lang === 'FR' ? 'Validation des Dépôts & Retraits Mobile Money' : 'Deposits and Withdrawals Ledger'}
              </h3>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono text-amber-400 font-bold uppercase tracking-wide">
                  {transactions.length} Enregistrées
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              {transactions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Aucune transaction enregistrée</div>
              ) : (
                <table className="w-full text-left text-xs text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/40 text-[10px] uppercase font-mono tracking-wider">
                      <th className="py-2.5 px-3">Type / Reference</th>
                      <th className="py-2.5 px-3">Membre WhatsApp</th>
                      <th className="py-2.5 px-3">Réseau d'Envoi</th>
                      <th className="py-2.5 px-3">N° Cible / Reçu</th>
                      <th className="py-2.5 px-3 font-mono text-center">Montant Exact</th>
                      <th className="py-2.5 px-3 text-center">Statut Actuel</th>
                      <th className="py-2.5 px-3 text-right">Actions de Validation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-950/20">
                        <td className="py-3 px-3">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider font-mono mr-1.5 ${
                            tx.type === 'Dépôt' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 'bg-red-500/10 text-red-400 border border-red-500/25'
                          }`}>
                            {tx.type}
                          </span>
                          <span className="font-mono text-gray-400 text-[10px]">{tx.reference}</span>
                          <div className="text-[9px] text-gray-500 mt-1">{new Date(tx.createdAt).toLocaleString()}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-100">{tx.userName}</div>
                          <div className="font-mono text-[10px] text-gray-500">{tx.userPhone}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-slate-200">{tx.method}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-mono text-xs text-gray-300">{tx.phoneTarget}</div>
                          {tx.type === 'Dépôt' && (
                            <div className="text-[10px] text-amber-500 font-semibold mt-1 flex items-center gap-1">
                              <span>📸 Capture fournie</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-black text-amber-400 bg-amber-500/5">
                          {tx.amount.toLocaleString()} FCFA
                        </td>
                        <td className="py-3 px-3 text-center">
                          {tx.status === 'En attente' ? (
                            <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 font-bold border border-yellow-500/20 text-[9px] tracking-wide uppercase animate-pulse">
                              En attente
                            </span>
                          ) : tx.status === 'Approuvé' ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[9px] tracking-wide uppercase">
                              Approuvé
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 font-bold border border-red-500/20 text-[9px] tracking-wide uppercase">
                              Rejeté
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {tx.status === 'En attente' ? (
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => tx.type === 'Dépôt' ? handleApproveDeposit(tx) : handleApproveWithdrawal(tx)}
                                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 p-1 rounded-lg transition"
                                title="Approuver"
                              >
                                <Check className="w-4 h-4 text-black font-extrabold" />
                              </button>
                              <button
                                onClick={() => tx.type === 'Dépôt' ? handleRejectDeposit(tx) : handleRejectWithdrawal(tx)}
                                className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white p-1 rounded-lg transition"
                                title="Refuser"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-500 font-mono">
                              Pris en charge ({tx.status})
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* PRODUCTS TABS */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest font-mono">
                {lang === 'FR' ? 'Gestion des Plans d\'Investissement VIP' : 'Manage Mining VIP Packages'}
              </h3>
            </div>

            {/* Product adding form */}
            <form onSubmit={handleAddNewProduct} className="bg-slate-950 p-4 border border-slate-800/80 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase">
                {lang === 'FR' ? '➕ Ajouter un Nouveau Forfait d\'Investissement IP' : '➕ Create New VIP Investment Plan'}
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1 font-semibold">Titre du Plan</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="VIP 7 — Apex Gold"
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1 font-semibold">Prix requis (FCFA)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1 font-semibold">Revenu journalier (FCFA)</label>
                  <input
                    type="number"
                    required
                    value={newProdDaily}
                    onChange={(e) => setNewProdDaily(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1 font-semibold">Durée du cycle (Jours)</label>
                  <input
                    type="number"
                    required
                    value={newProdDuration}
                    onChange={(e) => setNewProdDuration(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1 font-semibold">Badge Visuel (ex. VIP, Promo)</label>
                  <input
                    type="text"
                    value={newProdBadge}
                    onChange={(e) => setNewProdBadge(e.target.value)}
                    placeholder="Ex: Populaire"
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4 shrink-0 font-bold" />
                  {lang === 'FR' ? 'Enregistrer le nouveau produit' : 'Publish Plan'}
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950 border border-slate-900 rounded-2xl p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-50 text-sm">{item.name}</span>
                      {item.badge && (
                        <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] px-1.5 py-0.5 rounded font-black uppercase text-xs">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-1 mt-2 font-mono text-xs text-gray-400">
                      <div>
                        <span className="text-[10px] text-gray-500 block">Investi:</span>
                        <span className="font-bold text-slate-200">{item.price.toLocaleString()} F</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block">Rendement/jr:</span>
                        <span className="font-bold text-emerald-400">+{item.dailyReturn.toLocaleString()} F</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block">Durée:</span>
                        <span className="font-semibold text-slate-200">{item.durationDays} Jrs</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteProduct(item.id)}
                    className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white p-2 rounded-xl transition shrink-0"
                    title="Supprimer"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VOUCHERS CONTROL TABS */}
        {activeTab === 'vouchers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest font-mono">
                {lang === 'FR' ? 'Création et Gestion des Codes Bonus Cadeaux' : 'Voucher Codes System'}
              </h3>
            </div>

            <form onSubmit={handleCreateVoucher} className="bg-slate-950 p-4 border border-slate-800/80 rounded-2xl flex flex-wrap items-end gap-3">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1 font-semibold">Taper Code Bonus (ex: GOLD2026)</label>
                <input
                  type="text"
                  required
                  value={newCodeText}
                  onChange={(e) => setNewCodeText(e.target.value)}
                  placeholder="EX: WELCOME-FF"
                  className="bg-slate-900 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-slate-100 uppercase"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1 font-semibold">Valeur du Code (FCFA)</label>
                <input
                  type="number"
                  required
                  value={newCodeAmount}
                  onChange={(e) => setNewCodeAmount(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-mono"
                />
              </div>

              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 shrink-0 font-bold" />
                {lang === 'FR' ? 'Générer le Code Cadeau' : 'Issue Voucher'}
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/40 text-[10px] uppercase font-mono tracking-wider">
                    <th className="py-2.5 px-3">Code Unique</th>
                    <th className="py-2.5 px-3 font-mono text-center">Montant Cadeau</th>
                    <th className="py-2.5 px-3 text-center">État d'utilisation</th>
                    <th className="py-2.5 px-3 text-center">Créé le</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {bonusCodes.map((bc) => (
                    <tr key={bc.id} className="hover:bg-slate-950/20">
                      <td className="py-3 px-3 font-mono font-bold text-amber-400 uppercase tracking-widest">
                        {bc.code}
                      </td>
                      <td className="py-3 px-3 font-mono text-center font-bold text-slate-100">
                        {bc.amount.toLocaleString()} FCFA
                      </td>
                      <td className="py-3 px-3 text-center">
                        {bc.isUsed ? (
                          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700 text-[9px] font-bold tracking-wide uppercase">
                            Déjà utilisé
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold tracking-wide uppercase">
                            Disponible
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center text-gray-500 font-mono text-[10px]">
                        {new Date(bc.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GLOBALS NOTIFICATIONS TABS */}
        {activeTab === 'globals' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest font-mono">
                {lang === 'FR' ? 'Diffuser un Flash Notification Global' : 'Write System-wide Bulletin'}
              </h3>
            </div>

            <form onSubmit={handleBroadcastAnnouncement} className="bg-slate-950 p-4 border border-slate-800/80 rounded-2xl space-y-3">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1 font-semibold">Titre de l'Alerte</label>
                <input
                  type="text"
                  required
                  value={globalNotifTitle}
                  onChange={(e) => setGlobalNotifTitle(e.target.value)}
                  placeholder="EX: Maintenance Planifiée / Bonus Exceptionnel !"
                  className="w-full bg-slate-900 border border-dashed border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1 font-semibold">Message de l'Annonce</label>
                <textarea
                  required
                  rows={3}
                  value={globalNotifMsg}
                  onChange={(e) => setGlobalNotifMsg(e.target.value)}
                  placeholder="Écrivez le message de recommandation ou de mise à jour..."
                  className="w-full bg-slate-900 border border-dashed border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <Bell className="w-4 h-4 shrink-0" />
                  {lang === 'FR' ? 'Diffuser à tous les investisseurs' : 'Broadcast to all'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
