/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Home as HomeIcon, Briefcase, Users2, User, Lock, ChevronRight, Copy, Check, 
  Plus, LogIn, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Award, 
  Crown, ShieldAlert, Sparkles, Globe, LogOut, CheckCircle, Smartphone, Info, 
  CreditCard, Flame, Gift, Bell, MessageSquare, History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { UserProfile, InvestmentProduct, ActiveInvestment, Transaction, BonusCode, Notification } from './types';
import { 
  INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_TRANSACTIONS, MOCK_FAQS, MOCK_TESTIMONIALS 
} from './initialData';

// Subcomponents
import { LiveEarningFeedComponent } from './components/LiveEarningFeedComponent';
import { InvestorRankings } from './components/InvestorRankings';
import { FAQCollapse } from './components/FAQCollapse';
import { ChatSupport } from './components/ChatSupport';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  // STATE DEFINITIONS with LocalStorage backing
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('cfg_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [products, setProducts] = useState<InvestmentProduct[]>(() => {
    const saved = localStorage.getItem('cfg_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('cfg_txs');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [activeInvestments, setActiveInvestments] = useState<ActiveInvestment[]>(() => {
    const saved = localStorage.getItem('cfg_investments');
    return saved ? JSON.parse(saved) : [
      {
        id: 'inv-demo',
        userId: 'user-demo-id',
        productId: 'vip-1',
        productName: 'VIP 1 — Starter Gold',
        investedAmount: 3000,
        dailyReturn: 600,
        progressDays: 4,
        durationDays: 10,
        lastClaimDate: new Date(Date.now() - 3600 * 24 * 1000).toISOString(),
        purchasedAt: new Date(Date.now() - 3600 * 24 * 4 * 1000).toISOString()
      }
    ];
  });

  const [bonusCodes, setBonusCodes] = useState<BonusCode[]>(() => {
    const saved = localStorage.getItem('cfg_codes');
    return saved ? JSON.parse(saved) : [
      { id: 'c-1', code: 'GOLD2026', amount: 2000, isUsed: false, createdAt: new Date().toISOString() },
      { id: 'c-2', code: 'WELCOME-BONUS', amount: 1000, isUsed: false, createdAt: new Date().toISOString() }
    ];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('cfg_notifs');
    return saved ? JSON.parse(saved) : [
      {
        id: 'n-1',
        userId: 'user-demo-id',
        title: '🔥 Bienvenu sur Capital Gold Invest !',
        message: 'Activez un plan VIP et collectez des revenus passifs quotidiens immédiatement.',
        type: 'system',
        isRead: false,
        createdAt: new Date().toISOString()
      }
    ];
  });

  // Current session configurations
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('cfg_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Global app configs
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const [isDemoModeOn, setIsDemoModeOn] = useState(true); // Allow easy Admin switching
  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'team' | 'profile'>('home');

  // Input States
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  
  // Login Form States
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCountry, setRegCountry] = useState('Cameroun');
  const [regPass, setRegPass] = useState('');
  const [regPassConfirm, setRegPassConfirm] = useState('');
  const [regRef, setRegRef] = useState('WILF777'); // Seed values for ease

  // Wallet Views: Profile view toggles
  const [profileAction, setProfileAction] = useState<'none' | 'deposit' | 'withdraw' | 'history' | 'add_bonus'>('none');
  
  // Deposit workflow
  const [depMethod, setDepMethod] = useState('MTN Mobile Money');
  const [depAmount, setDepAmount] = useState<string>('3000');
  const [depRef, setDepRef] = useState('');
  const [depScreenshot, setDepScreenshot] = useState<File | null>(null);
  const [depSuccessMsg, setDepSuccessMsg] = useState(false);
  const [depErrorMsg, setDepErrorMsg] = useState('');

  // Withdrawal workflow
  const [withdrawMethod, setWithdrawMethod] = useState('MTN Mobile Money');
  const [withdrawPhone, setWithdrawPhone] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState(false);
  const [withdrawErrorMsg, setWithdrawErrorMsg] = useState('');

  // Bonus voucher field
  const [bonusInput, setBonusInput] = useState('');
  const [bonusCodeStatus, setBonusCodeStatus] = useState({ success: false, error: '' });

  // Notifications toggle modal/drawer
  const [showNotifsOverlay, setShowNotifsOverlay] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('cfg_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('cfg_products', JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem('cfg_txs', JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem('cfg_investments', JSON.stringify(activeInvestments));
  }, [activeInvestments]);
  useEffect(() => {
    localStorage.setItem('cfg_codes', JSON.stringify(bonusCodes));
  }, [bonusCodes]);
  useEffect(() => {
    localStorage.setItem('cfg_notifs', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cfg_current_user', JSON.stringify(currentUser));
      // Keep session profile in sync with global users list
      const freshUser = users.find(u => u.id === currentUser.id);
      if (freshUser && JSON.stringify(freshUser) !== JSON.stringify(currentUser)) {
        setCurrentUser(freshUser);
      }
    } else {
      localStorage.removeItem('cfg_current_user');
    }
  }, [currentUser, users]);

  // Handle live gain claim simulation (daily increments simulation)
  const handleClaimEarning = (invId: string) => {
    const inv = activeInvestments.find(i => i.id === invId);
    if (!inv || !currentUser) return;

    // Simulate claims and reset state
    // Increase user balance by dailyYield
    const dailyReturn = inv.dailyReturn;
    
    // Update active investments to mark claimed
    const updatedInvestments = activeInvestments.map(i => {
      if (i.id === invId) {
        return { 
          ...i, 
          progressDays: i.progressDays + 1,
          lastClaimDate: new Date().toISOString()
        };
      }
      return i;
    });

    // Check if finished cycle
    const completedInv = updatedInvestments.find(i => i.id === invId);
    let isExpired = false;
    let finalInvestys = updatedInvestments;
    if (completedInv && completedInv.progressDays >= completedInv.durationDays) {
      isExpired = true;
      finalInvestys = updatedInvestments.filter(i => i.id !== invId);
    }
    setActiveInvestments(finalInvestys);

    // Update global user earnings & balance
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          balance: u.balance + dailyReturn,
          dailyEarnings: u.dailyEarnings + dailyReturn,
          totalEarnings: u.totalEarnings + dailyReturn
        };
      }
      return u;
    });
    setUsers(updatedUsers);

    // Create notifications
    const newNotif: Notification = {
      id: Math.random().toString(),
      userId: currentUser.id,
      title: lang === 'FR' ? '💰 Gains VIP Réclamés !' : '💰 VIP Earnings Collected!',
      message: lang === 'FR' 
        ? `Félicitations ! Vous avez réclamé +${dailyReturn.toLocaleString()} FCFA sur le plan ${inv.productName}.`
        : `Congrats! You have collected +${dailyReturn.toLocaleString()} FCFA from ${inv.productName} plan.`,
      type: 'investment',
      isRead: false,
      createdAt: new Date().toISOString()
    };

    if (isExpired) {
      const expNotif: Notification = {
        id: Math.random().toString(),
        userId: currentUser.id,
        title: lang === 'FR' ? '⚠️ Plan VIP Expire' : '⚠️ VIP Cycle Expired',
        message: lang === 'FR'
          ? `Votre investissement sur ${inv.productName} a complété son cycle de ${inv.durationDays} jours avec succès.`
          : `Your investment on ${inv.productName} has reached its maturity of ${inv.durationDays} days.`,
        type: 'system',
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications([expNotif, newNotif, ...notifications]);
    } else {
      setNotifications([newNotif, ...notifications]);
    }
  };

  // Auth Functions
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone.trim() || !loginPass.trim()) return;

    // Search user
    const matched = users.find(u => u.phone === loginPhone.trim() && u.passwordHash === loginPass.trim());
    if (matched) {
      if (matched.isBlocked) {
        alert(lang === 'FR' ? '❌ Ce compte est bloqué par l’administrateur !' : '❌ This account is currently suspended!');
        return;
      }
      setCurrentUser(matched);
      setLoginPhone('');
      setLoginPass('');
      setActiveTab('profile');
    } else {
      alert(lang === 'FR' ? '❌ Numéro ou mot de passe incorrect.' : '❌ Invalid credentials.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!regName.trim() || !regPhone.trim() || !regPass.trim()) {
      alert(lang === 'FR' ? 'Veuillez remplir tous les champs.' : 'Please, fill in all fields.');
      return;
    }
    if (regPass !== regPassConfirm) {
      alert(lang === 'FR' ? 'Les mots de passe ne correspondent pas !' : 'Passwords do not match!');
      return;
    }

    // Check if phone already registered
    const exists = users.find(u => u.phone === regPhone.trim());
    if (exists) {
      alert(lang === 'FR' ? 'Ce numéro WhatsApp est déjà enregistré !' : 'This WhatsApp number is already in use!');
      return;
    }

    // Generate unique referral code
    const generatedCode = 'GOLD' + Math.floor(1000 + Math.random() * 9000);

    // Validate referral code (optional but lets seed bonus if valid)
    let inviterCode: string | undefined = undefined;
    const matchedReferer = users.find(u => u.referralCode === regRef.trim().toUpperCase());
    if (matchedReferer) {
      inviterCode = matchedReferer.referralCode;
    }

    const newUser: UserProfile = {
      id: 'usr-' + Math.random().toString(36).substr(2, 9),
      name: regName.trim(),
      phone: regPhone.trim(),
      country: regCountry,
      whatsapp: regPhone.trim(),
      passwordHash: regPass.trim(),
      referralCode: generatedCode,
      referredBy: inviterCode,
      role: 'User',
      isBlocked: false,
      createdAt: new Date().toISOString(),
      balance: 1200, // 1000 Welcome + 200 Sign-up bonus!
      dailyEarnings: 0,
      totalEarnings: 0,
      bonus: 1200 // 1000 Welcome + 200 Sign-up bonus!
    };

    setUsers([newUser, ...users]);
    setCurrentUser(newUser);

    // Notify new member of gift
    const giftNotif: Notification = {
      id: 'notif-' + Math.random().toString(36).substr(2, 9),
      userId: newUser.id,
      title: lang === 'FR' ? '🎁 Cadeau d\'inscription & Bienvenue !' : '🎁 Welcome & Signup Bonus!',
      message: lang === 'FR' 
        ? 'Félicitations ! Vous avez reçu un bonus d\'accueil de 1 000 FCFA offert ainsi qu\'un bonus d\'inscription exclusif de 200 FCFA !' 
        : 'Congratulations! You received a 1,000 FCFA welcome bonus plus an exclusive 200 FCFA sign-up bonus!',
      type: 'bonus',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications([giftNotif, ...notifications]);

    // Clear register forms
    setRegName('');
    setRegPhone('');
    setRegPass('');
    setRegPassConfirm('');
    setRegRef('');

    setActiveTab('profile');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setProfileAction('none');
    setActiveTab('home');
  };

  // Wallet deposit trigger
  const handleManualUploadText = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDepScreenshot(e.target.files[0]);
    }
  };

  const handleSubmitDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!depAmount || Number(depAmount) <= 0) {
      setDepErrorMsg(lang === 'FR' ? "Veuillez entrer un montant valide" : "Enter a valid amount");
      return;
    }
    if (!depRef.trim()) {
      setDepErrorMsg(lang === 'FR' ? "L'ID de Référence du transfert Mobile Money est requis" : "Transaction Reference ID is required");
      return;
    }

    const newTx: Transaction = {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      type: 'Dépôt',
      amount: Number(depAmount),
      method: depMethod,
      phoneTarget: depMethod === 'MTN Mobile Money' ? '+225 0501102233' : depMethod === 'Orange Money' ? '+225 0707778899' : '+225 0101556600',
      reference: depRef.trim(),
      screenshotUrl: 'mock-proof.jpg',
      status: 'En attente',
      createdAt: new Date().toISOString()
    };

    setTransactions([newTx, ...transactions]);
    setDepSuccessMsg(true);
    setDepErrorMsg('');
    setDepRef('');
    setDepScreenshot(null);

    // Notify user of pending validation
    const waitNotif: Notification = {
      id: Math.random().toString(),
      userId: currentUser.id,
      title: lang === 'FR' ? '🕒 Dépôt en cours de validation' : '🕒 Deposit validation pending',
      message: lang === 'FR'
        ? `Votre paiement de ${Number(depAmount).toLocaleString()} FCFA est mis en attente. Une notification vous parviendra après examen admin.`
        : `Your transfer of ${Number(depAmount).toLocaleString()} FCFA is processing. You will receive an alert once audited.`,
      type: 'system',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications([waitNotif, ...notifications]);
  };

  // Withdrawal transaction trigger
  const handleSubmitWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const amt = Number(withdrawAmount);
    if (!withdrawAmount || amt <= 0) {
      setWithdrawErrorMsg(lang === 'FR' ? 'Veuillez saisir un montant' : 'Please input code size');
      return;
    }
    if (amt < 1000) {
      setWithdrawErrorMsg(lang === 'FR' ? 'Le retrait minimal est de 1 000 FCFA' : 'Minimal withdrawal limit is 1,000 FCFA');
      return;
    }
    if (!withdrawPhone.trim()) {
      setWithdrawErrorMsg(lang === 'FR' ? 'Numéro de réception requis' : 'Destination mobile number required');
      return;
    }

    // Verify balance
    if (currentUser.balance < amt) {
      setWithdrawErrorMsg(lang === 'FR' ? 'Solde insuffisant pour cette opération !' : 'Insufficient funds inside your primary balance !');
      return;
    }

    // Deduct instantly from user balance
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, balance: u.balance - amt };
      }
      return u;
    });
    setUsers(updatedUsers);

    // Create withdrawal log
    const newTx: Transaction = {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      type: 'Retrait',
      amount: amt,
      method: withdrawMethod,
      phoneTarget: withdrawPhone.trim(),
      reference: 'RET-' + Math.floor(100000 + Math.random() * 900000),
      status: 'En attente',
      createdAt: new Date().toISOString()
    };

    setTransactions([newTx, ...transactions]);
    setWithdrawSuccessMsg(true);
    setWithdrawErrorMsg('');
    setWithdrawAmount('');
    setWithdrawPhone('');

    const waitNotif: Notification = {
      id: Math.random().toString(),
      userId: currentUser.id,
      title: lang === 'FR' ? '🕒 Retrait en attente de vérification' : '🕒 Cashout order under review',
      message: lang === 'FR'
        ? `Votre demande de retrait de ${amt.toLocaleString()} FCFA est envoyée pour approvisionnement.`
        : `Your withdrawal execution of ${amt.toLocaleString()} FCFA has been safely queued.`,
      type: 'system',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications([waitNotif, ...notifications]);
  };

  // Buy a product (Gold Miner / plan)
  const handleBuyProduct = (product: InvestmentProduct) => {
    if (!currentUser) {
      alert(lang === 'FR' ? 'Veuillez vous connecter pour investir.' : 'Kindly register or login to acquire options.');
      setAuthView('login');
      setActiveTab('profile');
      return;
    }

    // Verify balance
    if (currentUser.balance < product.price) {
      alert(lang === 'FR' 
        ? `Solde insuffisant (Requis: ${product.price.toLocaleString()} FCFA). Veuillez recharger votre compte.` 
        : `Insufficient funds (Price is ${product.price.toLocaleString()} FCFA). Please proceed to make a deposit.`);
      setProfileAction('deposit');
      setActiveTab('profile');
      return;
    }

    // Deduct price from user balance
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, balance: u.balance - product.price };
      }
      return u;
    });
    setUsers(updatedUsers);

    // Instantiate active investment
    const newInvestment: ActiveInvestment = {
      id: 'inv-' + Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      productId: product.id,
      productName: product.name,
      investedAmount: product.price,
      dailyReturn: product.dailyReturn,
      progressDays: 0,
      durationDays: product.durationDays,
      lastClaimDate: new Date().toISOString(),
      purchasedAt: new Date().toISOString()
    };

    setActiveInvestments([newInvestment, ...activeInvestments]);

    // Create confirmation audit log & notification
    const newNotif: Notification = {
      id: Math.random().toString(),
      userId: currentUser.id,
      title: lang === 'FR' ? '🎉 VIP Activé avec Succès !' : '🎉 VIP Miner Booted Successfully!',
      message: lang === 'FR'
        ? `Félicitations ! Votre investissement de ${product.price.toLocaleString()} FCFA sur ${product.name} a démarré.`
        : `Felicidations! Your active vault of ${product.price.toLocaleString()} FCFA on ${product.name} has started.`,
      type: 'investment',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications([newNotif, ...notifications]);

    alert(lang === 'FR' 
      ? `Félicitations ! Le plan ${product.name} a été activé. Réclamez vos gains quotidiennement dans votre profil.` 
      : `${product.name} asset purchased. Check active returns inside your portfolio.`);
    setActiveTab('profile');
  };

  // Claim voucher promo bonus
  const handleClaimBonusCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !bonusInput.trim()) return;

    const codeToSearch = bonusInput.trim().toUpperCase();
    const matched = bonusCodes.find(bc => bc.code === codeToSearch);

    if (!matched) {
      setBonusCodeStatus({ success: false, error: lang === 'FR' ? 'Code bonus incorrect ou inexistant.' : 'Promo code invalid or already expired.' });
      return;
    }

    if (matched.isUsed) {
      setBonusCodeStatus({ success: false, error: lang === 'FR' ? 'Ce code promo a déjà été utilisé.' : 'Voucher already used by you or other member.' });
      return;
    }

    // Apply coupon rewards to user's bonus and main balances
    const bonusWorth = matched.amount;
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { 
          ...u, 
          balance: u.balance + bonusWorth,
          bonus: u.bonus + bonusWorth 
        };
      }
      return u;
    });
    setUsers(updatedUsers);

    // Mark voucher code as used
    const updatedCodes = bonusCodes.map(bc => {
      if (bc.id === matched.id) {
        return { ...bc, isUsed: true, usedBy: currentUser.id };
      }
      return bc;
    });
    setBonusCodes(updatedCodes);

    setBonusCodeStatus({ success: true, error: '' });
    setBonusInput('');

    // Generate notification
    const newNotif: Notification = {
      id: Math.random().toString(),
      userId: currentUser.id,
      title: lang === 'FR' ? '🎁 Code Bonus Appliqué !' : '🎁 Coupon Code Applied!',
      message: lang === 'FR'
        ? `Félicitations ! Vous avez réclamé un bonus gratuit de +${bonusWorth.toLocaleString()} FCFA via le code ${codeToSearch}.`
        : `Congratulations! Code matching succeeded. Earned +${bonusWorth.toLocaleString()} FCFA!`,
      type: 'bonus',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Clipboard copy invitation link helper
  const handleCopyReferral = () => {
    if (!currentUser) return;
    const inviteLink = `${window.location.origin}/?ref=${currentUser.referralCode}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handleCopyReferralCodeOnly = () => {
    if (!currentUser) return;
    navigator.clipboard.writeText(currentUser.referralCode).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  const handleDailyCheckIn = () => {
    if (!currentUser) return;
    const todayStr = new Date().toISOString().split('T')[0];
    if (currentUser.lastCheckInDate === todayStr) {
      alert(lang === 'FR' ? "Vous avez déjà effectué votre pointage aujourd'hui !" : "You have already checked in today!");
      return;
    }
    
    // Create updated user
    const updatedUser: UserProfile = {
      ...currentUser,
      balance: currentUser.balance + 50,
      totalEarnings: currentUser.totalEarnings + 50,
      lastCheckInDate: todayStr
    };
    
    // Update users list
    setUsers(uList => uList.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    
    // Add pointage notification
    const checkInNotif: Notification = {
      id: 'notif-' + Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      title: lang === 'FR' ? "📅 Pointage quotidien validé !" : "📅 Daily check-in successful!",
      message: lang === 'FR' 
        ? "Félicitations ! Votre pointage du jour a été validé. +50 FCFA crédités sur votre solde principal." 
        : "Congratulations! Your check-in of the day is done. +50 FCFA credited to your main balance.",
      type: 'bonus',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications([checkInNotif, ...notifications]);
  };

  // Check for auto-referral code in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    if (refParam) {
      const code = refParam.trim().toUpperCase();
      setRegRef(code);
      setAuthView('register');
      // Scroll to registry form for best visual feedback
      setTimeout(() => {
        const formEl = document.getElementById('auth-card-parent');
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, []);

  // Filter notification logic
  const myNotifications = currentUser 
    ? notifications.filter(n => n.userId === currentUser.id || n.userId === 'all')
    : [];

  const unreadNotifsCount = myNotifications.filter(n => !n.isRead).length;

  const handleMarkNotificationsRead = () => {
    if (!currentUser) return;
    const updated = notifications.map(n => {
      if (n.userId === currentUser.id || n.userId === 'all') {
        return { ...n, isRead: true };
      }
      return n;
    });
    setNotifications(updated);
  };

  // MLM Sponsor trees
  const level1Invites = currentUser ? users.filter(u => u.referredBy === currentUser.referralCode) : [];
  const level2Invites = currentUser ? users.filter(u => {
    if (!u.referredBy) return false;
    return level1Invites.some(l1 => l1.referralCode === u.referredBy);
  }) : [];
  const level3Invites = currentUser ? users.filter(u => {
    if (!u.referredBy) return false;
    return level2Invites.some(l2 => l2.referralCode === u.referredBy);
  }) : [];

  const approvedDeposits = transactions.filter(t => t.type === 'Dépôt' && t.status === 'Approuvé');

  const realCommLevel1 = approvedDeposits
    .filter(t => level1Invites.some(l1 => l1.id === t.userId))
    .reduce((sum, t) => sum + Math.round(t.amount * 0.30), 0);

  const realCommLevel2 = approvedDeposits
    .filter(t => level2Invites.some(l2 => l2.id === t.userId))
    .reduce((sum, t) => sum + Math.round(t.amount * 0.02), 0);

  const realCommLevel3 = approvedDeposits
    .filter(t => level3Invites.some(l3 => l3.id === t.userId))
    .reduce((sum, t) => sum + Math.round(t.amount * 0.01), 0);

  const totalRevLevel1 = realCommLevel1 + (level1Invites.length * 1500); 
  const totalRevLevel2 = realCommLevel2 + (level2Invites.length * 300);
  const totalRevLevel3 = realCommLevel3 + (level3Invites.length * 100);

  // Dynamic stats calculation for platform metrics (Live synchronisation)
  const dynUsersCount = 14248 + users.length;
  const dynTotalDeposits = 1812500 + transactions
    .filter(t => t.type === 'Dépôt' && t.status === 'Approuvé')
    .reduce((sum, t) => sum + t.amount, 0);
  const dynTotalWithdrawals = 938200 + transactions
    .filter(t => t.type === 'Retrait' && t.status === 'Approuvé')
    .reduce((sum, t) => sum + t.amount, 0);
  const dynTotalEarnings = 415200 + users.reduce((sum, u) => sum + (u.totalEarnings || 0), 0);

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 relative selection:bg-amber-500 selection:text-slate-900 pb-24 sm:pb-0" id="applet-viewport">
      
      {/* Upper Navigation / Status bar */}
      <header className="bg-[#0a0c12]/95 border-b border-white/10 sticky top-0 z-30 backdrop-blur-md px-4 py-4" id="main-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-amber-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.35)] shrink-0">
              <Award className="w-6 h-6 text-black font-black" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight italic text-white font-display">
                CAPITAL GOLD <span className="text-amber-500 not-italic font-normal uppercase text-[9px] sm:text-xs tracking-[0.3em] ml-1 sm:inline block">Invest</span>
              </h1>
            </div>
          </div>

          {/* Quick controls desktop */}
          <div className="flex items-center gap-3">
            {/* Live indicator from mock */}
            <div className="hidden md:flex flex-col text-right mr-2 shrink-0">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Market Status</span>
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                ● LIVE 24/7
              </span>
            </div>

            {/* Demo admin switcher */}
            {isDemoModeOn && (
              <div className="flex items-center gap-2 bg-[#161b28] border border-white/5 rounded-xl px-2.5 py-1 text-xs shrink-0 font-sans shadow">
                <span className="text-[9px] text-amber-500 font-mono font-bold uppercase tracking-wider hidden sm:inline">Demo / Admin Controls</span>
                <select
                  aria-label="Toggle simulator perspective"
                  onChange={(e) => {
                    if (e.target.value === 'admin') {
                      // Login as admin
                      const adminUser = users.find(u => u.role === 'Admin');
                      if (adminUser) setCurrentUser(adminUser);
                    } else if (e.target.value === 'investor') {
                      // Switch back to demo investor
                      const standardInvestor = users.find(u => u.role === 'User' && u.phone === '2250707070707');
                      if (standardInvestor) setCurrentUser(standardInvestor);
                    } else {
                      setCurrentUser(null);
                    }
                  }}
                  value={currentUser?.role === 'Admin' ? 'admin' : currentUser ? 'investor' : 'anonymous'}
                  className="bg-[#05070a] border-none outline-none text-[10px] text-amber-400 font-bold uppercase py-0.5 cursor-pointer font-mono"
                >
                  <option value="anonymous">Invité / Guest</option>
                  <option value="investor">Investisseur (Wilfried)</option>
                  <option value="admin">Administrateur (Direction)</option>
                </select>
              </div>
            )}

            {/* Language Selection */}
            <button
              onClick={() => setLang(lang === 'FR' ? 'EN' : 'FR')}
              className="px-2.5 py-1.5 bg-[#161b28] hover:bg-[#1c1f26] border border-white/5 rounded-xl text-[10px] font-bold text-amber-400 transition shrink-0 uppercase tracking-widest flex items-center gap-1 font-mono"
              id="language-switcher"
            >
              <Globe className="w-3.5 h-3.5 shrink-0" />
              {lang}
            </button>

            {/* Notifications Alert center */}
            {currentUser && (
              <button
                onClick={() => {
                  setShowNotifsOverlay(true);
                  handleMarkNotificationsRead();
                }}
                className="p-2 bg-[#161b28] border border-white/5 rounded-xl text-amber-400 hover:text-white transition shrink-0 relative"
                id="notifications-bell"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center px-1 font-mono">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>
            )}

            {currentUser && (
              <button
                onClick={handleLogout}
                className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-505/20 text-red-400 rounded-xl transition shrink-0 font-bold"
                title="Déconnexion"
                id="logout-button-hdr"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container Section */}
      <main className="max-w-7xl mx-auto px-4 py-8" id="main-content-area">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Views left & sidebars */}
          <section className="col-span-1 lg:col-span-8 space-y-6">
            
            {/* CONDITIONAL PAGES LAYOUT */}

            {/* A: DETAILED ADVERTISING BANNER & HOME LANDING */}
            {activeTab === 'home' && (
              <div className="space-y-6" id="tab-home-pane">
                {/* Hero section */}
                <div className="bg-gradient-to-br from-[#161b28] to-[#0a0c12] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden shadow-2xl group">
                  {/* Decorative glowing lines */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full filter blur-[90px] -mr-16 -mt-16 transition-all duration-300 group-hover:bg-amber-500/15"></div>
                  <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-yellow-500/5 rounded-full filter blur-[80px]"></div>

                  <div className="max-w-xl relative">
                    <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-black uppercase text-amber-400 tracking-widest font-mono">
                      🔥 Platforme d'Investissement Certifiée
                    </span>
                    
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 leading-none mt-4 font-sans tracking-tight">
                      Garantissez vos Revenus Passifs Journaliers
                    </h1>
                    
                    <p className="text-gray-300 text-xs sm:text-sm mt-3 leading-relaxed">
                      Soutenu par des technologies fintech automatisées d'Afrique de l'Ouest et internationales. Bénéficiez de rendements fixes réguliers allant jusqu'à <span className="text-amber-400 font-bold">36% d'intérêts sur cycle court</span>.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-6">
                      {!currentUser ? (
                        <>
                          <button
                            onClick={() => {
                              setAuthView('register');
                              setActiveTab('profile');
                            }}
                            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-lg transition transform hover:-translate-y-0.5"
                          >
                            Créer un Compte gratuit
                          </button>
                          <button
                            onClick={() => {
                              setAuthView('login');
                              setActiveTab('profile');
                            }}
                            className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-amber-50 font-bold px-6 py-3 rounded-2xl text-xs transition uppercase tracking-wider"
                          >
                            Se Connecter
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => {
                              setProfileAction('deposit');
                              setActiveTab('profile');
                            }}
                            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-1.5"
                          >
                            <span>📥 Effectuer un Dépôt</span>
                          </button>
                          <button
                            onClick={() => {
                              setProfileAction('withdraw');
                              setActiveTab('profile');
                            }}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-1.5"
                          >
                            <span>💸 Retirer mes Gains</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Live stats section - TOTAL MEMBERS, TOTALS DEPOSIT, WITHDRAW */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="statistiques-en-direct">
                  <div className="bg-black/30 border border-white/5 p-5 rounded-2xl text-center shadow-lg transform transition">
                    <div className="text-xs font-bold text-slate-500 font-mono tracking-wider uppercase mb-1">MEMBRES</div>
                    <div className="text-xl sm:text-2xl font-mono font-black text-amber-500">{dynUsersCount.toLocaleString()}+</div>
                    <span className="text-[9px] text-emerald-400 bg-emerald-400/5 px-1.5 py-0.5 rounded mt-2 inline-block font-mono">● Actifs aujourd'hui</span>
                  </div>

                  <div className="bg-black/30 border border-white/5 p-5 rounded-2xl text-center shadow-lg transform transition">
                    <div className="text-xs font-bold text-slate-500 font-mono tracking-wider uppercase mb-1">TOTAL DÉPÔTS</div>
                    <div className="text-xl sm:text-2xl font-mono font-black text-slate-100">{dynTotalDeposits.toLocaleString()} FCFA</div>
                    <span className="text-[9px] text-emerald-400 bg-emerald-400/5 px-1.5 py-0.5 rounded mt-2 inline-block font-mono">✓ Mobile Money sécurisé</span>
                  </div>

                  <div className="bg-black/30 border border-white/5 p-5 rounded-2xl text-center shadow-lg transform transition">
                    <div className="text-xs font-bold text-slate-500 font-mono tracking-wider uppercase mb-1">TOTAL RETRAITS</div>
                    <div className="text-xl sm:text-2xl font-mono font-black text-slate-100">{dynTotalWithdrawals.toLocaleString()} FCFA</div>
                    <span className="text-[9px] text-emerald-400 bg-emerald-400/5 px-1.5 py-0.5 rounded mt-2 inline-block font-mono">🚀 Retraits -15 minutes</span>
                  </div>

                  <div className="bg-black/30 border border-white/5 p-5 rounded-2xl text-center shadow-lg transform transition">
                    <div className="text-xs font-bold text-slate-500 font-mono tracking-wider uppercase mb-1">REVENUS DES MEMBRES</div>
                    <div className="text-xl sm:text-2xl font-mono font-black text-amber-500">{dynTotalEarnings.toLocaleString()} FCFA</div>
                    <span className="text-[9px] text-yellow-500 bg-yellow-500/5 px-1.5 py-0.5 rounded mt-2 inline-block font-mono">⚡ Yield journalier</span>
                  </div>
                </div>

                {/* Reviews and feedback */}
                <div className="space-y-6 pt-2">
                  
                  {/* Reviews carousel */}
                  <div className="bg-slate-900/20 border border-slate-800/60 rounded-3xl p-5">
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest font-mono text-center mb-4">
                      {lang === 'FR' ? 'Témoignages de nos Partenaires VIP' : 'Testimonials & Reviews'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {MOCK_TESTIMONIALS.map((t, i) => (
                        <div key={i} className="bg-slate-950 p-4 rounded-2xl border border-slate-900">
                          <p className="text-[11px] text-gray-400 leading-relaxed italic">"{t.text}"</p>
                          <div className="flex items-center gap-2.5 mt-3.5 pt-3.5 border-t border-slate-900">
                            <img src={t.avatar} className="w-7 h-7 rounded-full object-cover border border-slate-805" alt={t.name} referrerPolicy="no-referrer" />
                            <div>
                              <div className="font-bold text-[10px] sm:text-xs text-amber-100">{t.name}</div>
                              <div className="text-[9px] text-gray-500 uppercase font-mono">{t.role}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* B: PRODUCTS SELECTION SECTION */}
            {activeTab === 'products' && (
              <div className="space-y-6" id="tab-products-pane">
                <div className="text-center max-w-lg mx-auto mb-4">
                  <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-250">
                    Forfaits d'Investissement Gold
                  </h2>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    Sélectionnez le niveau VIP correspondant à votre capital et collectez des revenus passifs quotidiens réclamables à tout moment.
                  </p>
                </div>

                {/* Product Stats Bar */}
                <div className="bg-gradient-to-r from-[#161b28] to-[#0a0c12] border border-white/5 p-4 sm:p-5 rounded-3xl flex justify-between items-center max-w-2xl mx-auto shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-16 h-16 bg-amber-500/5 rounded-full filter blur-lg"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold font-mono">Nombre de Produits</span>
                    <span className="text-sm sm:text-base font-bold text-amber-500 font-mono">
                      {products.length} Plans VIP Disponibles
                    </span>
                  </div>
                  <div className="text-right flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold font-mono">Revenu</span>
                    <span className="text-sm sm:text-base font-bold text-emerald-400 font-mono">
                      Jusqu'à 125,000 FCFA / Jour
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((item) => (
                    <div
                      key={item.id}
                      className={item.price >= 50000 
                        ? "bg-gradient-to-b from-[#1c1f26] to-[#0a0c12] border border-amber-500/30 rounded-[2.5rem] p-7 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 transform hover:-translate-y-1.5 overflow-hidden relative"
                        : "bg-[#0a0c12] border border-white/5 hover:border-amber-500/30 rounded-[2.5rem] p-7 flex flex-col justify-between shadow-[0_15px_30px_rgba(0,0,0,0.4)] transition-all duration-300 transform hover:-translate-y-1.5 overflow-hidden relative"
                      }
                    >
                      {/* Golden blur gradient */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full filter blur-xl"></div>
                      
                      {item.price >= 50000 && (
                        <div className="absolute top-6 right-8">
                          <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_#f59e0b]"></div>
                        </div>
                      )}

                      <div>
                        {/* Upper badge */}
                        <div className="flex justify-between items-start">
                          <span className={item.price >= 50000 
                            ? "px-3 py-1 bg-amber-500/20 rounded-full text-[9px] font-bold uppercase text-amber-500 font-mono tracking-wider"
                            : "px-3 py-1 bg-slate-800 rounded-full text-[9px] font-bold uppercase text-slate-400 font-mono tracking-wider"
                          }>
                            {item.badge || (item.price >= 50000 ? 'POPULAR CHOICE' : 'ENTRY LEVEL')}
                          </span>
                          <div className="text-amber-500 p-1.5 rounded-xl bg-slate-900/40 font-bold">
                            <Crown className="w-5 h-5" />
                          </div>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold text-amber-50 mt-4 font-sans leading-none italic font-display">
                          {item.name}
                        </h3>

                        {/* Price Tag */}
                        <div className="mt-4 pb-4 border-b border-white/5">
                          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Coût requis</div>
                          <div className="text-2xl font-mono font-bold text-amber-500">
                            {item.price.toLocaleString()} FCFA
                          </div>
                        </div>

                        {/* Earnings summary */}
                        <div className="space-y-3.5 mt-5 text-sm font-sans">
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-slate-400">Gains Quotidiens :</span>
                            <span className="font-bold text-white font-mono">{item.dailyReturn.toLocaleString()} FCFA</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-slate-400">Durée du cycle :</span>
                            <span className="font-bold text-white font-mono">{item.durationDays} Jours</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Rendement Total :</span>
                            <span className="font-bold text-emerald-400 font-mono">{item.totalReturn.toLocaleString()} FCFA</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8">
                        <button
                          onClick={() => handleBuyProduct(item)}
                          className={item.price >= 50000
                            ? "w-full py-4 bg-amber-500 text-black rounded-2xl hover:bg-amber-450 transition-all font-bold uppercase text-xs tracking-widest cursor-pointer shadow-[0_5px_15px_rgba(212,175,55,0.3)] block"
                            : "w-full py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all font-bold uppercase text-xs tracking-widest cursor-pointer block"
                          }
                        >
                          {lang === 'FR' ? 'Investir Maintenant' : 'Invest Now'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* C: MLM TEAM MEMBERS SECTION */}
            {activeTab === 'team' && (
              <div className="space-y-6" id="tab-team-pane">
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full filter blur-2xl"></div>
                  
                  <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-black uppercase text-amber-400 tracking-widest font-mono">
                    👥 Programme de Parrainage Multi-Level (MLM)
                  </span>

                  <h2 className="text-xl sm:text-2xl font-black text-amber-50 mt-4 font-sans tracking-tight">
                    Multipliez vos Gains d'Affiliation
                  </h2>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1 leading-relaxed">
                    Partagez votre lien d'invitation avec vos amis. Vous recevez des commissions financières automatiques créditées directement dans votre solde à chaque dépôt d'un affilié !
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 border-t border-white/5 pt-6">
                    {/* Code de parrainage */}
                    <div className="md:col-span-4">
                      <div className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">Votre Code Personnel</div>
                      <div className="bg-[#0a0c12] border border-white/5 px-4 py-3 rounded-2xl mt-2 flex items-center justify-between shadow-inner">
                        <span className="font-mono font-bold text-base tracking-widest text-amber-500 uppercase">
                          {currentUser ? currentUser.referralCode : 'WILF777'}
                        </span>
                        <button
                          onClick={handleCopyReferralCodeOnly}
                          className="bg-zinc-800 hover:bg-zinc-700 text-amber-500 hover:text-white px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 text-[11px] font-bold"
                          title="Copier le code uniquement"
                        >
                          {copiedCode ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copié!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copier</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Lien d'invitation automatique */}
                    <div className="md:col-span-8">
                      <div className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">Lien d'invitation automatique (Facilite le parrainage)</div>
                      <div className="bg-[#0a0c12] border border-white/5 px-3 py-2 rounded-2xl mt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-inner">
                        <div className="font-mono text-xs text-slate-400 select-all truncate max-w-full px-2 py-1 bg-black/40 rounded-xl flex-grow overflow-x-auto whitespace-nowrap min-h-[30px] flex items-center">
                          {window.location.origin}/?ref={currentUser ? currentUser.referralCode : 'WILF777'}
                        </div>
                        <button
                          onClick={handleCopyReferral}
                          className="bg-amber-500 hover:bg-amber-450 text-black px-4 py-2 sm:py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-xs font-bold shrink-0 shadow-[0_4px_10px_rgba(245,158,11,0.2)]"
                          title="Copier le lien complet"
                        >
                          {copiedLink ? (
                            <>
                              <Check className="w-4 h-4 text-slate-900" />
                              <span>Lien copié!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copier le Lien</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-white/5 pt-6">
                    <div className="text-[10px] text-zinc-500 uppercase font-black tracking-wider mb-2">Taux de Commission de Réseau & Gains Totaux réels</div>
                    <div className="grid grid-cols-3 gap-3 text-center max-w-lg">
                      <div className="bg-[#0f2115] border border-emerald-500/20 p-3 rounded-2xl flex flex-col justify-between">
                        <div>
                          <span className="text-lg sm:text-2xl font-mono font-black text-emerald-400 block">30%</span>
                          <span className="text-[9px] text-gray-400 uppercase font-bold block">Niveau 1</span>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-emerald-500/10 text-[10px] text-emerald-400 font-mono font-bold">
                          {totalRevLevel1.toLocaleString()} FCFA
                        </div>
                      </div>
                      <div className="bg-[#241b0f] border border-amber-500/20 p-3 rounded-2xl flex flex-col justify-between">
                        <div>
                          <span className="text-lg sm:text-2xl font-mono font-black text-amber-400 block">2%</span>
                          <span className="text-[9px] text-gray-400 uppercase font-bold block">Niveau 2</span>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-amber-500/10 text-[10px] text-amber-400 font-mono font-bold">
                          {totalRevLevel2.toLocaleString()} FCFA
                        </div>
                      </div>
                      <div className="bg-[#1b1028] border border-purple-500/20 p-3 rounded-2xl flex flex-col justify-between">
                        <div>
                          <span className="text-lg sm:text-2xl font-mono font-black text-purple-400 block">1%</span>
                          <span className="text-[9px] text-gray-400 uppercase font-bold block">Niveau 3</span>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-purple-500/10 text-[10px] text-purple-400 font-mono font-bold">
                          {totalRevLevel3.toLocaleString()} FCFA
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated MLM parameters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="mlm-parrainage-stats">
                  {/* Level 1 stats */}
                  <div className="bg-[#0a0c12] border border-white/5 rounded-3xl p-5">
                    <div className="flex flex-col gap-1 pb-3 border-b border-white/5">
                      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">
                        NIVEAU 1 (Direct - 30%)
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-mono font-bold text-slate-300">{level1Invites.length} Membres</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">{totalRevLevel1.toLocaleString()} FCFA</span>
                      </div>
                    </div>

                    {level1Invites.length === 0 ? (
                      <div className="p-6 text-center text-gray-500 text-[11px]">Aucun invité direct pour le moment</div>
                    ) : (
                      <div className="space-y-2 mt-3 p-1 max-h-[160px] overflow-y-auto">
                        {level1Invites.map((u, i) => (
                          <div key={i} className="flex justify-between items-center bg-black/40 p-2 rounded-xl border border-white/5">
                            <div className="truncate max-w-[65%]">
                              <div className="text-[11px] font-bold text-amber-50 truncate">{u.name}</div>
                              <div className="text-[9px] text-gray-500 font-mono font-bold">{u.phone}</div>
                            </div>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 font-mono text-[8px] text-emerald-400 shrink-0">
                              L1 Direct
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Level 2 stats */}
                  <div className="bg-[#0a0c12] border border-white/5 rounded-3xl p-5">
                    <div className="flex flex-col gap-1 pb-3 border-b border-white/5">
                      <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest font-mono">
                        NIVEAU 2 (Indirect - 2%)
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-mono font-bold text-slate-300">{level2Invites.length} Membres</span>
                        <span className="text-xs font-mono font-bold text-amber-500">{totalRevLevel2.toLocaleString()} FCFA</span>
                      </div>
                    </div>

                    {level2Invites.length === 0 ? (
                      <div className="p-6 text-center text-gray-500 text-[11px]">Aucun affilié de second degré</div>
                    ) : (
                      <div className="space-y-2 mt-3 p-1 max-h-[160px] overflow-y-auto">
                        {level2Invites.map((u, i) => (
                          <div key={i} className="flex justify-between items-center bg-black/40 p-2 rounded-xl border border-white/5">
                            <div className="truncate max-w-[65%]">
                              <div className="text-[11px] font-bold text-amber-50 truncate">{u.name}</div>
                              <div className="text-[9px] text-gray-500 font-mono font-bold">{u.phone}</div>
                            </div>
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/25 font-mono text-[8px] text-amber-400 shrink-0">
                              L2 Indirect
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Level 3 stats */}
                  <div className="bg-[#0a0c12] border border-white/5 rounded-3xl p-5">
                    <div className="flex flex-col gap-1 pb-3 border-b border-white/5">
                      <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest font-mono">
                        NIVEAU 3 (Tertiaire - 1%)
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-mono font-bold text-slate-300">{level3Invites.length} Membres</span>
                        <span className="text-xs font-mono font-bold text-purple-400">{totalRevLevel3.toLocaleString()} FCFA</span>
                      </div>
                    </div>

                    {level3Invites.length === 0 ? (
                      <div className="p-6 text-center text-gray-500 text-[11px]">Aucun affilié de troisième degré</div>
                    ) : (
                      <div className="space-y-2 mt-3 p-1 max-h-[160px] overflow-y-auto">
                        {level3Invites.map((u, i) => (
                          <div key={i} className="flex justify-between items-center bg-black/40 p-2 rounded-xl border border-white/5">
                            <div className="truncate max-w-[65%]">
                              <div className="text-[11px] font-bold text-amber-50 truncate">{u.name}</div>
                              <div className="text-[9px] text-gray-500 font-mono font-bold">{u.phone}</div>
                            </div>
                            <span className="px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/25 font-mono text-[8px] text-purple-400 shrink-0">
                              L3 Tertiaire
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* D: USER PROFILE & FINANCES */}
            {activeTab === 'profile' && (
              <div className="space-y-6" id="tab-profile-pane">
                
                {/* 1. AUTH STATE CHECK */}
                {!currentUser ? (
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 sm:p-8 max-w-md mx-auto shadow-2xl space-y-4" id="auth-forms-container">
                    
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10 mb-2">
                        <Lock className="w-6 h-6 text-slate-950" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                        {authView === 'login' ? 'Espace de Connexion' : 'Création de Compte VIP'}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1">
                        {authView === 'login' ? 'Accédez à votre portefeuille sécurisé' : 'Rejoignez le premier syndicat d\'investissement'}
                      </p>
                    </div>

                    {/* SELECT AUTH VIEWS */}
                    <div className="grid grid-cols-2 bg-slate-900 border border-slate-850 p-1 rounded-2xl">
                      <button
                        onClick={() => setAuthView('login')}
                        className={`py-2 text-xs font-bold rounded-xl transition-all ${
                          authView === 'login' ? 'bg-amber-500 text-slate-950' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Se connecter
                      </button>
                      <button
                        onClick={() => setAuthView('register')}
                        className={`py-2 text-xs font-bold rounded-xl transition-all ${
                          authView === 'register' ? 'bg-amber-500 text-slate-950' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        S'inscrire
                      </button>
                    </div>

                    {/* LOGIN FORM */}
                    {authView === 'login' && (
                      <form onSubmit={handleLogin} className="space-y-3.5" id="login-form">
                        <div>
                          <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Numéro WhatsApp</label>
                          <input
                            type="tel"
                            required
                            placeholder="Ex: 2250707070707"
                            value={loginPhone}
                            onChange={(e) => setLoginPhone(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-850 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                            id="login-phone-input"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Mot De Passe</label>
                          <input
                            type="password"
                            required
                            placeholder="Taper mot de passe"
                            value={loginPass}
                            onChange={(e) => setLoginPass(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-850 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                            id="login-password-input"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black py-3 rounded-2xl text-xs uppercase tracking-wider shadow-lg transition duration-75 mt-2"
                        >
                          Connexion Sécurisée
                        </button>
                      </form>
                    )}

                    {/* REGISTER FORM */}
                    {authView === 'register' && (
                      <form onSubmit={handleRegister} className="space-y-3" id="register-form">
                        <div>
                          <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Nom et prénom complet</label>
                          <input
                            type="text"
                            required
                            placeholder="Nom d'investisseur"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-850 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 font-sans"
                            id="register-name-input"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">WhatsApp</label>
                            <input
                              type="tel"
                              required
                              placeholder="2250707070707"
                              value={regPhone}
                              onChange={(e) => setRegPhone(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-850 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 font-mono"
                              id="register-phone-input"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Pays d'origine</label>
                            <select
                              value={regCountry}
                              aria-label="Selectionner pays d'origine"
                              onChange={(e) => setRegCountry(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-850 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 font-bold"
                            >
                              <option value="Burkina Faso">Burkina Faso 🇧🇫</option>
                              <option value="Cameroun">Cameroun 🇨🇲</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Mot De Passe</label>
                            <input
                              type="password"
                              required
                              placeholder="Créer mot de passe"
                              value={regPass}
                              onChange={(e) => setRegPass(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-850 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100"
                              id="register-password-input"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Confirmation</label>
                            <input
                              type="password"
                              required
                              placeholder="Répéter mot de passe"
                              value={regPassConfirm}
                              onChange={(e) => setRegPassConfirm(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-850 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100"
                              id="register-confirm-password-input"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Code de Parrainage (Optionnel)</label>
                          <input
                            type="text"
                            placeholder="Saisir code du parrain"
                            value={regRef}
                            onChange={(e) => setRegRef(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-850 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 uppercase font-mono"
                            id="register-refcode-input"
                          />
                          {regRef.trim() !== '' && (
                            <div className="mt-1.5 text-[11px]">
                              {users.some(u => u.referralCode === regRef.trim().toUpperCase()) ? (
                                <span className="text-emerald-400 font-medium flex items-center gap-1">
                                  ✓ Code valide : Parrainé par <strong className="underline">{users.find(u => u.referralCode === regRef.trim().toUpperCase())?.name}</strong> (+1 000 FCFA Offert)
                                </span>
                              ) : (
                                <span className="text-amber-500 font-mono text-[10px]">
                                  ⚠ Ce code de parrainage n'existe pas ou est erroné.
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black py-3 rounded-2xl text-xs uppercase tracking-wider shadow-lg transition mt-2"
                        >
                          Valider l'Inscription (+1 200F Offerts)
                        </button>
                      </form>
                    )}

                  </div>
                ) : currentUser.role === 'Admin' ? (
                  // If logged in under Admin directly, show AdminPanel component
                  <AdminPanel
                    currentUser={currentUser}
                    users={users}
                    transactions={transactions}
                    products={products}
                    bonusCodes={bonusCodes}
                    notifications={notifications}
                    onUpdateUsers={setUsers}
                    onUpdateTransactions={setTransactions}
                    onUpdateProducts={setProducts}
                    onUpdateBonusCodes={setBonusCodes}
                    onUpdateNotifications={setNotifications}
                    lang={lang}
                  />
                ) : (
                  
                  // STANDARD INVESTOR DASHBOARD
                  <div className="space-y-6" id="investor-dashboard">
                    
                    {/* Welcome header & quick stats panel */}
                    <div className="bg-gradient-to-br from-[#161b28] to-[#0a0c12] border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/15 rounded-full filter blur-[50px] -mr-10 -mt-10 transition-all duration-300 group-hover:bg-amber-500/20"></div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-black text-amber-50 flex items-center gap-1.5 font-sans tracking-tight">
                            {lang === 'FR' ? 'Tableau de bord de' : 'Dashboard of'} {currentUser.name}
                            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                          </h3>
                          <div className="text-[10px] sm:text-xs text-gray-400 mt-1 flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[9px] font-mono text-amber-500 font-bold">
                              {currentUser.referralCode}
                            </span>
                            <span>• {currentUser.country}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => setProfileAction('deposit')}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-2xl text-xs uppercase font-extrabold tracking-wider shadow flex items-center gap-1.5 transition"
                          >
                            <ArrowUpRight className="w-4 h-4 shrink-0 font-bold" />
                            Dépôt
                          </button>
                          <button
                            onClick={() => setProfileAction('withdraw')}
                            className="bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-850 px-4 py-2 rounded-2xl text-xs uppercase font-bold tracking-wider transition flex items-center gap-1.5"
                          >
                            <ArrowDownLeft className="w-4 h-4 shrink-0 font-bold" />
                            Retrait
                          </button>
                        </div>
                      </div>

                      {/* BALANCES SUBPANELS */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t border-slate-900 pt-5">
                        
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase font-semibold block mb-0.5">Solde Principal</span>
                          <span className="text-lg sm:text-2xl font-mono font-black text-amber-400">
                            {currentUser.balance.toLocaleString()} FCFA
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase font-semibold block mb-0.5">Gains du jour</span>
                          <span className="text-lg sm:text-2xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                            +{currentUser.dailyEarnings.toLocaleString()} FCFA
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase font-semibold block mb-0.5">Revenus Totaux</span>
                          <span className="text-lg sm:text-2xl font-mono font-black text-slate-50">
                            {currentUser.totalEarnings.toLocaleString()} FCFA
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase font-semibold block mb-0.5">Solde Bonus</span>
                          <span className="text-lg sm:text-2xl font-mono font-black text-amber-300">
                            {currentUser.bonus.toLocaleString()} FCFA
                          </span>
                        </div>

                      </div>
                    </div>

                    {/* DYNAMIC FORM SUBPANE ACCORDING TO USER'S CLICKS */}

                    {/* 1. DEPOSIT PANEL */}
                    {profileAction === 'deposit' && (
                      <div className="bg-slate-950 border border-slate-900 p-5 rounded-3xl space-y-4 shadow-xl" id="profile-deposit-flow">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-widest font-mono">
                            📥 Alimenter mon Portefeuille d'Investissement
                          </h4>
                          <button
                            onClick={() => setProfileAction('none')}
                            className="text-gray-500 hover:text-white text-xs font-semibold"
                          >
                            Retour
                          </button>
                        </div>

                        {depSuccessMsg ? (
                          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm rounded-2xl flex flex-col items-center text-center">
                            <CheckCircle className="w-10 h-10 mb-2 animate-bounce" />
                            <span className="font-bold">Commande de Dépôt Soumise avec Succès !</span>
                            <span className="text-[11px] text-gray-400 mt-1">L'administrateur valide généralement les recharges sous 10 à 30 minutes. Veuillez consulter l'historique de vos transactions en bas.</span>
                            <button
                              onClick={() => {
                                setDepSuccessMsg(false);
                                setProfileAction('none');
                              }}
                              className="bg-amber-500 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs mt-3 shadow-md"
                            >
                              Fermer
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleSubmitDeposit} className="space-y-4">
                            
                            {/* Démarches du Dépôt */}
                            <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl space-y-2.5">
                              <span className="text-xs text-amber-400 uppercase font-bold flex items-center gap-1.5 font-mono">
                                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                                Démarches pour effectuer votre Dépôt :
                              </span>
                              <ul className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed pl-1">
                                <li>Sélectionnez l'opérateur et saisissez le montant exact à déposer.</li>
                                <li>Envoyez le montant en effectuant un transfert direct vers le numéro marchand qui s'affiche ci-dessous.</li>
                                <li>Copiez l'ID / référence de la transaction reçue par SMS.</li>
                                <li>Saisissez l'ID dans le formulaire, téléversez votre capture d'écran, puis validez.</li>
                              </ul>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Opérateur de Paiement</label>
                                <select
                                  value={depMethod}
                                  aria-label="Selectionner operateur de paiement"
                                  onChange={(e) => setDepMethod(e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-850 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100"
                                >
                                  <option value="MTN Mobile Money">MTN Mobile Money (Momo)</option>
                                  <option value="Orange Money">Orange Money</option>
                                  <option value="Moov Money">Moov Money</option>
                                  <option value="Wave">Wave</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Montant à Dépenser (FCFA)</label>
                                <input
                                  type="number"
                                  required
                                  value={depAmount}
                                  onChange={(e) => setDepAmount(e.target.value)}
                                  placeholder="Min: 1000 FCFA"
                                  className="w-full bg-slate-900 border border-slate-850 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 font-mono"
                                  id="deposit-amount-input"
                                />
                              </div>
                            </div>

                            {/* Payment coordinates details */}
                            <div className="bg-slate-900 p-4 border border-slate-850 rounded-2xl space-y-2.5">
                              <span className="text-[10px] text-amber-500 uppercase font-bold block">🚨 Procédure d'Envoi Impérative</span>
                              <div className="text-xs text-zinc-300 leading-relaxed">
                                Veuillez effectuer un transfert direct de <span className="text-amber-400 font-bold">{Number(depAmount).toLocaleString()} FCFA</span> vers le numéro d'agence ci-dessous :
                                <div className="bg-slate-950/80 px-4 py-2 rounded-xl mt-2 flex justify-between items-center font-mono">
                                  <div>
                                    <span className="text-[9px] text-gray-500 block uppercase font-bold">Numéro d'Agence Reçu</span>
                                    <span className="text-sm font-black text-amber-300">
                                      {depMethod === 'MTN Mobile Money' ? '+225 0501102233' : depMethod === 'Orange Money' ? '+225 0707778899' : '+225 0101556600'}
                                    </span>
                                  </div>
                                  <span className="px-1.5 py-0.5 bg-slate-800 text-[9px] text-gray-400 font-bold rounded">
                                    Compte Marchand
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Numéro ID d'Opération de Référence</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Ex: ref: om-98242"
                                  value={depRef}
                                  onChange={(e) => setDepRef(e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-850 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                                  id="deposit-id-input"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Upload Capture de Reçu (Glisser / Sélectionner)</label>
                                <div className="relative w-full bg-slate-900 border border-dashed border-slate-800 rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs cursor-pointer">
                                  <span className="text-zinc-500 truncate text-[11px]">
                                    {depScreenshot ? depScreenshot.name : 'Choisir image de reçu (.jpg/.png)'}
                                  </span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleManualUploadText}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    id="deposit-file-picker"
                                  />
                                  <span className="px-2 py-0.5 bg-slate-800 text-gray-400 rounded text-[9px] font-bold">Parcourir</span>
                                </div>
                              </div>
                            </div>

                            {depErrorMsg && (
                              <div className="text-xs text-red-500 font-semibold">{depErrorMsg}</div>
                            )}

                            <button
                              type="submit"
                              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-2xl text-xs uppercase tracking-wider shadow transition"
                            >
                              Déclarer et Soumettre le Dépôt
                            </button>

                          </form>
                        )}
                      </div>
                    )}

                    {/* 2. WITHDRAW PANEL */}
                    {profileAction === 'withdraw' && (
                      <div className="bg-slate-950 border border-slate-900 p-5 rounded-3xl space-y-4 shadow-xl" id="profile-withdraw-flow">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-widest font-mono">
                            💸 Initier un Retrait de Fonds Direct
                          </h4>
                          <button
                            onClick={() => setProfileAction('none')}
                            className="text-gray-500 hover:text-white text-xs font-semibold"
                          >
                            Retour
                          </button>
                        </div>

                        {withdrawSuccessMsg ? (
                          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm rounded-2xl flex flex-col items-center text-center">
                            <CheckCircle className="w-10 h-10 mb-2 animate-bounce" />
                            <span className="font-bold">Demande de Retrait Transmise !</span>
                            <span className="text-[11px] text-gray-400 mt-1">Le montant a été gelé temporairement et sera traité par nos agents sous peu. Merci pour votre patience.</span>
                            <button
                              onClick={() => {
                                setWithdrawSuccessMsg(false);
                                setProfileAction('none');
                              }}
                              className="bg-amber-500 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs mt-3 shadow"
                            >
                              Fermer
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleSubmitWithdrawal} className="space-y-4">
                            
                            {/* Démarches du Retrait */}
                            <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl space-y-2.5">
                              <span className="text-xs text-amber-400 uppercase font-bold flex items-center gap-1.5 font-mono">
                                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                                Démarches pour effectuer votre Retrait :
                              </span>
                              <ul className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed pl-1">
                                <li>Sélectionnez le moyen de retrait et le montant désiré (Min: 1 000 FCFA).</li>
                                <li>Renseignez le numéro exact Mobile Money pour la réception des fonds.</li>
                                <li>Soumettez votre demande de retrait en cliquant sur le bouton ci-dessous.</li>
                                <li>Nos agents effectuent le paiement sous 10 à 30 minutes après vérification.</li>
                              </ul>
                            </div>
                            
                            <div className="bg-slate-900 p-3.5 border border-slate-850 rounded-2xl">
                              <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Votre Solde Actuel</span>
                              <span className="text-2xl font-mono font-black text-amber-400">
                                {currentUser.balance.toLocaleString()} FCFA
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Moyen / Réseau de Retrait</label>
                                <select
                                  value={withdrawMethod}
                                  aria-label="Selectionner operateur de retrait"
                                  onChange={(e) => setWithdrawMethod(e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-850 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100"
                                >
                                  <option value="MTN Mobile Money">MTN Mobile Money</option>
                                  <option value="Orange Money">Orange Money</option>
                                  <option value="Moov Money">Moov Money</option>
                                  <option value="Wave">Wave</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Montant à Retirer (FCFA)</label>
                                <input
                                  type="number"
                                  required
                                  value={withdrawAmount}
                                  onChange={(e) => setWithdrawAmount(e.target.value)}
                                  placeholder="Seuil Min: 1 000 FCFA"
                                  className="w-full bg-slate-900 border border-slate-850 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 font-mono"
                                  id="withdraw-amount-input"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Numéro Mobile Money de Réception</label>
                              <input
                                type="tel"
                                required
                                placeholder="Numéro complet (ex: 2250707...)"
                                value={withdrawPhone}
                                onChange={(e) => setWithdrawPhone(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-850 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 font-mono"
                                id="withdraw-phone-input"
                              />
                            </div>

                            {withdrawErrorMsg && (
                              <div className="text-xs text-red-500 font-semibold">{withdrawErrorMsg}</div>
                            )}

                            <button
                              type="submit"
                              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-2xl text-xs uppercase tracking-wider shadow transition"
                            >
                              Soumettre la demande de Retrait sécurisée
                            </button>

                          </form>
                        )}
                      </div>
                    )}

                    {/* HISTORIQUE COMPREHENSIF D'ACTIVITÉ */}
                    <div className="bg-[#0a0c12] border border-white/5 p-4 sm:p-5 rounded-3xl space-y-4 shadow-xl" id="profile-unified-history">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                          <History className="w-4 h-4 text-amber-500 shrink-0" />
                          Historique d'activité du compte
                        </h4>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">
                          Dépôt • Achat • Retrait
                        </span>
                      </div>

                      {(() => {
                        const historyItems: {
                          id: string;
                          type: 'Dépôt' | 'Achat' | 'Retrait';
                          title: string;
                          amount: number;
                          date: string;
                          status: string;
                          info: string;
                        }[] = [];

                        // 1. Add Deposits and Withdrawals
                        transactions
                          .filter(t => t.userId === currentUser.id)
                          .forEach(t => {
                            historyItems.push({
                              id: t.id,
                              type: t.type === 'Dépôt' ? 'Dépôt' : 'Retrait',
                              title: t.type === 'Dépôt' ? 'Dépôt de Fonds' : 'Retrait de Gains',
                              amount: t.amount,
                              date: t.createdAt,
                              status: t.status,
                              info: t.method
                            });
                          });

                        // 2. Add Purchased products (activeInvestments)
                        activeInvestments
                          .filter(i => i.userId === currentUser.id)
                          .forEach(i => {
                            historyItems.push({
                              id: i.id,
                              type: 'Achat',
                              title: `Achat - ${i.productName}`,
                              amount: i.investedAmount,
                              date: i.createdAt || new Date().toISOString(),
                              status: 'Approuvé',
                              info: `Revenu: +${i.dailyReturn} F / j`
                            });
                          });

                        // Sort chronological descending
                        historyItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                        if (historyItems.length === 0) {
                          return (
                            <div className="p-6 text-center text-zinc-500 text-xs font-semibold">
                              Aucune activité enregistrée (Dépôts, achats ou retraits).
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                            {historyItems.map((item) => (
                              <div
                                key={item.id}
                                className="bg-slate-950 border border-white/5 p-3 rounded-2xl flex items-center justify-between text-xs"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                    item.type === 'Dépôt' 
                                      ? 'bg-emerald-500/10 text-emerald-400' 
                                      : item.type === 'Retrait'
                                      ? 'bg-red-400/10 text-red-400'
                                      : 'bg-amber-500/10 text-amber-500'
                                  }`}>
                                    {item.type === 'Dépôt' ? '📥' : item.type === 'Retrait' ? '💸' : '🛍️'}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-bold text-slate-100 truncate">{item.title}</div>
                                    <div className="text-[10px] text-zinc-500 font-mono mt-0.5 truncate">
                                      {new Date(item.date).toLocaleDateString('fr-FR')} • {item.info}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right shrink-0 ml-2">
                                  <div className={`font-mono font-bold ${
                                    item.type === 'Dépôt' 
                                      ? 'text-emerald-400' 
                                      : item.type === 'Retrait'
                                      ? 'text-red-400'
                                      : 'text-amber-500'
                                  }`}>
                                    {item.type === 'Retrait' ? '-' : '+'}{item.amount.toLocaleString()} FCFA
                                  </div>
                                  <span className={`text-[9.5px] font-black uppercase mt-1 inline-block ${
                                    item.status === 'Approuvé' ? 'text-emerald-400' : item.status === 'Rejeté' ? 'text-red-500' : 'text-yellow-400 animate-pulse'
                                  }`}>
                                    {item.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>

                    {/* 3. CLAIM BONUS REDEMPTION PANE */}
                    <div className="bg-slate-900/40 border border-slate-800 p-4 sm:p-5 rounded-3xl" id="claim-vouchers-box">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono mb-2 flex items-center gap-1.5">
                        <Gift className="w-4 h-4 shrink-0" />
                        Avez-vous un Code de Promotion Cadeaux ?
                      </h4>
                      <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
                        Collez vos codes de d'événements, d'invitations ou distribués pour réclamer immédiatement du solde portefeuille capital.
                      </p>

                      <form onSubmit={handleClaimBonusCode} className="flex gap-2.5">
                        <input
                          type="text"
                          required
                          value={bonusInput}
                          onChange={(e) => setBonusInput(e.target.value)}
                          placeholder="EX: GOLD2026 / WELCOME-BONUS"
                          className="flex-1 bg-slate-950 border border-slate-850 px-3.5 py-2 text-xs text-amber-100 uppercase font-mono rounded-xl focus:outline-none focus:border-amber-400"
                          id="coupon-code-input"
                        />
                        <button
                          type="submit"
                          className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition"
                        >
                          Appliquer
                        </button>
                      </form>

                      {bonusCodeStatus.success && (
                        <div className="text-xs text-emerald-400 font-semibold mt-2">✓ Félicitations ! Solde bonus crédité avec succès !</div>
                      )}
                      {bonusCodeStatus.error && (
                        <div className="text-xs text-red-500 font-semibold mt-2">{bonusCodeStatus.error}</div>
                      )}
                    </div>

                    {/* 4. ACTIVE INVESTMENTS LISTS */}
                    <div className="space-y-4">
                      {/* Active Products Stats Row */}
                      <div className="bg-gradient-to-r from-[#161b28] to-[#0a0c12] border border-white/5 p-4 rounded-3xl flex justify-between items-center shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-12 h-12 bg-amber-500/5 rounded-full filter blur-lg"></div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold font-mono">Nombre de produits</span>
                          <span className="text-sm font-bold text-amber-500 font-mono">
                            {activeInvestments.filter(i => i.userId === currentUser.id).length} Plan(s) Actif(s)
                          </span>
                        </div>
                        <div className="text-right flex flex-col">
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold font-mono">Revenu</span>
                          <span className="text-sm font-bold text-emerald-400 font-mono">
                            +{activeInvestments.filter(i => i.userId === currentUser.id).reduce((sum, inv) => sum + inv.dailyReturn, 0).toLocaleString()} FCFA / Jour
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
                          📦 Détail de mes Investissements Actifs
                        </h4>
                      </div>

                      {activeInvestments.filter(i => i.userId === currentUser.id).length === 0 ? (
                        <div className="p-8 text-center bg-slate-950 border border-slate-900 rounded-3xl text-gray-500 text-xs sm:text-sm">
                          Découvrez nos offres rentables dans l'onglet <span className="text-amber-500 font-bold">'Produits'</span> et boostez vos rentes.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {activeInvestments.filter(i => i.userId === currentUser.id).map((inv) => {
                            // Calculate claims progress
                            const percentage = Math.min(100, (inv.progressDays / inv.durationDays) * 100);
                            
                            // Check claim lock (limit to simulation)
                            const isClaimedToday = false; // Simulated daily claim block, always available for simple simulation play

                            return (
                              <div
                                key={inv.id}
                                className="bg-slate-950 border border-slate-900 p-4 rounded-3xl relative overflow-hidden flex flex-col justify-between"
                              >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full filter blur-lg"></div>
                                
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start">
                                    <h5 className="font-bold text-amber-50 text-xs sm:text-sm truncate">
                                      {inv.productName}
                                    </h5>
                                    <span className="text-[10px] font-mono text-gray-500">
                                      {inv.progressDays}/{inv.durationDays} Jrs Cycles
                                    </span>
                                  </div>

                                  <div className="flex justify-between items-end font-mono">
                                    <div>
                                      <span className="text-[8px] text-gray-500 uppercase block">Gains par jour:</span>
                                      <span className="text-emerald-400 font-black text-sm">+{inv.dailyReturn.toLocaleString()} F</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-[8px] text-gray-505 uppercase block">Capital engagé:</span>
                                      <span className="text-slate-300 font-semibold text-xs">{inv.investedAmount.toLocaleString()} F</span>
                                    </div>
                                  </div>

                                  {/* Progress bar visualizer */}
                                  <div className="w-full shrink-0 h-1.5 bg-slate-900 rounded-full mt-2 overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-900/60 flex items-center justify-between">
                                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">
                                    Mise à jour: 24h
                                  </span>
                                  <button
                                    onClick={() => handleClaimEarning(inv.id)}
                                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 font-sans shadow-lg hover:to-teal-600 text-slate-950 font-black rounded-xl text-[10px] uppercase tracking-wider transition"
                                  >
                                    Réclamer +{inv.dailyReturn.toLocaleString()} FCFA
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>



                    {/* Pourquoi Choisir Capital Gold Invest & FAQ du site au niveau du profil */}
                    <div className="border-t border-white/5 pt-6 space-y-6">
                      {/* About Card */}
                      <div className="bg-[#0a0c12] border border-white/5 rounded-[2rem] p-6 sm:p-8 shadow-md">
                        <h3 className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-250 font-display tracking-tight mb-2">
                          Pourquoi choisir Capital Gold Invest ?
                        </h3>
                        <p className="text-gray-400 text-[11px] sm:text-xs leading-relaxed mb-4">
                          Notre plateforme convertit l'épargne individuelle en investissements productifs dans l'économie numérique, le cloud-computing et le négoce à fréquence automatisée. Nous offrons une structure claire, résiliente et sécurisée pour générer des gains de subsistance.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/5 pt-4">
                          <div className="flex gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 text-xs">✓</div>
                            <div>
                              <h4 className="text-[11px] font-bold text-slate-100 uppercase">Protection Intégrale</h4>
                              <p className="text-[9px] text-gray-500 mt-0.5">Fonds de réserve bloqué à hauteur de 150 000 000 FCFA.</p>
                            </div>
                          </div>
                          <div className="flex gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 text-xs">✓</div>
                            <div>
                              <h4 className="text-[11px] font-bold text-slate-100 uppercase">Multi-opérateur</h4>
                              <p className="text-[9px] text-gray-500 mt-0.5">Rechargez/retirez par MTN, Orange, Moov, Wave.</p>
                            </div>
                          </div>
                          <div className="flex gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 text-xs">✓</div>
                            <div>
                              <h4 className="text-[11px] font-bold text-slate-100 uppercase">Support Client 24/7</h4>
                              <p className="text-[9px] text-gray-500 mt-0.5">Assistance dédiée par WhatsApp et Chat direct.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* FAQs Card */}
                      <div className="space-y-4">
                        <FAQCollapse items={MOCK_FAQS} lang={lang} />
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

          </section>

          {/* RIGHT SIDEBAR MODULES (Feed & Rankings removed as requested) */}
          <aside className="col-span-1 lg:col-span-4 space-y-6">
            
            {/* Quick action buttons sidebar */}
            <div className="bg-gradient-to-br from-[#161b28] to-[#0a0c12] border border-white/5 rounded-[2rem] p-6 space-y-4 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full filter blur-xl"></div>
              <Flame className="w-8 h-8 text-amber-500 mx-auto animate-pulse" />
              <div>
                <h4 className="font-bold text-amber-50 leading-none text-xs sm:text-sm font-display">Canaux de Discussions Commutatifs</h4>
                <p className="text-[10px] text-gray-400 mt-1 leading-snug">Restez informé de tous les événements promotionnels hebdomadaires.</p>
              </div>

              <div className="space-y-2 pt-1">
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-slate-950 font-black py-2.5 rounded-xl text-[10px] uppercase tracking-wider block transition text-center shadow-lg"
                >
                  🟢 Canal Officiel WhatsApp
                </a>
                <a
                  href="https://telegram.org"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-black py-2.5 rounded-xl text-[10px] uppercase tracking-wider block transition text-center"
                >
                  🔵 Communauté Telegram VIP
                </a>
              </div>
            </div>

          </aside>

        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR BAR - Requested en dessous du site */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/95 border-t border-slate-900 py-2 sm:py-3 px-4 z-40 backdrop-blur-md block shadow-inner" id="mobile-bottom-navbar">
        <div className="max-w-md mx-auto flex items-center justify-around text-center">
          
          <button
            onClick={() => {
              setProfileAction('none');
              setActiveTab('home');
            }}
            className={`flex flex-col items-center gap-1 shrink-0 ${
              activeTab === 'home' ? 'text-amber-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            <HomeIcon className="w-5 h-5 shrink-0" />
            <span className="text-[9px] font-semibold w-max">L'accueil</span>
          </button>

          <button
            onClick={() => {
              setProfileAction('none');
              setActiveTab('products');
            }}
            className={`flex flex-col items-center gap-1 shrink-0 ${
              activeTab === 'products' ? 'text-amber-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-5 h-5 shrink-0" />
            <span className="text-[9px] font-semibold w-max">Achats et revenu</span>
          </button>

          <button
            onClick={() => {
              setProfileAction('none');
              setActiveTab('team');
            }}
            className={`flex flex-col items-center gap-1 shrink-0 ${
              activeTab === 'team' ? 'text-amber-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users2 className="w-5 h-5 shrink-0" />
            <span className="text-[9px] font-semibold w-max">Équipe</span>
          </button>

          <button
            onClick={() => {
              setProfileAction('none');
              setActiveTab('profile');
              // Auto focus normal login if unauthenticated
              if (!currentUser) {
                setAuthView('login');
              }
            }}
            className={`flex flex-col items-center gap-1 shrink-0 ${
              activeTab === 'profile' ? 'text-amber-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-5 h-5 shrink-0" />
            <span className="text-[9px] font-semibold w-max">{currentUser ? (currentUser.role === 'Admin' ? 'Admin' : 'Profil') : 'Profil'}</span>
          </button>

        </div>
      </nav>

      {/* FLOATING CHAT ASSISTANT SUPPORT IN REALTIME-LIKE */}
      <ChatSupport currentUser={currentUser} lang={lang} />

      {/* OVERLAY NOTIFICATION INBOX */}
      {showNotifsOverlay && currentUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4" id="notifications-overlay">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl overflow-hidden relative">
            <div className="flex justify-between items-center pb-2 border-b border-slate-900">
              <h3 className="font-bold text-amber-50 text-sm flex items-center gap-1.5 font-sans leading-none">
                <Bell className="w-4 h-4 text-amber-500" />
                {lang === 'FR' ? 'Centre de Notifications' : 'Notification center'}
              </h3>
              <button
                onClick={() => setShowNotifsOverlay(false)}
                className="text-gray-400 hover:text-white text-xs font-bold"
              >
                Fermer
              </button>
            </div>

            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1" id="notifications-modal-feed">
              {myNotifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-xs">Aucune notification archivée</div>
              ) : (
                myNotifications.map((notif) => (
                  <div key={notif.id} className="p-3 bg-slate-900/40 border border-slate-900 rounded-2xl space-y-1">
                    <span className="font-semibold text-xs text-amber-100 block">{notif.title}</span>
                    <p className="text-[10px] sm:text-xs text-gray-400 leading-relaxed">{notif.message}</p>
                    <span className="text-[8px] text-gray-500 font-mono block pt-1">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
