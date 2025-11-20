// Loading skeleton components for better UX

export const ProductCardSkeleton = () => {
  return (
    <div className="card p-4 animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-lg mb-4 skeleton"></div>
      <div className="h-6 bg-gray-200 rounded mb-2 skeleton"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 skeleton"></div>
      <div className="h-8 bg-gray-200 rounded skeleton"></div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const ProductDetailSkeleton = () => {
  return (
    <div className="container-custom section-padding">
      <div className="grid md:grid-cols-2 gap-12 animate-pulse">
        <div>
          <div className="aspect-square bg-gray-200 rounded-xl mb-4 skeleton"></div>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded skeleton"></div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded skeleton"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3 skeleton"></div>
          <div className="h-20 bg-gray-200 rounded skeleton"></div>
          <div className="h-12 bg-gray-200 rounded skeleton"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded skeleton"></div>
            <div className="h-4 bg-gray-200 rounded skeleton"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 skeleton"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PageSkeleton = () => {
  return (
    <div className="min-h-screen">
      <div className="h-96 bg-gray-200 skeleton"></div>
      <div className="container-custom section-padding">
        <div className="space-y-8 animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-1/3 skeleton"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded skeleton"></div>
            <div className="h-4 bg-gray-200 rounded skeleton"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 skeleton"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
