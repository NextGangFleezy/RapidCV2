import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/ui/logo';

export default function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/builder', label: 'Builder' },
    { href: '/contact', label: 'Contact' }
  ];

  const isActive = (href: string) => {
    if (href === '/' && location === '/') return true;
    if (href !== '/' && location.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Logo size="md" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`transition-colors ${
                  isActive(href) 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link href="/builder">
              <Button className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={`transition-colors text-lg ${
                        isActive(href) 
                          ? 'text-primary font-medium' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {label}
                    </Link>
                  ))}
                  <Link href="/builder">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90" 
                      onClick={() => setIsOpen(false)}
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
