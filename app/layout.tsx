import "./globals.css"
import Navbar from "./navbar";

export default function RootLayout({ children }: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <head/>
      <body>
        <Navbar/>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
