"use client";
import "./globals.css";
import { StrictMode } from "react";
import Navigation from "@/components/Navigation/Navigation";
import AppContextProvider from "@/components/AppContext";
import EventBusContextProvider from "@/components/EventBusContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StrictMode>
          <AppContextProvider>
            <EventBusContextProvider>
              <div className="app">
                <Navigation />
                {children}
              </div>
            </EventBusContextProvider>
          </AppContextProvider>
        </StrictMode>
      </body>
    </html>
  );
}
