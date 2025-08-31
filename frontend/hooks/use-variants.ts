import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { Variant, CreateVariantRequest, UpdateVariantRequest } from '@/types/api';
import { toast } from 'sonner';

export const useVariants = (productId?: string) => {
  return useQuery({
    queryKey: ['variants', productId],
    queryFn: () => apiClient.getVariants(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateVariant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateVariantRequest) => apiClient.createVariant(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['variants', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['variants'] });
      toast.success('Variant created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create variant');
    },
  });
};

export const useUpdateVariant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVariantRequest }) => 
      apiClient.updateVariant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variants'] });
      toast.success('Variant updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update variant');
    },
  });
};

export const useDeleteVariant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteVariant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variants'] });
      toast.success('Variant deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete variant');
    },
  });
};