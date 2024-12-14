import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"

interface EmployeeFileUploaderProps {
  file: File | null
  bucket: string
  initialUrl: string | null | undefined
  onUploadComplete: (url: string) => void
}

export async function uploadEmployeeFile({ 
  file, 
  bucket, 
  initialUrl, 
  onUploadComplete 
}: EmployeeFileUploaderProps) {
  if (!file) {
    return initialUrl
  }

  const fileExt = file.name.split('.').pop()
  const filePath = `${crypto.randomUUID()}.${fileExt}`
  
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)
  
  if (uploadError) throw uploadError
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)
  
  onUploadComplete(publicUrl)
  return publicUrl
}