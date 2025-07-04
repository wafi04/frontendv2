"use client";

import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Download, 
  Eye, 
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Filter,
  X
} from 'lucide-react';
import { useGetLogs } from './server/server';
import { HeaderDashboard } from '@/components/layouts/headerDashboard';
import { formatDate, FormatPrice } from '@/utils/format';

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Build filters object
  const filters = useMemo(() => {
    const filterObj: any = {
      page: currentPage,
      limit: 50,
    };

    if (searchTerm) filterObj.search = searchTerm;
    if (statusFilter !== 'all') filterObj.status = statusFilter;
    if (transactionTypeFilter !== 'all') filterObj.transactionType = transactionTypeFilter;
    if (paymentMethodFilter !== 'all') filterObj.paymentMethod = paymentMethodFilter;
    if (dateFrom) filterObj.dateFrom = dateFrom;
    if (dateTo) filterObj.dateTo = dateTo;


    return filterObj;
  }, [
    searchTerm,
    statusFilter,
    transactionTypeFilter,
    paymentMethodFilter,
    dateFrom,
    dateTo,
    amountMin,
    amountMax,
    currentPage,
  ]);

  const logs = useGetLogs(filters);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SUCCESS: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      FAILED: { color: 'bg-red-100 text-red-800', icon: XCircle },
      STARTED: { color: 'bg-blue-100 text-blue-800', icon: AlertTriangle },
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: AlertTriangle };
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getTransactionTypeBadge = (type: string) => {
    const typeConfig = {
      PURCHASE: { color: 'bg-blue-100 text-blue-800' },
      REFUND: { color: 'bg-orange-100 text-orange-800' },
      TOPUP: { color: 'bg-green-100 text-green-800' },
      WITHDRAWAL: { color: 'bg-red-100 text-red-800' },
    };

    const config = typeConfig[type] || { color: 'bg-gray-100 text-gray-800' };

    return (
      <Badge className={`${config.color} border-0`}>
        {type}
      </Badge>
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTransactionTypeFilter('all');
    setPaymentMethodFilter('all');
    setDateFrom('');
    setDateTo('');
    setAmountMin('');
    setAmountMax('');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || transactionTypeFilter !== 'all' || 
                          paymentMethodFilter !== 'all' || dateFrom || dateTo || amountMin || amountMax;

  if (logs.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HeaderDashboard title="Logs Transaction" desc="Manage Logs Transactions" />
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction Logs</CardTitle>
          <CardDescription>Search and filter transaction logs</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Basic Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Order ID, User ID, Position, or Product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="STARTED">Started</SelectItem>
              </SelectContent>
            </Select>


                  <div>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>

                  <div>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>

                  

           

            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="w-full sm:w-auto">
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

         

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">Active Filters:</span>
                {searchTerm && (
                  <Badge variant="secondary">Search: {searchTerm}</Badge>
                )}
                {statusFilter !== 'all' && (
                  <Badge variant="secondary">Status: {statusFilter}</Badge>
                )}
                {transactionTypeFilter !== 'all' && (
                  <Badge variant="secondary">Type: {transactionTypeFilter}</Badge>
                )}
                {paymentMethodFilter !== 'all' && (
                  <Badge variant="secondary">Payment: {paymentMethodFilter}</Badge>
                )}
                {dateFrom && (
                  <Badge variant="secondary">From: {dateFrom}</Badge>
                )}
                {dateTo && (
                  <Badge variant="secondary">To: {dateTo}</Badge>
                )}
                {amountMin && (
                  <Badge variant="secondary">Min: {FormatPrice(parseFloat(amountMin))}</Badge>
                )}
                {amountMax && (
                  <Badge variant="secondary">Max: {FormatPrice(parseFloat(amountMax))}</Badge>
                )}
              </div>
            </div>
          )}

          {/* Results Summary */}
          {logs.pagination && (
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {logs.data?.length || 0} of {logs.pagination.total} results
              {logs.pagination.totalPages > 1 && (
                <span> (Page {logs.pagination.currentPage} of {logs.pagination.totalPages})</span>
              )}
            </div>
          )}

          {/* Logs Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Order ID</TableHead>
                  <TableHead className="w-[100px]">User ID</TableHead>
                  <TableHead className="w-[120px]">Product</TableHead>
                  <TableHead className="w-[100px]">Amount</TableHead>
                  <TableHead className="w-[80px]">Status</TableHead>
                  <TableHead className="w-[80px]">Type</TableHead>
                  <TableHead className="w-[140px]">Time</TableHead>
                  <TableHead className="w-[80px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.data && logs.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No logs found matching your search criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.data?.map((log) => (
                    <TableRow key={log._id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="truncate max-w-[120px]" title={log.orderId}>
                          {log.orderId}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="truncate max-w-[100px]" title={log.userId}>
                          {log.userId}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="truncate max-w-[120px]" title={log.data.productName || '-'}>
                          {log.data.productName || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-green-600">
                          {log.data.finalAmount ? FormatPrice(log.data.finalAmount) : '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(log.status)}
                      </TableCell>
                      <TableCell>
                        {getTransactionTypeBadge(log.transactionType)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm" title={formatDate(log.timestamp)}>
                          {formatDate(log.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {logs.pagination && logs.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {logs.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === logs.pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Log Details</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLog(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Order ID</label>
                  <p className="font-medium">{selectedLog.orderId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User ID</label>
                  <p className="font-medium">{selectedLog.userId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <div className="mt-1">
                    {getTransactionTypeBadge(selectedLog.transactionType)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedLog.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                  <p className="font-medium">{formatDate(selectedLog.timestamp)}</p>
                </div>
                {selectedLog.data.paymentMethod && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                    <p className="font-medium">{selectedLog.data.paymentMethod}</p>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Data Details</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap break-all">
                    {JSON.stringify(selectedLog.data, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}