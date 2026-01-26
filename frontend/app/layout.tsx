import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ToastProvider } from "@/providers/toast-provider";
import ChatBubble from "@/components/chat-bubble";

const montserrat = Montserrat({ 
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: [
    {
      url: "/logo.png",
      href: "/logo.png",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <html lang="vi" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    const theme = localStorage.getItem('theme');
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    const shouldBeDark = theme === 'dark' || (!theme && prefersDark);
                    if (shouldBeDark) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  } catch (e) {}
                  
                  // Suppress RSC (React Server Components) requests for static export
                  // These requests cause 404 errors in static export mode
                  if (typeof window !== 'undefined' && window.fetch) {
                    const originalFetch = window.fetch;
                    window.fetch = function(...args) {
                      const url = args[0]?.toString() || '';
                      // Block RSC requests (index.txt?_rsc=)
                      if (url.includes('index.txt?_rsc=') || url.includes('/_rsc=')) {
                        return Promise.resolve(new Response(null, { status: 404 }));
                      }
                      return originalFetch.apply(this, args);
                    };
                  }
                })();
              `,
            }}
          />
        </head>
        <body className={montserrat.className}>
          <ThemeProvider>
            <ToastProvider />
            {children}
            <ChatBubble />
          </ThemeProvider>
        </body>
      </html>
    </ReactQueryProvider>
  );
}
