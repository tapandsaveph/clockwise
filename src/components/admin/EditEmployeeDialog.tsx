import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { EmployeeAvatarUpload } from "./EmployeeAvatarUpload"
import { EmployeeFormFields } from "./EmployeeFormFields"
import { EmployeeQRUpload } from "./EmployeeQRUpload"
import { EmployeeEditForm } from "./EmployeeEditForm"

interface EditEmployeeDialogProps {
  id: string
  initialName: string
  initialCode: string
  initialHourlyRate: number
  initialAvatarUrl?: string | null
  initialPaymentQrUrl?: string | null
  initialTimeIn: string
  initialTimeOut: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function EditEmployeeDialog({ 
  id, 
  initialName, 
  initialCode,
  initialHourlyRate,
  initialAvatarUrl,
  initialPaymentQrUrl,
  initialTimeIn,
  initialTimeOut,
  isOpen, 
  onOpenChange 
}: EditEmployeeDialogProps) {
  const [editName, setEditName] = useState(initialName)
  const [editCode, setEditCode] = useState(initialCode)
  const [editHourlyRate, setEditHourlyRate] = useState(initialHourlyRate.toString())
  const [editTimeIn, setEditTimeIn] = useState(initialTimeIn)
  const [editTimeOut, setEditTimeOut] = useState(initialTimeOut)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialAvatarUrl)
  const [qrFile, setQrFile] = useState<File | null>(null)
  const [qrPreview, setQrPreview] = useState<string | null>(initialPaymentQrUrl)
  const queryClient = useQueryClient()

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleQRChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setQrFile(file)
      setQrPreview(URL.createObjectURL(file))
    }
  }

  const handleSuccess = () => {
    onOpenChange(false)
    queryClient.invalidateQueries({ queryKey: ['employees'] })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <EmployeeAvatarUpload
            avatarPreview={avatarPreview}
            onFileChange={handleAvatarChange}
          />
          <EmployeeQRUpload
            qrPreview={qrPreview}
            onFileChange={handleQRChange}
          />
        </div>
        <EmployeeFormFields
          name={editName}
          code={editCode}
          hourlyRate={editHourlyRate}
          onNameChange={setEditName}
          onCodeChange={setEditCode}
          onHourlyRateChange={setEditHourlyRate}
          timeIn={editTimeIn}
          timeOut={editTimeOut}
          onTimeInChange={setEditTimeIn}
          onTimeOutChange={setEditTimeOut}
        />
        <EmployeeEditForm
          id={id}
          name={editName}
          code={editCode}
          hourlyRate={editHourlyRate}
          timeIn={editTimeIn}
          timeOut={editTimeOut}
          avatarFile={avatarFile}
          qrFile={qrFile}
          initialAvatarUrl={initialAvatarUrl}
          initialPaymentQrUrl={initialPaymentQrUrl}
          onSuccess={handleSuccess}
          onError={(error) => console.error(error)}
        />
      </DialogContent>
    </Dialog>
  )
}