
"use client"

import { useState } from 'react';
import { useAurumStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash, Edit, Sparkles, LogOut, ChevronLeft } from 'lucide-react';
import { generateProductDescription } from '@/ai/flows/generate-product-description';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export default function AdminPage() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { products, categories, addProduct, updateProduct, deleteProduct, addCategory, deleteCategory, isInitialized } = useAurumStore();

  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    price: 0,
    promoPrice: 0,
    categoryId: '',
    isMainCover: false,
    isHero: false,
    isPromo: false,
    hidePrice: false,
    material: '',
    style: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Acesso concedido', description: 'Bem-vindo ao painel administrativo.' });
    } catch (error: any) {
      console.error("Erro de login:", error);
      toast({ 
        title: 'Erro de Autenticação', 
        description: error.message || 'Verifique suas credenciais e a configuração do Firebase.', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Sessão encerrada' });
    } catch (error) {
      toast({ title: 'Erro ao sair', variant: 'destructive' });
    }
  };

  const handleOpenProductDialog = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        price: product.price || 0,
        promoPrice: product.promoPrice || 0,
        categoryId: product.categoryId || '',
        isMainCover: !!product.isMainCover,
        isHero: !!product.isHero,
        isPromo: !!product.isPromo,
        hidePrice: !!product.hidePrice,
        material: product.material || '',
        style: product.style || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', description: '', imageUrl: '', price: 0, promoPrice: 0,
        categoryId: categories[0]?.id || '', isMainCover: false, isHero: false,
        isPromo: false, hidePrice: false, material: '', style: ''
      });
    }
    setIsProductDialogOpen(true);
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.categoryId) {
      toast({ title: 'Campo Obrigatório', description: 'Nome e Categoria são necessários.', variant: 'destructive' });
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
      toast({ title: 'Atualizado', description: 'Produto salvo com sucesso.' });
    } else {
      addProduct(formData);
      toast({ title: 'Criado', description: 'Novo produto adicionado ao catálogo.' });
    }
    setIsProductDialogOpen(false);
  };

  const handleAiDescription = async () => {
    if (!formData.material || !formData.style) {
      toast({ title: 'Faltam detalhes', description: 'Material e Estilo ajudam a IA a escrever melhor.', variant: 'destructive' });
      return;
    }
    setIsGenerating(true);
    try {
      const res = await generateProductDescription({
        material: formData.material,
        style: formData.style
      });
      setFormData({ ...formData, description: res.description });
      toast({ title: 'IA Finalizada', description: 'Descrição elegante gerada.' });
    } catch (e) {
      toast({ title: 'Erro na IA', description: 'Não foi possível conectar ao serviço de geração.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  if (authLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-headline tracking-widest text-primary uppercase">Carregando Painel...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-xl border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl text-primary">Login Administrativo</CardTitle>
            <p className="text-xs uppercase tracking-widest opacity-60">Aurum Digital Studio</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu-email@exemplo.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-none border-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pass">Senha</Label>
                <Input 
                  id="pass" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-none border-primary/20 focus:border-primary"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-secondary transition-colors"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Verificando...' : 'Entrar no Painel'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent/20">
      <header className="bg-white border-b h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-primary hover:text-secondary transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-headline text-xl text-primary">Gestão Aurum</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground hidden sm:block">{user.email}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:bg-destructive/10">
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <Tabs defaultValue="products">
          <TabsList className="mb-6 bg-white border">
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Catálogo de Joias</CardTitle>
                <Button onClick={() => handleOpenProductDialog()} className="bg-primary hover:bg-secondary">
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Peça
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Preview</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                          Nenhum produto cadastrado. Comece adicionando um novo!
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>
                            <div className="w-12 h-12 rounded bg-muted overflow-hidden border">
                              {p.imageUrl ? (
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[8px] uppercase">Sem foto</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell>{categories.find(c => c.id === p.categoryId)?.name || 'Sem Categoria'}</TableCell>
                          <TableCell>
                            {p.hidePrice ? 'Sob Consulta' : `R$ ${p.isPromo ? p.promoPrice : p.price}`}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {p.isHero && <span className="bg-blue-50 text-blue-600 text-[9px] px-2 py-0.5 rounded-full border border-blue-100 uppercase font-bold tracking-tighter">Topo</span>}
                              {p.isMainCover && <span className="bg-green-50 text-green-600 text-[9px] px-2 py-0.5 rounded-full border border-green-100 uppercase font-bold tracking-tighter">Capa</span>}
                              {p.isPromo && <span className="bg-rose-50 text-rose-600 text-[9px] px-2 py-0.5 rounded-full border border-rose-100 uppercase font-bold tracking-tighter">Promo</span>}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenProductDialog(p)} className="hover:text-primary"><Edit className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteProduct(p.id)} className="text-destructive hover:bg-destructive/10"><Trash className="w-4 h-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card className="max-w-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Categorias de Joias</CardTitle>
                <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" /> Nova Categoria</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Adicionar Categoria</DialogTitle></DialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="space-y-2">
                        <Label>Nome (ex: Colares, Brincos, Anéis)</Label>
                        <Input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Digite o nome..." />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => { if(newCatName) { addCategory(newCatName); setNewCatName(''); setIsCategoryDialogOpen(false); } }} className="bg-primary">Salvar Categoria</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">Crie categorias para organizar seus produtos.</TableCell>
                      </TableRow>
                    ) : (
                      categories.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">{c.name}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => deleteCategory(c.id)} className="text-destructive hover:bg-destructive/10"><Trash className="w-4 h-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Product Form Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">{editingProduct ? 'Editar Peça' : 'Nova Peça no Acervo'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do Produto*</Label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Ex: Colar Infinito" />
              </div>
              <div className="space-y-2">
                <Label>Categoria*</Label>
                <Select value={formData.categoryId} onValueChange={(val) => setFormData({...formData, categoryId: val})}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>URL da Imagem</Label>
                <Input value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preço Base (R$)</Label>
                  <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
                {formData.isPromo && (
                  <div className="space-y-2 text-secondary">
                    <Label>Preço Oferta (R$)</Label>
                    <Input type="number" value={formData.promoPrice} onChange={(e) => setFormData({...formData, promoPrice: Number(e.target.value)})} className="border-secondary/40" />
                  </div>
                )}
              </div>
              <div className="space-y-3 pt-4 border-t">
                <Label className="text-[10px] uppercase opacity-60">Visibilidade e Destaques</Label>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hero" className="text-xs">Destaque no Banner Topo</Label>
                  <Checkbox id="hero" checked={formData.isHero} onCheckedChange={(val) => setFormData({...formData, isHero: !!val})} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="cover" className="text-xs">Exibir na Home (Favoritos)</Label>
                  <Checkbox id="cover" checked={formData.isMainCover} onCheckedChange={(val) => setFormData({...formData, isMainCover: !!val})} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="promo" className="text-xs">Ativar Modo Promoção</Label>
                  <Checkbox id="promo" checked={formData.isPromo} onCheckedChange={(val) => setFormData({...formData, isPromo: !!val})} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hide" className="text-xs">Ocultar Preço (Consultar)</Label>
                  <Checkbox id="hide" checked={formData.hidePrice} onCheckedChange={(val) => setFormData({...formData, hidePrice: !!val})} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-primary font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Escrita Criativa IA
                  </Label>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-[10px] uppercase font-bold opacity-70">Material da Peça</Label>
                    <Input placeholder="Ex: Banhado a Ouro 18k, Cristais" value={formData.material} onChange={(e) => setFormData({...formData, material: e.target.value})} className="h-9 text-sm" />
                  </div>
                  <div>
                    <Label className="text-[10px] uppercase font-bold opacity-70">Estilo / Design</Label>
                    <Input placeholder="Ex: Boho Chic, Minimalista" value={formData.style} onChange={(e) => setFormData({...formData, style: e.target.value})} className="h-9 text-sm" />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs font-headline hover:bg-primary hover:text-white transition-all" 
                    onClick={handleAiDescription}
                    disabled={isGenerating}
                  >
                    {isGenerating ? 'Refinando texto...' : 'Gerar Descrição de Luxo'}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição Detalhada</Label>
                <Textarea 
                  className="h-32 resize-none" 
                  placeholder="A IA escreverá aqui, ou você pode digitar manualmente..."
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                />
              </div>
            </div>
          </div>
          <DialogFooter className="border-t pt-4">
            <Button variant="ghost" onClick={() => setIsProductDialogOpen(false)} className="text-xs">Descartar</Button>
            <Button onClick={handleSaveProduct} className="bg-primary px-8">Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
