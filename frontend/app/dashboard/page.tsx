'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/guards/auth-guard';
import { Header } from '@/components/layout/header';
import { ProductsTable } from '@/components/tables/products-table';
import { VariantsTable } from '@/components/tables/variants-table';
import { Product } from '@/types/api';
import { Card, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50/50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Product Management Dashboard
              </h1>
              <p className="text-slate-600">
                Manage your products and variants with advanced filtering and sorting capabilities.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <Card className="shadow-sm border-slate-200">
                <CardContent className="p-6">
                  <ProductsTable 
                    selectedProductId={selectedProduct?.id}
                    onProductSelect={handleProductSelect}
                  />
                </CardContent>
              </Card>

              <Card className="shadow-sm border-slate-200">
                <CardContent className="p-6">
                  <VariantsTable selectedProduct={selectedProduct} />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}