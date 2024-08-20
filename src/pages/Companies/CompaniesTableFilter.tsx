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
import { CompanyCategory } from "../../types";

interface CompaniesTableFilterProps {
    categoryFilterValue: CompanyCategory | "";
    handleCategoryFiltering: (category: CompanyCategory) => void;
}

const categories: CompanyCategory[] = ["startup", "enterprise", "smallBusiness"];

export function CompaniesTableFilter({
    categoryFilterValue,
    handleCategoryFiltering,
}: CompaniesTableFilterProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    Category <ChevronDownIcon className="h-4 w-4 ml-2" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel className="font-semibold">Filter by category</DropdownMenuLabel>
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
