import { Button } from "@/components/ui/button"
import { LogIn, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getCurrentLocation } from "@/utils/geolocation"
import { parse, isWithinInterval, set } from "date-fns"

interface ClockButtonProps {
  isClockingIn: boolean
  onClockInOut: (location: string) => void
  timeIn: string
  timeOut: string
  latestEvent?: {
    event_type: 'in' | 'out' | 'ot'
    is_overtime?: boolean
    approval_status?: string
  } | null
}

export function ClockButton({ 
  isClockingIn, 
  onClockInOut,
  timeIn,
  timeOut,
  latestEvent
}: ClockButtonProps) {
  const { toast } = useToast()

  const isWithinSchedule = () => {
    const now = new Date()
    const scheduleStart = parse(timeIn, 'HH:mm:ss', new Date())
    const scheduleEnd = parse(timeOut, 'HH:mm:ss', new Date())
    
    const startTime = set(new Date(), {
      hours: scheduleStart.getHours(),
      minutes: scheduleStart.getMinutes(),
      seconds: scheduleStart.getSeconds()
    })

    const endTime = set(new Date(), {
      hours: scheduleEnd.getHours(),
      minutes: scheduleEnd.getMinutes(),
      seconds: scheduleEnd.getSeconds()
    })

    if (scheduleEnd < scheduleStart) {
      endTime.setDate(endTime.getDate() + 1)
    }

    return isWithinInterval(now, { start: startTime, end: endTime })
  }

  const handleClockInOut = async () => {
    if (!isWithinSchedule() && !isClockingIn) {
      toast({
        variant: "destructive",
        title: "Schedule Error",
        description: "You can only clock in during your scheduled hours.",
      })
      return
    }

    try {
      const location = await getCurrentLocation()
      onClockInOut(location)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Location Error",
        description: "Could not get your location. Please enable location access.",
      })
    }
  }

  const canClockOut = latestEvent && (
    latestEvent.event_type === 'in' || 
    (latestEvent.event_type === 'ot' && 
     latestEvent.is_overtime && 
     latestEvent.approval_status === 'approved')
  )

  const isDisabled = true // Always disabled as we only want photo button to be clickable

  return (
      <Button 
        onClick={handleClockInOut} 
        variant={isClockingIn ? "destructive" : "default"}
        className="w-full opacity-50"
        disabled={isDisabled}
      >
        {isClockingIn ? (
          <>
            <LogOut className="h-4 w-4 mr-2" />
            Clock Out
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4 mr-2" />
            Clock In
          </>
        )}
      </Button>
  )
}