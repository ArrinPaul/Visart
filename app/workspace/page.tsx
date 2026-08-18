import React from 'react';
import type { Metadata } from 'next';
import { getProductById, getRecentProducts } from '@/lib/supabase/products';
import { WorkspaceContainer } from '@/components/workspace/WorkspaceContainer';
import { SEED_PRODUCTS } from '@/lib/data/seed';

export const metadata: Metadata = {
  title: 'Workspace — VISART',
  description: 'Manage, edit, translate, and publish your AI-generated artisan craft listings.',
};

interface WorkspacePageProps {
  searchParams?: Promise<{
    id?: string;
  }>;
}

export default async function WorkspacePage({ searchParams }: WorkspacePageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const requestedId = resolvedParams.id;

  const recentProducts = await getRecentProducts();

  let activeProduct = null;
  if (requestedId) {
    activeProduct = await getProductById(requestedId);
  }

  if (!activeProduct) {
    activeProduct = recentProducts[0] || SEED_PRODUCTS[0];
  }

  return (
    <WorkspaceContainer
      initialProduct={activeProduct}
      recentProducts={recentProducts.length > 0 ? recentProducts : SEED_PRODUCTS}
    />
  );
}
