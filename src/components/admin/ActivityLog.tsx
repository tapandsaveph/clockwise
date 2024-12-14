import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, User } from "lucide-react"
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface ClockEvent {
  id: string
  employee_id: string
  event_type: 'in' | 'out'
  created_at: string
  employee_name: string
}

export function ActivityLog() {
  const { data: clockEvents } = useQuery({
    queryKey: ['clockEvents'],
    queryFn: async () => {
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select('id, name')

      if (employeesError) throw employeesError

      const latestEvents = await Promise.all(
        employees.map(async (employee) => {
          const { data, error } = await supabase
            .from('clock_events')
            .select('*')
            .eq('employee_id', employee.id)
            .order('created_at', { ascending: false })
            .limit(1)

          if (error || !data || data.length === 0) {
            return {
              employee_id: employee.id,
              employee_name: employee.name,
              event_type: null,
              created_at: null
            }
          }

          return {
            ...data[0],
            employee_name: employee.name
          }
        })
      )

      return latestEvents
    }
  })

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {clockEvents?.map((event) => event && (
        <Card key={event.employee_id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                {event.employee_name}
              </span>
              {event.event_type && (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  event.event_type === 'in' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  Last clocked {event.event_type}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {event.created_at 
                  ? format(new Date(event.created_at), 'MMM d, yyyy h:mm a')
                  : 'No clock events'}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}