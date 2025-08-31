'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Variant } from '@/types/api';

const variantSchema = z.object({
  name: z.string().min(1, 'Variant name is required').max(100, 'Name too long'),
});

type VariantFormData = z.infer<typeof variantSchema>;

interface VariantFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: Variant | null;
  productId: string;
  productName: string;
  onSubmit: (data: VariantFormData & { productId: string }) => void;
  isLoading?: boolean;
}

export function VariantForm({ 
  open, 
  onOpenChange, 
  variant, 
  productId,
  productName,
  onSubmit, 
  isLoading 
}: VariantFormProps) {
  const form = useForm<VariantFormData>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      name: variant?.name || '',
    },
  });

  const handleSubmit = (data: VariantFormData) => {
    onSubmit({ ...data, productId });
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {variant ? 'Edit Variant' : 'Add New Variant'}
          </DialogTitle>
          <DialogDescription>
            {variant 
              ? `Update the variant information for ${productName}.`
              : `Create a new variant for ${productName}.`
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Red Size 42" 
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : (variant ? 'Update' : 'Create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}