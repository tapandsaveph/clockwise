import { EmployeeCard } from "@/components/admin/EmployeeCard"
import { EmployeeHoursCard } from "@/components/admin/EmployeeHoursCard"
import { EmployeeActions } from "@/components/employee/EmployeeActions"

interface Employee {
  id: string
  name: string
  code: string
  hourly_rate: number
  avatar_url: string | null
  payment_qr_url: string | null
  time_in: string
  time_out: string
}

interface ClockEvent {
  id: string
  employee_id: string
  event_type: 'in' | 'out' | 'ot'
  created_at: string
  is_overtime?: boolean
  approval_status?: string
  photo_url?: string | null
}

interface EmployeeDashboardProps {
  employee: Employee
  clockEvents: ClockEvent[]
  employeeHours: any
  onClockInOut: (location?: string, isOvertimeClockOut?: boolean, photoUrl?: string) => void
}

export function EmployeeDashboard({ 
  employee, 
  clockEvents, 
  employeeHours,
  onClockInOut 
}: EmployeeDashboardProps) {
  const handleOvertimeRequest = () => {
    console.log('Overtime requested')
  }

  const latestEvent = clockEvents[0]
  const isClockingIn = latestEvent?.event_type === 'in' || 
    (latestEvent?.event_type === 'ot' && 
     latestEvent?.is_overtime && 
     latestEvent?.approval_status === 'approved')
  
  return (
    <div className="space-y-4">
      <EmployeeCard
        id={employee.id}
        name={employee.name}
        code={employee.code}
        hourlyRate={employee.hourly_rate}
        avatarUrl={employee.avatar_url}
        paymentQrUrl={employee.payment_qr_url}
        showCodes={false}
        clockEvents={clockEvents}
        timeIn={employee.time_in}
        timeOut={employee.time_out}
      />
      
      <EmployeeActions 
        isClockingIn={isClockingIn}
        onClockInOut={onClockInOut}
        timeIn={employee.time_in}
        timeOut={employee.time_out}
        employeeId={employee.id}
        onOvertimeRequest={handleOvertimeRequest}
        latestEvent={latestEvent}
      />
      
      {employeeHours && (
        <EmployeeHoursCard employee={employeeHours} />
      )}
    </div>
  )
}