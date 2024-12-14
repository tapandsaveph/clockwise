import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { EmployeeTimeline } from "./EmployeeTimeline"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface ClockEvent {
  id: string
  employee_id: string
  event_type: 'in' | 'out' | 'ot'
  created_at: string
}

interface EmployeeActivityLogProps {
  id: string
  clockEvents: ClockEvent[]
}

export function EmployeeActivityLog({ id, clockEvents }: EmployeeActivityLogProps) {
  const [isTimelineOpen, setIsTimelineOpen] = useState(false)

  return (
    <>
      <Separator />
      <Collapsible 
        key={id} 
        open={isTimelineOpen} 
        onOpenChange={setIsTimelineOpen}
      >
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex w-full items-center justify-between p-0 hover:bg-transparent"
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              Activity Log
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
              isTimelineOpen ? "rotate-180" : ""
            }`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <EmployeeTimeline clockEvents={clockEvents} />
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}