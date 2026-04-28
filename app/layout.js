import "./globals.css";

export const metadata = {
  title: "Sua Conselheira Bíblica",
  description: "Direção bíblica clara e prática para mulheres em restauração do casamento.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport = {
  themeColor: "#0f0f0f",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}