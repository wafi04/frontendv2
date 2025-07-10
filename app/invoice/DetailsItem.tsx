import { Button } from "@/components/ui/button"
import { Copy, Eye, EyeOff } from "lucide-react"
import { useCallback, useState } from "react"
import { toast } from "sonner"
import { DetailItemProps } from "./types"

export function DetailItem({ icon: Icon, label, value, description, copyable = false, sensitive = false }: DetailItemProps) {
  const [showSensitive, setShowSensitive] = useState(false)
  
  if (!value) return null
  
  const handleCopy = useCallback(async () => {
    if (!value) return
    
    try {
      await navigator.clipboard.writeText(value)
      toast.success("Berhasil disalin",{
          description: `${label} telaxh disalin ke clipboard`
      })
    } catch (error) {
      toast.error("Gagal Menyalin")
    }
  }, [value, label])
  
  const displayValue = sensitive && !showSensitive 
    ? value.replace(/./g, '•')
    : value
  
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border">
      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{displayValue}</p>
        <p className="text-xs text-muted-foreground">{description || label}</p>
      </div>
      <div className="flex items-center gap-1">
        {sensitive && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowSensitive(!showSensitive)}
            className="p-1 h-6 w-6"
          >
            {showSensitive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </Button>
        )}
        {copyable && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="p-1 h-6 w-6"
          >
            <Copy className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  )
}