import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface EmployeeHeaderProps {
  name: string
  code: string
  avatarUrl?: string | null
  showCodes: boolean
  isClockedIn: boolean
}

export function EmployeeHeader({ 
  name, 
  code, 
  avatarUrl, 
  showCodes,
  isClockedIn 
}: EmployeeHeaderProps) {
  return (
    <div className="flex flex-col items-start">
      <div className="relative">
        <Avatar className="h-24 w-24 ring-2 ring-primary/5">
          <AvatarImage src={avatarUrl || ""} alt={name} />
          <AvatarFallback className="bg-primary/5 text-primary font-semibold text-xl">
            {name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white ${
          isClockedIn ? 'bg-green-500' : 'bg-red-500'
        }`} />
      </div>
      <div className="w-full mt-4">
        <h3 className="font-semibold text-lg leading-none tracking-tight">{name}</h3>
        <p className="text-xs text-muted-foreground mt-1">Employee ID: {showCodes ? code : "****"}</p>
      </div>
    </div>
  )
}