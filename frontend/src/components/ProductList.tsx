import { useProducts } from '../hooks/useProduct';
import { LoadingIndicator } from './LoadingIndicator';
import { EmptyState } from './EmptyState';
import { ProductTable } from './ProductTable';
import { Pagination } from './Pagination';

export default function ProductList() {
    const {
        products,
        loading,
        pageNumber,
        handlePrev,
        handleNext,
        hasMore,
        isEmpty
    } = useProducts();

    if (loading) return <LoadingIndicator />;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Product List</h2>

            {isEmpty ? (
                <EmptyState />
            ) : (
                <>
                    <ProductTable products={products} />

                    <Pagination
                        pageNumber={pageNumber}
                        
                        onPrev={handlePrev}
                        onNext={handleNext}
                        isFirstPage={pageNumber === 0}
                        hasMore={hasMore}
                    />
                </>
            )}
        </div>
    );
}