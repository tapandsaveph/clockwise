import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { uploadEmployeeFile } from "./EmployeeFileUploader"
import { Button } from "@/components/ui/button"

interface EmployeeEditFormProps {
  id: string
  name: string
  code: string
  hourlyRate: string
  timeIn: string
  timeOut: string
  avatarFile: File | null
  qrFile: File | null
  initialAvatarUrl?: string | null
  initialPaymentQrUrl?: string | null
  onSuccess: () => void
  onError: (error: Error) => void
}

export function EmployeeEditForm({
  id,
  name,
  code,
  hourlyRate,
  timeIn,
  timeOut,
  avatarFile,
  qrFile,
  initialAvatarUrl,
  initialPaymentQrUrl,
  onSuccess,
  onError
}: EmployeeEditFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !code || !hourlyRate || !timeIn || !timeOut) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      let avatarUrl = initialAvatarUrl
      let paymentQrUrl = initialPaymentQrUrl

      if (avatarFile) {
        avatarUrl = await uploadEmployeeFile({ 
          file: avatarFile, 
          bucket: 'avatars',
          initialUrl: initialAvatarUrl,
          onUploadComplete: (url) => console.log('Avatar uploaded:', url)
        })
      }

      if (qrFile) {
        paymentQrUrl = await uploadEmployeeFile({ 
          file: qrFile, 
          bucket: 'payment_qr',
          initialUrl: initialPaymentQrUrl,
          onUploadComplete: (url) => console.log('QR uploaded:', url)
        })
      }

      const { error } = await supabase
        .from('employees')
        .update({ 
          name, 
          code,
          hourly_rate: parseFloat(hourlyRate),
          avatar_url: avatarUrl,
          payment_qr_url: paymentQrUrl,
          time_in: timeIn,
          time_out: timeOut
        })
        .eq('id', id)
      
      if (error) throw error

      onSuccess()
      
      toast({
        title: "Success",
        description: "Employee updated successfully",
      })
    } catch (error) {
      console.error('Error updating employee:', error)
      onError(error as Error)
      toast({
        title: "Error",
        description: "Failed to update employee",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Employee"}
      </Button>
    </form>
  )
}