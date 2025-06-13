interface PaginationProps {
  pageNumber: number;
  onPrev: () => void;
  onNext: () => void;
  isFirstPage: boolean;
  hasMore: boolean;
}

export const Pagination = ({
  pageNumber,
  onPrev,
  onNext,
  isFirstPage,
  hasMore
}: PaginationProps) => (
  <div className="md: flex justify-between items-center mt-4 ">
    <button
      onClick={onPrev}
      disabled={isFirstPage}
      className="px-4 py-2 bg-gray-200 text-sm rounded disabled:opacity-50  hover:bg-gray-300"
    >
      Previous
    </button>

    <span className="md: flex *:text-sm text-gray-700">Page {pageNumber}</span>

    <button
      onClick={onNext}
      disabled={!hasMore}
      className="px-4 py-2 md:flex bg-gray-200 text-sm rounded disabled:opacity-50 hover:bg-gray-300"
    >
      Next
    </button>
  </div>
);