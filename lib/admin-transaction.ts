import { Socket, io } from "socket.io-client";

interface TransactionLogData {
  orderId: string;
  transactionType: string;
  status: string;
  userId?: string;
  amount?: number;
  timestamp: string;
}

export class AdminTransactionMonitor {
  private serverUrl: string;
  private socket: Socket | null;
  private adminId: string;
  private eventHandlers: Map<string, Function[]>;
  private isAuthenticated: boolean;

  constructor(serverUrl = 'http://localhost:3003', adminId: string) {
    this.serverUrl = serverUrl;
    this.socket = null;
    this.adminId = adminId;
    this.eventHandlers = new Map();
    this.isAuthenticated = false;
  }

  // ========== CONNECT AS ADMIN ==========
  async connectAsAdmin(): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(this.serverUrl, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
          console.log('🔌 Admin connected to server');
          this.authenticateAsAdmin();
          resolve(this.socket?.id);
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ Admin connection error:', error);
          reject(error);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('🔌 Admin disconnected:', reason);
          this.isAuthenticated = false;
        });

        this.setupAdminListeners();

      } catch (error) {
        reject(error);
      }
    });
  }

  // ========== AUTHENTICATE ==========
  private authenticateAsAdmin() {
    if (!this.socket) return;

    this.socket.emit('admin_authenticate', {
      adminId: this.adminId
    });

    this.socket.on('admin_authenticated', (data) => {
      console.log('✅ Admin authenticated:', data);
      this.isAuthenticated = true;
      this.triggerHandler('admin_authenticated', data);
    });

    this.socket.on('admin_authentication_error', (error) => {
      console.error('❌ Admin authentication failed:', error);
      this.isAuthenticated = false;
      this.triggerHandler('admin_authentication_error', error);
    });
  }

  // ========== SETUP LISTENERS ==========
  private setupAdminListeners() {
    if (!this.socket) return;

    // New transaction logs (real-time)
    this.socket.on('admin_new_transaction', (data: TransactionLogData) => {
      console.log('📝 New transaction:', data);
      this.triggerHandler('new_transaction', data);
    });

    // Payment updates
    this.socket.on('admin_payment_update', (data) => {
      console.log('💳 Payment update:', data);
      this.triggerHandler('payment_update', data);
    });

    // Error alerts
    this.socket.on('admin_error_alert', (data) => {
      console.log('❌ Error alert:', data);
      this.triggerHandler('error_alert', data);
    });

    // User activity
    this.socket.on('admin_user_activity', (data) => {
      console.log('👤 User activity:', data);
      this.triggerHandler('user_activity', data);
    });

    // Transaction logs response
    this.socket.on('admin_transaction_logs', (data) => {
      console.log('📋 Transaction logs:', data);
      this.triggerHandler('transaction_logs', data);
    });

    // Transaction details response
    this.socket.on('admin_transaction_details', (data) => {
      console.log('📄 Transaction details:', data);
      this.triggerHandler('transaction_details', data);
    });

    // Stats response
    this.socket.on('admin_stats', (data) => {
      console.log('📊 Stats:', data);
      this.triggerHandler('stats', data);
    });

    // Error response
    this.socket.on('admin_error', (data) => {
      console.log('❌ Admin error:', data);
      this.triggerHandler('error', data);
    });
  }

  // ========== ADMIN ACTIONS ==========

  // Get all transaction logs
  getLogs(filter = {}) {
    if (!this.socket || !this.isAuthenticated) {
      throw new Error('Admin not authenticated');
    }

    this.socket.emit('admin_get_logs', filter);
    console.log('📋 Requesting transaction logs');
    return this;
  }

  // Get specific transaction details
  getTransactionDetails(orderId: string) {
    if (!this.socket || !this.isAuthenticated) {
      throw new Error('Admin not authenticated');
    }

    this.socket.emit('admin_get_transaction_details', { orderId });
    console.log(`📄 Requesting details for transaction: ${orderId}`);
    return this;
  }

  // Get stats
  getStats() {
    if (!this.socket || !this.isAuthenticated) {
      throw new Error('Admin not authenticated');
    }

    this.socket.emit('admin_get_stats');
    console.log('📊 Requesting stats');
    return this;
  }

  // ========== EVENT HANDLER MANAGEMENT ==========
  on(event: string, handler: Function) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)?.push(handler);
    return this;
  }

  off(event: string, handler: Function) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
    return this;
  }

  private triggerHandler(event: string, data: any) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in ${event} handler:`, error);
        }
      });
    }
  }

  getStatus() {
    return {
      connected: this.socket?.connected || false,
      authenticated: this.isAuthenticated,
      adminId: this.adminId,
      socketId: this.socket?.id
    };
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isAuthenticated = false;
      this.eventHandlers.clear();
      console.log('🔌 Admin disconnected');
    }
  }

  // Test connection
  ping() {
    if (this.socket) {
      this.socket.emit('ping');
      console.log('🏓 Ping sent');
    }
  }
}