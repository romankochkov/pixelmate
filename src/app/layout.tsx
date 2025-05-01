import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "AI Pixel Sprite Generation | Pixelmate"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Create stunning pixel art sprites effortlessly with our AI-powered generator. Whether you're designing characters, creatures, or objects, our tool delivers high-quality, pixel-style sprites in seconds. Customize your creations with advanced options and bring your game or project to life with unique pixel-perfect designs." />
        <meta name="keywords" content="pixelmate, sprite, ai generation, game dev, pixel art" />
        <meta name="author" content="Pixelmate Inc." />
        <meta name="robots" content="index, follow" />

        <meta property="og:title" content="AI Pixel Sprite Generation | Pixelmate" />
        <meta property="og:description" content="Create stunning pixel art sprites effortlessly with our AI-powered generator. Whether you're designing characters, creatures, or objects, our tool delivers high-quality, pixel-style sprites in seconds. Customize your creations with advanced options and bring your game or project to life with unique pixel-perfect designs." />
        <meta property="og:image" content="/pictures/meta.png" />

        <script async src="https://www.googletagmanager.com/gtag/js?id=G-Q8JSP4E268"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Q8JSP4E268');
            `,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
