import {Socket,io} from "socket.io-client"

export class TransactionWebSocketClient {
  serverUrl: string;
  socket: Socket | null;
  userId: string | null;
  subscribedTransactions: Set<unknown>;
  eventHandlers: Map<any, any>;


  constructor(serverUrl = 'http://localhost:3003') {
    this.serverUrl = serverUrl;
    this.socket = null;
    this.userId = null;
    this.subscribedTransactions = new Set();
    this.eventHandlers = new Map();
  }

  // Initialize WebSocket connection
  async connect(userId  : string) {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(this.serverUrl, {
          transports: ['websocket', 'polling'],
          upgrade: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
          console.log('🔌 Connected to WebSocket server');
          
          // Authenticate user
          if (userId) {
            this.authenticate(userId);
          }
          
          resolve(this.socket  && this.socket.id);
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ Connection error:', error);
          reject(error);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('🔌 Disconnected:', reason);
        });

        // Set up default event listeners
        this.setupDefaultListeners();

      } catch (error) {
        reject(error);
      }
    });
  }

  // Authenticate user
  authenticate(userId  : string | null) {
    this.userId = userId 
    if(this.socket){
        this.socket.emit('authenticate', { userId });   
        this.socket.on('authenticated', (data) => {
            console.log('✅ Authenticated:', data);
        });
        this.socket.on('authentication_error', (error) => {
            console.error('❌ Authentication failed:', error);
        });
    }
  }

  // Subscribe to transaction updates
  subscribeToTransaction(orderId   : string) {
    if (!this.socket) {
      throw new Error('WebSocket not connected');
    }

    this.socket.emit('subscribe_transaction', { orderId });
    this.subscribedTransactions.add(orderId);

    this.socket.on('subscribed', (data) => {
      console.log('📡 Subscribed to transaction:', data);
    });

    return this;
  }

  unsubscribeFromTransaction(orderId : string) {
    if (!this.socket) return this;

    this.socket.emit('unsubscribe_transaction', { orderId });
    this.subscribedTransactions.delete(orderId);

    this.socket.on('unsubscribed', (data) => {
      console.log('📡 Unsubscribed from transaction:', data);
    });

    return this;
  }

  setupDefaultListeners() {

    if(!this.socket){
        return null
    }
    this.socket.on('transaction_created', (data) => {
      console.log('🆕 Transaction created:', data);
      this.triggerHandler('transaction_created', data);
    });

    // Transaction log updates
    this.socket.on('transaction_log_update', (data) => {
      console.log('📝 Transaction log update:', data);
      this.triggerHandler('transaction_log_update', data);
    });

    // Transaction updates
    this.socket.on('transaction_update', (data) => {
      console.log('🔄 Transaction update:', data);
      this.triggerHandler('transaction_update', data);
    });

    // Payment processing events
    this.socket.on('payment_processing', (data) => {
      console.log('💳 Payment processing:', data);
      this.triggerHandler('payment_processing', data);
    });

    this.socket.on('payment_progress', (data) => {
      console.log('⏳ Payment progress:', data);
      this.triggerHandler('payment_progress', data);
    });

    this.socket.on('payment_completed', (data) => {
      console.log('✅ Payment completed:', data);
      this.triggerHandler('payment_completed', data);
    });

    this.socket.on('payment_error', (data) => {
      console.error('❌ Payment error:', data);
      this.triggerHandler('payment_error', data);
    });

    // Callback events
    this.socket.on('payment_callback_received', (data) => {
      console.log('📞 Payment callback:', data);
      this.triggerHandler('payment_callback_received', data);
    });

    // Error events
    this.socket.on('transaction_error', (data) => {
      console.error('❌ Transaction error:', data);
      this.triggerHandler('transaction_error', data);
    });

    // User-specific events
    this.socket.on('user_transaction_update', (data) => {
      console.log('👤 User transaction update:', data);
      this.triggerHandler('user_transaction_update', data);
    });

    this.socket.on('new_transaction', (data) => {
      console.log('🆕 New user transaction:', data);
      this.triggerHandler('new_transaction', data);
    });

    this.socket.on('payment_result', (data) => {
      console.log('💰 Payment result:', data);
      this.triggerHandler('payment_result', data);
    });

    // History events
    this.socket.on('transaction_logs_history', (data) => {
      console.log('📚 Transaction logs history:', data);
      this.triggerHandler('transaction_logs_history', data);
    });

    this.socket.on('test_message', (data) => {
      console.log('🧪 Test message:', data);
    });
  }

  on(event  : string, handler : Socket) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
    return this;
  }

  // Remove event handler
  off(event  : string, handler : Socket) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
    return this;
  }

  triggerHandler(event : string, data : Socket) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler  => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in ${event} handler:`, error);
        }
      });
    }
  }
  // Ping server
  ping() {
    if (this.socket) {
      this.socket.emit('ping');
      this.socket.on('pong', (data) => {
        console.log('🏓 Pong received:', data);
      });
    }
  }

  // Get connection status
  getStatus() {
    return {
      connected: this.socket?.connected || false,
      userId: this.userId,
      subscribedTransactions: Array.from(this.subscribedTransactions),
      socketId: this.socket?.id
    };
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.subscribedTransactions.clear();
      this.eventHandlers.clear();
    }
  }
}
