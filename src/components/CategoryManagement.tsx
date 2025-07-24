import React, { useState } from 'react';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Category } from '@/types';

interface CategoryManagementProps {
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
}

interface SortableCategoryProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

const SortableCategory: React.FC<SortableCategoryProps> = ({
  category,
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
  } = useSortable({ id: category.id });

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
      <div className="flex items-center gap-3">
        <div
          className="cursor-grab hover:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-medium">{category.name}</h3>
          <p className="text-xs text-muted-foreground">Ordem: {category.order}</p>
        </div>
      </div>
      
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(category)}
        >
          <Edit className="w-3 h-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(category.id)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export const CategoryManagement: React.FC<CategoryManagementProps> = ({
  categories,
  onUpdateCategories
}) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
  });
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  const resetForm = () => {
    setFormData({ name: '' });
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório",
        variant: "destructive",
      });
      return;
    }

    let updatedCategories;
    if (editingCategory) {
      updatedCategories = categories.map(c => 
        c.id === editingCategory.id 
          ? { ...c, name: formData.name }
          : c
      );
      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso!",
      });
    } else {
      const maxOrder = Math.max(...categories.map(c => c.order), 0);
      const newCategory: Category = {
        id: `category-${Date.now()}`,
        name: formData.name,
        order: maxOrder + 1
      };
      updatedCategories = [...categories, newCategory];
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso!",
      });
    }

    onUpdateCategories(updatedCategories);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (categoryId: string) => {
    const updatedCategories = categories.filter(c => c.id !== categoryId);
    onUpdateCategories(updatedCategories);
    toast({
      title: "Sucesso",
      description: "Categoria removida com sucesso!",
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sortedCategories.findIndex(item => item.id === active.id);
      const newIndex = sortedCategories.findIndex(item => item.id === over?.id);
      
      const reorderedCategories = arrayMove(sortedCategories, oldIndex, newIndex);
      
      // Atualizar as ordens
      const updatedCategories = reorderedCategories.map((category, index) => ({
        ...category,
        order: index + 1
      }));

      onUpdateCategories(updatedCategories);
      
      toast({
        title: "Sucesso",
        description: "Ordem das categorias atualizada!",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gerenciar Categorias</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Categoria *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Hambúrgueres"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingCategory ? 'Atualizar' : 'Criar'} Categoria
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Arraste as categorias para reordená-las
        </p>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedCategories.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {sortedCategories.map((category) => (
                <SortableCategory
                  key={category.id}
                  category={category}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};