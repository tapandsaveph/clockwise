import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Timer, DollarSign } from "lucide-react"
import { EmployeeHours } from "@/utils/timeCalculations"

interface EmployeeHoursCardProps {
  employee: EmployeeHours
}

export function EmployeeHoursCard({ employee }: EmployeeHoursCardProps) {
  return (
    <Card className="bg-white/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Timer className="h-4 w-4 text-primary" />
          {employee.employee_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-2xl font-bold">
            {employee.total_hours}h {employee.total_minutes}m
          </p>
          <p className="text-sm text-muted-foreground">Total time worked</p>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-500" />
          <div>
            <p className="text-lg font-bold text-green-600">
              ₱{(employee.total_earnings || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-muted-foreground">
              Total earnings (₱{(employee.hourly_rate || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/hr)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}