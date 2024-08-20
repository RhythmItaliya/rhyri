import { Button } from "../../components/ui/Button";

interface BanksTablePaginationProps {
  handleGetPrevPage: () => void;
  handleGetNextPage: () => void;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export function BanksTablePagination({
  handleGetPrevPage,
  handleGetNextPage,
  hasPrevPage,
  hasNextPage,
}: BanksTablePaginationProps) {
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
