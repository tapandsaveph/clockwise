import { format, parse } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"

interface EmployeeScheduleInfoProps {
  hourlyRate: number
  timeIn: string
  timeOut: string
}

export function EmployeeScheduleInfo({ 
  hourlyRate, 
  timeIn, 
  timeOut 
}: EmployeeScheduleInfoProps) {
  const formatTimeToAMPM = (time: string) => {
    const parsedTime = parse(time, 'HH:mm:ss', new Date())
    return format(parsedTime, 'h:mm a')
  }

  return (
    <Card className="bg-muted/50 shadow-sm">
      <CardContent className="p-3">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Hourly Rate</p>
              <p className="text-sm font-medium">₱{hourlyRate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Schedule</p>
              <p className="text-sm font-medium">{formatTimeToAMPM(timeIn)} - {formatTimeToAMPM(timeOut)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}