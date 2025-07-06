"use client"

import { HeaderDashboard } from "@/components/layouts/headerDashboard"
import { useGetAllMemberWithSession } from "./server/route"
import { Pagination } from "@/components/custom/pagination"
import { useFilter } from "@/hooks/usefilter"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, X, Eye, Edit, Trash2, AlertCircle, Loader2, Plus } from "lucide-react"
import { formatDate, FormatPrice } from "@/utils/format"
import { TableSkeleton } from "@/components/custom/tableSkeleton"
import { useState } from "react"
import { DialogUpdateUser } from "./_components/dialog"
import { UserResponse, UserWithSession } from "@/types/auth"
import { MemberDetailSheet } from "./_components/memberDetails"

export default function Page() {
  const { search, currentPage, limit, setSearch, setCurrentPage, setLimit, resetFilter } = useFilter("member")

  const { data, isLoading, isDebouncing } = useGetAllMemberWithSession({
    filters: {
      limit,
      page: currentPage.toString(),
      search,
    },
  })

  // State untuk dialog
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    mode: 'create' | 'update'
    initialData?: {
      username: string
      balance: number
      name: string
      role: string
    }
  }>({
    isOpen: false,
    mode: 'create'
  })

  // State untuk member detail sheet
  const [memberDetailState, setMemberDetailState] = useState<{
    isOpen: boolean
    selectedMember: UserWithSession | null
  }>({
    isOpen: false,
    selectedMember: null
  })

  const handleSearch = (value: string) => {
    setSearch(value)
  }

  const getActiveSessionsCount = (sessions: any[]) => {
    const now = new Date()
    return sessions.filter((session) => new Date(session.expires) > now).length
  }

  // Handler untuk membuka dialog update
  const handleOpenUpdate = (member: UserResponse) => {
    setDialogState({
      isOpen: true,
      mode: 'update',
      initialData: {
        name: member.name,
        username: member.username,
        balance: member.balance ?? 0,
        role: member.role
      }
    })
  }

  // Handler untuk membuka member detail
  const handleOpenMemberDetail = (member: UserWithSession) => {
    setMemberDetailState({
      isOpen: true,
      selectedMember: member
    })
  }

  // Handler untuk menutup member detail
  const handleCloseMemberDetail = () => {
    setMemberDetailState({
      isOpen: false,
      selectedMember: null
    })
  }

  if (isLoading && !data) {
    return (
      <>
        <HeaderDashboard title="Manage Member" desc="Manage All Member">
          <div className="flex gap-4 items-center">
            <div className="relative w-64">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </HeaderDashboard>
        <Card>
          <CardContent>
            <TableSkeleton limit={10} colSpan={7} />
          </CardContent>
        </Card>
      </>
    )
  }



  return (
    <>
      <div className="space-y-6">
        <HeaderDashboard title="Manage Member" desc="Manage All Member">
          <div className="flex gap-4 items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search member..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-10"
              />
              {/* Loading indicator saat debouncing */}
              {isDebouncing && (
                <Loader2 className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
              {search && !isDebouncing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSearch("")}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </HeaderDashboard>

        {/* Show loading overlay saat ada data tapi sedang fetch ulang */}
        <div className="relative">
          {isLoading && data && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}

          {data?.data?.data.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium text-muted-foreground">Member Tidak Ada</p>
                  {search && <p className="text-sm text-muted-foreground">Coba Gunakan Search Yang Lebih Optimal</p>}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sessions</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data?.data?.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div>
                              <div className="font-medium">{member.name || member.username}</div>
                              <div className="text-sm text-muted-foreground">{member.username}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={member.isOnline ? "default" : "secondary"}
                            className={member.isOnline ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                          >
                            {member.isOnline ? "Online" : "Offline"}
                          </Badge>
                          <Badge
                            variant={member.role === "admin" ? "default" : "outline"}
                            className={
                              member.role === "admin" ? "bg-purple-100 text-purple-800 hover:bg-purple-100" : ""
                            }
                          >
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex items-center gap-2">
                          <span className="font-medium">{getActiveSessionsCount(member.session)}</span>
                          <span className="text-muted-foreground">/ {member.session?.length || 0}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{FormatPrice(member.balance ?? 0)}</span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {member.lastActiveAt ? formatDate(member.lastActiveAt) : "Never"}
                        </TableCell>
                        <TableCell className="text-right flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenMemberDetail(member)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenUpdate(member)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        {data?.data?.meta && (
          <Pagination
            currentPage={data.data.meta.currentPage}
            totalPages={data.data.meta.totalPages}
            hasNextPage={data.data.meta.hasNextPage}
            hasPrevPage={data.data.meta.hasPrevPage}
            totalItems={data.data.meta.totalItems}
            itemsPerPage={data.data.meta.itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Dialog Update User */}
      <DialogUpdateUser
        open={dialogState.isOpen}
        setOpen={(open) => setDialogState(prev => ({ ...prev, isOpen: open }))}
        initialData={dialogState.initialData}
      />

      {/* Member Detail Sheet */}
      <MemberDetailSheet
        member={memberDetailState.selectedMember}
        open={memberDetailState.isOpen}
        onOpenChange={handleCloseMemberDetail}
      />
    </>
  )
}