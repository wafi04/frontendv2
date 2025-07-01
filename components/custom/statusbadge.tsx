import { Badge } from "../ui/badge";

export const getStatusBadge = (status: string) => {
  return status === "active" ? (
    <Badge
      variant="outline"
      className="bg-green-100 text-green-800 border-green-200"
    >
      Active
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
      Inactive
    </Badge>
  );
};
