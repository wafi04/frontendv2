import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsTransactions() {
    return (
        <section>

            <Card className="border-primary hover:border-primary/80 transition-colors">
                <CardHeader>
                    <CardTitle className="text-primary">Transaction Analytics</CardTitle>
                    <CardDescription className="text-muted-foreground">Detailed analysis of transaction data</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] flex items-center justify-center border rounded-lg bg-secondary">
                        <p className="text-muted-foreground">Analytics visualization will appear here</p>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}