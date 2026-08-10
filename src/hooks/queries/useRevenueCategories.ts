/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  revenueCategoriesService,
  CreateCategoryData,
  UpdateCategoryData,
  RevenueCategory,
} from "@/services/apiRevenueCategories";

export const revenueCategoryKeys = {
  all: ["revenue-categories"] as const,
  lists: () => [...revenueCategoryKeys.all, "list"] as const,
  list: (type?: "LEVY" | "PERMIT") =>
    typeof type === "undefined"
      ? ([...revenueCategoryKeys.lists()] as const)
      : ([...revenueCategoryKeys.lists()] as const),
  details: () => [...revenueCategoryKeys.all, "detail"] as const,
  detail: (id: string) => [...revenueCategoryKeys.details(), id] as const,
};

// Hook for revenue categories
export function useRevenueCategories(type?: "LEVY" | "PERMIT") {
  const queryClient = useQueryClient();

  // Get all categories
  const {
    data: categoriesResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: revenueCategoryKeys.list(type),
    queryFn: () => revenueCategoriesService.listCategories(type),
    staleTime: Infinity, // it should never go stale
  });

  const categories = categoriesResponse ?? [];

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateCategoryData) => revenueCategoriesService.createCategory(data),
    onSuccess: (newCategory) => {
      toast.success(`Category "${newCategory.name}" created successfully`);
      queryClient.invalidateQueries({ queryKey: revenueCategoryKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create category");
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryData }) =>
      revenueCategoriesService.updateCategory(id, data),
    onSuccess: (updatedCategory) => {
      toast.success(`Category "${updatedCategory.name}" updated successfully`);
      queryClient.invalidateQueries({ queryKey: revenueCategoryKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update category");
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => revenueCategoriesService.deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: revenueCategoryKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete category");
    },
  });

  // Helper: Get category by ID
  const getCategoryById = (id: string): RevenueCategory | undefined => {
    return categories.find((cat) => cat.id === id);
  };

  // Helper: Get category by slug
  const getCategoryBySlug = (slug: string): RevenueCategory | undefined => {
    return categories.find((cat) => cat.slug === slug);
  };

  // Helper: Get active categories only
  const activeCategories = categories.filter((cat) => cat.isActive);

  // Helper: Get categories with usage counts
  const categoriesWithUsage = categories.map((cat) => ({
    ...cat,
    usageCount:
      (cat._count?.levyConfigs || 0) +
      (cat._count?.permitConfigs || 0) +
      (cat._count?.invoices || 0),
  }));

  return {
    // Data
    categories,
    activeCategories,
    categoriesWithUsage,
    isLoading,
    error,
    refetch,

    // Helper functions
    getCategoryById,
    getCategoryBySlug,

    // Mutations
    createCategory: createCategoryMutation.mutate,
    createCategoryAsync: createCategoryMutation.mutateAsync,
    isCreating: createCategoryMutation.isPending,
    createError: createCategoryMutation.error,

    updateCategory: updateCategoryMutation.mutate,
    updateCategoryAsync: updateCategoryMutation.mutateAsync,
    isUpdating: updateCategoryMutation.isPending,
    updateError: updateCategoryMutation.error,

    deleteCategory: deleteCategoryMutation.mutate,
    deleteCategoryAsync: deleteCategoryMutation.mutateAsync,
    isDeleting: deleteCategoryMutation.isPending,
    deleteError: deleteCategoryMutation.error,
  };
}
