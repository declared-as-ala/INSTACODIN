'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ProductForm } from '@/components/forms/product-form';
import { 
  useProducts, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct 
} from '@/hooks/use-products';
import { Product } from '@/types/api';
import { Edit, Trash2, Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProductsTableProps {
  selectedProductId?: string;
  onProductSelect: (product: Product) => void;
}

export function ProductsTable({ selectedProductId, onProductSelect }: ProductsTableProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const columns = [
    {
      key: 'name' as keyof Product,
      header: 'Product Name',
      sortable: true,
      render: (value: string, product: Product) => (
        <Button
          variant="ghost"
          className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent hover:text-primary"
          onClick={() => onProductSelect(product)}
        >
          {value}
        </Button>
      ),
    },
    {
      key: 'index' as keyof Product,
      header: 'Index',
      sortable: true,
      render: (value: number) => (
        <span className="inline-flex items-center justify-center w-8 h-8 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
          {value}
        </span>
      ),
    },
  ];

  const handleCreate = (data: { name: string }) => {
    createMutation.mutate(data, {
      onSuccess: () => setShowForm(false),
    });
  };

  const handleUpdate = (data: { name: string }) => {
    if (editingProduct) {
      updateMutation.mutate(
        { id: editingProduct.id, data },
        {
          onSuccess: () => setEditingProduct(null),
        }
      );
    }
  };

  const handleDelete = () => {
    if (deleteProduct) {
      deleteMutation.mutate(deleteProduct.id, {
        onSuccess: () => setDeleteProduct(null),
      });
    }
  };

  const actions = (product: Product) => (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setEditingProduct(product)}
        className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-200"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setDeleteProduct(product)}
        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:border-red-200"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Products</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Click on a product name to view its variants
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <DataTable
        data={products.map(product => ({
          ...product,
          isSelected: product.id === selectedProductId
        }))}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search products..."
        searchKeys={['name']}
        actions={actions}
        emptyMessage="No products found. Create your first product to get started."
      />

      <ProductForm
        open={showForm || !!editingProduct}
        onOpenChange={(open) => {
          setShowForm(open);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSubmit={editingProduct ? handleUpdate : handleCreate}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteProduct?.name}"? 
              This action cannot be undone and will also delete all associated variants.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}