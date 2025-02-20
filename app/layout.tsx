import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./utils/context/context";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from 'react-toastify';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              border: '3px solid rgb(51, 9, 133)',
              padding: '16px',
              color: 'rgb(51, 9, 133)',
            },
            duration: 4000,
          }}
        />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="light"
        />
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
