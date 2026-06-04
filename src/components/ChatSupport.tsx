/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { SupportMessage } from '../types';

interface ChatSupportProps {
  currentUser: { id: string; name: string; role: string } | null;
  lang: 'FR' | 'EN';
}

export function ChatSupport({ currentUser, lang }: ChatSupportProps) {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load initial automated welcome message
  useEffect(() => {
    if (currentUser) {
      setMessages([
        {
          id: 'welcome-msg',
          userId: currentUser.id,
          sender: 'Admin',
          message: lang === 'FR' 
            ? `Bonjour ${currentUser.name} ! Bienvenue sur l'assistance Capital Gold. Comment puis-je vous aider aujourd'hui ?` 
            : `Hello ${currentUser.name}! Welcome to Capital Gold Support. How can we assist you today?`,
          createdAt: new Date().toISOString()
        }
      ]);
    }
  }, [currentUser, lang]);

  useEffect(() => {
    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser) return;

    const userMsg: SupportMessage = {
      id: Math.random().toString(),
      userId: currentUser.id,
      sender: 'User',
      message: inputText.trim(),
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulate smart bot/admin reply
    setTimeout(() => {
      let replyText = '';
      const lowercaseMsg = userMsg.message.toLowerCase();

      if (lowercaseMsg.includes('depot') || lowercaseMsg.includes('dépôt') || lowercaseMsg.includes('recharge') || lowercaseMsg.includes('payer')) {
        replyText = lang === 'FR'
          ? "Pour effectuer un dépôt, rendez-vous dans votre Profil, cliquez sur 'Dépôt', choisissez votre opérateur Mobile Money (MTN, Orange, Moov, Wave), envoyez le montant exact sur le numéro d'agence indiqué, puis tapez l'ID de référence avant d'importer la capture du paiement. Notre service validera votre solde sous 10 minutes !"
          : "To deposit, go to your Profile, tap 'Deposit', select your Mobile Money provider, transfer the money to our listed agent, then input the transaction reference and upload your receipt screenshot. Validation takes up to 10 minutes!";
      } else if (lowercaseMsg.includes('retrait') || lowercaseMsg.includes('retirer') || lowercaseMsg.includes('argent')) {
        replyText = lang === 'FR'
          ? "Les retraits sont rapides et sécurisés ! Cliquez sur 'Retrait' depuis votre portefeuille, configurez votre numéro Mobile Money et soumettez la demande. Le solde minimum de retrait est de 1 000 FCFA."
          : "Withdrawals are fast & secure! Tap 'Withdraw' on your wallet screen, set your Mobile Money number, and confirm. Minimum withdrawal limit is 1,000 FCFA.";
      } else if (lowercaseMsg.includes('code') || lowercaseMsg.includes('bonus') || lowercaseMsg.includes('cadeau')) {
        replyText = lang === 'FR'
          ? "Avez-vous un code cadeau ? Vous pouvez l'insérer sur votre profil dans la boîte 'Code Bonus' pour réclamer vos cadeaux d'événements immédiatement !"
          : "If you have a voucher or registration coupon, enter check inside your Profile screen to convert your bonus coupon into instant portfolio balance!";
      } else if (lowercaseMsg.includes('vip') || lowercaseMsg.includes('produit') || lowercaseMsg.includes('investir')) {
        replyText = lang === 'FR'
          ? "Nos plans VIP miniers s'activent instantanément dans l'onglet 'Produits'. Par exemple, le plan VIP 1 coûte 3 000 FCFA et vous verse 600 FCFA chaque jour de façon passive !"
          : "Our VIP investment plans active instantly in the 'Products' tab. For instance, VIP 1 costs 3,000 FCFA and earns you 600 FCFA daily with passive automated claim!";
      } else {
        replyText = lang === 'FR'
          ? "Votre message a bien été transmis. Un conseiller financier vous contactera sous peu. Veuillez rester à l'écoute !"
          : "Your support request has been queued. An investment agent will contact you shortly on WhatsApp.";
      }

      const adminMsg: SupportMessage = {
        id: Math.random().toString(),
        userId: currentUser.id,
        sender: 'Admin',
        message: replyText,
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, adminMsg]);
    }, 1500);
  };

  return (
    <>
      {/* Trigger floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 z-40 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 border border-amber-400"
        id="support-chat-trigger"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
      </button>

      {/* Chat Windows markup */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 z-50 w-[340px] sm:w-[380px] h-[480px] bg-slate-950 border border-slate-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden backdrop-blur-md"
          id="support-chat-window"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-amber-50 flex items-center gap-1 leading-none">
                  Support VIP <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                </div>
                <span className="text-[10px] text-emerald-400 font-mono leading-none">● {lang === 'FR' ? 'Conseiller en ligne' : 'Counselor online'}</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white text-xs font-mono font-bold uppercase transition"
            >
              Fermer
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/20" id="chat-messages-container">
            {messages.map((item) => {
              const isAdmin = item.sender === 'Admin';
              return (
                <div
                  key={item.id}
                  className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${isAdmin ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                      isAdmin ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-gray-300'
                    }`}>
                      {isAdmin ? 'VIP' : <User className="w-3.5 h-3.5" />}
                    </div>

                    <div>
                      <div className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                        isAdmin 
                          ? 'bg-slate-900 border border-slate-800/60 text-amber-50 rounded-tl-none' 
                          : 'bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-900 font-medium rounded-tr-none'
                      }`}>
                        {item.message}
                      </div>
                      <span className="text-[9px] text-gray-500 font-mono block mt-1 px-1">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-900 bg-slate-950 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={lang === 'FR' ? 'Écrivez votre message...' : 'Type message...'}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/80"
              id="support-chat-input"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 p-2.5 rounded-xl transition duration-150 flex items-center justify-center shrink-0 shadow-lg"
              id="support-chat-send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
