import { AdminSocketHook, AdminStats, TransactionLog, UseAdminSocketState } from "@/types/useAdminSocket";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";


export function useAdminSocket(serverUrl: string = 'http://localhost:3005'): AdminSocketHook {
  const [state, setState] = useState<UseAdminSocketState>({
    socket: null,
    isConnected: false,
    isAuthenticated: false,
    connectionError: null,
    adminId: null
  })

  const socketRef = useRef<Socket | null>(null)
  const eventHandlersRef = useRef<Map<string, Function[]>>(new Map())

  // Helper to add event handler
  const addEventHandler = useCallback((event: string, handler: Function) => {
    if (!eventHandlersRef.current.has(event)) {
      eventHandlersRef.current.set(event, [])
    }
    eventHandlersRef.current.get(event)?.push(handler)
  }, [])

  // Helper to remove event handler
  const removeEventHandler = useCallback((event: string, handler: Function) => {
    const handlers = eventHandlersRef.current.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }, [])

  // Helper to trigger event handlers
  const triggerEventHandlers = useCallback((event: string, data: any) => {
    const handlers = eventHandlersRef.current.get(event)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data)
        } catch (error) {
          console.error(`Error in ${event} handler:`, error)
        }
      })
    }
  }, [])

  // Setup socket listeners
  const setupSocketListeners = useCallback((socket: Socket) => {
    // Connection events
    socket.on('connect', () => {
      console.log('🔌 Admin connected to socket server')
      setState(prev => ({ 
        ...prev, 
        socket, 
        isConnected: true, 
        connectionError: null 
      }))
      toast.success('Connected to admin dashboard')
    })

    socket.on('disconnect', (reason) => {
      console.log('🔌 Admin disconnected:', reason)
      setState(prev => ({ 
        ...prev, 
        isConnected: false, 
        isAuthenticated: false 
      }))
      toast.error('Disconnected from admin dashboard')
    })

    socket.on('connect_error', (error) => {
      console.error('❌ Admin connection error:', error)
      setState(prev => ({ 
        ...prev, 
        connectionError: error.message,
        isConnected: false 
      }))
      toast.error('Admin connection failed')
    })

    // Authentication events
    socket.on('admin_authenticated', (data) => {
      console.log('✅ Admin authenticated:', data)
      setState(prev => ({ ...prev, isAuthenticated: true }))
      toast.success(`Admin authenticated: ${data.adminId}`)
    })

    socket.on('admin_authentication_error', (error) => {
      console.error('❌ Admin authentication error:', error)
      setState(prev => ({ ...prev, isAuthenticated: false }))
      toast.error('Admin authentication failed')
    })

    // Real-time events
    socket.on('admin_new_transaction', (data: TransactionLog) => {
      console.log('📝 New transaction:', data)
      triggerEventHandlers('new_transaction', data)
      
      // Show toast notification for new transactions
      toast.info(`New transaction: ${data.orderId}`, {
        description: `${data.transactionType} - ${data.status}`
      })
    })

    socket.on('admin_payment_update', (data) => {
      console.log('💳 Payment update:', data)
      triggerEventHandlers('payment_update', data)
      
      toast.info('Payment update received')
    })

    socket.on('admin_error_alert', (data) => {
      console.log('❌ Error alert:', data)
      triggerEventHandlers('error_alert', data)
      
      toast.error('Transaction error detected', {
        description: data.error || 'Unknown error'
      })
    })

    socket.on('admin_user_activity', (data) => {
      console.log('👤 User activity:', data)
      triggerEventHandlers('user_activity', data)
    })

    // Response events
    socket.on('admin_transaction_logs', (data) => {
      console.log('📋 Transaction logs received:', data)
      triggerEventHandlers('transaction_logs', data)
    })

    socket.on('admin_transaction_details', (data) => {
      console.log('📄 Transaction details received:', data)
      triggerEventHandlers('transaction_details', data)
    })

    socket.on('admin_stats', (data: AdminStats) => {
      console.log('📊 Stats received:', data)
      triggerEventHandlers('stats', data)
    })

    socket.on('admin_error', (data) => {
      console.log('❌ Admin error:', data)
      triggerEventHandlers('error', data)
      toast.error('Admin operation failed', {
        description: data.message
      })
    })

    // Ping-pong
    socket.on('pong', (data) => {
      console.log('🏓 Admin pong received:', data)
    })

    // Reconnection events
    socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Admin reconnected after', attemptNumber, 'attempts')
      toast.success('Reconnected to admin dashboard')
    })

    socket.on('reconnect_error', (error) => {
      console.error('❌ Admin reconnection error:', error)
      toast.error('Admin reconnection failed')
    })
  }, [triggerEventHandlers])

  // Connect function
  const connect = useCallback(async (adminId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        console.log('🔌 Connecting admin to server:', serverUrl)
        
        // Disconnect existing socket if any
        if (socketRef.current) {
          socketRef.current.disconnect()
        }

        const newSocket = io(serverUrl, {
          path: '/socket.io/',
          transports: ['polling', 'websocket'],
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
          forceNew: true,
          upgrade: true,
          rememberUpgrade: false,
        })

        socketRef.current = newSocket
        setState(prev => ({ ...prev, adminId }))

        setupSocketListeners(newSocket)

        newSocket.on('connect', () => {
          setTimeout(() => {
            authenticate(adminId)
          }, 100)
          resolve()
        })

        newSocket.on('connect_error', (error) => {
          reject(error)
        })

      } catch (error) {
        console.error('❌ Failed to create admin socket connection:', error)
        reject(error)
      }
    })
  }, [serverUrl, setupSocketListeners])

  // Disconnect function
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
      setState(prev => ({ 
        ...prev, 
        socket: null, 
        isConnected: false, 
        isAuthenticated: false,
        adminId: null 
      }))
      eventHandlersRef.current.clear()
      console.log('🔌 Admin disconnected')
    }
  }, [])

  // Authenticate function
  const authenticate = useCallback((adminId: string) => {
    if (socketRef.current && socketRef.current.connected) {
      console.log('🔐 Authenticating admin:', adminId)
      socketRef.current.emit('admin_authenticate', { adminId })
    } else {
      console.error('❌ Socket not connected for authentication')
    }
  }, [])

  // Admin functions
  const getLogs = useCallback((filter = {}) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('admin_get_logs', filter)
      console.log('📋 Requesting transaction logs with filter:', filter)
    } else {
      console.error('❌ Socket not connected for getLogs')
    }
  }, [])

  const getTransactionDetails = useCallback((orderId: string) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('admin_get_transaction_details', { orderId })
      console.log(`📄 Requesting details for transaction: ${orderId}`)
    } else {
      console.error('❌ Socket not connected for getTransactionDetails')
    }
  }, [])

  const getStats = useCallback(() => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('admin_get_stats')
      console.log('📊 Requesting stats')
    } else {
      console.error('❌ Socket not connected for getStats')
    }
  }, [])

  const ping = useCallback(() => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('ping')
      console.log('🏓 Admin ping sent')
    } else {
      console.error('❌ Socket not connected for ping')
    }
  }, [])

  const onNewTransaction = useCallback((callback: (data: TransactionLog) => void) => {
    addEventHandler('new_transaction', callback)
    return () => removeEventHandler('new_transaction', callback)
  }, [addEventHandler, removeEventHandler])

  const onPaymentUpdate = useCallback((callback: (data: any) => void) => {
    addEventHandler('payment_update', callback)
    return () => removeEventHandler('payment_update', callback)
  }, [addEventHandler, removeEventHandler])

  const onErrorAlert = useCallback((callback: (data: any) => void) => {
    addEventHandler('error_alert', callback)
    return () => removeEventHandler('error_alert', callback)
  }, [addEventHandler, removeEventHandler])

  const onUserActivity = useCallback((callback: (data: any) => void) => {
    addEventHandler('user_activity', callback)
    return () => removeEventHandler('user_activity', callback)
  }, [addEventHandler, removeEventHandler])

  const onTransactionLogs = useCallback((callback: (data: any) => void) => {
    addEventHandler('transaction_logs', callback)
    return () => removeEventHandler('transaction_logs', callback)
  }, [addEventHandler, removeEventHandler])

  const onTransactionDetails = useCallback((callback: (data: any) => void) => {
    addEventHandler('transaction_details', callback)
    return () => removeEventHandler('transaction_details', callback)
  }, [addEventHandler, removeEventHandler])

  const onStats = useCallback((callback: (data: AdminStats) => void) => {
    addEventHandler('stats', callback)
    return () => removeEventHandler('stats', callback)
  }, [addEventHandler, removeEventHandler])

  const onError = useCallback((callback: (data: any) => void) => {
    addEventHandler('error', callback)
    return () => removeEventHandler('error', callback)
  }, [addEventHandler, removeEventHandler])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  // Auto-ping every 30 seconds
  useEffect(() => {
    const pingInterval = setInterval(() => {
      if (socketRef.current && socketRef.current.connected) {
        ping()
      }
    }, 30000)

    return () => clearInterval(pingInterval)
  }, [ping])

  return {
    socket: state.socket,
    isConnected: state.isConnected,
    isAuthenticated: state.isAuthenticated,
    connectionError: state.connectionError,
    adminId: state.adminId,
    
    connect,
    disconnect,
    authenticate,
    
    getLogs,
    getTransactionDetails,
    getStats,
    ping,
    
    onNewTransaction,
    onPaymentUpdate,
    onErrorAlert,
    onUserActivity,
    onTransactionLogs,
    onTransactionDetails,
    onStats,
    onError
  }
}