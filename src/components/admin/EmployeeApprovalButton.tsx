import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Check, X } from "lucide-react"

interface EmployeeApprovalButtonProps {
  id: string
  name: string
}

export function EmployeeApprovalButton({ id, name }: EmployeeApprovalButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const handleApproveOvertime = async () => {
    try {
      // First, approve the overtime request
      const { error: approvalError } = await supabase
        .from('clock_events')
        .update({ approval_status: 'approved' })
        .eq('employee_id', id)
        .eq('event_type', 'ot')
        .eq('is_overtime', true)
        .eq('approval_status', 'pending')

      if (approvalError) throw approvalError

      // Then, create a clock-in event
      const { error: clockInError } = await supabase
        .from('clock_events')
        .insert([{
          employee_id: id,
          event_type: 'in',
          is_overtime: true
        }])

      if (clockInError) throw clockInError

      await queryClient.invalidateQueries({ queryKey: ['pendingApproval', id] })
      await queryClient.invalidateQueries({ queryKey: ['clock_events'] })

      toast({
        title: "Overtime Approved",
        description: "The overtime request has been approved and employee has been clocked in.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve overtime request.",
      })
    }
  }

  const handleRejectOvertime = async () => {
    try {
      const { error } = await supabase
        .from('clock_events')
        .update({ approval_status: 'rejected' })
        .eq('employee_id', id)
        .eq('event_type', 'ot')
        .eq('is_overtime', true)
        .eq('approval_status', 'pending')

      if (error) throw error

      await queryClient.invalidateQueries({ queryKey: ['pendingApproval', id] })
      await queryClient.invalidateQueries({ queryKey: ['clock_events'] })

      toast({
        title: "Overtime Rejected",
        description: "The overtime request has been rejected.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject overtime request.",
      })
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-orange-500 border-orange-500 hover:bg-orange-50 animate-pulse h-7 text-xs px-2"
      >
        Pending OT
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Overtime Request</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to approve or reject the overtime request for {name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#FDE1D3]/40 hover:bg-[#FDE1D3]/60 text-red-500 border-none"
              onClick={() => {
                handleRejectOvertime()
                setIsOpen(false)
              }}
            >
              <X className="h-4 w-4" />
            </AlertDialogAction>
            <AlertDialogAction
              className="bg-[#F2FCE2]/40 hover:bg-[#F2FCE2]/60 text-green-500 border-none"
              onClick={() => {
                handleApproveOvertime()
                setIsOpen(false)
              }}
            >
              <Check className="h-4 w-4" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}