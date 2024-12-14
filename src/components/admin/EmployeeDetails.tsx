import { Key, Clock, DollarSign } from "lucide-react"
import { format, parse } from "date-fns"

interface EmployeeDetailsProps {
  name: string
  code: string
  hourlyRate: number
  showCodes: boolean
  avatarUrl?: string | null
  timeIn: string
  timeOut: string
}

export function EmployeeDetails({ 
  code, 
  hourlyRate,
  showCodes,
  timeIn,
  timeOut
}: EmployeeDetailsProps) {
  const formatTimeToAMPM = (time: string) => {
    const parsedTime = parse(time, 'HH:mm:ss', new Date())
    return format(parsedTime, 'h:mm a')
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Access Code</p>
        <p className="font-medium">{showCodes ? code : "****"}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Hourly Rate</p>
        <p className="font-medium">₱{hourlyRate.toFixed(2)}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Time In</p>
        <p className="font-medium">{formatTimeToAMPM(timeIn)}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Time Out</p>
        <p className="font-medium">{formatTimeToAMPM(timeOut)}</p>
      </div>
    </div>
  )
}