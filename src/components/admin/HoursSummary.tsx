import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useEffect } from "react"
import { EmployeeHoursCard } from "./EmployeeHoursCard"
import { calculateEmployeeHours, type EmployeeHours } from "@/utils/timeCalculations"

// Type guard to validate event_type
function isValidEventType(eventType: string): eventType is 'in' | 'out' | 'ot' {
  return eventType === 'in' || eventType === 'out' || eventType === 'ot'
}

interface ClockEvent {
  id: string
  employee_id: string
  event_type: 'in' | 'out' | 'ot'
  created_at: string
  photo_url: string | null
  is_overtime?: boolean
  approval_status?: string
}

interface Employee {
  id: string
  name: string
  hourly_rate: number
  overtime_rate?: number
}

export function HoursSummary() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('clock_events_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clock_events'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['allClockEvents'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  const { data: employeeHours } = useQuery({
    queryKey: ['allClockEvents'],
    queryFn: async () => {
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select('id, name, hourly_rate, overtime_rate')

      if (employeesError) throw employeesError
      if (!employees) return []

      const employeeHours: EmployeeHours[] = await Promise.all(
        employees.map(async (employee) => {
          const { data: events, error: eventsError } = await supabase
            .from('clock_events')
            .select('*')
            .eq('employee_id', employee.id)
            .order('created_at', { ascending: true })

          if (eventsError) throw eventsError
          if (!events) return {
            employee_id: employee.id,
            employee_name: employee.name,
            total_hours: 0,
            total_minutes: 0,
            hourly_rate: employee.hourly_rate || 0,
            overtime_rate: employee.overtime_rate || 1.25,
            regular_earnings: 0,
            overtime_earnings: 0,
            total_earnings: 0
          }

          // Filter and transform events to ensure they have valid event_type
          const validEvents = events
            .filter((event): event is (typeof event & { event_type: 'in' | 'out' | 'ot' }) => 
              isValidEventType(event.event_type)
            )
            .map(event => ({
              id: event.id,
              employee_id: event.employee_id,
              event_type: event.event_type,
              created_at: event.created_at,
              is_overtime: event.is_overtime,
              approval_status: event.approval_status
            }))

          return calculateEmployeeHours(employee, validEvents)
        })
      )

      return employeeHours
    }
  })

  if (!employeeHours) return null

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
      {employeeHours.map((employee) => (
        <EmployeeHoursCard key={employee.employee_id} employee={employee} />
      ))}
    </div>
  )
}