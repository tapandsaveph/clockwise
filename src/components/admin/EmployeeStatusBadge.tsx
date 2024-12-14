interface EmployeeStatusBadgeProps {
  eventType: 'in' | 'out'
}

export function EmployeeStatusBadge({ eventType }: EmployeeStatusBadgeProps) {
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
      eventType === 'in' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      Clocked {eventType}
    </span>
  )
}