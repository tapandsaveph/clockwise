import { useState, useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { EmployeeCard } from "./EmployeeCard"
import { EmployeeListHeader } from "./EmployeeListHeader"

interface Employee {
  id: string
  name: string
  code: string
  hourly_rate: number
  avatar_url?: string | null
  payment_qr_url?: string | null
  time_in: string
  time_out: string
}

interface ClockEvent {
  id: string
  employee_id: string
  event_type: 'in' | 'out' | 'ot'
  created_at: string
}

type FilterType = 'all' | 'in' | 'out'

export function EmployeeList() {
  const [showCodes, setShowCodes] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')
  const queryClient = useQueryClient()
  
  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Employee[]
    }
  })

  const { data: clockEvents } = useQuery({
    queryKey: ['clock_events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clock_events')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as ClockEvent[]
    }
  })

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
          queryClient.invalidateQueries({ queryKey: ['clock_events'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  const getEmployeeClockEvents = (employeeId: string) => {
    if (!clockEvents) return []
    return clockEvents.filter(event => event.employee_id === employeeId)
  }

  const getLatestClockEvent = (employeeId: string) => {
    const events = getEmployeeClockEvents(employeeId)
    return events.length > 0 ? events[0] : null
  }

  const isEmployeePresent = (latestEvent: ClockEvent | null) => {
    if (!latestEvent) return false
    return latestEvent.event_type === 'in'
  }

  const filteredEmployees = employees?.filter(employee => {
    const latestEvent = getLatestClockEvent(employee.id)
    if (filter === 'all') return true
    if (filter === 'in') return isEmployeePresent(latestEvent)
    return !isEmployeePresent(latestEvent) // 'out' filter
  })

  const employeeCounts = {
    total: employees?.length || 0,
    clockedIn: employees?.filter(employee => 
      isEmployeePresent(getLatestClockEvent(employee.id))
    ).length || 0,
    get clockedOut() {
      return this.total - this.clockedIn
    }
  }

  return (
    <div className="space-y-6">
      <EmployeeListHeader 
        showCodes={showCodes}
        onToggleShowCodes={setShowCodes}
        filter={filter}
        onFilterChange={setFilter}
        employeeCounts={employeeCounts}
      />
      
      {!employees || employees.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No employees added yet. Add your first employee to get started.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees?.map((employee) => (
            <EmployeeCard
              key={employee.id}
              id={employee.id}
              name={employee.name}
              code={employee.code}
              hourlyRate={employee.hourly_rate}
              avatarUrl={employee.avatar_url}
              paymentQrUrl={employee.payment_qr_url}
              showCodes={showCodes}
              clockEvents={getEmployeeClockEvents(employee.id)}
              timeIn={employee.time_in}
              timeOut={employee.time_out}
            />
          ))}
        </div>
      )}
    </div>
  )
}