import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"

interface EmployeePaymentQRProps {
  imageUrl: string
}

export function EmployeePaymentQR({ imageUrl }: EmployeePaymentQRProps) {
  console.log('Payment QR URL:', imageUrl); // Debug log
  
  if (!imageUrl) {
    return (
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground ml-3">Payment QRs</p>
        <div className="w-16 h-16 ml-3 rounded-lg bg-muted flex items-center justify-center">
          <p className="text-xs text-muted-foreground">No QR</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground ml-3">Payment QRs</p>
      <Dialog>
        <DialogTrigger asChild>
          <div className="w-16 h-16 ml-3 rounded-lg cursor-pointer overflow-hidden border border-border">
            <AspectRatio ratio={1}>
              <img
                src={imageUrl}
                alt="Payment QR Code"
                className="object-contain w-full h-full hover:scale-105 transition-transform duration-300"
              />
            </AspectRatio>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] p-0 rounded-lg">
          <div className="w-full">
            <AspectRatio ratio={1}>
              <img
                src={imageUrl}
                alt="Payment QR Code"
                className="object-contain w-full h-full"
              />
            </AspectRatio>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}