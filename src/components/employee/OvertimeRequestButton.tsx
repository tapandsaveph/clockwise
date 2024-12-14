import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { parse, isAfter, set } from "date-fns"

interface OvertimeRequestButtonProps {
  employeeId: string
  timeOut: string
  onOvertimeRequest?: () => void
}

export function OvertimeRequestButton({ 
  employeeId, 
  timeOut,
  onOvertimeRequest 
}: OvertimeRequestButtonProps) {
  const { toast } = useToast()

  const canRequestOvertime = () => {
    const now = new Date()
    const scheduleEnd = parse(timeOut, 'HH:mm:ss', new Date())
    
    const endTime = set(new Date(), {
      hours: scheduleEnd.getHours(),
      minutes: scheduleEnd.getMinutes(),
      seconds: scheduleEnd.getSeconds()
    })

    return isAfter(now, endTime)
  }

  const handleOvertimeRequest = async () => {
    if (!canRequestOvertime()) {
      toast({
        variant: "destructive",
        title: "Not Allowed",
        description: "You can only request overtime after your scheduled time out.",
      })
      return
    }

    try {
      const { error } = await supabase
        .from('clock_events')
        .insert([{
          employee_id: employeeId,
          event_type: 'ot',
          is_overtime: true
        }])

      if (error) throw error

      toast({
        title: "Overtime Request Sent",
        description: "Your supervisor will review your request shortly.",
      })

      if (onOvertimeRequest) {
        onOvertimeRequest()
      }
    } catch (error) {
      console.error('Error requesting overtime:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit overtime request. Please try again.",
      })
    }
  }

  return (
    <Button 
      variant="secondary" 
      onClick={handleOvertimeRequest}
      className="w-full"
      disabled={!canRequestOvertime()}
    >
      <Clock className="h-4 w-4 mr-2" />
      Request Overtime
    </Button>
  )
}