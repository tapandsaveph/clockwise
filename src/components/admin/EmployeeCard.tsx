import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { EmployeeTimeline } from "./EmployeeTimeline"
import { EmployeeCardActions } from "./EmployeeCardActions"
import { EmployeeHeader } from "./EmployeeHeader"
import { EmployeeScheduleInfo } from "./EmployeeScheduleInfo"
import { EmployeePaymentQR } from "./EmployeePaymentQR"
import { EmployeeActivityLog } from "./EmployeeActivityLog"

interface ClockEvent {
  id: string
  employee_id: string
  event_type: 'in' | 'out' | 'ot'
  created_at: string
  is_overtime?: boolean
  approval_status?: string
}

interface EmployeeCardProps {
  id: string
  name: string
  code: string
  hourlyRate: number
  avatarUrl?: string | null
  paymentQrUrl?: string | null
  showCodes: boolean
  clockEvents: ClockEvent[]
  timeIn: string
  timeOut: string
}

export function EmployeeCard({ 
  id, 
  name, 
  code, 
  hourlyRate = 0,
  avatarUrl,
  paymentQrUrl,
  showCodes, 
  clockEvents,
  timeIn,
  timeOut
}: EmployeeCardProps) {
  const getLatestClockEvent = () => {
    if (!clockEvents || clockEvents.length === 0) return null
    return clockEvents[0]
  }

  const isClockedIn = () => {
    const latestEvent = getLatestClockEvent()
    return latestEvent?.event_type === 'in' || 
           (latestEvent?.event_type === 'ot' && 
            latestEvent?.is_overtime && 
            latestEvent?.approval_status === 'approved')
  }

  return (
    <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-lg bg-white shadow-md">
      <div className="absolute top-4 right-4">
        <EmployeeCardActions
          id={id}
          name={name}
          code={code}
          hourlyRate={hourlyRate}
          avatarUrl={avatarUrl}
          timeIn={timeIn}
          timeOut={timeOut}
        />
      </div>
      
      <CardHeader className="space-y-4 p-6">
        <EmployeeHeader
          name={name}
          code={code}
          avatarUrl={avatarUrl}
          showCodes={showCodes}
          isClockedIn={isClockedIn()}
        />
      </CardHeader>

      <CardContent className="space-y-4 px-3 pb-6 pt-0">
        <EmployeeScheduleInfo
          hourlyRate={hourlyRate}
          timeIn={timeIn}
          timeOut={timeOut}
        />
        
        <EmployeePaymentQR 
          imageUrl={paymentQrUrl || ""}
        />

        <EmployeeActivityLog 
          id={id}
          clockEvents={clockEvents}
        />
      </CardContent>
    </Card>
  )
}