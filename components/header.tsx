import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="FreePPT home">
        <span className="brand-mark"><Sparkles size={18} /></span>
        <span>FreePPT</span>
      </Link>
      <nav>
        <Link href="/resources">Resources</Link>
        <Link href="/queue">My decks</Link>
        <Link href="/pricing">Pricing</Link>
        <button className="login-button">Sign in</button>
      </nav>
    </header>
  );
}
