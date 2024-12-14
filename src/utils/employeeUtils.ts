import { supabase } from "@/integrations/supabase/client"

export const validateCode = async (code: string) => {
  const { data, error } = await supabase
    .from('employees')
    .select('code')
    .eq('code', code)
  
  if (error) throw error
  
  return !data || data.length === 0
}

export const uploadAvatar = async (avatarFile: File) => {
  console.log('Starting avatar upload...')
  const fileExt = avatarFile.name.split('.').pop()
  const filePath = `${crypto.randomUUID()}.${fileExt}`
  
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, avatarFile)
  
  if (uploadError) {
    console.error('Error uploading avatar:', uploadError)
    throw uploadError
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)
  
  console.log('Avatar upload successful:', publicUrl)
  return publicUrl
}

export const uploadQRCode = async (qrFile: File) => {
  console.log('Starting QR code upload...')
  const fileExt = qrFile.name.split('.').pop()
  const filePath = `${crypto.randomUUID()}.${fileExt}`
  
  const { error: uploadError } = await supabase.storage
    .from('payment_qr')
    .upload(filePath, qrFile)
  
  if (uploadError) {
    console.error('Error uploading QR code:', uploadError)
    throw uploadError
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from('payment_qr')
    .getPublicUrl(filePath)
  
  console.log('QR code upload successful:', publicUrl)
  return publicUrl
}

export const createEmployee = async ({
  name,
  code,
  hourlyRate,
  avatarUrl,
  paymentQrUrl,
  timeIn,
  timeOut
}: {
  name: string
  code: string
  hourlyRate: number
  avatarUrl: string | null
  paymentQrUrl: string | null
  timeIn: string
  timeOut: string
}) => {
  console.log('Creating employee with data:', {
    name,
    code,
    hourlyRate,
    avatarUrl,
    paymentQrUrl,
    timeIn,
    timeOut
  })

  const { data, error } = await supabase
    .from('employees')
    .insert([{ 
      name, 
      code,
      hourly_rate: hourlyRate,
      avatar_url: avatarUrl,
      payment_qr_url: paymentQrUrl,
      overtime_rate: 1.25, // Default overtime rate
      time_in: timeIn,
      time_out: timeOut
    }])
    .select()
  
  if (error) {
    console.error('Error creating employee:', error)
    throw error
  }

  console.log('Employee created successfully:', data)
  return data[0]
}