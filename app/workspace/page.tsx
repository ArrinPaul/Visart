import { Suspense } from 'react';
import { getProductById, getRecentProducts } from '@/lib/supabase/products';
import { SEED_PRODUCTS } from '@/lib/data/seed';
import { WorkspaceContainer } from '@/components/workspace/WorkspaceContainer';

export default async function WorkspacePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const recentProducts = await getRecentProducts();
  // Ensure we always have some products to show, fallback to seed if DB is empty
  const validRecentProducts = recentProducts.length > 0 ? recentProducts : SEED_PRODUCTS;
  
  let initialProduct = validRecentProducts[0];
  
  // Try to load the requested ID from URL if present
  if (id) {
    const requested = await getProductById(id);
    if (requested) {
      initialProduct = requested;
    }
  }

  return (
    <Suspense fallback={<div className="p-20 text-center">Loading workbench...</div>}>
      <WorkspaceContainer initialProduct={initialProduct} recentProducts={validRecentProducts} />
    </Suspense>
  );
}
