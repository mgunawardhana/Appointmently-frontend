"use client";

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";

interface Appointment {
  id: string;
  date: Date;
  time: string;
  name: string;
  contact: string;
  status: 'Confirmed' | 'Cancelled' | 'Pending';
}

const dummyAppointments: Appointment[] = [
  {
    id: "1",
    date: new Date(),
    time: "10:00 AM",
    name: "John Doe",
    contact: "john.doe@example.com",
    status: "Confirmed",
  },
  {
    id: "2",
    date: new Date(),
    time: "11:00 AM",
    name: "Jane Smith",
    contact: "jane.smith@example.com",
    status: "Pending",
  },
  {
    id: "3",
    date: new Date(),
    time: "02:00 PM",
    name: "Alice Johnson",
    contact: "alice.johnson@example.com",
    status: "Cancelled",
  },
];

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(dummyAppointments);

  useEffect(() => {
    // Simulate fetching appointments from a database or API
    // In a real application, you would fetch the data here
    // and update the state with the fetched data
  }, []);

  const handleConfirm = (id: string) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id ? { ...appointment, status: "Confirmed" } : appointment
      )
    );
  };

  const handleCancel = (id: string) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id ? { ...appointment, status: "Cancelled" } : appointment
      )
    );
  };

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="container mx-auto py-10">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
            <CardDescription>Manage and view appointments</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{format(appointment.date, 'PP')}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.name}</TableCell>
                    <TableCell>{appointment.contact}</TableCell>
                    <TableCell>{appointment.status}</TableCell>
                    <TableCell className="text-right">
                      {appointment.status === "Pending" && (
                        <>
                          <Button
                            variant="ghost"
                            onClick={() => handleConfirm(appointment.id)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleCancel(appointment.id)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
