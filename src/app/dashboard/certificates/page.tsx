'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { mockInstitutes } from "@/lib/mock-data";

const CERTIFICATE_COST = 10;

const formSchema = z.object({
  studentName: z.string().min(2, { message: "Student name must be at least 2 characters." }),
  courseName: z.string().min(3, { message: "Course name must be at least 3 characters." }),
  issueDate: z.date({
    required_error: "An issue date is required.",
  }),
});

export default function IssueCertificatePage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    
    // In a real app, this would come from a user session or context.
    const [institute, setInstitute] = React.useState(mockInstitutes.find(i => i.id === '1')); 

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            studentName: "",
            courseName: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        // Simulate API call and balance check
        setTimeout(() => {
            if (!institute) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not identify your institution.",
                });
                setIsLoading(false);
                return;
            }

            if (institute.balance < CERTIFICATE_COST) {
                toast({
                    variant: "destructive",
                    title: "Insufficient Balance",
                    description: `You need at least $${CERTIFICATE_COST.toFixed(2)} to issue a certificate. Your current balance is $${institute.balance.toFixed(2)}.`,
                });
                setIsLoading(false);
                return;
            }
            
            // Deduct balance and create pending certificate (simulation)
            const newBalance = institute.balance - CERTIFICATE_COST;
            setInstitute({...institute, balance: newBalance });
            
            console.log("New pending certificate submitted:", {
                ...values,
                id: `UKCAS-${Math.floor(Math.random() * 90000000) + 10000000}`,
                instituteId: institute.id,
                status: 'Pending',
            });
            
            toast({
                title: "Certificate Submitted!",
                description: `The new certificate for ${values.studentName} is pending admin approval. $${CERTIFICATE_COST.toFixed(2)} has been deducted from your balance.`,
            });

            form.reset();
            setIsLoading(false);
        }, 1000);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl sm:text-3xl font-bold font-headline">Issue New Certificate</CardTitle>
                <CardDescription>Fill out the form below. Each certificate costs ${CERTIFICATE_COST.toFixed(2)} to issue, which will be deducted from your balance upon submission.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="studentName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Student's Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="courseName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course or Qualification Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., BSc in Computer Science" {...field} />
                                    </FormControl>
                                     <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="issueDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>Date of Issue</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading}>
                           {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                           Submit for Approval
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
