import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode } from "lucide-react"

interface EmployeeQRUploadProps {
  qrPreview: string | null
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function EmployeeQRUpload({
  qrPreview,
  onFileChange,
}: EmployeeQRUploadProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        {qrPreview ? (
          <AvatarImage src={qrPreview} className="object-cover" />
        ) : (
          <AvatarFallback className="bg-muted">
            <QrCode className="h-8 w-8 text-muted-foreground" />
          </AvatarFallback>
        )}
      </Avatar>
      <div className="space-y-2 w-full">
        <Label htmlFor="qr">Payment QR Code</Label>
        <Input
          id="qr"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="cursor-pointer"
        />
      </div>
    </div>
  )
}