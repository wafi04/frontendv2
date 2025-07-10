import { Transaction } from "@/types/transactions";
import { formatDate } from "@/utils/format";
import * as XLSX from 'xlsx'
export type User = {
  id: number;
  username: string;
  name: string;
  role: "platinum" | "gold" | "silver" | string; 
  balance: number;
  isOnline: boolean;
  lastActiveAt: string | null;     
  lastPaymentAt: string | null;    
  createdAt: string;               
};
export type Deposit = {
  id: number;
  depositId: string;
  username: string;
  amount: number;
  method: string;
  paymentReference: string;
  status: "SUCCESS" | "PENDING" | "FAILED"; // tambahkan status lain jika ada
  log: string;
  createdAt: string;   // ISO format
  updatedAt: string;   // ISO format
};
export class ExportData {
    exportTransaction(data : Transaction[],name : string) {
         if (!data || data.length === 0) {
            alert("No data to export")
            return
        }


        const excelData = data.map((transaction, index) => ({
            No: transaction.id,
            'Order ID': transaction.orderId || '',
            'Username': transaction.username || '-',
            'Service Name': transaction.serviceName || '',
            'Price': transaction.price || 0,
            'Profit': transaction.profitAmount || 0,
            'Fee': transaction.payment.feeAmount || 0,
            'Total': transaction.payment.totalAmount || 0,
            'Status': transaction.status || '',
            'Serial Number': transaction.serialNumber || '',
            'Payment Method': transaction.payment?.method || '',
            'Payment Status': transaction.payment?.status || '',
            'Transaksi Dibuat': formatDate(transaction.createdAt),
            'Transaksi Berakhir': formatDate(transaction.updatedAt),
        }))


        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.json_to_sheet(excelData)

        // Set column widths
        const colWidths = [
            { wch: 5 }, 
            { wch: 15 }, // Order ID
            { wch: 15 }, // Username
            { wch: 30 }, // Service Name
            { wch: 12 }, // Price
            { wch: 12 }, // Profit
            { wch: 12 }, // Status
            { wch: 20 }, // Serial Number
            { wch: 15 }, // Payment Method
            { wch: 15 }, // Payment Status
            { wch: 15 }, // Created At
            { wch: 15 }, // Created At
            { wch: 15 }, // Created At
            { wch: 15 }, // Created At
        ]
        ws['!cols'] = colWidths

        XLSX.utils.book_append_sheet(wb, ws,"Transaksi")

        // Download file
        const fileName = `${name}.xlsx`
        XLSX.writeFile(wb, fileName)
    }
     exportMember(data : User[],name : string) {
         if (!data || data.length === 0) {
            alert("No data to export")
            return
        }


        const excelData = data.map((user, index) => ({
            No: index + 1,
            'User ID': user.id,
            'Username': user.username || '-',
            'Name': user.name || '-',
            'Role': user.role || '-',
            'Balance': user.balance || 0,
            'Is Online': user.isOnline ? 'Yes' : 'No',
            'Last Active': user.lastActiveAt ? formatDate(user.lastActiveAt) : '-',
            'Last Payment': user.lastPaymentAt ? formatDate(user.lastPaymentAt) : '-',
            'Account Created': formatDate(user.createdAt),
            }));


        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.json_to_sheet(excelData)

        // Set column widths
        const colWidths = [
            { wch: 5 }, 
            { wch: 15 }, // Order ID
            { wch: 15 }, // Username
            { wch: 30 }, // Service Name
            { wch: 12 }, // Price
            { wch: 12 }, // Profit
            { wch: 12 }, // Status
            { wch: 20 }, // Serial Number
            { wch: 15 }, // Payment Method
            { wch: 15 }, // Payment Status
        ]
        ws['!cols'] = colWidths

        XLSX.utils.book_append_sheet(wb, ws,name)

        // Download file
        const fileName = `${name}.xlsx`
        XLSX.writeFile(wb, fileName)
     }
    exportDeposits(data: Deposit[], name: string) {
        if (!data || data.length === 0) {
            alert("No deposit data to export");
            return;
        }

        const excelData = data.map((deposit, index) => ({
            No: index + 1,
            'Deposit ID': deposit.depositId,
            'Username': deposit.username,
            'Amount': deposit.amount,
            'Method': deposit.method,
            'Payment Reference': deposit.paymentReference,
            'Status': deposit.status,
            'Log': deposit.log,
            'Created At': formatDate(deposit.createdAt),
            'Updated At': formatDate(deposit.updatedAt),
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);

        const colWidths = [
            { wch: 5 },   // No
            { wch: 15 },  // Deposit ID
            { wch: 15 },  // Username
            { wch: 12 },  // Amount
            { wch: 12 },  // Method
            { wch: 20 },  // Payment Reference
            { wch: 12 },  // Status
            { wch: 30 },  // Log
            { wch: 20 },  // Created At
            { wch: 20 },  // Updated At
        ];

        ws["!cols"] = colWidths;
        XLSX.utils.book_append_sheet(wb, ws,"deposit");

        const fileName = `${name}.xlsx`;
        XLSX.writeFile(wb, fileName);
    }
}