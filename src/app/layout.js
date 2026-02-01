import './globals.css';
import ClientAuthNav from '@/components/ClientAuthNav'; // NEW CLIENT COMPONENT
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="flex h-screen bg-[var(--page-bg)]">
            {/* NAVBAR */}
            <nav className="fixed h-full z-50 shadow-2xl border-r border-white/10 transition-all duration-300
              lg:w-[var(--navbar-w)] lg:bg-[var(--page-bg)] lg:px-[var(--padding)] lg:py-8 lg:flex lg:flex-col lg:gap-4 lg:rounded-r-lg
              w-[var(--navbar-w-mobile)] bg-[var(--page-bg)] px-4 py-6 flex flex-col gap-3 rounded-r-lg">
              
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-[var(--accent)] rounded mx-auto mb-6 lg:mb-8 
                             border-4 border-[var(--pane-bg)] text-xs font-bold shadow-lg flex items-center justify-center">
                [LOGO]
              </div>
              
              <div className="flex-1 flex flex-col gap-2 lg:gap-2">
                <NavLink href="/" icon="🏠" label="Home" />
                <NavLink href="/recipes" icon="🍳" label="Recipes" />
                <NavLink href="/favorites" icon="❤️" label="Favorites" />
                <NavLink href="/calculator" icon="🧮" label="Calculator" disabled />
                <NavLink href="/community" icon="👥" label="Community" disabled />
              </div>
              
              {/* AUTH NAV - CLIENT COMPONENT */}
              <div className="border-t border-white/20 pt-6 mt-auto">
                <ClientAuthNav />
              </div>
            </nav>
            
            {/* MAIN PANE */}
            <main className="transition-all duration-300 overflow-auto
              lg:ml-[calc(var(--navbar-w)+var(--padding-lg))] lg:w-[calc(100vw-var(--navbar-w)-var(--padding-lg)*3)] lg:h-[calc(100vh-var(--padding-lg)*2)] lg:mx-[var(--padding-lg)] lg:my-[var(--padding-lg)]
              ml-[calc(var(--navbar-w-mobile)+1rem)] w-[calc(100vw-var(--navbar-w-mobile)-2rem)] h-screen mx-4 my-0
              bg-[var(--pane-bg)] lg:rounded-lg shadow-2xl">
              <div className="p-[var(--padding-lg)] lg:p-[var(--padding-lg)] h-full">
                {children}
              </div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

function NavLink({ href, icon, label, disabled }) {
  return (
    <a href={disabled ? '#' : href} className={`
      py-3 px-3 lg:px-4 rounded flex items-center gap-3 font-medium transition-all duration-200 hover:scale-[1.02]
      text-white/80 hover:bg-white/10 hover:text-white shadow-md
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}>
      <div className="w-6 h-6 lg:w-6 lg:h-6 bg-[var(--accent)]/30 backdrop-blur-sm rounded flex items-center justify-center text-xs font-bold min-w-[24px]">
        {icon}
      </div>
      <span className="hidden lg:inline">{label}</span>
    </a>
  );
}
