import { Footer } from './footer';
import { Header } from './header';

type Prop = {
  children: React.ReactNode
}

export default function MarketingLayout({ children }: Prop) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex flex-col flex-1 items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}
