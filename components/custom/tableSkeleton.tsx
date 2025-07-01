import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
    limit: string | number;
    colSpan?: number; // Jumlah kolom untuk skeleton
}

export function TableSkeleton({ limit, colSpan = 6 }: TableSkeletonProps) {
    const rows = Array.from({ length: parseInt(limit.toString()) }, (_, i) => i);

    return (
        <>
            {rows.map((row) => (
                <TableRow key={row}>
                    {Array.from({ length: colSpan }, (_, colIndex) => (
                        <TableCell key={colIndex}>
                            <Skeleton className="h-4 w-full" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
}