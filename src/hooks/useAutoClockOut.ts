import { useEffect } from "react"
import { parse, isAfter, set } from "date-fns"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { calculateEmployeeHours } from "@/utils/timeCalculations"

interface Employee {
  id: string
  name: string
  code: string
  hourly_rate: number
  avatar_url: string | null
  time_in: string
  time_out: string
}

interface ClockEvent {
  id: string
  employee_id: string
  event_type: 'in' | 'out'
  created_at: string
}

export function useAutoClockOut(
  employee: Employee | null,
  latestEvent: ClockEvent | null,
  setLatestEvent: (event: ClockEvent) => void,
  setClockEvents: (events: ClockEvent[]) => void,
  setEmployeeHours: (hours: any) => void
) {
  const { toast } = useToast()

  useEffect(() => {
    if (!employee || !latestEvent || latestEvent.event_type !== 'in') return

    const checkAutoClockOut = async () => {
      const now = new Date()
      const scheduleEnd = parse(employee.time_out, 'HH:mm:ss', new Date())
      
      const endTime = set(new Date(), {
        hours: scheduleEnd.getHours(),
        minutes: scheduleEnd.getMinutes(),
        seconds: scheduleEnd.getSeconds()
      })

      if (isAfter(now, endTime)) {
        try {
          const { data: newEvent, error } = await supabase
            .from('clock_events')
            .insert([{
              employee_id: employee.id,
              event_type: 'out',
              location: 'Auto clock-out'
            }])
            .select()
            .single()

          if (error) throw error

          setLatestEvent(newEvent as ClockEvent)
          
          const { data: updatedEvents } = await supabase
            .from('clock_events')
            .select('*')
            .eq('employee_id', employee.id)
            .order('created_at', { ascending: false })

          setClockEvents(updatedEvents as ClockEvent[] || [])
          
          if (updatedEvents) {
            const hours = await calculateEmployeeHours(employee, updatedEvents as ClockEvent[])
            setEmployeeHours(hours)
          }

          toast({
            title: "Automatic Clock Out",
            description: "You have been automatically clocked out as your shift has ended.",
          })
        } catch (error) {
          console.error('Error during auto clock-out:', error)
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to process automatic clock out",
          })
        }
      }
    }

    // Check immediately and then every minute
    checkAutoClockOut()
    const interval = setInterval(checkAutoClockOut, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [employee, latestEvent, toast, setLatestEvent, setClockEvents, setEmployeeHours])
}