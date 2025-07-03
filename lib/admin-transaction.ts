import { Socket, io } from "socket.io-client";
export class AdminTransactionMonitor {
  private socket: Socket | null = null;
  private serverUrl: string;
  private adminId: string;
  private eventHandlers: Map<string, Function[]>;
  private isAuthenticated: boolean = false;

  constructor(serverUrl = 'http://localhost:3005', adminId: string) {
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
        console.log('🔌 Connecting to server:', this.serverUrl);
        
        // Improved connection options
        this.socket = io(this.serverUrl, {
          transports: ['polling', 'websocket'], 
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
          forceNew: true,
          upgrade: true,
          rememberUpgrade: false,
        });

        this.setupAdminListeners();

        this.socket.on('connect', () => {
          console.log('🔌 Admin connected to server, Socket ID:', this.socket?.id);
          
          setTimeout(() => {
            this.authenticateAsAdmin();
          }, 100);
          
          resolve(this.socket?.id);
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ Admin connection error:', error);
          console.error('Error details:', {
            message: error.message,
            serverUrl: this.serverUrl
          });
          reject(error);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('🔌 Admin disconnected:', reason);
          this.isAuthenticated = false;
        });

      } catch (error) {
        console.error('❌ Failed to create socket connection:', error);
        reject(error);
      }
    });
  }

  private authenticateAsAdmin() {
    if (!this.socket) {
      console.error('❌ Socket not connected for authentication');
      return;
    }

    console.log('🔐 Authenticating as admin:', this.adminId);
    console.log('🔐 Socket connected:', this.socket.connected);
    console.log('🔐 Socket ID:', this.socket.id);
    
    // ✅ Fix: Emit dengan adminId yang benar
    this.socket.emit('admin_authenticate', {
      adminId: this.adminId 
    });
    
    console.log('🔐 Authentication request sent');
  }

  // ========== SETUP LISTENERS ==========
  private setupAdminListeners() {
    if (!this.socket) return;

    console.log('🎧 Setting up admin listeners...');

    // ✅ Fix: Authentication responses
    this.socket.on('admin_authenticated', (data) => {
      console.log('✅ Admin authenticated SUCCESS:', data);
      this.isAuthenticated = true;
      this.triggerHandler('admin_authenticated', data);
    });

    this.socket.on('admin_authentication_error', (error) => {
      console.error('❌ Admin authentication FAILED:', error);
      this.isAuthenticated = false;
      this.triggerHandler('admin_authentication_error', error);
    });

    // New transaction logs (real-time)
    this.socket.on('admin_new_transaction', (data: any) => {
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

    // Pong response
    this.socket.on('pong', (data) => {
      console.log('🏓 Pong received:', data);
      this.triggerHandler('pong', data);
    });

    // ✅ Add: Connection status listeners
    this.socket.on('connect', () => {
      console.log('🔌 Socket connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      this.isAuthenticated = false;
    });
  }

  // ========== CONNECTION TESTING ==========
  async testConnection(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.socket) {
        console.log('❌ Socket not available for testing');
        resolve(false);
        return;
      }

      const timeout = setTimeout(() => {
        console.log('❌ Connection test timeout');
        resolve(false);
      }, 5000);

      this.socket.emit('ping');
      
      const pongHandler = () => {
        clearTimeout(timeout);
        console.log('✅ Connection test successful');
        this.socket?.off('pong', pongHandler);
        resolve(true);
      };

      this.socket.on('pong', pongHandler);
    });
  }

  // ========== MANUAL AUTHENTICATION TEST ==========
  testAuthentication() {
    console.log('🧪 Testing authentication manually...');
    console.log('🧪 Socket status:', {
      connected: this.socket?.connected,
      id: this.socket?.id,
      authenticated: this.isAuthenticated
    });
    
    if (this.socket?.connected) {
      this.authenticateAsAdmin();
    } else {
      console.error('❌ Socket not connected for manual auth test');
    }
  }

  // ========== ADMIN ACTIONS ==========

  // Get all transaction logs
  getLogs(filter = {}) {
    if (!this.socket) {
      console.error('❌ Socket not connected');
      return this;
    }

    if (!this.isAuthenticated) {
      console.warn('⚠️ Admin not authenticated, attempting to get logs anyway');
    }

    this.socket.emit('admin_get_logs', filter);
    console.log('📋 Requesting transaction logs with filter:', filter);
    return this;
  }

  // Get specific transaction details
  getTransactionDetails(orderId: string) {
    if (!this.socket) {
      console.error('❌ Socket not connected');
      return this;
    }

    if (!this.isAuthenticated) {
      console.warn('⚠️ Admin not authenticated, attempting to get transaction details anyway');
    }

    this.socket.emit('admin_get_transaction_details', { orderId });
    console.log(`📄 Requesting details for transaction: ${orderId}`);
    return this;
  }

  // Get stats
  getStats() {
    if (!this.socket) {
      console.error('❌ Socket not connected');
      return this;
    }

    if (!this.isAuthenticated) {
      console.warn('⚠️ Admin not authenticated, attempting to get stats anyway');
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
      socketId: this.socket?.id,
      serverUrl: this.serverUrl
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

  // Force reconnection
  reconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket.connect();
      console.log('🔄 Reconnecting...');
    }
  }
}