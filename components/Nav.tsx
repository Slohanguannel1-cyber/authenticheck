import Link from "next/link";
export default function Nav(){
 return <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#070711]/80 backdrop-blur-xl">
  <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
   <Link href="/" className="text-xl font-black tracking-tight">AUTHENTI<span className="text-indigo-400">CHECK</span></Link>
   <div className="hidden gap-7 text-sm text-white/65 md:flex"><Link href="/#how">Comment ça marche</Link><Link href="/pricing">Tarifs</Link><Link href="/dashboard">Dashboard</Link></div>
   <Link href="/analyze" className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-black hover:bg-white/90">Analyser</Link>
  </div>
 </nav>
}