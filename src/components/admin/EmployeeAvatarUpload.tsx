import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"

interface EmployeeAvatarUploadProps {
  avatarPreview: string | null
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function EmployeeAvatarUpload({ avatarPreview, onFileChange }: EmployeeAvatarUploadProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarPreview || ""} />
        <AvatarFallback className="bg-muted">
          {avatarPreview ? null : <Upload className="h-8 w-8 text-muted-foreground" />}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-2 w-full">
        <Label htmlFor="avatar">Profile Photo</Label>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="cursor-pointer"
        />
      </div>
    </div>
  )
}