import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface ClockInFormProps {
  onSuccess: (employee: any) => void;
}

export function ClockInForm({ onSuccess }: ClockInFormProps) {
  const [code, setCode] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (code.length === 4) {
      try {
        const { data: employeeData, error: employeeError } = await supabase
          .from('employees')
          .select('*')
          .eq('code', code)
          .limit(1)

        if (employeeError) throw employeeError
        if (!employeeData || employeeData.length === 0) {
          toast({
            variant: "destructive",
            title: "Invalid code",
            description: "Please enter a valid employee code.",
          })
          return
        }

        onSuccess(employeeData[0])
      } catch (error) {
        console.error('Error:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to retrieve employee information.",
        })
      }
    } else {
      toast({
        variant: "destructive",
        title: "Invalid code",
        description: "Please enter a valid 4-digit code.",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="code" className="text-sm font-medium text-gray-700">
          Enter your code
        </label>
        <Input
          id="code"
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={4}
          placeholder="****"
          className="text-center text-2xl tracking-widest bg-white/50 border-purple-100 focus-visible:ring-purple-400"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-[#e7722d] to-orange-500 hover:opacity-90 transition-opacity"
      >
        Submit
      </Button>
    </form>
  )
}