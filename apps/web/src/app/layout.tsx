import './global.css';

export const metadata = {
  title: 'Email Cadence App',
  description: 'A simple email scheduling app using Temporal.io and Typescript',
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
