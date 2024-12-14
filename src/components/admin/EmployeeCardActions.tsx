import { Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocation } from "react-router-dom"
import { useState } from "react"
import { EditEmployeeDialog } from "./EditEmployeeDialog"
import { DeleteEmployeeDialog } from "./DeleteEmployeeDialog"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { EmployeeApprovalButton } from "./EmployeeApprovalButton"

interface EmployeeCardActionsProps {
  id: string
  name: string
  code: string
  hourlyRate: number
  avatarUrl?: string | null
  timeIn: string
  timeOut: string
}

export function EmployeeCardActions({ 
  id, 
  name, 
  code, 
  hourlyRate,
  avatarUrl,
  timeIn,
  timeOut,
}: EmployeeCardActionsProps) {
  const location = useLocation()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Query to check if employee has any pending overtime requests
  const { data: hasPendingApproval } = useQuery({
    queryKey: ['pendingApproval', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clock_events')
        .select()
        .eq('employee_id', id)
        .eq('event_type', 'ot')
        .eq('is_overtime', true)
        .eq('approval_status', 'pending')

      if (error) {
        console.error('Error checking pending approval:', error)
        return false
      }
      
      return data && data.length > 0
    },
    retry: false
  })

  // Don't render anything if we're on the employee route
  if (location.pathname === '/employee') {
    return null
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 hover:bg-transparent"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 hover:bg-transparent text-destructive hover:text-destructive"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      {hasPendingApproval && (
        <EmployeeApprovalButton id={id} name={name} />
      )}

      <EditEmployeeDialog
        id={id}
        initialName={name}
        initialCode={code}
        initialHourlyRate={hourlyRate}
        initialAvatarUrl={avatarUrl}
        initialTimeIn={timeIn}
        initialTimeOut={timeOut}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <DeleteEmployeeDialog
        id={id}
        name={name}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </div>
  )
}