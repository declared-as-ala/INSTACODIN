'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { VariantForm } from '@/components/forms/variant-form';
import { 
  useVariants, 
  useCreateVariant, 
  useUpdateVariant, 
  useDeleteVariant 
} from '@/hooks/use-variants';
import { Product, Variant } from '@/types/api';
import { Edit, Trash2, Plus, Package } from 'lucide-react';
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

interface VariantsTableProps {
  selectedProduct: Product | null;
}

export function VariantsTable({ selectedProduct }: VariantsTableProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [deleteVariant, setDeleteVariant] = useState<Variant | null>(null);

  const { data: variants = [], isLoading } = useVariants(selectedProduct?.id);
  const createMutation = useCreateVariant();
  const updateMutation = useUpdateVariant();
  const deleteMutation = useDeleteVariant();

  const createdByOptions = useMemo(() => {
    const creators = Array.from(new Set(variants.map(v => v.createdBy)));
    return creators.map(creator => ({ label: creator, value: creator }));
  }, [variants]);

  const columns = [
    {
      key: 'name' as keyof Variant,
      header: 'Variant Name',
      sortable: true,
    },
    {
      key: 'skuCode' as keyof Variant,
      header: 'SKU Code',
      sortable: true,
      render: (value: string) => (
        <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">
          {value}
        </code>
      ),
    },
    {
      key: 'index' as keyof Variant,
      header: 'Index',
      sortable: true,
      render: (value: number) => (
        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {value}
        </span>
      ),
    },
    {
      key: 'createdBy' as keyof Variant,
      header: 'Created By',
      sortable: true,
      render: (value: string) => (
        <span className="inline-flex items-center gap-1 text-sm text-slate-600">
          <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium">{value.charAt(0).toUpperCase()}</span>
          </div>
          {value}
        </span>
      ),
    },
  ];

  const handleCreate = (data: { name: string; productId: string }) => {
    createMutation.mutate(data, {
      onSuccess: () => setShowForm(false),
    });
  };

  const handleUpdate = (data: { name: string }) => {
    if (editingVariant) {
      updateMutation.mutate(
        { id: editingVariant.id, data },
        {
          onSuccess: () => setEditingVariant(null),
        }
      );
    }
  };

  const handleDelete = () => {
    if (deleteVariant) {
      deleteMutation.mutate(deleteVariant.id, {
        onSuccess: () => setDeleteVariant(null),
      });
    }
  };

  const actions = (variant: Variant) => (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setEditingVariant(variant)}
        className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-200"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setDeleteVariant(variant)}
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
          <h2 className="text-2xl font-semibold">Variants</h2>
          {selectedProduct && (
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <Package className="h-4 w-4" />
              Showing variants for: <span className="font-medium">{selectedProduct.name}</span>
            </p>
          )}
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
          disabled={!selectedProduct}
          className="gap-2 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Variant
        </Button>
      </div>

      {!selectedProduct ? (
        <div className="border rounded-lg p-12 text-center">
          <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">No Product Selected</h3>
          <p className="text-slate-500">
            Select a product from the left panel to view and manage its variants
          </p>
        </div>
      ) : (
        <DataTable
          data={variants}
          columns={columns}
          isLoading={isLoading}
          searchPlaceholder="Search variants by name or SKU..."
          searchKeys={['name', 'skuCode']}
          filterKey="createdBy"
          filterOptions={createdByOptions}
          actions={actions}
          emptyMessage="No variants found for this product. Create your first variant to get started."
        />
      )}

      {selectedProduct && (
        <VariantForm
          open={showForm || !!editingVariant}
          onOpenChange={(open) => {
            setShowForm(open);
            setEditingVariant(null);
          }}
          variant={editingVariant}
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          onSubmit={editingVariant ? handleUpdate : handleCreate}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <AlertDialog open={!!deleteVariant} onOpenChange={() => setDeleteVariant(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Variant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteVariant?.name}"? 
              This action cannot be undone.
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