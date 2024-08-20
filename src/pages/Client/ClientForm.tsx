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
import { Client } from "../../types";
import { clientValidator, ClientInputs } from "./clientValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "../../components/Icons";

interface ClientFormProps {
  onSubmit: (values: ClientInputs) => void;
  isPending: boolean;
  client?: Client;
}

export function ClientForm({
  onSubmit,
  isPending,
  client,
}: ClientFormProps) {
  const form = useForm<ClientInputs>({
    resolver: zodResolver(clientValidator),
    defaultValues: {
      clientName: client?.clientName || "",
      clientEmail: client?.clientEmail || "",
      clientTelephone: client?.clientTelephone || "",
      clientAddress: client?.clientAddress || "",
      clientState: client?.clientState || "",
      clientCity: client?.clientCity || "",
      clientPostCode: client?.clientPostCode || "",
      clientCountry: client?.clientCountry || "",
      clientCategory: client?.clientCategory || "",
      clientGSTNumber: client?.clientGSTNumber || "",
    },
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const formData = form.getValues();
    console.log("Form Data before submit:", formData);
    onSubmit(formData);
    console.log("Button clicked!");
  };

  return (
    <Form {...form}>
      <form className="max-w-full space-y-10">
        <div className="space-y-4">
          <p className="font-semibold text-accent">Client Details</p>
          <div className="grid gap-4">
            <FormField control={form.control} name="clientName" render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="clientEmail" render={({ field }) => (
              <FormItem>
                <FormLabel>Client Email</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="clientTelephone" render={({ field }) => (
              <FormItem>
                <FormLabel>Client Telephone</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="clientGSTNumber" render={({ field }) => (
              <FormItem>
                <FormLabel>Client GST Number</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* City */}
            <FormField control={form.control} name="clientAddress" render={({ field }) => (
              <FormItem>
                <FormLabel>Full Address</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* City */}
            <FormField control={form.control} name="clientCity" render={({ field }) => (
              <FormItem>
                <FormLabel>Client City</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Street Address */}
            <FormField control={form.control} name="clientState" render={({ field }) => (
              <FormItem>
                <FormLabel>Client State</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Post Code */}
            <FormField control={form.control} name="clientPostCode" render={({ field }) => (
              <FormItem>
                <FormLabel>Post Code</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Country */}
            <FormField control={form.control} name="clientCountry" render={({ field }) => (
              <FormItem>
                <FormLabel>Client Country</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Client Category */}
            <FormField
              control={form.control}
              name="clientCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Category</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="VIP">Vip</SelectItem>
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
