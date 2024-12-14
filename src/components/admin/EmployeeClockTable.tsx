import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { useState } from "react"
import { AttendanceFilters } from "./AttendanceFilters"
import { EmployeeStatusBubble } from "./EmployeeStatusBubble"

interface Employee {
  id: string
  name: string
  code: string
  hourly_rate: number
  avatar_url?: string | null
}

interface ClockEvent {
  id: string
  employee_id: string
  event_type: 'in' | 'out' | 'ot'
  created_at: string
  is_overtime?: boolean
  approval_status?: string
}

type FilterType = 'all' | 'in' | 'out'

export function EmployeeClockTable() {
  const [filter, setFilter] = useState<FilterType>('all')

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name', { ascending: true })
      
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

  const getLatestClockEvent = (employeeId: string) => {
    if (!clockEvents) return null
    return clockEvents.find(event => event.employee_id === employeeId)
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

  const clockedInCount = employees?.filter(employee => 
    isEmployeePresent(getLatestClockEvent(employee.id))
  ).length || 0

  const clockedOutCount = (employees?.length || 0) - clockedInCount

  return (
    <Card>
      <CardHeader className="space-y-6">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#e7722d]" />
          Attendance Overview
        </CardTitle>
        <AttendanceFilters 
          filter={filter}
          setFilter={setFilter}
          totalCount={employees?.length || 0}
          presentCount={clockedInCount}
          absentCount={clockedOutCount}
        />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[5px]">
          {filteredEmployees?.map((employee) => {
            const latestEvent = getLatestClockEvent(employee.id)
            const isPresent = isEmployeePresent(latestEvent)
            
            return (
              <EmployeeStatusBubble
                key={employee.id}
                name={employee.name}
                avatarUrl={employee.avatar_url}
                isPresent={isPresent}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}