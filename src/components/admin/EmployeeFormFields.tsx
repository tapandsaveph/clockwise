import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EmployeeFormFieldsProps {
  name: string
  code: string
  hourlyRate: string
  timeIn: string
  timeOut: string
  onNameChange: (value: string) => void
  onCodeChange: (value: string) => void
  onHourlyRateChange: (value: string) => void
  onTimeInChange: (value: string) => void
  onTimeOutChange: (value: string) => void
}

export function EmployeeFormFields({
  name,
  code,
  hourlyRate,
  timeIn,
  timeOut,
  onNameChange,
  onCodeChange,
  onHourlyRateChange,
  onTimeInChange,
  onTimeOutChange
}: EmployeeFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Employee Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="John Doe"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="code">Access Code</Label>
        <Input
          id="code"
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder="1234"
          type="text"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="hourlyRate">Hourly Rate (PHP)</Label>
        <Input
          id="hourlyRate"
          value={hourlyRate}
          onChange={(e) => onHourlyRateChange(e.target.value)}
          placeholder="0.00"
          type="number"
          step="0.01"
          min="0"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timeIn">Time In</Label>
          <Input
            id="timeIn"
            value={timeIn}
            onChange={(e) => onTimeInChange(e.target.value)}
            type="time"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timeOut">Time Out</Label>
          <Input
            id="timeOut"
            value={timeOut}
            onChange={(e) => onTimeOutChange(e.target.value)}
            type="time"
          />
        </div>
      </div>
    </>
  )
}