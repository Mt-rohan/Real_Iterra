import "@fontsource/inter/400.css"; // Fallback to a guaranteed weight
import "./globals.css";

export const metadata = {
  title: "Iterra – AI Tennis Coach",
  description: "Upload your tennis video and get professional feedback",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
