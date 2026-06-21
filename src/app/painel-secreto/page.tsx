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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Tabs';
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
      toast({ title: 'Bem-vindo', description: 'Acesso autorizado.' });
    } catch (error: any) {
      toast({ 
        title: 'Erro de Acesso', 
        description: 'E-mail ou senha inválidos.', 
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
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
        promoPrice: product.promoPrice || 0,
        categoryId: product.categoryId,
        isMainCover: product.isMainCover,
        isHero: product.isHero,
        isPromo: product.isPromo,
        hidePrice: product.hidePrice,
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
      toast({ title: 'Erro', description: 'Preencha os campos obrigatórios.', variant: 'destructive' });
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
      toast({ title: 'Sucesso', description: 'Produto atualizado.' });
    } else {
      addProduct(formData);
      toast({ title: 'Sucesso', description: 'Produto criado.' });
    }
    setIsProductDialogOpen(false);
  };

  const handleAiDescription = async () => {
    if (!formData.material || !formData.style) {
      toast({ title: 'Atenção', description: 'Preencha o material e o estilo para usar o IA.', variant: 'destructive' });
      return;
    }
    setIsGenerating(true);
    try {
      const res = await generateProductDescription({
        material: formData.material,
        style: formData.style
      });
      setFormData({ ...formData, description: res.description });
      toast({ title: 'IA Concluída', description: 'Descrição gerada com sucesso.' });
    } catch (e) {
      toast({ title: 'Erro IA', description: 'Não foi possível gerar a descrição.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  if (authLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-headline tracking-widest text-primary uppercase">Aurum Admin</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-xl border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl text-primary">Acesso Restrito</CardTitle>
            <p className="text-xs uppercase tracking-widest opacity-60">Painel Administrativo Aurum</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@aurum.com.br"
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
                className="w-full bg-primary hover:bg-secondary"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Entrando...' : 'Entrar'}
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
          <h1 className="font-headline text-xl text-primary">Aurum Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground hidden sm:block">{user.email}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive">
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
                <CardTitle>Gerenciamento de Produtos</CardTitle>
                <Button onClick={() => handleOpenProductDialog()} className="bg-primary hover:bg-secondary">
                  <Plus className="w-4 h-4 mr-2" /> Novo Produto
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Foto</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Destaques</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="w-10 h-10 rounded bg-muted overflow-hidden">
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{categories.find(c => c.id === p.categoryId)?.name}</TableCell>
                        <TableCell>
                          {p.hidePrice ? 'Oculto' : `R$ ${p.isPromo ? p.promoPrice : p.price}`}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {p.isHero && <span className="bg-blue-100 text-blue-700 text-[10px] px-1 rounded">Hero</span>}
                            {p.isMainCover && <span className="bg-green-100 text-green-700 text-[10px] px-1 rounded">Capa</span>}
                            {p.isPromo && <span className="bg-rose-100 text-rose-700 text-[10px] px-1 rounded">Promo</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenProductDialog(p)}><Edit className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteProduct(p.id)} className="text-destructive"><Trash className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card className="max-w-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Categorias</CardTitle>
                <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" /> Nova Categoria</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Nova Categoria</DialogTitle></DialogHeader>
                    <div className="py-4">
                      <Label>Nome da Categoria</Label>
                      <Input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} />
                    </div>
                    <DialogFooter>
                      <Button onClick={() => { addCategory(newCatName); setNewCatName(''); setIsCategoryDialogOpen(false); }}>Salvar</Button>
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
                    {categories.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>{c.name}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => deleteCategory(c.id)} className="text-destructive"><Trash className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Product Form Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label>Nome do Produto*</Label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <Label>Categoria*</Label>
                <Select value={formData.categoryId} onValueChange={(val) => setFormData({...formData, categoryId: val})}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>URL da Foto</Label>
                <Input value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Preço Base (R$)</Label>
                  <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
                {formData.isPromo && (
                  <div>
                    <Label>Preço Promo (R$)</Label>
                    <Input type="number" value={formData.promoPrice} onChange={(e) => setFormData({...formData, promoPrice: Number(e.target.value)})} />
                  </div>
                )}
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="hero" checked={formData.isHero} onCheckedChange={(val) => setFormData({...formData, isHero: !!val})} />
                  <Label htmlFor="hero">Exibir no Carrossel (Destaque Topo)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="cover" checked={formData.isMainCover} onCheckedChange={(val) => setFormData({...formData, isMainCover: !!val})} />
                  <Label htmlFor="cover">Exibir na Capa Principal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="promo" checked={formData.isPromo} onCheckedChange={(val) => setFormData({...formData, isPromo: !!val})} />
                  <Label htmlFor="promo">Modo Promoção (Preço antigo/novo)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="hide" checked={formData.hidePrice} onCheckedChange={(val) => setFormData({...formData, hidePrice: !!val})} />
                  <Label htmlFor="hide">Exibir sem Preço (Consultar)</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-primary font-bold">Assistente de IA</Label>
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-[10px] uppercase">Material</Label>
                    <Input placeholder="Ex: Ouro 18k, Pérolas" value={formData.material} onChange={(e) => setFormData({...formData, material: e.target.value})} className="h-8 text-sm" />
                  </div>
                  <div>
                    <Label className="text-[10px] uppercase">Estilo</Label>
                    <Input placeholder="Ex: Minimalista, Vintage" value={formData.style} onChange={(e) => setFormData({...formData, style: e.target.value})} className="h-8 text-sm" />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs" 
                    onClick={handleAiDescription}
                    disabled={isGenerating}
                  >
                    {isGenerating ? 'Gerando...' : 'Gerar Descrição Elegante'}
                  </Button>
                </div>
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea 
                  className="h-40" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsProductDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveProduct} className="bg-primary">Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
