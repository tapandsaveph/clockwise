import { differenceInSeconds } from "date-fns"

export interface EmployeeHours {
  employee_id: string
  employee_name: string
  total_hours: number
  total_minutes: number
  hourly_rate: number
  total_earnings: number
  overtime_rate: number
  regular_earnings: number
  overtime_earnings: number
}

interface ClockEvent {
  id: string
  employee_id: string
  event_type: 'in' | 'out' | 'ot'
  created_at: string
  is_overtime?: boolean
  approval_status?: string
}

interface Employee {
  id: string
  name: string
  hourly_rate: number
  overtime_rate?: number
}

export const calculateEmployeeHours = async (employee: Employee, events: ClockEvent[]): Promise<EmployeeHours> => {
  let totalSeconds = 0
  let overtimeSeconds = 0
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  // Process events in pairs (clock-in followed by clock-out)
  for (let i = 0; i < sortedEvents.length - 1; i++) {
    const currentEvent = sortedEvents[i]
    const nextEvent = sortedEvents[i + 1]

    // Check if this is a valid pair of events (either regular clock in/out or approved overtime)
    const isValidPair = (
      (currentEvent.event_type === 'in' && nextEvent?.event_type === 'out') ||
      (currentEvent.event_type === 'ot' && nextEvent?.event_type === 'out')
    )

    if (isValidPair) {
      const seconds = differenceInSeconds(
        new Date(nextEvent.created_at),
        new Date(currentEvent.created_at)
      )
      
      // Add seconds to either regular or overtime total
      if (currentEvent.event_type === 'ot' && 
          currentEvent.is_overtime && 
          currentEvent.approval_status === 'approved') {
        overtimeSeconds += Math.max(0, seconds)
      } else if (currentEvent.event_type === 'in') {
        totalSeconds += Math.max(0, seconds)
      }
      
      i++ // Skip the next event since we've used it
    }
  }

  // Calculate total hours and minutes
  const totalRegularHours = Math.floor(totalSeconds / 3600)
  const remainingRegularSeconds = totalSeconds % 3600
  const totalRegularMinutes = Math.floor(remainingRegularSeconds / 60)

  const totalOvertimeHours = Math.floor(overtimeSeconds / 3600)
  const remainingOvertimeSeconds = overtimeSeconds % 3600
  const totalOvertimeMinutes = Math.floor(remainingOvertimeSeconds / 60)

  // Calculate total combined hours and minutes
  const totalHours = totalRegularHours + totalOvertimeHours
  const totalMinutes = totalRegularMinutes + totalOvertimeMinutes
  
  const hourlyRate = Number(employee.hourly_rate) || 0
  const overtimeRate = Number(employee.overtime_rate) || 1.25
  
  // Calculate earnings
  const regularEarnings = (totalSeconds / 3600) * hourlyRate
  const overtimeEarnings = (overtimeSeconds / 3600) * hourlyRate * overtimeRate
  const totalEarnings = regularEarnings + overtimeEarnings

  return {
    employee_id: employee.id,
    employee_name: employee.name,
    total_hours: totalHours,
    total_minutes: totalMinutes,
    hourly_rate: hourlyRate,
    overtime_rate: overtimeRate,
    regular_earnings: regularEarnings,
    overtime_earnings: overtimeEarnings,
    total_earnings: totalEarnings
  }
}