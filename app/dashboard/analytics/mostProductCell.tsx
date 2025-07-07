import { MostProductCell } from "@/types/transactions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Crown } from "lucide-react";
import { FormatPrice } from "@/utils/format";

export function MostProductCellComponent({ productData }: { productData: MostProductCell[] }) {


    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    const getTopPerformer = () => {
        if (!productData || productData.length === 0) return null;
        return productData.reduce((max, product) =>
            product.total_profit > max.total_profit ? product : max
        );
    };

    const topPerformer = getTopPerformer();

    if (!productData || productData.length === 0) {
        return (
            <div>
                <Card className="text-center py-12">
                    <CardContent className="pt-6">
                        <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <CardTitle className="mb-2">Tidak ada Transaksi</CardTitle>
                        <CardDescription>Transactions Tidak ada.</CardDescription>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-3 font-semibold">Rank</th>
                                    <th className="text-left p-3 font-semibold">Product Name</th>
                                    <th className="text-right p-3 font-semibold">Total Profit</th>
                                    <th className="text-right p-3 font-semibold">Pendapatan</th>
                                    <th className="text-right p-3 font-semibold">Rata - rata</th>
                                    <th className="text-right p-3 font-semibold">Transactions</th>
                                    <th className="text-right p-3 font-semibold">User</th>
                                    <th className="text-right p-3 font-semibold">Profit Margin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productData.map((product, index) => {
                                    const profitMargin = ((product.total_profit / product.total_amount) * 100);
                                    const isTopPerformer = product === topPerformer;

                                    return (
                                        <tr
                                            key={`${product.product_name}-${index}`}
                                            className={`border-b transition-colors ${isTopPerformer ? 'bg-blue-900' : ''
                                                }`}
                                        >
                                            <td className="p-3">
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant="outline">#{index + 1}</Badge>
                                                    {isTopPerformer && (
                                                        <Crown className="h-4 w-4 text-amber-500" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                        <span className="text-primary font-semibold text-sm">
                                                            {product.product_name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{product.product_name}</div>
                                                        {isTopPerformer && (
                                                            <Badge className="bg-amber-100 text-amber-800 text-xs mt-1">
                                                                Top Performer
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="font-bold text-green-600">
                                                    {FormatPrice(product.total_profit)}
                                                </div>
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="font-bold text-blue-600">
                                                    {FormatPrice(product.total_amount)}
                                                </div>
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="font-bold text-purple-600">
                                                    {FormatPrice(product.average_amount)}
                                                </div>
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="font-bold">
                                                    {formatNumber(product.transaction_count)}
                                                </div>
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="font-bold">
                                                    {formatNumber(product.unique_users)}
                                                </div>
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <div className="font-medium">
                                                        {profitMargin.toFixed(1)}%
                                                    </div>
                                                    <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-green-500 transition-all duration-300"
                                                            style={{ width: `${Math.min(profitMargin, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}