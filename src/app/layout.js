import './globals.css';
import ClientAuthNav from '@/components/ClientAuthNav'; // NEW CLIENT COMPONENT
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/NavBar';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="flex h-screen bg-[var(--page-bg)]">
            
            <NavBar />

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


