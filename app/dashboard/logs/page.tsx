"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Activity, CreditCard, AlertTriangle, Monitor, Search } from 'lucide-react';
import { AdminTransactionMonitor } from '@/lib/admin-transaction';

interface TransactionLog {
  orderId: string;
  transactionType: string;
  status: string;
  userId?: string;
  amount?: number;
  timestamp: string;
  error?: string;
}

interface Stats {
  todayTransactions: number;
  successTransactions: number;
  connectedAdmins: number;
}
const AdminDashboard = () => {
  const [adminMonitor, setAdminMonitor] = useState<AdminTransactionMonitor | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [transactionLogs, setTransactionLogs] = useState<TransactionLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<string>('');
  const [transactionDetails, setTransactionDetails] = useState<any[]>([]);

  // Initialize admin monitor
  useEffect(() => {
    const monitor = new AdminTransactionMonitor('http://localhost:3005', 'admin-001');
    setAdminMonitor(monitor);

    // Setup event handlers SEBELUM connect
    // ✅ Fix: Event name yang benar adalah 'admin_authenticated'
    monitor.on('admin_authenticated', (data: any) => {
      setIsAuthenticated(true);
      console.log('✅ Admin authenticated:', data);

      setTimeout(() => {
        monitor.getLogs();
        monitor.getStats();
      }, 100);
    });

    monitor.on('admin_authentication_error', (error: any) => {
      console.error('❌ Authentication failed:', error);
      setIsAuthenticated(false);
    });

    // Real-time transaction updates
    monitor.on('new_transaction', (log: TransactionLog) => {
      console.log('📝 New transaction:', log);
      setTransactionLogs(prev => [log, ...prev.slice(0, 49)]); // Keep last 50
    });

    // Payment updates
    monitor.on('payment_update', (payment: any) => {
      console.log('💳 Payment update:', payment);
    });

    // Error alerts
    monitor.on('error_alert', (error: any) => {
      console.error('❌ Error alert:', error);
    });

    // User activity
    monitor.on('user_activity', (activity: any) => {
      console.log('👤 User activity:', activity);
    });

    // Transaction logs response
    monitor.on('transaction_logs', (data: any) => {
      console.log('📋 Got transaction logs:', data);
      setTransactionLogs(data.logs || []);
    });

    // Transaction details response
    monitor.on('transaction_details', (data: any) => {
      console.log('📄 Got transaction details:', data);
      setTransactionDetails(data.logs || []);
    });

    // Stats response
    monitor.on('stats', (data: Stats) => {
      console.log('📊 Got stats:', data);
      setStats(data);
    });

    // Error response
    monitor.on('error', (error: any) => {
      console.error('❌ Admin error:', error);
    });

    // Connect setelah semua event handler siap
    monitor.connectAsAdmin()
      .then(() => {
        setIsConnected(true);
        console.log('🔌 Admin connected successfully');
      })
      .catch(err => {
        console.error('❌ Failed to connect:', err);
        setIsConnected(false);
      });

    return () => {
      monitor.disconnect();
    };
  }, []);

  const handleGetTransactionDetails = useCallback((orderId: string) => {
    if (adminMonitor && orderId) {
      adminMonitor.getTransactionDetails(orderId);
      setSelectedTransaction(orderId);
    }
  }, [adminMonitor]);

  const handleRefreshLogs = useCallback(() => {
    if (adminMonitor) {
      adminMonitor.getLogs();
    }
  }, [adminMonitor]);

  const handleRefreshStats = useCallback(() => {
    if (adminMonitor) {
      adminMonitor.getStats();
    }
  }, [adminMonitor]);

  // Loading state
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Connecting to admin panel...</p>
        </div>
      </div>
    );
  }

  // Authentication state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <p>Authenticating admin...</p>
          <p className="text-sm text-gray-400 mt-2">
            Connected: {isConnected ? '✅' : '❌'} | 
            Authenticated: {isAuthenticated ? '✅' : '❌'}
          </p>
          
        
          {/* Debug Info */}
          <div className="mt-4 text-xs text-gray-500">
            <p>Socket Status: {adminMonitor?.getStatus().connected ? 'Connected' : 'Disconnected'}</p>
            <p>Socket ID: {adminMonitor?.getStatus().socketId || 'None'}</p>
            <p>Admin ID: {adminMonitor?.getStatus().adminId || 'None'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Rest of your component JSX goes here...
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Status indicator */}
        <div className="mb-4 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-4">
            <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>Connected: {isConnected ? '✅' : '❌'}</span>
            <span>Authenticated: {isAuthenticated ? '✅' : '❌'}</span>
          </div>
        </div>

        {/* Your dashboard content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stats */}
          {stats && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Statistics</h2>
              <div className="space-y-2">
                <p>Today's Transactions: {stats.todayTransactions || 0}</p>
                <p>Success Transactions: {stats.successTransactions || 0}</p>
                <p>Connected Admins: {stats.connectedAdmins || 0}</p>
              </div>
            </div>
          )}

          {/* Transaction Logs */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {transactionLogs.map((log, index) => (
                <div key={index} className="p-3 bg-gray-700 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm">{log.orderId}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      log.status === 'SUCCESS' ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex space-x-4">
          <button
            onClick={handleRefreshLogs}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            Refresh Logs
          </button>
          <button
            onClick={handleRefreshStats}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
          >
            Refresh Stats
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard