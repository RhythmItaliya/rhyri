import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, TrashIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { useFieldArray, useForm } from "react-hook-form";

import BankSelectButton from "../../components/popup/BankPopup";
import CompanySelectButton from "../../components/popup/CompanyPopup";
import { Icons } from "../../components/Icons";
import { Button } from "../../components/ui/Button";
import { Calendar } from "../../components/ui/Calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/Form";
import { Input } from "../../components/ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/Popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { Bank, Company } from "../../types";
import { PurchaseBill } from "../../types/purchaseBillTypes";
import { appToast, cn, formatCurrency } from "../../lib/utils";
import { calculatePurchaseBillTotals } from "./purchaseBillUtils";
import {
  PurchaseBillInputs,
  purchaseBillValidator,
} from "./purchaseBillValidator";

const standardTerms = ["1", "7", "14", "30", "45", "60", "90"];

interface PurchaseBillFormProps {
  onSubmit: (values: PurchaseBillInputs) => void;
  isPending: boolean;
  purchaseBill?: PurchaseBill;
  defaultCustomNumber?: string;
}

export function PurchaseBillForm({
  onSubmit,
  isPending,
  purchaseBill,
  defaultCustomNumber,
}: PurchaseBillFormProps) {
  const form = useForm<PurchaseBillInputs>({
    // @ts-expect-error - Known issue with react-hook-form v7 and zodResolver type inference
    resolver: zodResolver(purchaseBillValidator),
    defaultValues: {
      supplierName: purchaseBill?.supplierName || "",
      supplierTelephone: purchaseBill?.supplierTelephone || "",
      supplierEmail: purchaseBill?.supplierEmail || "",
      supplierAddress: purchaseBill?.supplierAddress || "",
      supplierCity: purchaseBill?.supplierCity || "",
      supplierState: purchaseBill?.supplierState || "",
      supplierPostCode: purchaseBill?.supplierPostCode || "",
      supplierCountry: purchaseBill?.supplierCountry || "INDIA",
      supplierGSTNumber: purchaseBill?.supplierGSTNumber || "",
      supplierUdyamNumber: purchaseBill?.supplierUdyamNumber || "",

      buyerName: purchaseBill?.buyerName || "",
      buyerTelephone: purchaseBill?.buyerTelephone || "",
      buyerEmail: purchaseBill?.buyerEmail || "",
      buyerAddress: purchaseBill?.buyerAddress || "",
      buyerCity: purchaseBill?.buyerCity || "",
      buyerState: purchaseBill?.buyerState || "",
      buyerPostCode: purchaseBill?.buyerPostCode || "",
      buyerCountry: purchaseBill?.buyerCountry || "INDIA",
      buyerGSTNumber: purchaseBill?.buyerGSTNumber || "",

      purchaseBillNumber:
        purchaseBill?.purchaseBillNumber || defaultCustomNumber || "",
      purchaseBillDate: purchaseBill?.purchaseBillDate
        ? purchaseBill.purchaseBillDate.toDate()
        : new Date(),
      paymentTerms: purchaseBill?.paymentTerms || "45",
      dueDate: purchaseBill?.dueDate
        ? purchaseBill.dueDate.toDate()
        : addDays(new Date(), 45),
      vehicleNumber: purchaseBill?.vehicleNumber || "",
      placeOfSupply: purchaseBill?.placeOfSupply || "24-Gujarat",
      memoType: purchaseBill?.memoType || "Debit Memo",
      copyType: purchaseBill?.copyType || "Original",

      itemList:
        purchaseBill?.itemList && purchaseBill.itemList.length > 0
          ? purchaseBill.itemList
          : [
              {
                productName: "",
                hsnSac: "",
                qty2: 0,
                quantity: 1,
                taxRate: 0,
                rate: 0,
                gstPercentage: 5,
              },
            ],

      bankName: purchaseBill?.bankName || "",
      bankAccountNumber: purchaseBill?.bankAccountNumber || "",
      bankBranchName: purchaseBill?.bankBranchName || "",
      bankIfscCode: purchaseBill?.bankIfscCode || "",
    },
  });

  const [isBillDateOpen, setIsBillDateOpen] = useState(false);
  const [isDueDateOpen, setIsDueDateOpen] = useState(false);

  const itemListFieldArray = useFieldArray({
    control: form.control,
    name: "itemList",
  });

  const { setValue, watch } = form;
  const itemList = watch("itemList");
  const paymentTerms = watch("paymentTerms");
  const watchedBillDate = watch("purchaseBillDate");
  const billDate =
    watchedBillDate instanceof Timestamp
      ? watchedBillDate.toDate()
      : watchedBillDate instanceof Date
        ? watchedBillDate
        : new Date();
  const totals = calculatePurchaseBillTotals(itemList);

  useEffect(() => {
    if (paymentTerms && paymentTerms !== "custom") {
      const days = Number(paymentTerms);
      if (!Number.isNaN(days)) {
        setValue("dueDate", addDays(billDate, days));
      }
    }
  }, [billDate, paymentTerms, setValue]);

  const handleNumberChange =
    (fieldName: keyof PurchaseBillInputs) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(fieldName, event.target.value.replace(/[^0-9]/g, "") as never);
    };

  const handleBuyerSelection = (company: Company) => {
    setValue("buyerName", company.companyName || "");
    setValue("buyerTelephone", company.companyTelephone || "");
    setValue("buyerEmail", company.companyEmail || "");
    setValue("buyerAddress", company.companyAddress || "");
    setValue("buyerCity", company.companyCity || "");
    setValue("buyerState", company.companyState || "");
    setValue("buyerPostCode", company.companyPostCode || "");
    setValue("buyerCountry", company.companyCountry || "");
    setValue("buyerGSTNumber", company.companyGSTNumber || "");
  };

  const handleBankSelection = (bank: Bank) => {
    setValue("bankName", bank.bankName || "");
    setValue("bankAccountNumber", bank.bankAccountNumber || "");
    setValue("bankBranchName", bank.bankBranchName || "");
    setValue("bankIfscCode", bank.bankIfscCode || "");
  };

  const handleSubmitClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    const isValid = await form.trigger();

    if (!isValid) {
      appToast.error("Please check purchase bill details before submitting.");
      return;
    }

    onSubmit(form.getValues());
  };

  const renderInput = (
    name: keyof PurchaseBillInputs,
    label: string,
    options?: {
      className?: string;
      inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
      numberOnly?: boolean;
    },
  ) => (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={options?.className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              autoComplete="off"
              className="uppercase"
              inputMode={options?.inputMode}
              onChange={
                options?.numberOnly ? handleNumberChange(name) : field.onChange
              }
              value={field.value as string}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form className="max-w-full space-y-10">
        <section className="space-y-4">
          <p className="font-semibold text-accent">Supplier / Vendor</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {renderInput("supplierName", "Name", {
              className: "lg:col-span-2",
            })}
            {renderInput("supplierTelephone", "Telephone", {
              inputMode: "numeric",
              numberOnly: true,
            })}
            {renderInput("supplierAddress", "Address", {
              className: "sm:col-span-2 lg:col-span-3",
            })}
            {renderInput("supplierCity", "City")}
            {renderInput("supplierState", "State")}
            {renderInput("supplierPostCode", "Post Code", {
              inputMode: "numeric",
              numberOnly: true,
            })}
            {renderInput("supplierCountry", "Country")}
            {renderInput("supplierGSTNumber", "GST Number")}
            {renderInput("supplierUdyamNumber", "Udyam Number")}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-accent">M/s. Buyer</p>
            <CompanySelectButton onCompanySelect={handleBuyerSelection} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {renderInput("buyerName", "Name", { className: "lg:col-span-2" })}
            {renderInput("buyerTelephone", "Telephone", {
              inputMode: "numeric",
              numberOnly: true,
            })}
            {renderInput("buyerAddress", "Address", {
              className: "sm:col-span-2 lg:col-span-3",
            })}
            {renderInput("buyerCity", "City")}
            {renderInput("buyerState", "State")}
            {renderInput("buyerPostCode", "Post Code", {
              inputMode: "numeric",
              numberOnly: true,
            })}
            {renderInput("buyerCountry", "Country")}
            {renderInput("buyerGSTNumber", "GST Number")}
            {renderInput("placeOfSupply", "Place of Supply")}
          </div>
        </section>

        <section className="space-y-4">
          <p className="font-semibold text-accent">Bill Details</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {renderInput("purchaseBillNumber", "Purchase Bill No.")}

            <FormField
              name="purchaseBillDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bill Date</FormLabel>
                  <Popover
                    open={isBillDateOpen}
                    onOpenChange={setIsBillDateOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick date"}
                          <CalendarIcon className="h-4 w-4 text-muted" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setIsBillDateOpen(false);
                        }}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="paymentTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pay Due</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select terms" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {standardTerms.map((term) => (
                        <SelectItem key={term} value={term}>
                          Net {term} days
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Due Date</FormLabel>
                  <Popover open={isDueDateOpen} onOpenChange={setIsDueDateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick date"}
                          <CalendarIcon className="h-4 w-4 text-muted" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          if (date) setValue("paymentTerms", "custom");
                          setIsDueDateOpen(false);
                        }}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {renderInput("vehicleNumber", "Vehicle No.")}
            {renderInput("memoType", "Memo Type")}
            {renderInput("copyType", "Copy Type")}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-accent">Bank Details</p>
            <BankSelectButton onBankSelect={handleBankSelection} />
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            {renderInput("bankName", "Bank Name")}
            {renderInput("bankAccountNumber", "Account Number", {
              inputMode: "numeric",
              numberOnly: true,
            })}
            {renderInput("bankBranchName", "Branch Name")}
            {renderInput("bankIfscCode", "IFSC Code")}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-accent">Item List</p>
            {form.formState.errors.itemList?.message && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.itemList.message}
              </p>
            )}
          </div>

          <div className="grid gap-6">
            {itemListFieldArray.fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col gap-2 md:flex-row md:items-end"
              >
                <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-9">
                  <FormField
                    name={`itemList.${index}.productName`}
                    render={({ field }) => (
                      <FormItem className="col-span-2 lg:col-span-2">
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="uppercase" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`itemList.${index}.hsnSac`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>HSN/SAC</FormLabel>
                        <FormControl>
                          <Input {...field} className="uppercase" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {(
                    [
                      "qty2",
                      "quantity",
                      "taxRate",
                      "rate",
                      "gstPercentage",
                    ] as const
                  ).map((itemField) => (
                    <FormField
                      key={itemField}
                      name={`itemList.${index}.${itemField}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {itemField === "qty2"
                              ? "Qty2"
                              : itemField === "gstPercentage"
                                ? "GST %"
                                : itemField === "taxRate"
                                  ? "Tax Rate"
                                  : itemField === "quantity"
                                    ? "Qty"
                                    : "Rate"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.001"
                              min="0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Amount</p>
                    <p className="flex h-10 items-center text-sm">
                      {formatCurrency(
                        Number(itemList[index]?.quantity || 0) *
                          Number(itemList[index]?.rate || 0),
                      )}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  sizes="icon"
                  className="max-md:w-full"
                  onClick={() => itemListFieldArray.remove(index)}
                >
                  <TrashIcon className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Delete item</span>
                </Button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            sizes="sm"
            onClick={() =>
              itemListFieldArray.append({
                productName: "",
                hsnSac: "",
                qty2: 0,
                quantity: 1,
                taxRate: 0,
                rate: 0,
                gstPercentage: 5,
              })
            }
          >
            Add Item
          </Button>
        </section>

        <Table className="border rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Sub Total</TableCell>
              <TableCell className="text-right">
                {formatCurrency(totals.subtotal)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CGST ({totals.cgstRate}%)</TableCell>
              <TableCell className="text-right">
                {formatCurrency(totals.cgstAmount)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>SGST ({totals.sgstRate}%)</TableCell>
              <TableCell className="text-right">
                {formatCurrency(totals.sgstAmount)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Round Off</TableCell>
              <TableCell className="text-right">
                {formatCurrency(totals.roundOff)}
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-bold">Grand Total</TableCell>
              <TableCell className="text-right font-bold">
                {formatCurrency(totals.roundedAmount)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        <div className="w-full grid">
          <Button
            type="button"
            variant="accent"
            sizes="sm"
            disabled={isPending}
            onClick={handleSubmitClick}
            className={cn(isPending && "cursor-not-allowed opacity-70")}
          >
            {isPending && (
              <Icons.spinner
                className="h-4 w-4 animate-spin mr-2"
                aria-hidden="true"
              />
            )}
            {purchaseBill ? "Update purchase bill" : "Generate purchase bill"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
