import { Button } from "../../components/ui/Button";

interface ClientsTablePaginationProps {
  handleGetNextPage: () => void;
  handleGetPrevPage: () => void;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export function ClientsTablePagination({
  handleGetPrevPage,
  handleGetNextPage,
  hasPrevPage,
  hasNextPage,
}: ClientsTablePaginationProps) {
  return (
    <div className="flex items-center gap-4 justify-end">
      <Button
        variant="outline"
        sizes="sm"
        aria-label="Get previous page"
        onClick={handleGetPrevPage}
        disabled={!hasPrevPage}
      >
        Prev
      </Button>
      <Button
        variant="outline"
        sizes="sm"
        aria-label="Get next page"
        onClick={handleGetNextPage}
        disabled={!hasNextPage}
      >
        Next
      </Button>
    </div>
  );
}
