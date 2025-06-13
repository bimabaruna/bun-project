import { useProducts } from '../hooks/useProduct';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { EmptyState } from '../components/EmptyState';
import { ProductTable } from '../components/ProductTable';
import { Pagination } from '../components/Pagination';

export default function ProductList() {
    const {
        products,
        loading,
        pageNumber,
        handlePrev,
        handleNext,
        hasMore ,
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
                        isFirstPage={pageNumber === 1}
                        hasMore={hasMore}
                    />
                </>
            )}
        </div>
    );
}