"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
  suggestOptimalAppointmentSlots,
  SuggestOptimalAppointmentSlotsOutput,
} from "@/ai/flows/slot-suggestion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { sendBookingEmail } from "@/services/email";
import { useToast } from "@/hooks/use-toast";

const bookingSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  phoneNumber: z.string().regex(new RegExp(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/), {
    message: "Invalid phone number.",
  }),
  date: z.date(),
  time: z.string().min(1, {
    message: "Please select a time.",
  }),
});

type BookingValues = z.infer<typeof bookingSchema>;

export default function Home() {
  const [suggestedSlots, setSuggestedSlots] = useState<SuggestOptimalAppointmentSlotsOutput | null>(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const { toast } = useToast();

  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      date: new Date(),
      time: "",
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { isValid },
    watch,
  } = form;

  const selectedDate = watch("date");

  useEffect(() => {
    const fetchSuggestedSlots = async () => {
      if (selectedDate) {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        try {
          const slots = await suggestOptimalAppointmentSlots({
            fullName: form.getValues().fullName,
            email: form.getValues().email,
            phoneNumber: form.getValues().phoneNumber,
            preferredDate: formattedDate,
          });
          setSuggestedSlots(slots);
        } catch (error) {
          console.error("Error fetching suggested slots:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch suggested appointment slots.",
          });
        }
      }
    };

    fetchSuggestedSlots();
  }, [selectedDate, form, toast]);

  const onSubmit = async (data: BookingValues) => {
    console.log(data);
    try {
      const formattedDate = format(data.date, "yyyy-MM-dd");
      const bookingSuccessful = await sendBookingEmail({
        email: data.email,
        fullName: data.fullName,
        date: formattedDate,
        time: data.time,
      });

      if (bookingSuccessful) {
        setIsBookingConfirmed(true);
        toast({
          title: "Booking Confirmed",
          description: `Your appointment has been booked for ${format(data.date, "PP")} at ${data.time}.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Booking Failed",
          description: "There was an error booking your appointment. Please try again.",
        });
      }
    } catch (error) {
      console.error("Email sending error:", error);
      toast({
        variant: "destructive",
        title: "Email Error",
        description: "Failed to send confirmation email.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary-gradient items-center justify-center p-4">
      <AlertDialog open={isBookingConfirmed} onOpenChange={setIsBookingConfirmed}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Appointment Booked!</AlertDialogTitle>
            <AlertDialogDescription>
              Your appointment has been successfully booked. Check your email for confirmation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsBookingConfirmed(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container max-w-2xl rounded-lg shadow-xl bg-card p-8">
        <h1 className="text-2xl font-semibold text-foreground text-center mb-6">Book an Appointment</h1>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="(123) 456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Appointment Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
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
                        onSelect={(date) => {
                          field.onChange(date);
                          // Clear the time when a new date is selected
                          setValue("time", "");
                        }}
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Please select the date you would like to book.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment Time</FormLabel>
                  <FormControl>
                    <select
                      defaultValue=""
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="" disabled>
                        Select a time
                      </option>
                      {suggestedSlots?.suggestedSlots?.map((slot) => (
                        <option key={`${slot.date}-${slot.time}`} value={slot.time}>
                          {slot.time}
                        </option>
                      ))}
                      {!suggestedSlots?.suggestedSlots?.length && (
                        <option disabled>No slots available for this date</option>
                      )}
                    </select>
                  </FormControl>
                  <FormDescription>
                    Suggested times based on availability.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={!isValid} className="w-full bg-accent-gradient text-primary-foreground">
              Book Appointment
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
