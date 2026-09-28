import { ShoppingCart, Menu, User, LogOut, Package, LayoutDashboard, Store, PhoneCall, Home as HomeIcon, ShieldCheck, Leaf, Truck, HelpCircle, ChevronDown, MessageCircle, FileText } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cartStore';
import { api, auth } from '@/lib/api';
import { useState, useEffect, useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import melodivaLogo from '/public/melodiva-logo.png';

const Header = () => {
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);
  const getCartTotal = useCartStore((state) => state.getTotal);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = getCartTotal();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const adminEmails = useMemo(() => {
    return (import.meta.env.VITE_ADMIN_EMAILS ?? '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
  }, []);

  const isAdmin = useMemo(() => {
    if (!user?.email) return false;
    if (adminEmails.length === 0) return true;
    return adminEmails.includes(user.email.toLowerCase());
  }, [user, adminEmails]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    if (user) {
      api.getProfile()
        .then((data) => setProfile(data))
        .catch(() => setProfile(null));

      api
        .checkAffiliate()
        .then((res) => setIsAffiliate(res.isAffiliate))
        .catch(() => setIsAffiliate(false));
    } else {
      setProfile(null);
      setIsAffiliate(false);
    }
  }, [user]);

  const fullName = useMemo(() => {
    return profile?.full_name || user?.user_metadata?.full_name || user?.full_name || '';
  }, [profile, user]);

  const displayName = useMemo(() => {
    if (fullName && fullName.trim()) {
      return fullName.trim().split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  }, [fullName, user]);

  const userInitial = useMemo(() => {
    return (displayName || 'U').charAt(0).toUpperCase();
  }, [displayName]);

  const handleSignOut = async () => {
    await api.signOut();
    window.location.href = '/';
  };

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Shop', href: '/shop', icon: Store },
    { name: 'Shipping', href: '/shipping', icon: Truck },
    { name: 'Contact', href: '/contact', icon: PhoneCall },
    ...(isAdmin ? [{ name: 'Admin', href: '/admin', icon: ShieldCheck }] : []),
  ];

  return (
    <div className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Announcement Bar (Shows only at top of page) */}
      {!scrolled && (
        <div className="hidden md:block bg-primary/95 text-primary-foreground py-1.5 px-4 text-xs font-semibold tracking-wide transition-all duration-300 border-b border-primary/20 animate-fade-in">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 mx-auto md:mx-0">
              <Leaf className="w-3.5 h-3.5 text-emerald-100 shrink-0" />
              <span className="truncate">
                100% Organic & Eco-Friendly Skincare | Fast Nigeria-Wide Shipping
              </span>
              <Truck className="w-3.5 h-3.5 text-emerald-100 shrink-0 hidden sm:inline" />
            </div>
            <div className="hidden md:flex items-center gap-4 text-[11px] font-medium opacity-90">
              <Link to="/shipping" className="hover:underline flex items-center gap-1">
                <Truck className="w-3 h-3" /> Delivery Rates
              </Link>
              <span>•</span>
              <Link 
                to="/order-history" 
                className="hover:underline flex items-center gap-1 text-emerald-100 font-bold"
              >
                <Package className="w-3.5 h-3.5" /> Track Order
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Glass Header */}
      <header className={`transition-all duration-300 ${scrolled ? 'px-3 md:px-6 py-2' : 'px-4 md:px-8 py-2'}`}>
        <div
          className={`mx-auto transition-all duration-300 ${
            scrolled
              ? 'max-w-3xl lg:max-w-4xl xl:max-w-5xl bg-background/90 dark:bg-zinc-950/90 backdrop-blur-2xl border border-primary/25 shadow-[0_10px_35px_rgba(0,0,0,0.12)] py-2 px-4 md:px-6 rounded-full'
              : 'max-w-7xl bg-transparent border border-transparent shadow-none py-2.5 px-2 md:px-4 rounded-none'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
              <img
                src={melodivaLogo}
                alt="Melodiva Logo"
                className="h-10 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-lg md:text-xl font-black tracking-tight text-foreground flex items-center gap-1.5 whitespace-nowrap">
                <span className="font-black">Melodiva</span>
                <span className="text-primary font-black">Skin Care</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-2 bg-secondary/60 backdrop-blur-md p-1.5 rounded-full border border-border/60 shadow-inner">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const IconComp = item.icon;
                if (item.href === '/admin') {
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 text-foreground/80 hover:text-primary hover:bg-background/80"
                    >
                      <IconComp className="h-3.5 w-3.5" />
                      <span>{item.name}</span>
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-102'
                        : 'text-foreground/80 hover:text-primary hover:bg-background/80'
                    }`}
                  >
                    <IconComp className="h-3.5 w-3.5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Controls & Cart */}
            <div className="flex items-center space-x-3">
              {/* Cart Button */}
              <Link to="/cart">
                <Button
                  variant="ghost"
                  className={`relative rounded-full h-10 px-4 bg-secondary/70 hover:bg-primary/15 transition-all border border-border/60 flex items-center gap-2 ${
                    cartCount > 0 ? 'border-primary/40 bg-primary/5' : ''
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <ShoppingCart className="h-4.5 w-4.5 text-foreground group-hover:text-primary transition-colors" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-2.5 -right-2.5 h-4.5 min-w-[18px] px-1 flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-black border-2 border-background animate-pulse-glow rounded-full">
                        {cartCount}
                      </Badge>
                    )}
                  </div>
                  {cartCount > 0 && (
                    <span className="hidden sm:inline text-xs font-extrabold text-primary">
                      ₦{cartTotal.toLocaleString()}
                    </span>
                  )}
                </Button>
              </Link>

              {/* User Account Dropdown */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="rounded-full h-10 px-3.5 border border-primary/30 bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-all hidden md:flex items-center gap-2"
                    >
                      <div className="w-6 h-6 rounded-full shrink-0 aspect-square bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-black uppercase leading-none">
                        {userInitial}
                      </div>
                      <span className="text-xs font-bold max-w-[130px] truncate">{displayName}</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2 bg-card/95 backdrop-blur-xl border-border shadow-2xl animate-fade-in-up">
                    <DropdownMenuLabel className="font-normal p-2.5 rounded-xl bg-secondary/50 mb-1">
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-xs font-extrabold text-foreground truncate">{fullName || displayName}</p>
                        <p className="text-[11px] font-medium text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer rounded-xl text-xs py-2 font-medium">
                      <User className="h-4 w-4 mr-2.5 text-primary" />
                      Profile & Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/order-history')} className="cursor-pointer rounded-xl text-xs py-2 font-medium">
                      <Package className="h-4 w-4 mr-2.5 text-primary" />
                      Order History
                    </DropdownMenuItem>
                    {isAffiliate && (
                      <DropdownMenuItem onClick={() => navigate('/affiliate-dashboard')} className="cursor-pointer rounded-xl text-xs py-2 font-medium">
                        <LayoutDashboard className="h-4 w-4 mr-2.5 text-primary" />
                        Affiliate Dashboard
                      </DropdownMenuItem>
                    )}
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => window.open('/admin', '_blank')} className="cursor-pointer rounded-xl text-xs py-2 font-medium text-emerald-600 dark:text-emerald-400 font-bold">
                        <ShieldCheck className="h-4 w-4 mr-2.5 text-primary" />
                        Admin Control Panel ↗
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem onClick={() => navigate('/shipping')} className="cursor-pointer rounded-xl text-xs py-2 text-muted-foreground">
                      <Truck className="h-3.5 w-3.5 mr-2.5" />
                      Shipping & Delivery
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/returns')} className="cursor-pointer rounded-xl text-xs py-2 text-muted-foreground">
                      <FileText className="h-3.5 w-3.5 mr-2.5" />
                      Refund Policy
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer rounded-xl text-xs py-2 text-destructive focus:text-destructive font-semibold">
                      <LogOut className="h-4 w-4 mr-2.5" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild size="sm" className="btn-primary rounded-full px-5 text-xs font-extrabold hidden md:flex shadow-md shadow-primary/20">
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}

              {/* Mobile Drawer Trigger */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 border border-border/80 bg-secondary/50">
                    <Menu className="h-5 w-5 text-foreground" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[310px] sm:w-[340px] rounded-l-3xl p-5 sm:p-6 pb-10 sm:pb-12 bg-card/95 backdrop-blur-2xl border-border flex flex-col justify-between overflow-y-auto max-h-screen">
                  <div>
                    <SheetHeader className="text-left pb-4 border-b border-border">
                      <SheetTitle className="flex items-center gap-2">
                        <img src={melodivaLogo} alt="Melodiva" className="h-8 w-auto object-contain" />
                        <span className="font-black text-foreground text-base flex items-center gap-1">
                          <span className="font-black">Melodiva</span>
                          <span className="text-primary font-black">Skin Care</span>
                        </span>
                      </SheetTitle>
                    </SheetHeader>

                    {/* Navigation Items */}
                    <nav className="flex flex-col space-y-1.5 mt-5">
                      {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        const IconComp = item.icon;
                        if (item.href === '/admin') {
                          return (
                            <a
                              key={item.name}
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all text-foreground/80 hover:bg-secondary/70"
                            >
                              <IconComp className="h-4 w-4" />
                              <span>{item.name}</span>
                            </a>
                          );
                        }
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                              isActive
                                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                                : 'text-foreground/90 hover:bg-secondary/70'
                            }`}
                          >
                            <IconComp className="h-5 w-5 shrink-0" />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </nav>

                    {/* Policy Shortcuts Grid */}
                    <div className="mt-8 pt-6 border-t border-border/80">
                      <p className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground px-1 mb-3">
                        Information & Policies
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                        <Link
                          to="/shipping"
                          onClick={() => setMobileMenuOpen(false)}
                          className="p-3 rounded-2xl bg-secondary/50 hover:bg-secondary flex items-center gap-2.5 text-foreground text-xs font-bold transition-all border border-border/40"
                        >
                          <Truck className="w-4 h-4 text-primary shrink-0" /> Shipping
                        </Link>
                        <Link
                          to="/returns"
                          onClick={() => setMobileMenuOpen(false)}
                          className="p-3 rounded-2xl bg-secondary/50 hover:bg-secondary flex items-center gap-2.5 text-foreground text-xs font-bold transition-all border border-border/40"
                        >
                          <FileText className="w-4 h-4 text-primary shrink-0" /> Refunds
                        </Link>
                        <Link
                          to="/privacy"
                          onClick={() => setMobileMenuOpen(false)}
                          className="p-3 rounded-2xl bg-secondary/50 hover:bg-secondary flex items-center gap-2.5 text-foreground text-xs font-bold transition-all border border-border/40"
                        >
                          <HelpCircle className="w-4 h-4 text-primary shrink-0" /> Privacy
                        </Link>
                        <Link
                          to="/terms"
                          onClick={() => setMobileMenuOpen(false)}
                          className="p-3 rounded-2xl bg-secondary/50 hover:bg-secondary flex items-center gap-2.5 text-foreground text-xs font-bold transition-all border border-border/40"
                        >
                          <FileText className="w-4 h-4 text-primary shrink-0" /> Terms
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Account / Auth & WhatsApp Actions at bottom */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    {user ? (
                      <div className="space-y-2">
                        <div className="p-3 rounded-2xl bg-secondary/60 border border-border/60">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground">Account</p>
                          <p className="text-xs font-bold text-foreground truncate">{fullName || displayName}</p>
                          <p className="text-[11px] font-medium text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() => {
                              navigate('/profile');
                              setMobileMenuOpen(false);
                            }}
                            variant="outline"
                            className="rounded-xl text-xs font-bold h-9"
                          >
                            Profile
                          </Button>
                          <Button
                            onClick={() => {
                              navigate('/order-history');
                              setMobileMenuOpen(false);
                            }}
                            variant="outline"
                            className="rounded-xl text-xs font-bold h-9"
                          >
                            Orders
                          </Button>
                        </div>
                        <Button
                          onClick={() => {
                            handleSignOut();
                            setMobileMenuOpen(false);
                          }}
                          variant="destructive"
                          className="w-full rounded-xl text-xs font-bold h-9"
                        >
                          <LogOut className="h-3.5 w-3.5 mr-2" /> Sign Out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button asChild className="w-full btn-primary rounded-xl text-xs font-bold h-10 shadow-md" onClick={() => setMobileMenuOpen(false)}>
                          <Link to="/auth">Sign In / Create Account</Link>
                        </Button>
                      </div>
                    )}

                    <a
                      href="https://wa.me/2348078725283"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm border border-emerald-500/30 transition-all shadow-xs"
                    >
                      <FaWhatsapp className="w-4.5 h-4.5 text-emerald-500 shrink-0" /> Need Help? Chat on WhatsApp
                    </a>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;

