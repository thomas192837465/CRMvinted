"use client";

import { useState, useEffect } from "react";
// ─── ICONS (inline SVG components) ───────────────────────────────────────────
const Icon = ({ d, size = 18, stroke = "currentColor", fill = "none", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

const icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  inventory: ["M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", "M3.27 6.96L12 12.01l8.73-5.05", "M12 22.08V12"],
  orders: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2",
  customers: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75", "M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
  stats: ["M18 20V10", "M12 20V4", "M6 20v-6"],
  settings: ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"],
  plus: ["M12 5v14", "M5 12h14"],
  search: ["M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z", "M16 16l3.5 3.5"],
  bell: ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
  trend: ["M23 6l-9.5 9.5-5-5L1 18", "M17 6h6v6"],
  tag: ["M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z", "M7 7h.01"],
  truck: ["M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 0 0 0v3", "M9 17h6", "M13 17h8l-3-9H5v9", "M17 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", "M7 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"],
  alert: ["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", "M12 9v4", "M12 17h.01"],
  edit: ["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"],
  trash: ["M3 6h18", "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6", "M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"],
  filter: ["M22 3H2l8 9.46V19l4 2v-8.54L22 3"],
  download: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"],
  ai: ["M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 0 2h-1v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1H1a1 1 0 0 1 0-2h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z", "M10 13v2", "M14 13v2"],
  barcode: ["M3 5v14", "M7 5v4", "M7 13v6", "M11 5v14", "M15 5v4", "M15 13v6", "M19 5v14", "M21 5v14"],
  check: "M20 6L9 17l-5-5",
  x: ["M18 6L6 18", "M6 6l12 12"],
  chevron: "M9 18l6-6-6-6",
  user: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  message: ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  ban: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M4.93 4.93l14.14 14.14"],
  euro: ["M14 12H4", "M14 8H4", "M18 17.5c-.75 1.19-2.09 2-3.5 2-3.04 0-5.5-2.69-5.5-6s2.46-6 5.5-6c1.41 0 2.75.81 3.5 2"],
  package: ["M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"],
  arrowUp: ["M12 19V5", "M5 12l7-7 7 7"],
  arrowDown: ["M12 5v14", "M19 12l-7 7-7-7"],
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, sku: "VNT-001", brand: "Nike", model: "Air Max 90", size: "42", color: "Blanc/Rouge", condition: "Très bon état", purchase_price: 45, target_price: 89, min_price: 65, status: "ONLINE", roi: 97.8, net_margin: 44, physical_location: "Étagère A1", purchase_date: "2024-01-15" },
  { id: 2, sku: "VNT-002", brand: "Levi's", model: "501 Original", size: "32/32", color: "Bleu délavé", condition: "Bon état", purchase_price: 22, target_price: 48, min_price: 35, status: "DRAFT", roi: 118.2, net_margin: 26, physical_location: "Boîte B3", purchase_date: "2024-01-18" },
  { id: 3, sku: "VNT-003", brand: "Adidas", model: "Stan Smith", size: "40", color: "Blanc/Vert", condition: "Neuf sans étiquette", purchase_price: 38, target_price: 75, min_price: 58, status: "SOLD", roi: 97.4, net_margin: 37, physical_location: "Étagère A2", purchase_date: "2024-01-10" },
  { id: 4, sku: "VNT-004", brand: "Zara", model: "Manteau laine", size: "M", color: "Camel", condition: "Bon état", purchase_price: 30, target_price: 65, min_price: 45, status: "TO_PHOTO", roi: 116.7, net_margin: 35, physical_location: "Penderie C1", purchase_date: "2024-01-20" },
  { id: 5, sku: "VNT-005", brand: "Vintage", model: "Veste en jean", size: "L", color: "Bleu", condition: "État correct", purchase_price: 15, target_price: 42, min_price: 28, status: "TO_CLEAN", roi: 180, net_margin: 27, physical_location: "Boîte B1", purchase_date: "2024-01-22" },
  { id: 6, sku: "VNT-006", brand: "Polo Ralph Lauren", model: "Polo classic", size: "S", color: "Navy", condition: "Très bon état", purchase_price: 18, target_price: 45, min_price: 30, status: "ONLINE", roi: 150, net_margin: 27, physical_location: "Boîte B2", purchase_date: "2024-01-12" },
  { id: 7, sku: "VNT-007", brand: "Converse", model: "Chuck Taylor", size: "38", color: "Noir", condition: "Bon état", purchase_price: 25, target_price: 52, min_price: 38, status: "ONLINE", roi: 108, net_margin: 27, physical_location: "Étagère A3", purchase_date: "2024-01-08" },
  { id: 8, sku: "VNT-008", brand: "H&M", model: "Robe florale", size: "S", color: "Multicolore", condition: "Neuf avec étiquette", purchase_price: 8, target_price: 25, min_price: 18, status: "DRAFT", roi: 212.5, net_margin: 17, physical_location: "Penderie C2", purchase_date: "2024-01-25" },
];

const ORDERS = [
  { id: "CMD-2401", product: "Nike Air Max 90", customer: "marie_dupont", status: "TO_PREPARE", shipping: "Mondial Relay", tracking: null, days: 0, amount: 89, has_dispute: false },
  { id: "CMD-2402", product: "Stan Smith Adidas", customer: "jean_martin", status: "SHIPPED", shipping: "Colissimo", tracking: "CL12345678FR", days: 1, amount: 75, has_dispute: false },
  { id: "CMD-2403", product: "Polo Ralph Lauren", customer: "sophie_b", status: "IN_TRANSIT", shipping: "Mondial Relay", tracking: "MR98765432", days: 6, amount: 45, has_dispute: false },
  { id: "CMD-2404", product: "Converse Chuck Taylor", customer: "alex_v", status: "IN_TRANSIT", shipping: "Colissimo", tracking: "CL87654321FR", days: 12, amount: 52, has_dispute: true },
  { id: "CMD-2405", product: "Levi's 501", customer: "thomas_k", status: "DELIVERED", shipping: "Colissimo", tracking: "CL11122233FR", days: 3, amount: 48, has_dispute: false },
  { id: "CMD-2406", product: "Manteau Zara", customer: "julie_r", status: "PAID", shipping: "Mondial Relay", tracking: "MR55544433", days: 4, amount: 65, has_dispute: false },
];

const CUSTOMERS = [
  { id: 1, username: "marie_dupont", rating: 4.9, purchases: 3, total_spent: 187, is_blacklisted: false, notes: "Cliente fidèle, toujours sympa" },
  { id: 2, username: "jean_martin", rating: 4.7, purchases: 1, total_spent: 75, is_blacklisted: false, notes: "" },
  { id: 3, username: "sophie_b", rating: 4.5, purchases: 2, total_spent: 110, is_blacklisted: false, notes: "Aime négocier" },
  { id: 4, username: "alex_v", rating: 3.2, purchases: 1, total_spent: 52, is_blacklisted: false, notes: "⚠️ Litige en cours CMD-2404" },
  { id: 5, username: "trouble_buyer99", rating: 2.1, purchases: 0, total_spent: 0, is_blacklisted: true, notes: "Arnaque tentée, ne pas vendre" },
];

const MONTHLY_DATA = [
  { month: "Août", ca: 420, margin: 180, orders: 8 },
  { month: "Sep", ca: 580, margin: 245, orders: 11 },
  { month: "Oct", ca: 710, margin: 310, orders: 14 },
  { month: "Nov", ca: 890, margin: 390, orders: 17 },
  { month: "Déc", ca: 1240, margin: 560, orders: 24 },
  { month: "Jan", ca: 980, margin: 420, orders: 19 },
];

// ─── STATUS CONFIG ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  TO_CLEAN:  { label: "À nettoyer",  color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  TO_PHOTO:  { label: "À photographier", color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
  DRAFT:     { label: "Brouillon",   color: "#6b7280", bg: "rgba(107,114,128,0.15)" },
  ONLINE:    { label: "En ligne",    color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  SOLD:      { label: "Vendu",       color: "#06b6d4", bg: "rgba(6,182,212,0.15)" },
  RETURNED:  { label: "Retourné",    color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
  LOST:      { label: "Perdu",       color: "#374151", bg: "rgba(55,65,81,0.15)" },
};

const ORDER_STATUS = {
  TO_PREPARE: { label: "À préparer", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  SHIPPED:    { label: "Expédié",    color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
  IN_TRANSIT: { label: "En transit", color: "#06b6d4", bg: "rgba(6,182,212,0.15)" },
  DELIVERED:  { label: "Livré",      color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  PAID:       { label: "Payé ✓",    color: "#34d399", bg: "rgba(52,211,153,0.15)" },
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --bg-base: #0a0d12;
    --bg-surface: #111520;
    --bg-card: #161b27;
    --bg-hover: #1c2235;
    --border: rgba(255,255,255,0.07);
    --border-accent: rgba(6,182,212,0.3);
    --cyan: #06b6d4;
    --cyan-bright: #22d3ee;
    --cyan-dim: rgba(6,182,212,0.2);
    --text-primary: #f0f4ff;
    --text-secondary: #8892a4;
    --text-muted: #4a5568;
    --green: #10b981;
    --red: #ef4444;
    --amber: #f59e0b;
    --purple: #8b5cf6;
    --font-mono: 'Space Mono', monospace;
    --font-sans: 'DM Sans', sans-serif;
    --sidebar-w: 220px;
    --radius: 10px;
    --radius-lg: 14px;
  }

  html, body, #root { height: 100%; background: var(--bg-base); color: var(--text-primary); font-family: var(--font-sans); font-size: 14px; }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-accent); border-radius: 2px; }

  .app { display: flex; height: 100vh; overflow: hidden; }

  /* SIDEBAR */
  .sidebar {
    width: var(--sidebar-w);
    background: var(--bg-surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    padding: 0;
    position: relative;
    z-index: 10;
  }
  .sidebar::after {
    content: '';
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, var(--cyan-dim) 30%, var(--cyan-dim) 70%, transparent);
  }
  .sidebar-logo {
    padding: 22px 20px 18px;
    border-bottom: 1px solid var(--border);
  }
  .logo-mark {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .logo-icon {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, var(--cyan), #0e7490);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .logo-text { font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.5px; line-height: 1.2; }
  .logo-sub { font-size: 10px; color: var(--text-muted); font-family: var(--font-sans); font-weight: 400; letter-spacing: 0.5px; text-transform: uppercase; }

  .sidebar-nav { padding: 12px 10px; flex: 1; overflow-y: auto; }
  .nav-section-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); padding: 8px 10px 6px; font-weight: 600; }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: var(--radius);
    cursor: pointer; transition: all 0.15s;
    color: var(--text-secondary);
    font-size: 13.5px; font-weight: 500;
    margin-bottom: 2px;
    position: relative;
  }
  .nav-item:hover { background: var(--bg-hover); color: var(--text-primary); }
  .nav-item.active {
    background: linear-gradient(90deg, rgba(6,182,212,0.12), rgba(6,182,212,0.05));
    color: var(--cyan-bright);
    border: 1px solid rgba(6,182,212,0.2);
  }
  .nav-item.active::before {
    content: '';
    position: absolute; left: -1px; top: 20%; bottom: 20%;
    width: 3px; background: var(--cyan);
    border-radius: 0 2px 2px 0;
  }
  .nav-badge {
    margin-left: auto;
    background: rgba(239,68,68,0.2); color: #f87171;
    font-size: 10px; font-weight: 700;
    padding: 2px 6px; border-radius: 10px;
    font-family: var(--font-mono);
  }
  .nav-badge.cyan { background: var(--cyan-dim); color: var(--cyan); }

  .sidebar-footer {
    padding: 12px 10px;
    border-top: 1px solid var(--border);
  }
  .user-card {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: var(--radius);
    background: var(--bg-card); cursor: pointer;
  }
  .user-avatar {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #0e7490, var(--purple));
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: white;
    font-family: var(--font-mono);
  }
  .user-name { font-size: 12.5px; font-weight: 600; }
  .user-plan { font-size: 10px; color: var(--cyan); font-family: var(--font-mono); }

  /* MAIN */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  /* HEADER */
  .header {
    height: 60px;
    background: var(--bg-surface);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px;
    flex-shrink: 0;
  }
  .header-title { font-size: 16px; font-weight: 600; }
  .header-title span { color: var(--cyan); }
  .header-actions { display: flex; align-items: center; gap: 12px; }

  .search-bar {
    display: flex; align-items: center; gap: 8px;
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 8px; padding: 7px 12px;
    color: var(--text-secondary); font-size: 13px;
    width: 220px; transition: all 0.15s;
  }
  .search-bar:focus-within { border-color: var(--border-accent); color: var(--text-primary); }
  .search-bar input { background: none; border: none; outline: none; color: inherit; font-size: inherit; font-family: var(--font-sans); width: 100%; }

  .header-btn {
    display: flex; align-items: center; gap: 6px;
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 8px; padding: 7px 14px;
    color: var(--text-secondary); cursor: pointer;
    font-size: 13px; font-family: var(--font-sans); font-weight: 500;
    transition: all 0.15s;
  }
  .header-btn:hover { border-color: var(--border-accent); color: var(--text-primary); }
  .header-btn.primary {
    background: linear-gradient(135deg, var(--cyan), #0891b2);
    border-color: transparent; color: white;
  }
  .header-btn.primary:hover { opacity: 0.9; }

  .notif-btn {
    width: 36px; height: 36px;
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-secondary); position: relative;
    transition: all 0.15s;
  }
  .notif-btn:hover { border-color: var(--border-accent); color: var(--text-primary); }
  .notif-dot {
    position: absolute; top: 6px; right: 6px;
    width: 7px; height: 7px;
    background: var(--red); border-radius: 50%;
    border: 1.5px solid var(--bg-surface);
  }

  /* CONTENT */
  .content { flex: 1; overflow-y: auto; padding: 24px; }

  /* STAT CARDS */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px; }
  .stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 18px 20px;
    position: relative; overflow: hidden;
    transition: all 0.2s;
  }
  .stat-card:hover { border-color: var(--border-accent); transform: translateY(-1px); }
  .stat-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
  }
  .stat-card.cyan::before { background: linear-gradient(90deg, var(--cyan), transparent); }
  .stat-card.green::before { background: linear-gradient(90deg, var(--green), transparent); }
  .stat-card.amber::before { background: linear-gradient(90deg, var(--amber), transparent); }
  .stat-card.purple::before { background: linear-gradient(90deg, var(--purple), transparent); }
  .stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-muted); font-weight: 600; margin-bottom: 8px; }
  .stat-value { font-family: var(--font-mono); font-size: 26px; font-weight: 700; color: var(--text-primary); line-height: 1; margin-bottom: 8px; }
  .stat-sub { font-size: 12px; color: var(--text-secondary); display: flex; align-items: center; gap: 4px; }
  .stat-trend { font-size: 11px; font-family: var(--font-mono); font-weight: 700; }
  .stat-trend.up { color: var(--green); }
  .stat-trend.down { color: var(--red); }
  .stat-icon {
    position: absolute; right: 16px; top: 16px;
    width: 38px; height: 38px;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
  }
  .stat-icon.cyan { background: rgba(6,182,212,0.12); color: var(--cyan); }
  .stat-icon.green { background: rgba(16,185,129,0.12); color: var(--green); }
  .stat-icon.amber { background: rgba(245,158,11,0.12); color: var(--amber); }
  .stat-icon.purple { background: rgba(139,92,246,0.12); color: var(--purple); }

  /* SECTION HEADERS */
  .section-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 14px;
  }
  .section-title { font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
  .section-title-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--cyan); flex-shrink: 0; }

  /* TABLE */
  .table-wrap {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }
  .table-toolbar {
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }
  .filter-btn {
    display: flex; align-items: center; gap: 6px;
    background: var(--bg-hover); border: 1px solid var(--border);
    border-radius: 7px; padding: 6px 12px;
    color: var(--text-secondary); cursor: pointer;
    font-size: 12.5px; font-family: var(--font-sans);
    transition: all 0.15s;
  }
  .filter-btn:hover, .filter-btn.active { border-color: var(--border-accent); color: var(--cyan); background: var(--cyan-dim); }
  .filter-sep { width: 1px; height: 20px; background: var(--border); margin: 0 4px; }

  table { width: 100%; border-collapse: collapse; }
  thead th {
    text-align: left; padding: 10px 14px;
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px;
    color: var(--text-muted); font-weight: 600;
    border-bottom: 1px solid var(--border);
    background: rgba(255,255,255,0.01);
    white-space: nowrap;
  }
  tbody tr { border-bottom: 1px solid var(--border); transition: background 0.12s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: var(--bg-hover); }
  td { padding: 11px 14px; font-size: 13.5px; vertical-align: middle; }

  .sku-badge {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--cyan); background: var(--cyan-dim);
    padding: 3px 7px; border-radius: 5px;
  }
  .status-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 20px;
    font-size: 11.5px; font-weight: 600; white-space: nowrap;
  }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

  .roi-bar-wrap { display: flex; align-items: center; gap: 8px; }
  .roi-bar { height: 4px; background: var(--bg-hover); border-radius: 2px; width: 60px; overflow: hidden; }
  .roi-bar-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--cyan), var(--green)); }
  .roi-val { font-family: var(--font-mono); font-size: 12px; color: var(--green); font-weight: 700; }

  .price-val { font-family: var(--font-mono); font-size: 13px; font-weight: 700; }
  .price-val.target { color: var(--cyan); }
  .price-val.cost { color: var(--text-secondary); }

  .action-btns { display: flex; gap: 6px; }
  .action-btn {
    width: 28px; height: 28px; border-radius: 6px;
    background: var(--bg-hover); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-secondary);
    transition: all 0.15s;
  }
  .action-btn:hover.edit { color: var(--cyan); border-color: var(--border-accent); background: var(--cyan-dim); }
  .action-btn:hover.del { color: var(--red); border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.1); }
  .action-btn:hover.ai { color: var(--purple); border-color: rgba(139,92,246,0.3); background: rgba(139,92,246,0.1); }

  /* KANBAN */
  .kanban-board { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; }
  .kanban-col {
    min-width: 220px; flex: 1;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    display: flex; flex-direction: column;
    max-height: calc(100vh - 240px);
  }
  .kanban-col-header {
    padding: 12px 14px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0;
  }
  .kanban-col-title { font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 7px; }
  .kanban-count {
    background: var(--bg-hover); border: 1px solid var(--border);
    border-radius: 5px; padding: 1px 7px;
    font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary);
  }
  .kanban-col-body { padding: 10px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 8px; }
  .kanban-card {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 11px 12px;
    cursor: pointer; transition: all 0.15s;
  }
  .kanban-card:hover { border-color: var(--border-accent); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
  .kanban-card.alert-border { border-color: rgba(239,68,68,0.4); }
  .kanban-card-id { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); margin-bottom: 5px; }
  .kanban-card-product { font-size: 12.5px; font-weight: 600; margin-bottom: 6px; line-height: 1.3; }
  .kanban-card-meta { display: flex; align-items: center; justify-content: space-between; }
  .kanban-card-buyer { font-size: 11px; color: var(--text-secondary); }
  .kanban-card-amount { font-family: var(--font-mono); font-size: 13px; color: var(--cyan); font-weight: 700; }
  .kanban-alert {
    margin-top: 6px; padding: 4px 8px;
    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
    border-radius: 5px; font-size: 11px; color: #f87171;
    display: flex; align-items: center; gap: 5px;
  }
  .kanban-days { font-size: 11px; color: var(--text-muted); margin-top: 4px; }

  /* CUSTOMERS */
  .customers-grid { display: flex; flex-direction: column; gap: 10px; }
  .customer-row {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 14px 18px;
    display: flex; align-items: center; gap: 16px;
    transition: all 0.15s;
  }
  .customer-row:hover { border-color: var(--border-accent); }
  .customer-row.blacklisted { border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.03); }
  .cust-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-mono); font-size: 13px; font-weight: 700;
    flex-shrink: 0;
  }
  .cust-info { flex: 1; min-width: 0; }
  .cust-name { font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
  .cust-note { font-size: 12px; color: var(--text-secondary); margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cust-stat { text-align: center; min-width: 60px; }
  .cust-stat-val { font-family: var(--font-mono); font-size: 15px; font-weight: 700; }
  .cust-stat-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .rating-stars { display: flex; align-items: center; gap: 3px; font-family: var(--font-mono); font-size: 13px; font-weight: 700; }
  .blacklist-tag {
    display: flex; align-items: center; gap: 5px;
    background: rgba(239,68,68,0.12); color: #f87171;
    border: 1px solid rgba(239,68,68,0.25);
    padding: 3px 9px; border-radius: 5px;
    font-size: 11px; font-weight: 600;
  }
  .vip-tag {
    background: rgba(6,182,212,0.12); color: var(--cyan);
    border: 1px solid rgba(6,182,212,0.2);
    padding: 3px 9px; border-radius: 5px;
    font-size: 11px; font-weight: 600;
  }

  /* CHARTS */
  .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
  .chart-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 18px 20px;
  }
  .chart-title { font-size: 13px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; }
  .chart-legend { display: flex; gap: 14px; }
  .legend-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--text-secondary); }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; }

  .bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 120px; }
  .bar-group { flex: 1; display: flex; align-items: flex-end; gap: 3px; }
  .bar {
    flex: 1; border-radius: 4px 4px 0 0;
    transition: opacity 0.15s; cursor: pointer; min-width: 0;
  }
  .bar:hover { opacity: 0.85; }
  .bar-labels { display: flex; gap: 8px; margin-top: 8px; }
  .bar-label { flex: 1; text-align: center; font-size: 10px; color: var(--text-muted); font-family: var(--font-mono); }

  .donut-container { display: flex; align-items: center; gap: 20px; }
  .donut { position: relative; width: 100px; height: 100px; flex-shrink: 0; }
  .donut svg { transform: rotate(-90deg); }
  .donut-center {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    font-family: var(--font-mono);
  }
  .donut-val { font-size: 18px; font-weight: 700; color: var(--cyan); }
  .donut-sub { font-size: 9px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .donut-legend { flex: 1; }
  .donut-item { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; font-size: 12px; }
  .donut-item-bar { flex: 1; height: 4px; border-radius: 2px; background: var(--bg-hover); overflow: hidden; }
  .donut-item-fill { height: 100%; border-radius: 2px; }
  .donut-item-pct { font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); min-width: 30px; text-align: right; }

  /* KPI ROW */
  .kpi-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .kpi-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 16px 18px;
  }
  .kpi-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-muted); font-weight: 600; margin-bottom: 6px; }
  .kpi-val { font-family: var(--font-mono); font-size: 22px; font-weight: 700; color: var(--text-primary); }
  .kpi-meta { font-size: 12px; color: var(--text-secondary); margin-top: 4px; }
  .kpi-trend { display: flex; align-items: center; gap: 4px; font-size: 11px; font-family: var(--font-mono); margin-top: 6px; }

  /* TAB */
  .tab-bar { display: flex; gap: 4px; margin-bottom: 16px; }
  .tab-btn {
    padding: 7px 16px; border-radius: 8px;
    font-size: 13px; font-weight: 500; cursor: pointer;
    border: 1px solid transparent; transition: all 0.15s;
    color: var(--text-secondary);
    background: var(--bg-card);
    border-color: var(--border);
  }
  .tab-btn.active { background: var(--cyan-dim); color: var(--cyan-bright); border-color: var(--border-accent); }
  .tab-btn:hover:not(.active) { background: var(--bg-hover); color: var(--text-primary); }

  /* OVERVIEW PAGE */
  .overview-grid { display: grid; grid-template-columns: 1fr 320px; gap: 16px; }
  .activity-list { display: flex; flex-direction: column; gap: 8px; }
  .activity-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 14px;
    background: var(--bg-hover); border-radius: var(--radius);
    font-size: 12.5px;
  }
  .activity-icon {
    width: 30px; height: 30px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .activity-text { flex: 1; }
  .activity-time { font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); }

  .quick-actions { display: flex; flex-direction: column; gap: 8px; }
  .quick-action {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    cursor: pointer; transition: all 0.15s;
    font-size: 13px; font-weight: 500;
  }
  .quick-action:hover { border-color: var(--border-accent); background: var(--bg-hover); }
  .quick-action-icon {
    width: 34px; height: 34px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .quick-action-desc { font-size: 11px; color: var(--text-secondary); margin-top: 2px; }

  /* Responsive adjustments */
  .stats-grid { flex-wrap: wrap; }

  /* Empty state */
  .empty { text-align: center; padding: 40px 20px; color: var(--text-muted); font-size: 13px; }

  /* Tooltip-like */
  .tooltip { position: relative; }
`;

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
function StatusPill({ status, config }) {
  const c = config[status] || {};
  return (
    <span className="status-pill" style={{ background: c.bg, color: c.color }}>
      <span className="status-dot" style={{ background: c.color }} />
      {c.label || status}
    </span>
  );
}

function RoiBar({ roi }) {
  const pct = Math.min(roi / 3, 100);
  return (
    <div className="roi-bar-wrap">
      <div className="roi-bar"><div className="roi-bar-fill" style={{ width: `${pct}%` }} /></div>
      <span className="roi-val">+{roi}%</span>
    </div>
  );
}

function BarChart({ data }) {
  const maxCA = Math.max(...data.map(d => d.ca));
  const maxM = Math.max(...data.map(d => d.margin));
  return (
    <div>
      <div className="bar-chart">
        {data.map((d, i) => (
          <div key={i} className="bar-group">
            <div className="bar" style={{ height: `${(d.ca / maxCA) * 100}%`, background: 'linear-gradient(180deg, #06b6d4, #0e7490)' }} title={`CA: ${d.ca}€`} />
            <div className="bar" style={{ height: `${(d.margin / maxM) * 100}%`, background: 'linear-gradient(180deg, #10b981, #065f46)' }} title={`Marge: ${d.margin}€`} />
          </div>
        ))}
      </div>
      <div className="bar-labels">
        {data.map((d, i) => <span key={i} className="bar-label">{d.month}</span>)}
      </div>
    </div>
  );
}

function DonutChart({ segments }) {
  const total = segments.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  const r = 40, circ = 2 * Math.PI * r;
  const arcs = segments.map(seg => {
    const pct = seg.value / total;
    const dash = pct * circ;
    const arc = { ...seg, dash, gap: circ - dash, offset };
    offset += dash;
    return arc;
  });
  return (
    <div className="donut-container">
      <div className="donut">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
          {arcs.map((arc, i) => (
            <circle key={i} cx="50" cy="50" r={r} fill="none"
              stroke={arc.color} strokeWidth="12"
              strokeDasharray={`${arc.dash} ${arc.gap}`}
              strokeDashoffset={-arc.offset}
              style={{ transition: 'all 0.3s' }}
            />
          ))}
        </svg>
        <div className="donut-center">
          <span className="donut-val">{total}</span>
          <span className="donut-sub">items</span>
        </div>
      </div>
      <div className="donut-legend">
        {segments.map((seg, i) => (
          <div key={i} className="donut-item">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: seg.color, flexShrink: 0, display: 'inline-block' }} />
            <span style={{ flex: 1, fontSize: 11 }}>{seg.label}</span>
            <div className="donut-item-bar"><div className="donut-item-fill" style={{ width: `${(seg.value / total) * 100}%`, background: seg.color }} /></div>
            <span className="donut-item-pct">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── VIEWS ────────────────────────────────────────────────────────────────────

function OverviewView() {
  const activities = [
    { icon: icons.package, color: "#06b6d4", bg: "rgba(6,182,212,0.12)", text: "Nike Air Max 90 mise en ligne", time: "il y a 2 min" },
    { icon: icons.orders, color: "#10b981", bg: "rgba(16,185,129,0.12)", text: "CMD-2406 marquée Payée", time: "il y a 15 min" },
    { icon: icons.user, color: "#8b5cf6", bg: "rgba(139,92,246,0.12)", text: "Nouveau client : marie_dupont", time: "il y a 1h" },
    { icon: icons.alert, color: "#ef4444", bg: "rgba(239,68,68,0.12)", text: "Litige ouvert sur CMD-2404", time: "il y a 3h" },
    { icon: icons.trend, color: "#f59e0b", bg: "rgba(245,158,11,0.12)", text: "Stan Smith vendu à 75€ (+97%)", time: "il y a 6h" },
  ];
  const quickActs = [
    { icon: icons.plus, color: "#06b6d4", bg: "rgba(6,182,212,0.12)", label: "Ajouter un article", desc: "Créer un nouveau produit en stock" },
    { icon: icons.ai, color: "#8b5cf6", bg: "rgba(139,92,246,0.12)", label: "Générer une description IA", desc: "Optimiser vos annonces Vinted" },
    { icon: icons.download, color: "#10b981", bg: "rgba(16,185,129,0.12)", label: "Exporter URSSAF", desc: "PDF/CSV pour la comptabilité" },
    { icon: icons.barcode, color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "Imprimer les étiquettes", desc: "Codes-barres pour votre stock" },
  ];
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card cyan">
          <div className="stat-label">Chiffre d'affaires (jan)</div>
          <div className="stat-value">980€</div>
          <div className="stat-sub"><span className="stat-trend up">↑ +23%</span> vs déc.</div>
          <div className="stat-icon cyan"><Icon d={icons.euro} /></div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Marge nette</div>
          <div className="stat-value">420€</div>
          <div className="stat-sub"><span className="stat-trend up">↑ 42.9%</span> taux</div>
          <div className="stat-icon green"><Icon d={icons.trend} /></div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Articles en ligne</div>
          <div className="stat-value">3</div>
          <div className="stat-sub">sur 8 en stock total</div>
          <div className="stat-icon amber"><Icon d={icons.inventory} /></div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">Commandes actives</div>
          <div className="stat-value">4</div>
          <div className="stat-sub"><span style={{ color: '#ef4444' }}>1 litige</span> en cours</div>
          <div className="stat-icon purple"><Icon d={icons.truck} /></div>
        </div>
      </div>
      <div className="overview-grid">
        <div>
          <div className="chart-card" style={{ marginBottom: 14 }}>
            <div className="chart-title">
              <span>Évolution CA & Marge</span>
              <div className="chart-legend">
                <span className="legend-item"><span className="legend-dot" style={{ background: '#06b6d4' }} />CA</span>
                <span className="legend-item"><span className="legend-dot" style={{ background: '#10b981' }} />Marge</span>
              </div>
            </div>
            <BarChart data={MONTHLY_DATA} />
          </div>
          <div className="section-header">
            <div className="section-title"><div className="section-title-dot" />Activité récente</div>
          </div>
          <div className="activity-list">
            {activities.map((a, i) => (
              <div key={i} className="activity-item">
                <div className="activity-icon" style={{ background: a.bg, color: a.color }}><Icon d={a.icon} size={14} /></div>
                <span className="activity-text">{a.text}</span>
                <span className="activity-time">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="chart-card" style={{ marginBottom: 14 }}>
            <div className="chart-title">Répartition du stock</div>
            <DonutChart segments={[
              { label: "En ligne", value: 3, color: "#10b981" },
              { label: "Brouillon", value: 2, color: "#6b7280" },
              { label: "À préparer", value: 2, color: "#8b5cf6" },
              { label: "Vendu", value: 1, color: "#06b6d4" },
            ]} />
          </div>
          <div className="section-header">
            <div className="section-title"><div className="section-title-dot" />Actions rapides</div>
          </div>
          <div className="quick-actions">
            {quickActs.map((a, i) => (
              <div key={i} className="quick-action">
                <div className="quick-action-icon" style={{ background: a.bg, color: a.color }}><Icon d={a.icon} size={16} /></div>
                <div>
                  <div>{a.label}</div>
                  <div className="quick-action-desc">{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InventoryView() {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const filters = ["ALL", "ONLINE", "DRAFT", "TO_PHOTO", "TO_CLEAN", "SOLD"];
  const filtered = PRODUCTS.filter(p => {
    const matchFilter = filter === "ALL" || p.status === filter;
    const matchSearch = !search || p.brand.toLowerCase().includes(search.toLowerCase()) || p.model.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card cyan"><div className="stat-label">Total articles</div><div className="stat-value">8</div><div className="stat-sub">dans l'inventaire</div><div className="stat-icon cyan"><Icon d={icons.package} /></div></div>
        <div className="stat-card green"><div className="stat-label">En ligne</div><div className="stat-value">3</div><div className="stat-sub"><span className="stat-trend up">37.5%</span> du stock</div><div className="stat-icon green"><Icon d={icons.check} /></div></div>
        <div className="stat-card amber"><div className="stat-label">Valeur achat</div><div className="stat-value">201€</div><div className="stat-sub">coût total investi</div><div className="stat-icon amber"><Icon d={icons.euro} /></div></div>
        <div className="stat-card purple"><div className="stat-label">Valeur vente</div><div className="stat-value">441€</div><div className="stat-sub">potentiel à prix cible</div><div className="stat-icon purple"><Icon d={icons.trend} /></div></div>
      </div>
      <div className="section-header">
        <div className="section-title"><div className="section-title-dot" />Inventaire</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="header-btn"><Icon d={icons.barcode} size={14} />Étiquettes</button>
          <button className="header-btn primary"><Icon d={icons.plus} size={14} />Ajouter</button>
        </div>
      </div>
      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="search-bar" style={{ width: 200 }}>
            <Icon d={icons.search} size={14} />
            <input placeholder="SKU, marque, modèle…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="filter-sep" />
          {filters.map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === "ALL" ? "Tous" : STATUS_CONFIG[f]?.label || f}
            </button>
          ))}
          <button className="filter-btn" style={{ marginLeft: 'auto' }}><Icon d={icons.download} size={13} />Exporter</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Marque / Modèle</th>
              <th>Taille</th>
              <th>Localisation</th>
              <th>Prix achat</th>
              <th>Prix cible</th>
              <th>ROI</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td><span className="sku-badge">{p.sku}</span></td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.brand}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.model} · {p.color}</div>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{p.size}</td>
                <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.physical_location}</td>
                <td><span className="price-val cost">{p.purchase_price}€</span></td>
                <td><span className="price-val target">{p.target_price}€</span></td>
                <td><RoiBar roi={p.roi} /></td>
                <td><StatusPill status={p.status} config={STATUS_CONFIG} /></td>
                <td>
                  <div className="action-btns">
                    <div className="action-btn ai" title="Générer description IA"><Icon d={icons.ai} size={13} /></div>
                    <div className="action-btn edit" title="Modifier"><Icon d={icons.edit} size={13} /></div>
                    <div className="action-btn del" title="Supprimer"><Icon d={icons.trash} size={13} /></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty">Aucun article trouvé</div>}
      </div>
    </div>
  );
}

function OrdersView() {
  const columns = ["TO_PREPARE", "SHIPPED", "IN_TRANSIT", "DELIVERED", "PAID"];
  const byStatus = (s) => ORDERS.filter(o => o.status === s);
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card cyan"><div className="stat-label">À préparer</div><div className="stat-value">1</div><div className="stat-sub">en attente expédition</div><div className="stat-icon cyan"><Icon d={icons.package} /></div></div>
        <div className="stat-card amber"><div className="stat-label">En transit</div><div className="stat-value">2</div><div className="stat-sub"><span style={{ color: '#ef4444' }}>1 bloqué</span> +10 jours</div><div className="stat-icon amber"><Icon d={icons.truck} /></div></div>
        <div className="stat-card red" style={{ '--card-top': 'var(--red)' }}><div className="stat-label">Litiges</div><div className="stat-value" style={{ color: '#ef4444' }}>1</div><div className="stat-sub">action requise</div><div className="stat-icon" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}><Icon d={icons.alert} /></div></div>
        <div className="stat-card green"><div className="stat-label">CA en attente</div><div className="stat-value">329€</div><div className="stat-sub">commandes non payées</div><div className="stat-icon green"><Icon d={icons.euro} /></div></div>
      </div>
      <div className="section-header">
        <div className="section-title"><div className="section-title-dot" />Tableau Kanban — Commandes</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="header-btn"><Icon d={icons.download} size={14} />Bordereaux en masse</button>
        </div>
      </div>
      <div className="kanban-board">
        {columns.map(col => {
          const orders = byStatus(col);
          const cfg = ORDER_STATUS[col];
          return (
            <div key={col} className="kanban-col">
              <div className="kanban-col-header">
                <div className="kanban-col-title">
                  <span className="status-dot" style={{ background: cfg.color }} />
                  {cfg.label}
                </div>
                <span className="kanban-count">{orders.length}</span>
              </div>
              <div className="kanban-col-body">
                {orders.map(o => (
                  <div key={o.id} className={`kanban-card ${o.has_dispute || o.days > 10 ? 'alert-border' : ''}`}>
                    <div className="kanban-card-id">{o.id}</div>
                    <div className="kanban-card-product">{o.product}</div>
                    <div className="kanban-card-meta">
                      <span className="kanban-card-buyer">@{o.customer}</span>
                      <span className="kanban-card-amount">{o.amount}€</span>
                    </div>
                    {o.tracking && <div className="kanban-days">{o.shipping} · {o.tracking}</div>}
                    {o.days > 0 && <div className="kanban-days">Jour {o.days} en transit</div>}
                    {o.has_dispute && (
                      <div className="kanban-alert"><Icon d={icons.alert} size={12} />Litige ouvert</div>
                    )}
                    {o.days > 10 && !o.has_dispute && (
                      <div className="kanban-alert"><Icon d={icons.alert} size={12} />Colis bloqué ({o.days}j)</div>
                    )}
                  </div>
                ))}
                {orders.length === 0 && <div style={{ textAlign: 'center', padding: '20px 10px', color: 'var(--text-muted)', fontSize: 12 }}>Aucune commande</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CustomersView() {
  const [tab, setTab] = useState("all");
  const displayed = tab === "blacklist" ? CUSTOMERS.filter(c => c.is_blacklisted) : CUSTOMERS.filter(c => !c.is_blacklisted);
  const colors = ["#06b6d4", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];
  const getRating = (r) => {
    const color = r >= 4.5 ? '#10b981' : r >= 3.5 ? '#f59e0b' : '#ef4444';
    return <span className="rating-stars" style={{ color }}>{r} ★</span>;
  };
  const templates = ["Colis expédié 📦", "Article disponible ✅", "Offre acceptée 🎉", "Merci pour la commande 💙", "Avis laissé ⭐"];
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card cyan"><div className="stat-label">Clients total</div><div className="stat-value">4</div><div className="stat-sub">acheteurs uniques</div><div className="stat-icon cyan"><Icon d={icons.customers} /></div></div>
        <div className="stat-card green"><div className="stat-label">Note moyenne</div><div className="stat-value">4.3</div><div className="stat-sub">sur 5 étoiles</div><div className="stat-icon green"><Icon d={icons.star} /></div></div>
        <div className="stat-card amber"><div className="stat-label">CA moyen / client</div><div className="stat-value">106€</div><div className="stat-sub">par acheteur</div><div className="stat-icon amber"><Icon d={icons.euro} /></div></div>
        <div className="stat-card purple"><div className="stat-label">Blacklistés</div><div className="stat-value" style={{ color: '#ef4444' }}>1</div><div className="stat-sub">client bloqué</div><div className="stat-icon purple" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}><Icon d={icons.ban} /></div></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16 }}>
        <div>
          <div className="section-header">
            <div className="tab-bar">
              <button className={`tab-btn ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>Tous les clients</button>
              <button className={`tab-btn ${tab === 'blacklist' ? 'active' : ''}`} onClick={() => setTab('blacklist')}>🚫 Blacklist</button>
            </div>
          </div>
          <div className="customers-grid">
            {displayed.map((c, i) => (
              <div key={c.id} className={`customer-row ${c.is_blacklisted ? 'blacklisted' : ''}`}>
                <div className="cust-avatar" style={{ background: c.is_blacklisted ? 'rgba(239,68,68,0.15)' : `${colors[i % colors.length]}22`, color: c.is_blacklisted ? '#ef4444' : colors[i % colors.length] }}>
                  {c.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="cust-info">
                  <div className="cust-name">
                    @{c.username}
                    {c.is_blacklisted && <span className="blacklist-tag"><Icon d={icons.ban} size={10} />Blacklisté</span>}
                    {c.purchases >= 2 && !c.is_blacklisted && <span className="vip-tag">VIP</span>}
                  </div>
                  <div className="cust-note">{c.notes || "Aucune note"}</div>
                </div>
                <div className="cust-stat"><div className="cust-stat-val">{getRating(c.rating)}</div><div className="cust-stat-label">Note</div></div>
                <div className="cust-stat"><div className="cust-stat-val" style={{ fontFamily: 'var(--font-mono)' }}>{c.purchases}</div><div className="cust-stat-label">Achats</div></div>
                <div className="cust-stat"><div className="cust-stat-val" style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>{c.total_spent}€</div><div className="cust-stat-label">Total</div></div>
                <div className="action-btns">
                  <div className="action-btn edit"><Icon d={icons.message} size={13} /></div>
                  <div className="action-btn del"><Icon d={icons.ban} size={13} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="section-header"><div className="section-title"><div className="section-title-dot" />Templates messages</div></div>
          <div className="chart-card">
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Réponses rapides — clic pour copier</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {templates.map((t, i) => (
                <div key={i} style={{ padding: '9px 12px', background: 'var(--bg-hover)', borderRadius: 7, fontSize: 12.5, cursor: 'pointer', border: '1px solid var(--border)', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.color = 'var(--cyan)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}>
                  <Icon d={icons.message} size={12} />{t}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: '12px', background: 'rgba(6,182,212,0.05)', border: '1px solid var(--border-accent)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--cyan)', marginBottom: 6, fontWeight: 600 }}>💰 Calculateur de marge</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Évaluer une offre entrante</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 6, padding: '7px 10px', fontSize: 12 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>OFFRE</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>62€</div>
                </div>
                <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 6, padding: '7px 10px', fontSize: 12 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>MARGE</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--green)' }}>+17€</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>ROI: +37.8% — ACCEPTER ✓</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsView() {
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card cyan"><div className="stat-label">CA Cumulé 2024</div><div className="stat-value">4820€</div><div className="stat-sub"><span className="stat-trend up">↑ +34%</span> vs 2023</div><div className="stat-icon cyan"><Icon d={icons.euro} /></div></div>
        <div className="stat-card green"><div className="stat-label">Marge nette totale</div><div className="stat-value">2105€</div><div className="stat-sub"><span className="stat-trend up">43.7%</span> taux moyen</div><div className="stat-icon green"><Icon d={icons.trend} /></div></div>
        <div className="stat-card amber"><div className="stat-label">ROI moyen</div><div className="stat-value">127%</div><div className="stat-sub">sur le stock vendu</div><div className="stat-icon amber"><Icon d={icons.arrowUp} /></div></div>
        <div className="stat-card purple"><div className="stat-label">Rotation stock</div><div className="stat-value">12j</div><div className="stat-sub">délai moyen de vente</div><div className="stat-icon purple"><Icon d={icons.package} /></div></div>
      </div>
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">
            <span>CA & Marge — 6 derniers mois</span>
            <div className="chart-legend">
              <span className="legend-item"><span className="legend-dot" style={{ background: '#06b6d4' }} />CA</span>
              <span className="legend-item"><span className="legend-dot" style={{ background: '#10b981' }} />Marge</span>
            </div>
          </div>
          <BarChart data={MONTHLY_DATA} />
        </div>
        <div className="chart-card">
          <div className="chart-title">Répartition par marque</div>
          <DonutChart segments={[
            { label: "Nike", value: 89, color: "#06b6d4" },
            { label: "Adidas", value: 75, color: "#10b981" },
            { label: "Levi's", value: 48, color: "#8b5cf6" },
            { label: "Zara", value: 65, color: "#f59e0b" },
            { label: "Autres", value: 154, color: "#4a5568" },
          ]} />
        </div>
      </div>
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Taux de conversion</div>
          <div className="kpi-val">78%</div>
          <div className="kpi-meta">des articles listés ont été vendus</div>
          <div className="kpi-trend" style={{ color: 'var(--green)' }}><Icon d={icons.arrowUp} size={12} />+5% vs mois dernier</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Dépenses consommables</div>
          <div className="kpi-val">68€</div>
          <div className="kpi-meta">emballages, étiquettes, fournitures</div>
          <div className="kpi-trend" style={{ color: 'var(--amber)' }}>Jan 2024</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Export URSSAF</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button className="header-btn primary" style={{ fontSize: 12 }}><Icon d={icons.download} size={13} />PDF</button>
            <button className="header-btn" style={{ fontSize: 12 }}><Icon d={icons.download} size={13} />CSV</button>
          </div>
          <div className="kpi-meta" style={{ marginTop: 8 }}>Registre des achats & recettes</div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("overview");

  const navItems = [
    { id: "overview", label: "Vue d'ensemble", icon: icons.dashboard },
    { id: "inventory", label: "Inventaire", icon: icons.inventory, badge: "8", badgeType: "cyan" },
    { id: "orders", label: "Commandes", icon: icons.orders, badge: "1", badgeType: "red" },
    { id: "customers", label: "Clients", icon: icons.customers },
    { id: "stats", label: "Comptabilité", icon: icons.stats },
  ];

  const titles = {
    overview: { main: "Vue d'ensemble", sub: "Dashboard" },
    inventory: { main: "Inventaire", sub: "Stock" },
    orders: { main: "Commandes", sub: "Logistique" },
    customers: { main: "Clients", sub: "& Messagerie" },
    stats: { main: "Comptabilité", sub: "& Statistiques" },
  };

  const t = titles[view];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-mark">
              <div className="logo-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <div>
                <div className="logo-text">VintedPro</div>
                <div className="logo-sub">CRM Dashboard</div>
              </div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section-label">Navigation</div>
            {navItems.map(item => (
              <div key={item.id} className={`nav-item ${view === item.id ? 'active' : ''}`} onClick={() => setView(item.id)}>
                <Icon d={item.icon} size={15} />
                {item.label}
                {item.badge && <span className={`nav-badge ${item.badgeType || ''}`}>{item.badge}</span>}
              </div>
            ))}
            <div className="nav-section-label" style={{ marginTop: 12 }}>Outils</div>
            <div className="nav-item">
              <Icon d={icons.ai} size={15} />
              Générateur IA
              <span className="nav-badge cyan">β</span>
            </div>
            <div className="nav-item">
              <Icon d={icons.barcode} size={15} />
              Étiquettes QR
            </div>
            <div className="nav-item">
              <Icon d={icons.settings} size={15} />
              Paramètres
            </div>
          </nav>
          <div className="sidebar-footer">
            <div className="user-card">
              <div className="user-avatar">LP</div>
              <div>
                <div className="user-name">Lucas Petit</div>
                <div className="user-plan">PRO · Actif</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN AREA */}
        <div className="main">
          {/* HEADER */}
          <header className="header">
            <div className="header-title">
              {t.main} <span>/ {t.sub}</span>
            </div>
            <div className="header-actions">
              <div className="search-bar">
                <Icon d={icons.search} size={14} />
                <input placeholder="Rechercher…" />
              </div>
              <button className="header-btn"><Icon d={icons.filter} size={14} />Filtres</button>
              <div className="notif-btn"><Icon d={icons.bell} size={16} /><div className="notif-dot" /></div>
            </div>
          </header>

          {/* CONTENT */}
          <main className="content">
            {view === "overview"   && <OverviewView />}
            {view === "inventory"  && <InventoryView />}
            {view === "orders"     && <OrdersView />}
            {view === "customers"  && <CustomersView />}
            {view === "stats"      && <StatsView />}
          </main>
        </div>
      </div>
    </>
  );
}
