# **App Name**: Appointmently

## Core Features:

- Date Time Picker: Implement a date and time picker for users to select their preferred appointment slots.
- User Input: Implement forms for users to input their full name, email, and phone number.
- Appointment Confirmation: Implement confirmation upon the successful booking
- Slot Suggestion: Use an AI tool to suggest optimal appointment slots based on historical booking data and availability.
- Admin Panel: Provide an admin dashboard to view and manage appointments (confirm, cancel).

## Style Guidelines:

- Primary color gradient: #EAF2FF to #D1E7FF, evoking trust and cleanliness.
- Secondary color gradient: #F0F9FF to #E0F2FF, for backgrounds and calm contrast.
- Accent color gradient: #A7D9ED to #73BBDD for interactive elements, indicating action.
- Clean and readable sans-serif fonts for easy information processing.
- Simple, outline-style icons for clarity and quick understanding.
- Clean, grid-based layout with ample whitespace for comfortable viewing and focus.

## Original User Request:
You are a senior frontend engineer. Generate a complete React 18 frontend (no backend) for a Digital Appointment Booking System using Vite and Tailwind CSS. Follow these specifications:

1. Project Setup
   - Initialize using `npm create vite@latest` with the React template.
   - Install and configure Tailwind CSS via its Vite plugin.
   - Include TypeScript support, ESLint, and Prettier configurations.

2. User Interface
   - **Home / Booking Page**: 
     - DatePicker and TimePicker components to select appointment slots.
     - Form fields: Full Name, Email, Phone Number.
     - “Book Appointment” button that validates inputs and emits a `bookingCreated` event.
   - **Admin Dashboard**:
     - Table or card list showing all bookings with columns/fields: Date, Time, Name, Contact.
     - Controls to mark appointments as “Confirmed” or “Cancelled”.
     - Real‑time UI updates (use React state or Context API).

3. Components & State
   - Use functional components and React Hooks.
   - Create reusable UI components: Button, Input, Modal, Notification.
   - Manage state with Context or Redux Toolkit (choose one and justify).

4. Styling
   - Use Tailwind utility classes for responsive design.
   - Include a dark mode toggle (Tailwind dark variant).
   - Ensure mobile‑first breakpoints and ARIA attributes for accessibility.

5. Email Notification (Stub)
   - Add an `EmailService.ts` module exporting a `sendBookingEmail` stub that logs booking data.
   - In the booking handler, call `sendBookingEmail` with form details.

6. Testing
   - Include one example unit test with Vitest and React Testing Library (e.g., form validation).
   - Showcase test configuration in `vitest.config.ts`.

7. Documentation
   - Provide `README.md` with setup, run (`npm run dev`), build, and test instructions.
   - Outline where to integrate a real email backend or API.

Ensure code is cleanly organized under `src/`, with clear folder structure:
  