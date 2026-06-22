import Link from 'next/link';
import { Instagram, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/painel-secreto" className="hover:opacity-80 transition-opacity">
              <h3 className="font-headline text-2xl text-primary mb-4">Th Acessórios</h3>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs text-center md:text-left leading-relaxed">
              Curadoria autêntica de bijuterias finas, criadas para destacar a sua essência mais delicada e natural.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h4 className="font-body font-bold text-xs uppercase tracking-[0.2em] mb-6">Atendimento</h4>
            <ul className="space-y-4 text-sm text-center">
              <li className="flex items-center gap-2 justify-center">
                <Phone className="w-4 h-4 text-primary" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-2 justify-center">
                <Mail className="w-4 h-4 text-primary" />
                <span>contato@thacessorios.com.br</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <h4 className="font-body font-bold text-xs uppercase tracking-[0.2em] mb-6">Siga-nos</h4>
            <div className="flex gap-4">
              <Link href="#" className="p-3 bg-accent rounded-full text-primary hover:bg-primary hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-3 bg-accent rounded-full text-primary hover:bg-primary hover:text-white transition-all">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-8 text-center relative">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-60">
            &copy; {new Date().getFullYear()} Th Acessórios. Todos os direitos reservados<Link href="/painel-secreto" className="opacity-0 cursor-default">.</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
