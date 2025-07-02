"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Users, CreditCard, AlertTriangle, Monitor, Search } from 'lucide-react';
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
    const monitor = new AdminTransactionMonitor('http://localhost:3003', 'admin-001');
    setAdminMonitor(monitor);

    // Setup event handlers
    monitor.on('admin_authenticated', (data: any) => {
      setIsAuthenticated(true);
      console.log('✅ Admin authenticated:', data);

      // Get initial data
      monitor.getLogs();
      monitor.getStats();
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

    // Connect
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Transaction Monitor</h1>
        <p className="text-gray-400">Real-time monitoring dashboard</p>
        <div className="mt-2 text-sm text-green-400">
          ✅ Connected & Authenticated
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Today's Transactions</p>
                <p className="text-2xl font-bold">{stats.todayTransactions}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Successful Transactions</p>
                <p className="text-2xl font-bold">{stats.successTransactions}</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Connected Admins</p>
                <p className="text-2xl font-bold">{stats.connectedAdmins}</p>
              </div>
              <Monitor className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={handleRefreshLogs}
              className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
            >
              Refresh Transaction Logs
            </button>
            <button
              onClick={handleRefreshStats}
              className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors"
            >
              Refresh Statistics
            </button>
            <button
              onClick={() => adminMonitor?.ping()}
              className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition-colors"
            >
              Test Connection (Ping)
            </button>
          </div>
        </div>

        {/* Transaction Search */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Transaction Search</h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Order ID"
                className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleGetTransactionDetails(e.currentTarget.value);
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Enter Order ID"]') as HTMLInputElement;
                  if (input && input.value) {
                    handleGetTransactionDetails(input.value);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>

            {selectedTransaction && (
              <div className="text-sm text-gray-400">
                Searching for: <span className="text-white">{selectedTransaction}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      {transactionDetails.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Transaction Details: {selectedTransaction}
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {transactionDetails.map((detail, index) => (
              <div key={index} className="bg-gray-700 p-3 rounded">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div><span className="text-gray-400">Type:</span> {detail.transactionType}</div>
                  <div><span className="text-gray-400">Status:</span> {detail.status}</div>
                  <div><span className="text-gray-400">Time:</span> {new Date(detail.timestamp).toLocaleString()}</div>
                  {detail.amount && (
                    <div><span className="text-gray-400">Amount:</span> Rp {detail.amount.toLocaleString()}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-time Transaction Logs */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Real-time Transaction Logs</h3>
          <div className="text-sm text-gray-400">
            {transactionLogs.length} transactions
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactionLogs.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No transaction logs yet...</p>
              <p className="text-gray-500 text-sm">Waiting for real-time updates...</p>
            </div>
          ) : (
            transactionLogs.map((log, index) => (
              <div
                key={`${log.orderId}-${index}`}
                className="bg-gray-700 p-4 rounded border-l-4 border-blue-500 hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => handleGetTransactionDetails(log.orderId)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono bg-gray-600 px-2 py-1 rounded">
                      {log.orderId}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${log.status === 'SUCCESS' ? 'bg-green-600' :
                        log.status === 'FAILED' ? 'bg-red-600' :
                          log.status === 'PENDING' ? 'bg-yellow-600' :
                            'bg-gray-600'
                      }`}>
                      {log.status}
                    </span>
                    <span className="text-xs px-2 py-1 bg-purple-600 rounded">
                      {log.transactionType}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-300">
                  {log.userId && (
                    <div>
                      <span className="text-gray-400">User:</span> {log.userId}
                    </div>
                  )}
                  {log.amount && (
                    <div>
                      <span className="text-gray-400">Amount:</span> Rp {log.amount.toLocaleString()}
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400">Time:</span> {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                  {log.error && (
                    <div className="col-span-full">
                      <span className="text-red-400">Error:</span> {log.error}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
