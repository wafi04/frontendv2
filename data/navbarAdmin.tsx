import {
  ClipboardList,
  LayoutDashboard,
  Package,
  PackageSearch,
  Settings,
  ShoppingCart,
  Users,
  Wallet,
} from "lucide-react";

export interface NavItem {
  nama: string;
  path?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}
export const dataNavAdmin: NavItem[] = [
  {
    nama: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    nama: "Transactions",
    icon: <ShoppingCart className="h-5 w-5" />,
    children: [
      {
        nama: "All Transactions",
        path: "/dashboard/transactions",
      },
      {
        nama: "Manual Transactions",
        path: "/dashboard/manual-transactions",
      },
    ],
  },
  {
    nama: "Member",
    icon: <Users className="h-5 w-5" />,
    children: [
      {
        nama: "Member Deposit",
        path: "/dashboard/user-deposit",
      },
      {
        nama: "Kelola Member",
        path: "/dashboard/member",
      },
    ],
  },
  {
    nama: "Produk",
    icon: <Package className="h-5 w-5" />,
    children: [
      {
        nama: "Category",
        path: "/dashboard/category",
      },
      {
        nama: "Sub - Category",
        path: "/dashboard/sub-category",
      },
      {
        nama: "Services",
        path: "/dashboard/service",
      },
      {
        nama: "Voucher",
        path: "/dashboard/voucher",
      },
    ],
  },
  {
    nama: "Tracking",
    path: "/dashboard/tracking",
    icon: <PackageSearch className="size-4" />,
  },
  {
    nama: "Metode",
    path: "/dashboard/methode",
    icon: <Wallet className="size-4" />,
  },

  {
    nama: "General",
    path: "/dashboard/general",
    icon: <Settings className="h-5 w-5" />,
  },
];
