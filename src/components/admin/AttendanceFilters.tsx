import { Button } from "@/components/ui/button"

interface AttendanceFiltersProps {
  filter: 'all' | 'in' | 'out'
  setFilter: (filter: 'all' | 'in' | 'out') => void
  totalCount: number
  presentCount: number
  absentCount: number
}

export function AttendanceFilters({ 
  filter, 
  setFilter, 
  totalCount,
  presentCount,
  absentCount
}: AttendanceFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant={filter === 'all' ? "default" : "outline"} 
        size="sm"
        onClick={() => setFilter('all')}
        className="min-w-24"
      >
        All Employees
        <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
          {totalCount}
        </span>
      </Button>
      <Button 
        variant="outline"
        size="sm"
        onClick={() => setFilter('in')}
        className={`min-w-24 border-[#bfeecb] ${
          filter === 'in' 
            ? 'bg-[#caf0d7] hover:bg-[#b8e8c5] text-black' 
            : 'bg-transparent hover:bg-[#caf0d7]/10 text-black'
        }`}
      >
        Present
        <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium text-black ${
          filter === 'in' ? 'bg-white/80' : 'bg-gray-100'
        }`}>
          {presentCount}
        </span>
      </Button>
      <Button 
        variant="outline"
        size="sm"
        onClick={() => setFilter('out')}
        className={`min-w-24 border-[#FFD7D7] ${
          filter === 'out'
            ? 'bg-[#FFF1F1] hover:bg-[#FFE4E4] text-black'
            : 'bg-transparent hover:bg-[#FFF1F1]/10 text-black'
        }`}
      >
        Absent
        <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium text-black ${
          filter === 'out' ? 'bg-white/80' : 'bg-gray-100'
        }`}>
          {absentCount}
        </span>
      </Button>
    </div>
  )
}