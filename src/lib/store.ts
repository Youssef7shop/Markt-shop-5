import { useState, useEffect } from 'react';

// Type definitions
export interface User {
  id: string | number;
  username: string;
  email: string;
  balance: number;
  spent: number;
  status: 'Active' | 'Banned';
  role: 'User' | 'Reseller' | 'Admin';
  joined: string;
}

export interface Service {
  id: string | number;
  name: string;
  category: string;
  platform?: string;
  description?: string;
  image?: string;
  discount?: string;
  price: number; // rate per 1000
  cost: number;  // API cost
  min: number;
  max: number;
  type: string;
  provider: string;
}

export interface Order {
  id: string | number;
  username: string;
  service: string;
  link: string;
  quantity: number;
  charge: number;
  startCount: number;
  remains: number;
  status: 'Completed' | 'Processing' | 'Pending' | 'Canceled' | 'Failed';
  date: string;
}

export interface Payment {
  id: string | number;
  username: string;
  method: string;
  amount: number;
  fee: number;
  status: 'Paid' | 'Pending' | 'Failed';
  date: string;
}

export interface TicketMessage {
  sender: 'user' | 'admin';
  text: string;
  time: string;
}

export interface Ticket {
  id: string | number;
  username: string;
  subject: string;
  message: string;
  status: 'Open' | 'Closed' | 'Answered';
  date: string;
  messages: TicketMessage[];
}

// Default Seed Data
const defaultUsers: User[] = [
  { id: 1, username: 'johndoe', email: 'john@example.com', balance: 125.50, spent: 8432.00, status: 'Active', role: 'User', joined: '2026-01-15' },
  { id: 2, username: 'alex99', email: 'alex@test.com', balance: 50.00, spent: 120.00, status: 'Active', role: 'Reseller', joined: '2026-02-10' },
  { id: 3, username: 'spammerx', email: 'banned@spam.com', balance: 0.00, spent: 0.00, status: 'Banned', role: 'User', joined: '2026-05-20' },
  { id: 4, username: 'sara_xyz', email: 'sara@social.com', balance: 450.25, spent: 1540.00, status: 'Active', role: 'User', joined: '2026-03-05' },
  { id: 5, username: 'admin_haytam', email: 'hihhnhkkk@gmail.com', balance: 9999.00, spent: 0.00, status: 'Active', role: 'Admin', joined: '2026-05-27' },
];

const defaultServices: Service[] = [
  { id: '101', name: 'ID 101 - Instagram Followers [Guaranteed] - $0.50 per 1000', category: 'Instagram Services', price: 0.50, cost: 0.20, min: 100, max: 10000, type: 'Default', provider: 'SMM Provider A' },
  { id: '102', name: 'ID 102 - Instagram Likes [Real] - $0.15 per 1000', category: 'Instagram Services', price: 0.15, cost: 0.05, min: 50, max: 50000, type: 'Default', provider: 'SMM Provider A' },
  { id: '201', name: 'ID 201 - TikTok Views [Instant] - $0.05 per 1000', category: 'TikTok Services', price: 0.05, cost: 0.02, min: 1000, max: 1000000, type: 'Default', provider: 'SMM Provider B' },
  { id: '202', name: 'ID 202 - TikTok Followers [Premium] - $1.20 per 1000', category: 'TikTok Services', price: 1.20, cost: 0.50, min: 100, max: 5000, type: 'Default', provider: 'SMM Provider B' },
  { id: '301', name: 'ID 301 - YouTube Views [High Retention] - $2.50 per 1000', category: 'YouTube Services', price: 2.50, cost: 1.00, min: 1000, max: 100000, type: 'Default', provider: 'SMM Provider C' },
];

const defaultOrders: Order[] = [
  { id: 4103, username: 'johndoe', service: 'Instagram Followers [Guaranteed]', link: 'instagram.com/p/xhsjhjd', quantity: 3000, charge: 1.50, startCount: 1540, remains: 0, status: 'Completed', date: '2026-05-26 14:20' },
  { id: 4102, username: 'johndoe', service: 'TikTok Views [Instant]', link: 'tiktok.com/@user', quantity: 16000, charge: 0.80, startCount: 0, remains: 1000, status: 'Processing', date: '2026-05-26 15:10' },
  { id: 4101, username: 'johndoe', service: 'YouTube Views [High Retention]', link: 'youtube.com/watch?v=xxx', quantity: 2000, charge: 5.00, startCount: 120, remains: 5000, status: 'Pending', date: '2026-05-27 01:15' },
  { id: 4100, username: 'johndoe', service: 'Instagram Likes [Real]', link: 'instagram.com/username', quantity: 13333, charge: 2.00, startCount: 0, remains: 1000, status: 'Canceled', date: '2026-05-27 02:00' },
  { id: 4099, username: 'johndoe', service: 'TikTok Followers [Premium]', link: 't.me/channel_link', quantity: 416, charge: 1.25, startCount: 0, remains: 0, status: 'Completed', date: '2026-05-27 05:30' },
];

const defaultPayments: Payment[] = [
  { id: 1001, username: 'johndoe', method: 'Visa/Mastercard', amount: 150.00, fee: 3.00, status: 'Paid', date: '2026-05-15 11:20' },
  { id: 1002, username: 'alex99', method: 'Crypto', amount: 50.00, fee: 1.00, status: 'Paid', date: '2026-05-20 18:42' },
  { id: 1003, username: 'sara_xyz', method: 'PayPal', amount: 450.25, fee: 9.00, status: 'Paid', date: '2026-05-22 09:12' },
  { id: 1004, username: 'johndoe', method: 'Crypto', amount: 200.00, fee: 4.00, status: 'Pending', date: '2026-05-27 12:00' },
];

const defaultTickets: Ticket[] = [
  {
    id: 1,
    username: 'johndoe',
    subject: 'Speed is slow',
    message: 'Instagram followers order speed has been slow today.',
    status: 'Open',
    date: '2026-05-27 14:30',
    messages: [
      { sender: 'user', text: 'Instagram followers order speed has been slow today.', time: '14:30' }
    ]
  },
  {
    id: 2,
    username: 'alex99',
    subject: 'Payment confirmation',
    message: 'Sent via crypto wallet but still pending.',
    status: 'Answered',
    date: '2026-05-27 10:15',
    messages: [
      { sender: 'user', text: 'Sent via crypto wallet but still pending.', time: '10:15' },
      { sender: 'admin', text: 'Hello Alex, your deposit has been credited!', time: '10:45' }
    ]
  }
];

// In-Memory listeners
const listeners = new Set<() => void>();

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notify() {
  listeners.forEach(l => l());
}

// Core DB Accessors
export function getUsers(): User[] {
  const data = localStorage.getItem('db_users');
  if (!data) {
    localStorage.setItem('db_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(data);
}

export function saveUsers(users: User[]) {
  localStorage.setItem('db_users', JSON.stringify(users));
  notify();
}

export function getServices(): Service[] {
  const data = localStorage.getItem('db_services');
  if (!data) {
    localStorage.setItem('db_services', JSON.stringify(defaultServices));
    return defaultServices;
  }
  return JSON.parse(data);
}

export function saveServices(services: Service[]) {
  localStorage.setItem('db_services', JSON.stringify(services));
  notify();
}

export function getOrders(): Order[] {
  const data = localStorage.getItem('db_orders');
  if (!data) {
    localStorage.setItem('db_orders', JSON.stringify(defaultOrders));
    return defaultOrders;
  }
  return JSON.parse(data);
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem('db_orders', JSON.stringify(orders));
  notify();
}

export function getPayments(): Payment[] {
  const data = localStorage.getItem('db_payments');
  if (!data) {
    localStorage.setItem('db_payments', JSON.stringify(defaultPayments));
    return defaultPayments;
  }
  return JSON.parse(data);
}

export function savePayments(payments: Payment[]) {
  localStorage.setItem('db_payments', JSON.stringify(payments));
  notify();
}

export function getTickets(): Ticket[] {
  const data = localStorage.getItem('db_tickets');
  if (!data) {
    localStorage.setItem('db_tickets', JSON.stringify(defaultTickets));
    return defaultTickets;
  }
  return JSON.parse(data);
}

export function saveTickets(tickets: Ticket[]) {
  localStorage.setItem('db_tickets', JSON.stringify(tickets));
  notify();
}

export function getAuthUser(): User | null {
  const users = getUsers();
  const storedUser = localStorage.getItem('current_user_name');
  if (!storedUser) return null;
  const found = users.find(u => u.username.toLowerCase() === storedUser.toLowerCase());
  return found || null;
}

export function getAdminAuthUser(): User | null {
  const user = getAuthUser();
  if (user && user.role === 'Admin') return user;
  return null;
}

export function logout() {
  localStorage.removeItem('current_user_name');
  notify();
}

export function getCurrentUser(): User {
  const users = getUsers();
  const storedUser = localStorage.getItem('current_user_name');
  const fallbackUsername = storedUser || 'johndoe';
  const found = users.find(u => u.username.toLowerCase() === fallbackUsername.toLowerCase());
  if (found) return found;
  
  // Backup: find any Admin/User
  if (users.length > 0) return users[0];
  return defaultUsers[0];
}

export function setCurrentUser(username: string) {
  localStorage.setItem('current_user_name', username);
  notify();
}

// Reactive hook to automatically re-bind states to components
export function useStoreState<T>(selector: () => T): T {
  const [state, setState] = useState<T>(selector);

  useEffect(() => {
    const handleUpdate = () => {
      setState(selector());
    };
    // Force run once to prevent stale states
    handleUpdate();
    return subscribe(handleUpdate);
  }, []);

  return state;
}

// Business Logic Operations
export function addOrder(username: string, serviceName: string, link: string, quantity: number, charge: number): boolean {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
  
  if (userIndex === -1) return false;
  if (users[userIndex].balance < charge) {
    return false; // Insufficient balance
  }

  // Deduct Balance
  users[userIndex].balance = Number((users[userIndex].balance - charge).toFixed(2));
  users[userIndex].spent = Number((users[userIndex].spent + charge).toFixed(2));
  saveUsers(users);

  // New order
  const orders = getOrders();
  const newId = orders.length > 0 ? Math.max(...orders.map(o => Number(o.id))) + 1 : 10001;
  const newOrder: Order = {
    id: newId,
    username,
    service: serviceName,
    link,
    quantity,
    charge,
    startCount: 0,
    remains: quantity,
    status: 'Pending',
    date: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };

  orders.unshift(newOrder);
  saveOrders(orders);
  return true;
}

export function addPayment(username: string, method: string, amount: number, isInstant: boolean = false): void {
  const payments = getPayments();
  const newId = payments.length > 0 ? Math.max(...payments.map(p => Number(p.id))) + 1 : 2001;
  const newPayment: Payment = {
    id: newId,
    username,
    method,
    amount,
    fee: Number((amount * 0.02).toFixed(2)),
    status: isInstant ? 'Paid' : 'Pending',
    date: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };

  payments.unshift(newPayment);
  savePayments(payments);

  if (isInstant) {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
    if (userIndex !== -1) {
      users[userIndex].balance = Number((users[userIndex].balance + amount).toFixed(2));
      saveUsers(users);
    }
  }
}

export function addTicket(username: string, subject: string, message: string): void {
  const tickets = getTickets();
  const newId = tickets.length > 0 ? Math.max(...tickets.map(t => Number(t.id))) + 1 : 1;
  const newTicket: Ticket = {
    id: newId,
    username,
    subject,
    message,
    status: 'Open',
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    messages: [
      { sender: 'user', text: message, time: new Date().toTimeString().slice(0, 5) }
    ]
  };

  tickets.unshift(newTicket);
  saveTickets(tickets);
}

export function addTicketReply(ticketId: string | number, sender: 'user' | 'admin', text: string): void {
  const tickets = getTickets();
  const index = tickets.findIndex(t => String(t.id) === String(ticketId));
  if (index !== -1) {
    tickets[index].messages.push({
      sender,
      text,
      time: new Date().toTimeString().slice(0, 5)
    });
    tickets[index].status = sender === 'admin' ? 'Answered' : 'Open';
    saveTickets(tickets);
  }
}

export function approvePayment(paymentId: string | number): void {
  const payments = getPayments();
  const index = payments.findIndex(p => String(p.id) === String(paymentId));
  if (index !== -1 && payments[index].status === 'Pending') {
    payments[index].status = 'Paid';
    savePayments(payments);

    // Add balance to user
    const users = getUsers();
    const uIndex = users.findIndex(u => u.username.toLowerCase() === payments[index].username.toLowerCase());
    if (uIndex !== -1) {
      users[uIndex].balance = Number((users[uIndex].balance + payments[index].amount).toFixed(2));
      saveUsers(users);
    }
  }
}

export function rejectPayment(paymentId: string | number): void {
  const payments = getPayments();
  const index = payments.findIndex(p => String(p.id) === String(paymentId));
  if (index !== -1 && payments[index].status === 'Pending') {
    payments[index].status = 'Failed';
    savePayments(payments);
  }
}

export function transferFunds(fromUsername: string, toUsername: string, amount: number): { success: boolean, error?: string } {
  const users = getUsers();
  const fromIndex = users.findIndex(u => u.username.toLowerCase() === fromUsername.toLowerCase());
  const toIndex = users.findIndex(u => u.username.toLowerCase() === toUsername.toLowerCase());

  if (fromIndex === -1) return { success: false, error: 'Source user not found' };
  if (toIndex === -1) return { success: false, error: 'Recipient user not found' };
  if (users[fromIndex].balance < amount) return { success: false, error: 'Insufficient balance' };

  users[fromIndex].balance = Number((users[fromIndex].balance - amount).toFixed(2));
  users[toIndex].balance = Number((users[toIndex].balance + amount).toFixed(2));
  saveUsers(users);

  // Add transfer payments so it logs under payments
  const payments = getPayments();
  const newId = payments.length > 0 ? Math.max(...payments.map(p => Number(p.id))) + 1 : 2001;
  const transferOut: Payment = {
    id: newId,
    username: fromUsername,
    method: `Transfer out to @${toUsername}`,
    amount: -amount,
    fee: 0,
    status: 'Paid',
    date: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };
  const transferIn: Payment = {
    id: newId + 1,
    username: toUsername,
    method: `Transfer in from @${fromUsername}`,
    amount: amount,
    fee: 0,
    status: 'Paid',
    date: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };

  payments.unshift(transferOut, transferIn);
  savePayments(payments);

  return { success: true };
}

export function addUser(username: string, email: string, balance: number, role: 'User' | 'Reseller' | 'Admin'): void {
  const users = getUsers();
  const newId = users.length > 0 ? Math.max(...users.map(u => Number(u.id))) + 1 : 1;
  users.push({
    id: newId,
    username,
    email,
    balance: Number(balance.toFixed(2)),
    spent: 0,
    status: 'Active',
    role,
    joined: new Date().toISOString().substring(0, 10)
  });
  saveUsers(users);
}

export function updateUserBalance(username: string, newBalance: number): boolean {
  const users = getUsers();
  const index = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
  if (index !== -1) {
    users[index].balance = Number(Number(newBalance).toFixed(2));
    saveUsers(users);
    return true;
  }
  return false;
}

export function toggleUserStatus(username: string): void {
  const users = getUsers();
  const index = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
  if (index !== -1) {
    users[index].status = users[index].status === 'Active' ? 'Banned' : 'Active';
    saveUsers(users);
  }
}

export function deleteUser(username: string): void {
  const users = getUsers();
  const filtered = users.filter(u => u.username.toLowerCase() !== username.toLowerCase());
  saveUsers(filtered);
}

export function updateOrderStatus(orderId: string | number, status: Order['status']): void {
  const orders = getOrders();
  const index = orders.findIndex(o => String(o.id) === String(orderId));
  if (index !== -1) {
    orders[index].status = status;
    saveOrders(orders);
  }
}

export function addService(name: string, category: string, platform: string, description: string, image: string, discount: string, price: number, cost: number, min: number, max: number, provider: string): void {
  const services = getServices();
  // Parse maximum number to define new ID
  const numIds = services.map(s => parseInt(String(s.id))).filter(n => !isNaN(n));
  const newId = numIds.length > 0 ? Math.max(...numIds) + 1 : 101;
  services.push({
    id: String(newId),
    name,
    category,
    platform,
    description,
    image,
    discount,
    price: Number(price),
    cost: Number(cost),
    min: Number(min),
    max: Number(max),
    type: 'Default',
    provider
  });
  saveServices(services);
}

export function deleteService(serviceId: string | number): void {
  const services = getServices();
  const filtered = services.filter(s => String(s.id) !== String(serviceId));
  saveServices(filtered);
}

export function closeTicket(ticketId: string | number): void {
  const tickets = getTickets();
  const index = tickets.findIndex(t => String(t.id) === String(ticketId));
  if (index !== -1) {
    tickets[index].status = 'Closed';
    saveTickets(tickets);
  }
}
