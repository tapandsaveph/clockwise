import { PhotoCaptureButton } from "./PhotoCaptureButton"
import { ClockButton } from "./ClockButton"
import { OvertimeRequestButton } from "./OvertimeRequestButton"

interface EmployeeActionsProps {
  isClockingIn: boolean
  onClockInOut: (location?: string, isOvertimeClockOut?: boolean, photoUrl?: string) => void
  timeIn: string
  timeOut: string
  employeeId: string
  onOvertimeRequest?: () => void
  latestEvent?: {
    event_type: 'in' | 'out' | 'ot'
    is_overtime?: boolean
    approval_status?: string
  } | null
}

export function EmployeeActions({ 
  isClockingIn, 
  onClockInOut,
  timeIn,
  timeOut,
  employeeId,
  onOvertimeRequest,
  latestEvent
}: EmployeeActionsProps) {
  const handlePhotoCapture = (location: string, photoUrl: string) => {
    const isOvertimeClockOut = latestEvent?.event_type === 'ot' && 
                              latestEvent?.is_overtime && 
                              latestEvent?.approval_status === 'approved'
    onClockInOut(location, isOvertimeClockOut, photoUrl)
  }

  const handleClockInOut = (location: string) => {
    const isOvertimeClockOut = latestEvent?.event_type === 'ot' && 
                              latestEvent?.is_overtime && 
                              latestEvent?.approval_status === 'approved'
    onClockInOut(location, isOvertimeClockOut)
  }

  return (
    <div className="space-y-2">
      <PhotoCaptureButton 
        employeeId={employeeId}
        onPhotoCapture={handlePhotoCapture}
        latestEvent={latestEvent}
      />
      <ClockButton 
        isClockingIn={isClockingIn}
        onClockInOut={handleClockInOut}
        timeIn={timeIn}
        timeOut={timeOut}
        latestEvent={latestEvent}
      />
      <OvertimeRequestButton 
        employeeId={employeeId} 
        timeOut={timeOut}
        onOvertimeRequest={onOvertimeRequest}
      />
    </div>
  )
}