import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Paperclip, Send } from 'lucide-react'

export default function MessagingPage() {
  return (
    <div className="grid h-[calc(100vh-8rem)] w-full grid-cols-1 md:grid-cols-[300px_1fr] gap-4">
      <Card>
        <CardHeader>
          <Input placeholder="Search conversations..." />
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-3 p-3 text-left transition-colors bg-muted hover:bg-muted/80">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src="https://placehold.co/40x40.png"
                  alt="Assessor"
                  data-ai-hint="person portrait"
                />
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">Alex Steele (Assessor)</p>
                <p className="text-sm text-muted-foreground truncate">
                  Regarding your ISO 9001 application...
                </p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-3 text-left transition-colors hover:bg-muted/80">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src="https://placehold.co/40x40.png"
                  alt="Support"
                  data-ai-hint="person office"
                />
                <AvatarFallback>SP</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">UKCAS Support</p>
                <p className="text-sm text-muted-foreground truncate">
                  Welcome to the platform!
                </p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src="https://placehold.co/40x40.png"
                alt="Assessor"
                data-ai-hint="person portrait"
              />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Alex Steele (Assessor)</p>
              <p className="text-sm text-muted-foreground">Online</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src="https://placehold.co/40x40.png"
                alt="Assessor"
                data-ai-hint="person portrait"
              />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm">
                  Hello, regarding your ISO 9001 application, can you please
                  provide clarification on section 4.2 of your Quality Manual?
                </p>
              </div>
              <p className="text-xs text-muted-foreground">2:15 PM</p>
            </div>
          </div>
          <div className="flex items-start gap-4 justify-end">
            <div className="space-y-2 text-right">
              <div className="p-3 rounded-lg bg-primary text-primary-foreground">
                <p className="text-sm">
                  Certainly. I've attached the revised section. Please let me
                  know if you need anything else.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">2:18 PM</p>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarImage
                src="https://placehold.co/40x40.png"
                alt="User"
                data-ai-hint="person professional"
              />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
        <div className="border-t p-4 bg-card">
          <form className="relative">
            <Textarea
              placeholder="Type your message..."
              className="pr-24"
              rows={1}
            />
            <div className="absolute top-1/2 right-3 -translate-y-1/2 flex gap-1">
              <Button type="button" size="icon" variant="ghost">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button type="submit" size="icon" variant="default">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
