import {IBM_Plex_Sans_Arabic,IBM_Plex_Mono} from "next/font/google"
import "./globals.css";


const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-plex-mono",
  display: "swap",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`scroll-smooth ${plex.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">
        {children}
        </body>
    </html>
  );
}
