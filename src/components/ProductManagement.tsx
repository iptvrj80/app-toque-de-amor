import React, { useState } from 'react';
import { Plus, Edit, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';
import { Product, Category } from '@/types';

interface ProductManagementProps {
  products: Product[];
  categories: Category[];
  onUpdateProducts: (products: Product[]) => void;
}

interface SortableProductProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const SortableProduct: React.FC<SortableProductProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
    >
      <div className="flex items-center gap-3 flex-1">
        <div
          className="cursor-grab hover:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{product.name}</h4>
            {product.isFeatured && (
              <Badge variant="secondary" className="text-xs">Destaque</Badge>
            )}
            <Badge variant={product.isAvailable ? "default" : "destructive"} className="text-xs">
              {product.isAvailable ? 'Disponível' : 'Indisponível'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {product.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Ordem: {product.order}</span>
            <span>R$ {product.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(product)}
        >
          <Edit className="w-3 h-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(product.id)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

interface CategorySectionProps {
  category: Category;
  products: Product[];
  onProductEdit: (product: Product) => void;
  onProductDelete: (productId: string) => void;
  onProductsReorder: (categoryId: string, reorderedProducts: Product[]) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  products,
  onProductEdit,
  onProductDelete,
  onProductsReorder,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortedProducts = [...products].sort((a, b) => a.order - b.order);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sortedProducts.findIndex(item => item.id === active.id);
      const newIndex = sortedProducts.findIndex(item => item.id === over?.id);
      
      const reorderedProducts = arrayMove(sortedProducts, oldIndex, newIndex);
      
      // Atualizar as ordens
      const updatedProducts = reorderedProducts.map((product, index) => ({
        ...product,
        order: index + 1
      }));

      onProductsReorder(category.id, updatedProducts);
      
      toast({
        title: "Sucesso",
        description: "Ordem dos produtos atualizada!",
      });
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-4 h-auto">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{category.name}</h3>
            <Badge variant="outline">{sortedProducts.length} produtos</Badge>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 px-4 pb-4">
        {sortedProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum produto nesta categoria
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedProducts.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {sortedProducts.map((product) => (
                  <SortableProduct
                    key={product.id}
                    product={product}
                    onEdit={onProductEdit}
                    onDelete={onProductDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  categories,
  onUpdateProducts
}) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    serves: '',
    volume: '',
    isAvailable: true,
    isFeatured: false,
    image: '',
    tags: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      serves: '',
      volume: '',
      isAvailable: true,
      isFeatured: false,
      image: '',
      tags: ''
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category,
      serves: product.serves || '',
      volume: product.volume || '',
      isAvailable: product.isAvailable,
      isFeatured: product.isFeatured || false,
      image: product.image,
      tags: product.tags?.join(', ') || ''
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const productData: Product = {
      id: editingProduct?.id || `product-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      category: formData.category,
      serves: formData.serves || undefined,
      volume: formData.volume || undefined,
      isAvailable: formData.isAvailable,
      isFeatured: formData.isFeatured,
      image: formData.image || '/placeholder.svg',
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : undefined,
      order: editingProduct?.order || Math.max(...products.filter(p => p.category === formData.category).map(p => p.order), 0) + 1
    };

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? productData : p);
      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso!",
      });
    } else {
      updatedProducts = [...products, productData];
      toast({
        title: "Sucesso",
        description: "Produto criado com sucesso!",
      });
    }

    onUpdateProducts(updatedProducts);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (productId: string) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    onUpdateProducts(updatedProducts);
    toast({
      title: "Sucesso",
      description: "Produto removido com sucesso!",
    });
  };

  const handleProductsReorder = (categoryId: string, reorderedProducts: Product[]) => {
    const updatedProducts = products.map(product => {
      const reorderedProduct = reorderedProducts.find(p => p.id === product.id);
      return reorderedProduct || product;
    });
    onUpdateProducts(updatedProducts);
  };

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gerenciamento de Produtos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Hambúrguer Clássico"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o produto..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Preço *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Preço Original</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortedCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serves">Serve</Label>
                  <Input
                    id="serves"
                    value={formData.serves}
                    onChange={(e) => setFormData({ ...formData, serves: e.target.value })}
                    placeholder="Ex: 1-2 pessoas"
                  />
                </div>
                <div>
                  <Label htmlFor="volume">Volume</Label>
                  <Input
                    id="volume"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    placeholder="Ex: 500ml"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image">URL da Imagem</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="novo, promoção, vegano"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                  />
                  <Label htmlFor="isAvailable">Disponível</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                  />
                  <Label htmlFor="isFeatured">Destaque</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingProduct ? 'Atualizar' : 'Criar'} Produto
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          Arraste os produtos para reordená-los dentro de cada categoria
        </p>
        <div className="space-y-4">
          {sortedCategories.map((category) => {
            const categoryProducts = products.filter(p => p.category === category.id);
            return (
              <div key={category.id} className="border border-border rounded-lg">
                <CategorySection
                  category={category}
                  products={categoryProducts}
                  onProductEdit={handleEdit}
                  onProductDelete={handleDelete}
                  onProductsReorder={handleProductsReorder}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};