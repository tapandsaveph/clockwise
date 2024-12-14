import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EmployeeStatusBubbleProps {
  name: string
  avatarUrl?: string | null
  isPresent: boolean
}

export function EmployeeStatusBubble({ name, avatarUrl, isPresent }: EmployeeStatusBubbleProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className={`inline-flex items-center gap-3 rounded-full pl-1 pr-5 py-1 transition-colors ${
            isPresent ? 'bg-[#caf0d7]' : 'bg-[#FFF1F1] text-black'
          }`}>
            <Avatar className="h-10 w-10 border-2 border-white">
              <AvatarImage src={avatarUrl || ""} alt={name} />
              <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-medium truncate">{name}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">
            {isPresent ? 'Present' : 'Absent'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}