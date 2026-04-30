import "./globals.css";  
import Navbar from "./components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">  
        <Navbar />
        <main>{children}</main> 
      </body>
    </html>
  );
}