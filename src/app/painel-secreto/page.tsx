
"use client"

import { useState, useRef } from 'react';
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
import { Plus, Trash, Edit, Sparkles, LogOut, ChevronLeft, ImagePlus, X } from 'lucide-react';
import { generateProductDescription } from '@/ai/flows/generate-product-description';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import Image from 'next/image';

export default function AdminPage() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
        description: error.code === 'auth/invalid-api-key' ? 'Configuração do Firebase inválida.' : error.message || 'Verifique suas credenciais.', 
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for base64 in firestore
        toast({ title: 'Arquivo muito grande', description: 'Tente uma imagem menor que 1MB.', variant: 'destructive' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
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

  // Helper to format price for input
  const formatPriceInput = (value: number) => {
    if (value === 0) return '';
    return value.toString().replace('.', ',');
  };

  const parsePriceInput = (value: string) => {
    const cleaned = value.replace(',', '.');
    return cleaned === '' ? 0 : parseFloat(cleaned);
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
            <p className="text-xs uppercase tracking-widest opacity-60">Th Acessórios Studio</p>
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
          <h1 className="font-headline text-xl text-primary">Gestão Th Acessórios</h1>
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
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">{editingProduct ? 'Editar Peça' : 'Nova Peça no Acervo'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-6">
            {/* Left Column: Image and Details */}
            <div className="md:col-span-5 space-y-6">
              <div 
                className="relative aspect-square rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center overflow-hidden group cursor-pointer hover:border-primary/40 transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                {formData.imageUrl ? (
                  <>
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <p className="text-white text-xs font-bold uppercase tracking-widest">Trocar Imagem</p>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({...formData, imageUrl: ''});
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <div className="bg-primary/10 p-4 rounded-full inline-block mb-3">
                      <ImagePlus className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">Carregar Foto</p>
                    <p className="text-[10px] text-muted-foreground mt-2 px-4 italic">Escolha uma foto da sua galeria (máx. 1MB)</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
              </div>

              <div className="space-y-4 bg-white p-4 rounded-xl border shadow-sm">
                <Label className="text-[10px] uppercase font-bold opacity-60">Configurações de Exibição</Label>
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

            {/* Right Column: Text Information */}
            <div className="md:col-span-7 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Peça*</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Ex: Brinco Pérola" />
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preço Base (R$)</Label>
                  <Input 
                    placeholder="Ex: 45,90" 
                    value={formatPriceInput(formData.price)} 
                    onChange={(e) => setFormData({...formData, price: parsePriceInput(e.target.value)})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preço Oferta (R$)</Label>
                  <Input 
                    disabled={!formData.isPromo}
                    placeholder={formData.isPromo ? "Ex: 39,90" : "Ative 'Promoção'"} 
                    value={formatPriceInput(formData.promoPrice)} 
                    onChange={(e) => setFormData({...formData, promoPrice: parsePriceInput(e.target.value)})} 
                    className={formData.isPromo ? "border-secondary/40 text-secondary" : ""}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Material</Label>
                  <Input placeholder="Ex: Banhado a Ouro 18k" value={formData.material} onChange={(e) => setFormData({...formData, material: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Estilo / Design</Label>
                  <Input placeholder="Ex: Minimalista" value={formData.style} onChange={(e) => setFormData({...formData, style: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <Label>Descrição Detalhada</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-[10px] uppercase font-bold text-primary gap-1"
                    onClick={handleAiDescription}
                    disabled={isGenerating}
                  >
                    <Sparkles className="w-3 h-3" /> {isGenerating ? 'Escrevendo...' : 'Gerar com IA'}
                  </Button>
                </div>
                <Textarea 
                  className="h-32 resize-none leading-relaxed" 
                  placeholder="Conte a história desta peça..."
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                />
              </div>
            </div>
          </div>
          <DialogFooter className="border-t pt-4">
            <Button variant="ghost" onClick={() => setIsProductDialogOpen(false)}>Descartar</Button>
            <Button onClick={handleSaveProduct} className="bg-primary px-8">Salvar no Acervo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
