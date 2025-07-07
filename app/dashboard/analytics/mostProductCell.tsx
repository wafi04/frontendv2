import { MostProductCell } from "@/types/transactions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, ShoppingCart, DollarSign, Star, Package } from "lucide-react";

export function MostProductCellComponent({ productData }: { productData: MostProductCell[] }) {
    console.log(productData);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

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
            <div className="container mx-auto p-6">
                <Card className="text-center py-12">
                    <CardContent className="pt-6">
                        <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <CardTitle className="mb-2">No Product Data Available</CardTitle>
                        <CardDescription>Add some products to see analytics here.</CardDescription>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">


            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productData.map((product, index) => {
                    const profitMargin = ((product.total_profit / product.total_amount) * 100);
                    const isTopPerformer = product === topPerformer;

                    return (
                        <Card
                            key={`${product.product_name}-${index}`}
                            className={`hover:shadow-lg transition-shadow duration-300 ${isTopPerformer ? 'ring-2 ring-amber-400' : ''
                                }`}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg mb-1">{product.product_name}</CardTitle>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="outline">#{index + 1}</Badge>
                                            {isTopPerformer && (
                                                <Badge className="bg-amber-100 text-amber-800">
                                                    Top Performer
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span className="text-primary font-semibold">
                                            {product.product_name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Financial Metrics */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-1">
                                            <TrendingUp className="h-3 w-3 text-green-600" />
                                            <span className="text-xs text-muted-foreground">Total Profit</span>
                                        </div>
                                        <div className="text-lg font-bold text-green-600">
                                            {formatCurrency(product.total_profit)}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-1">
                                            <DollarSign className="h-3 w-3 text-blue-600" />
                                            <span className="text-xs text-muted-foreground">Revenue</span>
                                        </div>
                                        <div className="text-lg font-bold text-blue-600">
                                            {formatCurrency(product.total_amount)}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center space-x-1">
                                        <DollarSign className="h-3 w-3 text-purple-600" />
                                        <span className="text-xs text-muted-foreground">Average per Transaction</span>
                                    </div>
                                    <div className="text-lg font-bold text-purple-600">
                                        {formatCurrency(product.average_amount)}
                                    </div>
                                </div>

                                {/* Activity Metrics */}
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center space-x-1 mb-1">
                                            <ShoppingCart className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Transactions</span>
                                        </div>
                                        <div className="text-xl font-bold">
                                            {formatNumber(product.transaction_count)}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center space-x-1 mb-1">
                                            <Users className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Unique Users</span>
                                        </div>
                                        <div className="text-xl font-bold">
                                            {formatNumber(product.unique_users)}
                                        </div>
                                    </div>
                                </div>

                                {/* Profit Margin */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Profit Margin</span>
                                        <span className="font-medium">{profitMargin.toFixed(1)}%</span>
                                    </div>
                                    <Progress value={Math.min(profitMargin, 100)} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Summary Stats */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Summary Statistics</CardTitle>
                    <CardDescription>Overall performance across all products</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center space-y-2">
                            <div className="mx-auto w-fit p-2 bg-blue-100 rounded-full">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                                {productData.length}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Products</div>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="mx-auto w-fit p-2 bg-green-100 rounded-full">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(productData.reduce((sum, p) => sum + p.total_profit, 0))}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Profit</div>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="mx-auto w-fit p-2 bg-purple-100 rounded-full">
                                <ShoppingCart className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="text-2xl font-bold text-purple-600">
                                {formatNumber(productData.reduce((sum, p) => sum + p.transaction_count, 0))}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Transactions</div>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="mx-auto w-fit p-2 bg-orange-100 rounded-full">
                                <Users className="h-6 w-6 text-orange-600" />
                            </div>
                            <div className="text-2xl font-bold text-orange-600">
                                {formatNumber(productData.reduce((sum, p) => sum + p.unique_users, 0))}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Users</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}