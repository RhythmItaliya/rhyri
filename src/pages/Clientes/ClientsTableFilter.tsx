import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/DropdownMenu";
import { Button } from "../../components/ui/Button";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { ClientCategory } from "../../types";

interface ClientsTableFilterProps {
  categoryFilterValue: ClientCategory | "";
  handleCategoryFiltering: (category: ClientCategory) => void;
}

const categories: ClientCategory[] = ["regular", "premium", "vip"];

export function ClientsTableFilter({
  categoryFilterValue,
  handleCategoryFiltering,
}: ClientsTableFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Category <ChevronDownIcon className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="font-semibold">
          Filter by category
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {categories.map((category) => (
          <DropdownMenuCheckboxItem
            key={category}
            checked={categoryFilterValue === category}
            onCheckedChange={() => handleCategoryFiltering(category)}
            className="capitalize"
          >
            {category}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
