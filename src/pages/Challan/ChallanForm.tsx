import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, TrashIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { useFieldArray, useForm } from "react-hook-form";

import ClientSelectButton from "../../components/popup/ClientPopup";
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
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { Client, Company } from "../../types";
import { Challan } from "../../types/challanTypes";
import { appToast, cn, formatCurrency } from "../../lib/utils";
import { getChallanTotals } from "./challanUtils";
import { ChallanInputs, challanValidator } from "./challanValidator";

interface ChallanFormProps {
  onSubmit: (values: ChallanInputs) => void;
  isPending: boolean;
  challan?: Challan;
  defaultCustomNumber?: string;
}

function toFormDate(value: Timestamp | Date | undefined) {
  if (!value) return new Date();
  return value instanceof Timestamp ? value.toDate() : value;
}

export function ChallanForm({
  onSubmit,
  isPending,
  challan,
  defaultCustomNumber,
}: ChallanFormProps) {
  const form = useForm<ChallanInputs>({
    // @ts-expect-error - Known issue with react-hook-form v7 and zodResolver type inference
    resolver: zodResolver(challanValidator),
    defaultValues: {
      companyName: challan?.companyName || "",
      companyTelephone: challan?.companyTelephone || "",
      companyEmail: challan?.companyEmail || "",
      companyAddress: challan?.companyAddress || "",
      companyCity: challan?.companyCity || "",
      companyState: challan?.companyState || "",
      companyPostCode: challan?.companyPostCode || "",
      companyCountry: challan?.companyCountry || "INDIA",
      companyGSTNumber: challan?.companyGSTNumber || "",

      clientName: challan?.clientName || "",
      clientTelephone: challan?.clientTelephone || "",
      clientEmail: challan?.clientEmail || "",
      clientAddress: challan?.clientAddress || "",
      clientCity: challan?.clientCity || "",
      clientState: challan?.clientState || "",
      clientPostCode: challan?.clientPostCode || "",
      clientCountry: challan?.clientCountry || "INDIA",
      clientGSTNumber: challan?.clientGSTNumber || "",

      challanNumber: challan?.challanNumber || defaultCustomNumber || "",
      challanDate: toFormDate(challan?.challanDate),
      orderDate: toFormDate(challan?.orderDate),
      poNumber: challan?.poNumber || "",

      itemList:
        challan?.itemList && challan.itemList.length > 0
          ? challan.itemList
          : [
              {
                description: "",
                size: "",
                designNumber: "",
                pieces: 0,
                quantity: 1,
                rate: 0,
              },
            ],
    },
  });

  const [isChallanDateOpen, setIsChallanDateOpen] = useState(false);
  const [isOrderDateOpen, setIsOrderDateOpen] = useState(false);

  const itemListFieldArray = useFieldArray({
    control: form.control,
    name: "itemList",
  });

  const { setValue, watch } = form;
  const itemList = watch("itemList");
  const totals = getChallanTotals(itemList);

  const handleNumberOnlyChange =
    (fieldName: keyof ChallanInputs) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(fieldName, event.target.value.replace(/[^0-9]/g, "") as never);
    };

  const handleCompanySelection = (company: Company) => {
    setValue("companyName", company.companyName || "");
    setValue("companyTelephone", company.companyTelephone || "");
    setValue("companyEmail", company.companyEmail || "");
    setValue("companyAddress", company.companyAddress || "");
    setValue("companyCity", company.companyCity || "");
    setValue("companyState", company.companyState || "");
    setValue("companyPostCode", company.companyPostCode || "");
    setValue("companyCountry", company.companyCountry || "");
    setValue("companyGSTNumber", company.companyGSTNumber || "");
  };

  const handleClientSelection = (client: Client) => {
    setValue("clientName", client.clientName || "");
    setValue("clientTelephone", client.clientTelephone || "");
    setValue("clientEmail", client.clientEmail || "");
    setValue("clientAddress", client.clientAddress || "");
    setValue("clientCity", client.clientCity || "");
    setValue("clientState", client.clientState || "");
    setValue("clientPostCode", client.clientPostCode || "");
    setValue("clientCountry", client.clientCountry || "");
    setValue("clientGSTNumber", client.clientGSTNumber || "");
  };

  const handleSubmitClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    const isValid = await form.trigger();

    if (!isValid) {
      appToast.error("Please check challan details before submitting.");
      return;
    }

    onSubmit(form.getValues());
  };

  const renderInput = (
    name: keyof ChallanInputs,
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
                options?.numberOnly
                  ? handleNumberOnlyChange(name)
                  : field.onChange
              }
              value={(field.value as string) || ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderDateField = (
    name: "challanDate" | "orderDate",
    label: string,
    isOpen: boolean,
    setIsOpen: (value: boolean) => void,
  ) => (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant="outline" className="w-full justify-between">
                  {field.value ? format(field.value, "PPP") : "Pick date"}
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
                  setIsOpen(false);
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
  );

  return (
    <Form {...form}>
      <form className="max-w-full space-y-10">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-accent">Company</p>
            <CompanySelectButton onCompanySelect={handleCompanySelection} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {renderInput("companyName", "Company Name", {
              className: "lg:col-span-2",
            })}
            {renderInput("companyTelephone", "Telephone", {
              inputMode: "numeric",
              numberOnly: true,
            })}
            {renderInput("companyAddress", "Address", {
              className: "sm:col-span-2 lg:col-span-3",
            })}
            {renderInput("companyCity", "City")}
            {renderInput("companyState", "State")}
            {renderInput("companyPostCode", "Post Code", {
              inputMode: "numeric",
              numberOnly: true,
            })}
            {renderInput("companyCountry", "Country")}
            {renderInput("companyGSTNumber", "GST Number")}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-accent">To / Client</p>
            <ClientSelectButton onClientSelect={handleClientSelection} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {renderInput("clientName", "Client Name", {
              className: "lg:col-span-2",
            })}
            {renderInput("clientTelephone", "Telephone", {
              inputMode: "numeric",
              numberOnly: true,
            })}
            {renderInput("clientAddress", "Address", {
              className: "sm:col-span-2 lg:col-span-3",
            })}
            {renderInput("clientCity", "City")}
            {renderInput("clientState", "State")}
            {renderInput("clientPostCode", "Post Code", {
              inputMode: "numeric",
              numberOnly: true,
            })}
            {renderInput("clientCountry", "Country")}
            {renderInput("clientGSTNumber", "GST Number")}
          </div>
        </section>

        <section className="space-y-4">
          <p className="font-semibold text-accent">Challan Details</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {renderInput("challanNumber", "Challan No.")}
            {renderDateField(
              "challanDate",
              "Challan Date",
              isChallanDateOpen,
              setIsChallanDateOpen,
            )}
            {renderDateField(
              "orderDate",
              "Order Date",
              isOrderDateOpen,
              setIsOrderDateOpen,
            )}
            {renderInput("poNumber", "P.O. No.")}
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
                <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-8">
                  <FormField
                    name={`itemList.${index}.designNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Design No.</FormLabel>
                        <FormControl>
                          <Input {...field} className="uppercase" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`itemList.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} className="uppercase" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`itemList.${index}.size`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Challan No.</FormLabel>
                        <FormControl>
                          <Input {...field} className="uppercase" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {(["pieces", "quantity", "rate"] as const).map(
                    (itemField) => (
                      <FormField
                        key={itemField}
                        name={`itemList.${index}.${itemField}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {itemField === "pieces"
                                ? "Pieces"
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
                    ),
                  )}
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
                description: "",
                size: "",
                designNumber: "",
                pieces: 0,
                quantity: 1,
                rate: 0,
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
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Total Pieces</TableCell>
              <TableCell className="text-right">{totals.totalPieces}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total Quantity</TableCell>
              <TableCell className="text-right">
                {totals.totalQuantity}
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-bold">Total Amount</TableCell>
              <TableCell className="text-right font-bold">
                {formatCurrency(totals.amount)}
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
            {challan ? "Update challan" : "Generate challan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
