import { useForm, useFieldArray, Control, useWatch } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/Form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../components/ui/Popover"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import Decimal from 'decimal.js';
import { invoiceValidator, InvoiceInputs } from "./invoiceValidator"
import { zodResolver } from "@hookform/resolvers/zod"

import { CalendarIcon, TrashIcon } from "@radix-ui/react-icons"
import { Icons } from "../../components/Icons"

import { cn, formatCurrency } from "../../lib/utils"
import { addDays, format } from "date-fns"
import { Calendar } from "../../components/ui/Calendar"
import { Bank, Client, Company, Invoice } from "../../types"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter, } from "../../components/ui/Table"
import React, { useEffect, useState } from "react"
import { Timestamp } from "@firebase/firestore"
import ClientSelectButton from "../../components/popup/ClientPopup"
import CompanySelectButton from "../../components/popup/CompanyPopup"
import BankSelectButton from "../../components/popup/BankPopup"
import { useLocation } from "react-router-dom"

const Total = ({
  control,
  index,
}: {
  control: Control<InvoiceInputs>
  index: number
}) => {
  const item = useWatch({
    name: `itemList.${index}`,
    control,
  })

  const total = new Decimal(item.price || 0).times(item.quantity || 0)

  return (
    <div className="space-y-2 py-1 pl-2">
      <p className="text-sm text-muted">Total</p>
      <p className="flex w-full text-sm py-2">{total.toFixed(5)}</p>
    </div>
  )
}

interface InvoiceFormProps {
  onSubmit: (values: InvoiceInputs) => void
  isPending: boolean
  invoice?: Invoice
}

export function InvoiceForm({
  onSubmit,
  isPending,
  invoice,
}: InvoiceFormProps) {
  const form = useForm<InvoiceInputs>({
    resolver: zodResolver(invoiceValidator),
    defaultValues: {
      companyName: invoice?.companyName || "",
      companyEmail: invoice?.companyEmail || "",
      companyTelephone: invoice?.companyTelephone || "",
      companyAddress: invoice?.companyAddress || "",
      companyState: invoice?.companyState || "",
      companyCity: invoice?.companyCity || "",
      companyPostCode: invoice?.companyPostCode || "",
      companyCountry: invoice?.companyCountry || "",
      companyTagline: invoice?.companyTagline || "",
      companyGSTNumber: invoice?.companyGSTNumber || "",
      companyPersonName: invoice?.companyPersonName || "",

      clientName: invoice?.clientName || "",
      clientEmail: invoice?.clientEmail || "",
      clientAddress: invoice?.clientAddress || "",
      clientCountry: invoice?.clientCountry || "",
      clientCity: invoice?.clientCity || "",
      clientPostCode: invoice?.clientPostCode || "",
      clientGSTNumber: invoice?.clientGSTNumber || "",
      clientTelephone: invoice?.clientTelephone || "",
      clientUid: invoice?.clientUid || "",

      invoiceDate: invoice?.invoiceDate ? invoice.invoiceDate.toDate() : new Date(),
      paymentTerms: invoice?.paymentTerms || "",
      // serviceDescription: invoice?.serviceDescription || "",
      itemList: invoice?.itemList || [],
      invoiceCustomNumber: invoice?.invoiceCustomNumber || "",
      challanNumber: invoice?.challanNumber || "",
      dueDate: invoice?.invoiceDate ? invoice.invoiceDate.toDate() : new Date(),
      rateTotal: invoice?.rateTotal || 0,
      qtyTotal: invoice?.qtyTotal || 0,
      discountType: invoice?.discountType || "percentage",
      discountPercentage: invoice?.discountType === "percentage" ? invoice?.discountPercentage || 0 : 0,
      discountAmount: invoice?.discountType === "fixed" ? invoice?.discountAmount || 0 : 0,
      gst: invoice?.gst || 0,
      sgst: invoice?.sgst || 0,
      otherTaxType: invoice?.otherTaxType || "percentage",
      otherTaxPercentage: invoice?.otherTaxType === "percentage" ? invoice?.otherTaxPercentage || 0 : 0,
      otherTaxAmount: invoice?.otherTaxType === "fixed" ? invoice?.otherTaxAmount || 0 : 0,

      bankName: invoice?.bankName || '',
      bankAccountNumber: invoice?.bankAccountNumber || '',
      bankBranchName: invoice?.bankBranchName || '',
      bankIfscCode: invoice?.bankIfscCode || '',
    },
  })

  const [showFinalAmount, setShowFinalAmount] = useState(false);
  const location = useLocation();
  const isEditing = location.pathname.includes('edit');
  const [companySelected, setCompanySelected] = useState(false);
  const [clientSelected, setClientSelected] = useState(false);
  const [bankSelected, setBankSelected] = useState(false);

  const itemListFieldArray = useFieldArray({
    control: form.control,
    name: "itemList",
  })
  const itemListError = form.formState.errors.itemList

  const itemList = form.watch("itemList");
  const mainTotal = itemList.reduce((total, item) => {
    return new Decimal(total).plus(new Decimal(item.price || 0).times(item.quantity || 0));
  }, new Decimal(0));
  const discountType = form.watch("discountType") || "percentage";
  const discountPercentage = new Decimal(form.watch("discountPercentage") || 0);
  const discountAmount = new Decimal(form.watch("discountAmount") || 0);
  const gst = new Decimal(form.watch("gst") || 0);
  const sgst = new Decimal(form.watch("sgst") || 0);
  const otherTaxType = form.watch("otherTaxType") || "percentage";
  const otherTaxPercentage = new Decimal(form.watch("otherTaxPercentage") || 0);
  const otherTaxAmount = new Decimal(form.watch("otherTaxAmount") || 0);
  const totalAfterDiscount = discountType === "percentage"
    ? mainTotal.minus(mainTotal.times(discountPercentage).div(100))
    : mainTotal.minus(discountAmount);
  const gstAmount = totalAfterDiscount.times(gst).div(100);
  const sgstAmount = totalAfterDiscount.times(sgst).div(100);
  const otherTaxFinal = otherTaxType === "percentage"
    ? totalAfterDiscount.times(otherTaxPercentage).div(100)
    : otherTaxAmount;
  const totalFinal = totalAfterDiscount.plus(gstAmount).plus(sgstAmount).plus(otherTaxFinal);

  const formatTotalFinal = (totalFinal: Decimal) => {
    const totalFinalStr = totalFinal.toString();
    const [, fractionalPart = ''] = totalFinalStr.split('.');
    const formattedFractionalPart = fractionalPart.padEnd(6, '0');
    return `0.${formattedFractionalPart}`;
  };

  const { setValue, watch } = form;
  const paymentTerms = watch("paymentTerms");
  const watchedInvoiceDate = watch("invoiceDate");
  const invoiceDate = watchedInvoiceDate instanceof Timestamp ? watchedInvoiceDate.toDate() : watchedInvoiceDate instanceof Date ? watchedInvoiceDate : new Date();

  useEffect(() => {
    if (paymentTerms) {
      const days = parseInt(paymentTerms, 10);
      if (!isNaN(days)) {
        const dueDate = addDays(invoiceDate, days);
        setValue("dueDate", dueDate);
      }
    }
  }, [paymentTerms, invoiceDate, setValue]);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const isValid = await form.trigger();

    if (!clientSelected || !companySelected || !bankSelected) {
      alert('Please select a company, client, and bank details before submitting.');
      return;
    }

    if (!isValid) {
      console.log('Form validation failed');
      return;
    }

    const formData = form.getValues();
    onSubmit(formData);
  };

  const handleClientSelection = (client: Client) => {
    setValue('clientName', client.clientName || '');
    setValue('clientEmail', client.clientEmail || '');
    setValue('clientAddress', client.clientAddress || '');
    setValue('clientCountry', client.clientCountry || '');
    setValue('clientCity', client.clientCity || '');
    setValue('clientPostCode', client.clientPostCode || '');
    setValue('clientGSTNumber', client.clientGSTNumber || '');
    setValue('clientTelephone', client.clientTelephone || '');
    setValue('clientUid', client.id);
    setClientSelected(true);
  };

  const handleCompanySelection = (company: Company) => {
    setValue('companyName', company.companyName || '');
    setValue('companyEmail', company.companyEmail || '');
    setValue('companyTelephone', company.companyTelephone || '');
    setValue('companyAddress', company.companyAddress || '');
    setValue('companyState', company.companyState || '');
    setValue('companyCity', company.companyCity || '');
    setValue('companyPostCode', company.companyPostCode || '');
    setValue('companyCountry', company.companyCountry || '');
    setValue('companyTagline', company.companyTagline || '');
    setValue('companyGSTNumber', company.companyGSTNumber || '');
    setValue('companyPersonName', company.companyPersonName || '');
    setCompanySelected(true);
  };

  const handleBankSelection = (bank: Bank) => {
    setValue('bankName', bank.bankName || '');
    setValue('bankAccountNumber', bank.bankAccountNumber || '');
    setValue('bankIfscCode', bank.bankIfscCode || '');
    setValue('bankBranchName', bank.bankBranchName || '');
    setBankSelected(true);
  }

  const handleNumberChange = (fieldName: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const formattedValue = value.replace(/[^0-9]/g, '');
    setValue(fieldName, formattedValue);
  };

  return (
    <Form {...form}>
      <form className="max-w-full space-y-10">

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-accent">Invoice From</p>
            <CompanySelectButton onCompanySelect={handleCompanySelection} />
          </div>

          {isEditing && (
            <div className="grid gap-4">
              <FormField control={form.control} name="companyName" render={({ field }) => (<FormItem> <FormLabel>Name</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" /></FormControl><FormMessage /></FormItem>)} />

              <FormField control={form.control} name="companyEmail" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} autoComplete="off" className="lowercase" /></FormControl><FormMessage /></FormItem>)} />

              <FormField control={form.control} name="companyTelephone" render={({ field }) => (<FormItem><FormLabel>Telephone</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" onChange={handleNumberChange('companyTelephone')} value={field.value} inputMode="numeric" /></FormControl><FormMessage /></FormItem>)} />

              <FormField control={form.control} name="companyTagline" render={({ field }) => <FormItem><FormLabel>Tagline</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" /></FormControl><FormMessage /></FormItem>} />

              <FormField control={form.control} name="companyAddress" render={({ field }) => <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" /></FormControl><FormMessage /></FormItem>} />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <FormField control={form.control} name="companyPersonName" render={({ field }) => (<FormItem><FormLabel>Contact Person</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" /></FormControl><FormMessage /></FormItem>)} />

                <FormField control={form.control} name="companyGSTNumber" render={({ field }) => <FormItem><FormLabel>GST Number</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" maxLength={15} /></FormControl><FormMessage /></FormItem>} />

                <FormField control={form.control} name="companyCountry" render={({ field }) => <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" /></FormControl><FormMessage /></FormItem>} />

                <FormField control={form.control} name="companyState" render={({ field }) => <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" /></FormControl><FormMessage /></FormItem>} />

                <FormField control={form.control} name="companyCity" render={({ field }) => <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" /></FormControl><FormMessage /></FormItem>} />

                <FormField control={form.control} name="companyPostCode" render={({ field }) => <FormItem className="max-sm:col-span-2"><FormLabel>Post Code</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" onChange={handleNumberChange('companyPostCode')} value={field.value} inputMode="numeric" /></FormControl><FormMessage /></FormItem>} />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-accent">Invoice To</p>
            <ClientSelectButton onClientSelect={handleClientSelection} />
          </div>

          {isEditing && (
            <div className="grid gap-4">
              <FormField control={form.control} name="clientName" render={({ field }) => (<FormItem><FormLabel>Client'Name</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" /></FormControl><FormMessage /></FormItem>)} />

              <FormField control={form.control} name="clientEmail" render={({ field }) => (<FormItem><FormLabel>Client's Email</FormLabel><FormControl><Input {...field} autoComplete="off" className="lowercase" /></FormControl><FormMessage /></FormItem>)} />

              <FormField control={form.control} name="clientGSTNumber" render={({ field }) => (<FormItem><FormLabel>Client GST Number</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" maxLength={15} /></FormControl><FormMessage /></FormItem>)} />

              <FormField control={form.control} name="clientAddress" render={({ field }) => (<FormItem><FormLabel>Street Address</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" /></FormControl><FormMessage /></FormItem>)} />

              <FormField control={form.control} name="clientTelephone" render={({ field }) => (<FormItem><FormLabel>Client Telephone</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" onChange={handleNumberChange('clientTelephone')} value={field.value} inputMode="numeric" /></FormControl><FormMessage /></FormItem>)} />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <FormField control={form.control} name="clientCountry" render={({ field }) => (<FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" /></FormControl><FormMessage /></FormItem>)} />

                <FormField control={form.control} name="clientCity" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" /></FormControl><FormMessage /></FormItem>)} />

                <FormField control={form.control} name="clientPostCode" render={({ field }) => (<FormItem className="max-sm:col-span-2"><FormLabel>Post code</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" onChange={handleNumberChange('clientPostCode')} value={field.value} inputMode="numeric" /></FormControl><FormMessage /></FormItem>)} />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-accent">Bank Details</p>
            <BankSelectButton onBankSelect={handleBankSelection} />
          </div>

          {isEditing && (
            <div className="grid gap-4">
              <FormField control={form.control} name="bankName" render={({ field }) => (<FormItem><FormLabel>Bank Name</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" /></FormControl><FormMessage /></FormItem>)} />

              <FormField control={form.control} name="bankAccountNumber" render={({ field }) => (<FormItem><FormLabel>Account Number</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" onChange={handleNumberChange('bankAccountNumber')} value={field.value} inputMode="numeric" /></FormControl><FormMessage /></FormItem>)} />

              <FormField control={form.control} name="bankIfscCode" render={({ field }) => (<FormItem><FormLabel>IFSC Code</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" /></FormControl><FormMessage /></FormItem>)} />

              <FormField control={form.control} name="bankBranchName" render={({ field }) => (<FormItem><FormLabel>Branch Name</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" /></FormControl><FormMessage /></FormItem>)} />
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="invoiceCustomNumber" render={({ field }) => (<FormItem><p className="font-semibold text-accent">Invoice Number</p><FormControl><Input {...field} autoComplete="off" className="uppercase" /></FormControl><FormMessage /></FormItem>)} />

          <FormField control={form.control} name="challanNumber" render={({ field }) => (<FormItem><p className="font-semibold text-accent">Challan Number</p><FormControl><Input {...field} autoComplete="off" className="uppercase" /></FormControl><FormMessage /></FormItem>)} />
        </div>

        <div className="grid sm:grid-cols-3 gap-2">
          <FormField control={form.control} name="invoiceDate" render={({ field }) => (<FormItem><p className="font-semibold text-accent">Invoice Date</p><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between")}>{field.value ? (format(field.value, "PPP")) : (format(invoiceDate, "PPP"))} <CalendarIcon className="h-4 w-4 text-muted" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />

          <FormField control={form.control} name="paymentTerms" render={({ field }) => (<FormItem><p className="font-semibold text-accent">Payment Terms</p><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select payment terms" /></SelectTrigger></FormControl><SelectContent><SelectItem value="1">Net 1 day</SelectItem><SelectItem value="7">Net 7 days</SelectItem><SelectItem value="14">Net 14 days</SelectItem><SelectItem value="30">Net 30 days</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />

          <FormField control={form.control} name="dueDate" render={({ field }) => (<FormItem><p className="font-semibold text-accent">Due Date</p><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="h-4 w-4 text-muted" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
        </div>

        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-accent">Item List</p>{itemListError && (<p className="text-sm font-medium text-destructive">{itemListError.message}</p>)}
          </div>
          <div className="grid gap-6">
            {itemListFieldArray.fields.map((field, index) => (
              <div key={field.id} className="flex flex-col items-center md:flex-row md:items-end gap-2">
                <div key={field.id} className="grid grid-cols-4 sm:grid-cols-9 gap-4 w-full">
                  <FormField control={form.control} name={`itemList.${index}.item` as const} render={({ field }) => (<FormItem className="col-span-3 sm:col-span-4"><FormLabel>Item</FormLabel><FormControl><Input {...field} autoComplete="off" className="uppercase" /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name={`itemList.${index}.quantity` as const} render={({ field }) => (<FormItem className="col-span-1"><FormLabel>Qty.</FormLabel><FormControl><Input {...field} type="number" inputMode="numeric" /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name={`itemList.${index}.price` as const} render={({ field }) => (<FormItem className="col-span-2"><FormLabel>Price</FormLabel><FormControl><Input {...field} type="number" inputMode="numeric" /></FormControl><FormMessage /></FormItem>)} />
                  <Total control={form.control} index={index} />
                </div>
                <Button type="button" variant="outline" sizes="icon" className="max-sm:w-full" onClick={() => itemListFieldArray.remove(index)}><TrashIcon className="h-4 w-4" aria-hidden="true" /><span className="sr-only">Delete item</span></Button>
              </div>
            ))}
          </div>
          <Button type="button" sizes="sm" onClick={() => itemListFieldArray.append({ item: "", quantity: 1, price: 0, })}>Add Item</Button>
        </div>

        <Table className="border rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Item</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itemListFieldArray.fields.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-600 py-4">No items available</TableCell>
              </TableRow>
            ) : (
              itemListFieldArray.fields.map((field, index) => {
                const item = form.watch(`itemList.${index}.item`);
                const quantity = form.watch(`itemList.${index}.quantity`) || 0;
                const price = form.watch(`itemList.${index}.price`) || 0;
                const amount = quantity * price;
                return (
                  <TableRow key={field.id}>
                    <TableCell className="text-center">{item || 'N/A'}</TableCell>
                    <TableCell className="text-gray-600 text-center">{quantity}</TableCell>
                    <TableCell className="text-gray-600 text-center">{price}</TableCell>
                    <TableCell className="text-gray-600 text-right">{amount}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
          {itemListFieldArray.fields.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell className="text-center font-bold">Total</TableCell>
                <TableCell className="text-gray-600 text-center font-bold">
                  {itemListFieldArray.fields.reduce((acc, _, index) => { const quantity = parseFloat(form.watch(`itemList.${index}.quantity`) as unknown as string) || 0; return acc + quantity; }, 0)}
                </TableCell>
                <TableCell className="text-gray-600 text-center font-bold">
                  {itemListFieldArray.fields.reduce((acc, _, index) => { const price = parseFloat(form.watch(`itemList.${index}.price`) as unknown as string) || 0; return acc + price; }, 0)}
                </TableCell>
                <TableCell className="text-gray-600 text-right font-bold">
                  {itemListFieldArray.fields.reduce((acc, _, index) => { const quantity = parseFloat(form.watch(`itemList.${index}.quantity`) as unknown as string) || 0; const price = parseFloat(form.watch(`itemList.${index}.price`) as unknown as string) || 0; return acc + (quantity * price); }, 0)}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>


        <div><p className="font-semibold text-accent">Invoice Total</p></div>
        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          <div className="flex-1 grid sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="discountType" render={({ field }) => (<FormItem><FormLabel>Discount Type</FormLabel><FormControl><Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue placeholder="Select discount type" /></SelectTrigger><SelectContent><SelectItem value="percentage">Percentage</SelectItem><SelectItem value="fixed">Amount</SelectItem></SelectContent></Select></FormControl><FormMessage /></FormItem>)} />

            {discountType === "percentage" ? (
              <FormField control={form.control} name="discountPercentage" render={({ field }) => (<FormItem><FormLabel>Discount Percentage</FormLabel><FormControl><Input {...field} type="number" step="0.01" min="0" max="100" /></FormControl><FormMessage /></FormItem>)} />
            ) : (
              <FormField control={form.control} name="discountAmount" render={({ field }) => (<FormItem><FormLabel>Discount Amount</FormLabel><FormControl><Input {...field} type="number" step="0.01" min="0" /></FormControl><FormMessage /></FormItem>)} />
            )}

            <FormField control={form.control} name="gst" render={({ field }) => (<FormItem><FormLabel>CGST (%)</FormLabel><FormControl><Input {...field} type="number" step="0.01" min="0" max="100" /></FormControl><FormMessage /></FormItem>)} />

            <FormField control={form.control} name="sgst" render={({ field }) => (<FormItem><FormLabel>SGST (%)</FormLabel><FormControl><Input {...field} type="number" step="0.01" min="0" max="100" /></FormControl><FormMessage /></FormItem>)} />

            <FormField control={form.control} name="otherTaxType" render={({ field }) => (<FormItem><FormLabel>Other Tax Type</FormLabel><FormControl><Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue placeholder="Select Other Tax type" /></SelectTrigger><SelectContent><SelectItem value="percentage">Percentage</SelectItem><SelectItem value="fixed">Amount</SelectItem></SelectContent></Select></FormControl><FormMessage /></FormItem>)} />

            {otherTaxType === "percentage" ? (
              <FormField control={form.control} name="otherTaxPercentage" render={({ field }) => (<FormItem><FormLabel>Other Tax Percentage</FormLabel><FormControl><Input {...field} type="number" step="0.01" min="0" max="100" /></FormControl><FormMessage /></FormItem>)} />
            ) : (
              <FormField control={form.control} name="otherTaxAmount" render={({ field }) => (<FormItem><FormLabel>Other Tax Amount</FormLabel><FormControl><Input {...field} type="number" step="0.01" min="0" /></FormControl><FormMessage /></FormItem>)} />)}
          </div>

          <div className="flex-1">
            <Table className="border rounded-lg">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Description</TableHead>
                  <TableHead className="text-center">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Total</TableCell>
                  <TableCell className="text-gray-600 text-right">{mainTotal.toString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Other Tax ({discountType === 'percentage' ? `${discountPercentage.toString()}%` : formatCurrency(Number(discountAmount.toString()))})
                  </TableCell>
                  <TableCell className="text-gray-600 text-right">
                    {discountType === 'percentage' ? `${mainTotal.times(discountPercentage).div(100).toString()}` : `${discountAmount.toString()}`}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">Total Amount Before Tax</TableCell>
                  <TableCell className="text-right font-bold">{totalAfterDiscount.toString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>CGST ({gst.toString()}%)</TableCell>
                  <TableCell className="text-gray-600 text-right">{gstAmount.toString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>SGST ({sgst.toString()}%)</TableCell>
                  <TableCell className="text-gray-600 text-right">{sgstAmount.toString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Other Tax ({otherTaxType === 'percentage' ? `${otherTaxPercentage.toString()}%` : formatCurrency(Number(otherTaxAmount.toString()))})
                  </TableCell>
                  <TableCell className="text-gray-600 text-right">
                    {otherTaxType === 'percentage' ? `${totalAfterDiscount.times(otherTaxPercentage).div(100).toString()}` : `${otherTaxAmount.toString()}`}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">Total Amount</TableCell>
                  <TableCell className="text-right font-bold">{totalFinal.toString()}</TableCell>
                </TableRow>
              </TableBody>

              {totalFinal.mod(1).toString() !== '0' && (
                <TableFooter>
                  <TableRow>
                    <TableCell className="flex items-center space-x-2">
                      <Input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 cursor-pointer transition-transform duration-300 ease-in-out" checked={showFinalAmount} onChange={() => setShowFinalAmount(!showFinalAmount)} />
                    </TableCell>
                    <TableCell className="text-right">
                      {showFinalAmount ? `- ${formatTotalFinal(totalFinal)}` : 'Rounded Amount'}
                    </TableCell>
                  </TableRow>
                  <TableRow className={`transition-opacity duration-300 ease-in-out ${showFinalAmount ? 'opacity-100' : 'opacity-0'}`}>
                    <TableCell className="text-gray-500">Rounded Amount</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(Number(totalFinal))}</TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </div>
        </div>

        <div className="w-full grid">
          <Button type="button" variant="accent" sizes="sm" disabled={isPending} onClick={handleClick} > {isPending && (<Icons.spinner className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />)}Save Changes</Button>
        </div>
      </form>
    </Form >
  )
}
