import "./globals.css";
export const metadata = { title:"Authenticheck", description:"Analyse intelligente d'articles de seconde main." };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr"><body>{children}</body></html>}