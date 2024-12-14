import { Eye, EyeOff, Filter } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { AddEmployeeDialog } from "./AddEmployeeDialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface EmployeeListHeaderProps {
  showCodes: boolean
  onToggleShowCodes: (show: boolean) => void
  filter: 'all' | 'in' | 'out'
  onFilterChange: (filter: 'all' | 'in' | 'out') => void
  employeeCounts: {
    total: number
    clockedIn: number
    clockedOut: number
  }
}

export function EmployeeListHeader({ 
  showCodes, 
  onToggleShowCodes,
  filter,
  onFilterChange,
  employeeCounts
}: EmployeeListHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full flex items-center justify-between sm:justify-start gap-2">
          <h2 className="text-xl font-semibold">Employees</h2>
          <div className="flex items-center gap-2">
            <Toggle
              pressed={showCodes}
              onPressedChange={onToggleShowCodes}
              aria-label="Toggle code visibility"
              className="h-8"
              size="sm"
            >
              {showCodes ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </Toggle>
            <div className="block sm:hidden">
              <AddEmployeeDialog />
            </div>
          </div>
        </div>
        <div className="hidden sm:block">
          <AddEmployeeDialog />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              {filter === 'all' && 'All Employees'}
              {filter === 'in' && 'Present'}
              {filter === 'out' && 'Absent'}
              <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                filter === 'all' ? 'bg-gray-100 text-gray-600' :
                filter === 'in' ? 'bg-[#dcfce7] text-black' :
                'bg-[#FFF1F1] text-black'
              }`}>
                {filter === 'all' && employeeCounts.total}
                {filter === 'in' && employeeCounts.clockedIn}
                {filter === 'out' && employeeCounts.clockedOut}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onFilterChange('all')} className="gap-2">
              All Employees
              <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {employeeCounts.total}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('in')} className="gap-2">
              Present
              <span className="ml-auto rounded-full bg-[#dcfce7] px-2 py-0.5 text-xs font-medium text-black">
                {employeeCounts.clockedIn}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('out')} className="gap-2">
              Absent
              <span className="ml-auto rounded-full bg-[#FFF1F1] px-2 py-0.5 text-xs font-medium text-black">
                {employeeCounts.clockedOut}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}