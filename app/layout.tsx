
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{backgroundColor: "black", color:"white", margin: 0}}
      >
        {children}
      </body>
    </html>
  );
}
