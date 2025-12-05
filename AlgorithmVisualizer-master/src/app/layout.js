import localFont from "next/font/local";
import TargetCursor from "../components/ui/TargetCursor";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Algorithm Visualizer",
  description: "Explore and learn algorithms through visualization.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TargetCursor 
          spinDuration={2}
          hideDefaultCursor={true}
        />
        {children}
      </body>
    </html>
  );
}