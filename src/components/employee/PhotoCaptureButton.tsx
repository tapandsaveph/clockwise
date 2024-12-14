import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { getCurrentLocation } from "@/utils/geolocation"
import { compressImage } from "@/utils/imageUtils"
import { useIsMobile } from "@/hooks/use-mobile"

interface PhotoCaptureButtonProps {
  employeeId: string
  onPhotoCapture: (location: string, photoUrl: string) => void
  latestEvent?: {
    event_type: 'in' | 'out' | 'ot'
    is_overtime?: boolean
    approval_status?: string
  } | null
}

export function PhotoCaptureButton({ 
  employeeId, 
  onPhotoCapture,
  latestEvent 
}: PhotoCaptureButtonProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const handlePhotoCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const compressedFile = await compressImage(file)
      const fileExt = compressedFile.name.split('.').pop()
      const fileName = `${employeeId}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('attendance')
        .upload(fileName, compressedFile)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('attendance')
        .getPublicUrl(fileName)

      const location = await getCurrentLocation()
      onPhotoCapture(location, publicUrl)

      toast({
        title: "Success",
        description: "Photo uploaded successfully!",
      })
    } catch (error) {
      console.error('Photo upload error:', error)
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: "Failed to upload photo. Please try again.",
      })
    } finally {
      setIsUploading(false)
      // Reset the input value so the same file can be selected again
      event.target.value = ''
    }
  }

  if (!isMobile) {
    return (
      <div className="space-y-1">
        <span className="text-sm font-medium">Photos can only be taken on mobile devices</span>
        <Button 
          variant="outline"
          className="w-full bg-white/50 hover:bg-white/50 text-black/50 border-gray-200 cursor-not-allowed"
          disabled={true}
        >
          <Camera className="h-4 w-4 mr-2 text-black/50" />
          Take Photo
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <span className="text-sm font-medium">Take a photo to clock {latestEvent?.event_type === 'in' ? 'out' : 'in'}</span>
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoCapture}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        <Button 
          variant="outline"
          className="w-full bg-white hover:bg-white/90 text-black border-gray-200"
          disabled={isUploading}
        >
          <Camera className="h-4 w-4 mr-2 text-black" />
          {isUploading ? 'Uploading...' : 'Take Photo'}
        </Button>
      </div>
    </div>
  )
}