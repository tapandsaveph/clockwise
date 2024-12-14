import { Clock, Camera } from "lucide-react"
import { format, formatDistanceStrict } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ClockEvent {
  id: string
  employee_id: string
  event_type: 'in' | 'out' | 'ot'
  created_at: string
  location?: string | null
  photo_url?: string | null
}

interface EventPair {
  clockIn: ClockEvent
  clockOut: ClockEvent | null
  duration?: string
}

interface EmployeeTimelineProps {
  clockEvents: ClockEvent[]
}

export function EmployeeTimeline({ clockEvents }: EmployeeTimelineProps) {
  const eventPairs: EventPair[] = []
  const sortedEvents = [...clockEvents].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  for (let i = 0; i < sortedEvents.length; i++) {
    const event = sortedEvents[i]
    if (event.event_type === 'in') {
      const nextEvent = sortedEvents[i + 1]
      const pair: EventPair = {
        clockIn: event,
        clockOut: nextEvent?.event_type === 'out' ? nextEvent : null
      }
      
      if (pair.clockOut) {
        pair.duration = formatDistanceStrict(
          new Date(pair.clockOut.created_at),
          new Date(pair.clockIn.created_at)
        )
        i++
      }
      
      eventPairs.push(pair)
    }
  }

  const groupedPairs: { [date: string]: EventPair[] } = {}
  eventPairs.forEach(pair => {
    const date = format(new Date(pair.clockIn.created_at), 'MMM d, yyyy')
    if (!groupedPairs[date]) {
      groupedPairs[date] = []
    }
    groupedPairs[date].push(pair)
  })

  if (clockEvents.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No activity recorded
      </div>
    )
  }

  const PhotoButton = ({ photoUrl, location }: { photoUrl: string, location?: string | null }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-4 w-4 hover:bg-transparent">
          <Camera className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 border-0 bg-transparent">
        <div className="relative w-fit mx-auto">
          <img
            src={photoUrl}
            alt="Attendance photo"
            className="rounded-lg max-h-[80vh] w-auto"
          />
          {location && (
            <div className="absolute bottom-3 inset-x-0 mx-3 bg-black/50 text-white px-3 py-1.5 rounded-md text-sm">
              {location}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-6">
        {Object.entries(groupedPairs).map(([date, pairs]) => (
          <div key={date} className="space-y-2">
            {pairs.map((pair, index) => (
              <div 
                key={pair.clockIn.id}
                className="relative pl-6 pb-4 last:pb-0"
              >
                <div className="absolute left-2 top-2 bottom-0 w-px bg-border" />
                
                {index === 0 && (
                  <h5 className="text-sm font-medium text-muted-foreground mb-4">
                    {date}
                  </h5>
                )}
                
                <div className="relative flex items-center gap-2 mb-2">
                  <div className="absolute left-[-24px] w-4 h-4 rounded-full bg-green-100" />
                  <span className="text-sm font-medium text-green-600">
                    {format(new Date(pair.clockIn.created_at), 'h:mm a')}
                  </span>
                  {pair.clockIn.photo_url && (
                    <PhotoButton 
                      photoUrl={pair.clockIn.photo_url} 
                      location={pair.clockIn.location}
                    />
                  )}
                </div>
                
                {pair.clockOut && (
                  <div className="relative flex items-center gap-2">
                    <div className="absolute left-[-24px] w-4 h-4 rounded-full bg-red-100" />
                    <span className="text-sm font-medium text-red-600">
                      {format(new Date(pair.clockOut.created_at), 'h:mm a')}
                    </span>
                    {pair.clockOut.photo_url && (
                      <PhotoButton 
                        photoUrl={pair.clockOut.photo_url}
                        location={pair.clockOut.location}
                      />
                    )}
                    {pair.duration && (
                      <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {pair.duration}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}