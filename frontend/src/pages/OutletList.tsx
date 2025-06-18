import { useOutlets } from '../hooks/useOutlet';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { EmptyState } from '../components/EmptyState';
import { ProductTable } from '../components/ProductTable';
import { Pagination } from '../components/Pagination';
import { OutletTable } from '../components/OutletTable';

export default function OutletList() {
    const {
        outlets,
        loading,
        isEmpty
    } = useOutlets();

    if (loading) return <LoadingIndicator />;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Outlet List</h2>

            {isEmpty ? (
                <EmptyState />
            ) : (
                <>
                    <OutletTable
                        outlet={outlets}

                    />
                    {/* <Pagination
                        pageNumber={pageNumber}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        isFirstPage={pageNumber === 1}
                        hasMore={hasMore}
                    /> */}
                </>
            )}
        </div>
    );
}
