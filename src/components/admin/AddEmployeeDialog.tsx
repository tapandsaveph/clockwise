import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EmployeeFormFields } from "./EmployeeFormFields"

export function AddEmployeeDialog() {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [hourlyRate, setHourlyRate] = useState("")
  const [timeIn, setTimeIn] = useState("07:00")
  const [timeOut, setTimeOut] = useState("16:00")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>
        <EmployeeFormFields 
          name={name}
          code={code}
          hourlyRate={hourlyRate}
          timeIn={timeIn}
          timeOut={timeOut}
          onNameChange={setName}
          onCodeChange={setCode}
          onHourlyRateChange={setHourlyRate}
          onTimeInChange={setTimeIn}
          onTimeOutChange={setTimeOut}
        />
      </DialogContent>
    </Dialog>
  )
}