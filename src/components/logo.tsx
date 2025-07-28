import { Gavel } from 'lucide-react'

export function Logo() {
  return (
    <div className="bg-primary text-primary-foreground flex items-center justify-center gap-3 p-4">
      <div className="p-2 bg-primary-foreground rounded-lg">
        <Gavel className="w-6 h-6 text-primary" />
      </div>
      <span className="text-2xl font-bold tracking-tighter font-headline">
        UKCAS
      </span>
    </div>
  )
}
