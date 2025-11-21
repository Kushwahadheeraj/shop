import ShopLayout from '@/components/ShopLayout';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export default function ShopPageLayout({ children }) {
  return <ShopLayout>{children}</ShopLayout>;
}
