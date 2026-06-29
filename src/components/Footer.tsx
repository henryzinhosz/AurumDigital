import Link from 'next/link';
import { Instagram, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-accent/30 text-secondary pt-20 pb-10 border-t border-primary/10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/painel-secreto" className="hover:opacity-80 transition-opacity mb-6">
              <h3 className="font-headline text-3xl text-secondary">Th Acessórios</h3>
            </Link>
            <p className="text-secondary/70 text-sm max-w-xs text-center md:text-left leading-relaxed font-body">
              Curadoria autêntica de bijuterias finas, criadas para destacar a sua essência mais delicada e natural através de detalhes que encantam.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h4 className="font-body font-bold text-xs uppercase tracking-[0.3em] mb-8 text-secondary/90">Atendimento</h4>
            <ul className="space-y-5 text-sm text-center font-body">
              <li className="flex items-center gap-3 justify-center group cursor-pointer">
                <Phone className="w-4 h-4 text-secondary/60 transition-transform group-hover:scale-110" />
                <span className="hover:text-primary transition-colors">(21) 99661-9548</span>
              </li>
              <li className="flex items-center gap-3 justify-center group cursor-pointer">
                <Mail className="w-4 h-4 text-secondary/60 transition-transform group-hover:scale-110" />
                <span className="hover:text-primary transition-colors">thacessorios@gmail.com</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <h4 className="font-body font-bold text-xs uppercase tracking-[0.3em] mb-8 text-secondary/90">Siga-nos</h4>
            <div className="flex gap-6">
              <Link href="#" className="p-4 bg-secondary/10 rounded-full text-secondary hover:bg-secondary/20 transition-all shadow-sm border border-secondary/10">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-4 bg-secondary/10 rounded-full text-secondary hover:bg-secondary/20 transition-all shadow-sm border border-secondary/10">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-secondary/10 pt-10 text-center relative">
          <p className="text-[10px] uppercase tracking-[0.5em] text-secondary/50 font-bold">
            &copy; {new Date().getFullYear()} Th Acessórios. Todos os direitos reservados<Link href="/painel-secreto" className="opacity-0 cursor-default">.</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
