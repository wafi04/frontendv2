// hooks/useSocket.ts
import { useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { toast } from 'sonner'

interface SocketState {
  socket: Socket | null
  isConnected: boolean
  isAuthenticated: boolean
  connectionError: string | null
}

export function useSocket() {
  const [state, setState] = useState<SocketState>({
    socket: null,
    isConnected: false,
    isAuthenticated: false,
    connectionError: null
  })

  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const newSocket = io('http://localhost:3005', {
      path: '/socket.io/',
      transports: ['polling', 'websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketRef.current = newSocket

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('🔌 Connected to socket server')
      setState(prev => ({ 
        ...prev, 
        socket: newSocket, 
        isConnected: true, 
        connectionError: null 
      }))
      const userId = localStorage.getItem('userId') 
      if (userId) {
        newSocket.emit('authenticate', { userId })
      }
    })

    newSocket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from socket server:', reason)
      setState(prev => ({ 
        ...prev, 
        isConnected: false, 
        isAuthenticated: false 
      }))
      
      if (reason === 'io server disconnect') {
        newSocket.connect()
      }
    })

    newSocket.on('authenticated', (data) => {
      console.log('✅ Socket authenticated:', data)
      setState(prev => ({ ...prev, isAuthenticated: true }))
      toast.success('Connected to real-time updates')
    })

    newSocket.on('authentication_error', (error) => {
      console.error('❌ Authentication error:', error)
      setState(prev => ({ ...prev, isAuthenticated: false }))
      toast.error('Authentication failed')
    })

    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error)
      setState(prev => ({ 
        ...prev, 
        connectionError: error.message,
        isConnected: false 
      }))
      toast.error('Connection failed')
    })

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts')
      toast.success('Reconnected to server')
    })

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection error:', error)
      toast.error('Reconnection failed')
    })

    // Ping-pong for connection health
    const pingInterval = setInterval(() => {
      if (newSocket.connected) {
        newSocket.emit('ping')
      }
    }, 30000)

    newSocket.on('pong', (data) => {
      console.log('🏓 Pong received:', data)
    })

    // Cleanup on unmount
    return () => {
      clearInterval(pingInterval)
      newSocket.close()
      socketRef.current = null
    }
  }, [])

  // Authentication function
  const authenticate = (userId: string) => {
    if (socketRef.current && state.isConnected) {
      socketRef.current.emit('authenticate', { userId })
    }
  }

  // Subscribe to transaction updates
  const subscribeToTransaction = (orderId: string) => {
    if (socketRef.current && state.isConnected) {
      socketRef.current.emit('subscribe_transaction', { orderId })
    }
  }

  // Unsubscribe from transaction updates
  const unsubscribeFromTransaction = (orderId: string) => {
    if (socketRef.current && state.isConnected) {
      socketRef.current.emit('unsubscribe_transaction', { orderId })
    }
  }

  return {
    ...state,
    authenticate,
    subscribeToTransaction,
    unsubscribeFromTransaction
  }
}