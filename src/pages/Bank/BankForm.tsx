import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/Form";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select";
import { Bank } from "../../types";
import { bankValidator, BankInputs } from "./bankValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "../../components/Icons";

interface BankFormProps {
  onSubmit: (values: BankInputs) => void;
  isPending: boolean;
  bank?: Bank;
}

export function BankForm({
  onSubmit,
  isPending,
  bank,
}: BankFormProps) {
  const form = useForm<BankInputs>({
    resolver: zodResolver(bankValidator),
    defaultValues: {
      bankName: bank?.bankName || "",
      bankAccountNumber: bank?.bankAccountNumber || "",
      bankBranchName: bank?.bankBranchName || "",
      bankIfscCode: bank?.bankIfscCode || "",
      bankAddress: bank?.bankAddress || "",
      bankCity: bank?.bankCity || "",
      bankState: bank?.bankState || "",
      bankPostCode: bank?.bankPostCode || "",
      bankCountry: bank?.bankCountry || "",
      bankCategory: bank?.bankCategory || "",
    },
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const formData = form.getValues();
    onSubmit(formData);
  };


  const handleNumberChange = (fieldName: keyof BankInputs) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const formattedValue = value.replace(/[^0-9]/g, '');
    form.setValue(fieldName, formattedValue);
  };

  return (
    <Form {...form}>
      <form className="max-w-full space-y-10">
        <div className="space-y-4">
          <p className="font-semibold text-accent">Bank Details</p>
          <div className="grid gap-4">
            <FormField control={form.control} name="bankName" render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" className="uppercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="bankAccountNumber" render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" className="uppercase" onChange={handleNumberChange('bankAccountNumber')} value={field.value} inputMode="numeric" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="bankBranchName" render={({ field }) => (
              <FormItem>
                <FormLabel>Branch Name</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" className="uppercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="bankIfscCode" render={({ field }) => (
              <FormItem>
                <FormLabel>IFSC Code</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" className="uppercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="bankAddress" render={({ field }) => (
              <FormItem>
                <FormLabel>Full Address</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" className="uppercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="bankCity" render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" className="uppercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="bankState" render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" className="uppercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="bankPostCode" render={({ field }) => (
              <FormItem>
                <FormLabel>Post Code</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" className="uppercase" onChange={handleNumberChange('bankPostCode')} value={field.value} inputMode="numeric" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="bankCountry" render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" className="uppercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField
              control={form.control}
              name="bankCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Savings">Savings</SelectItem>
                        <SelectItem value="Current">Current</SelectItem>
                        <SelectItem value="Fixed">Fixed Deposit</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="w-full grid">
          <Button
            type="button"
            variant="accent"
            sizes="sm"
            disabled={isPending}
            onClick={handleClick}
          >
            {isPending && (
              <Icons.spinner className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
