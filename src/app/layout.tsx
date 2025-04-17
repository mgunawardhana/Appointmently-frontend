import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Appointmently',
  description: 'Digital Appointment Booking System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="bg-secondary-gradient p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-foreground">
              Appointmently
            </Link>
            <div>
              <Link href="/" className="px-4 py-2 text-foreground hover:underline">
                Book Appointment
              </Link>
              <Link href="/admin" className="px-4 py-2 text-foreground hover:underline">
                Admin Dashboard
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}

