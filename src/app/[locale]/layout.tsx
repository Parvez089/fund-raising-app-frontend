/** @format */
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Navbar from "@/components/Navbar";
import "@/app/globals.css";
import Providers from "@/components/Providers";


export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const messages = await getMessages({ locale }); // ← pass locale explicitly



  return (
    <html lang={locale}>
      <body className="antialiased bg-slate-50">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>    
          <Navbar />
          <main>{children}</main>
           </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}