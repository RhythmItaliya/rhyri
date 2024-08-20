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
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select";
import { Company } from "../../types";
import { companyValidator, CompanyInputs } from "./companyValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "../../components/Icons";

interface CompanyFormProps {
    onSubmit: (values: CompanyInputs) => void;
    isPending: boolean;
    company?: Company;
}

export function CompanyForm({
    onSubmit,
    isPending,
    company,
}: CompanyFormProps) {
    const form = useForm<CompanyInputs>({
        resolver: zodResolver(companyValidator),
        defaultValues: {
            companyName: company?.companyName || "",
            companyEmail: company?.companyEmail || "",
            companyTelephone: company?.companyTelephone || "",
            companyAddress: company?.companyAddress || "",
            companyState: company?.companyState || "",
            companyCity: company?.companyCity || "",
            companyPostCode: company?.companyPostCode || "",
            companyCountry: company?.companyCountry || "",
            companyTagline: company?.companyTagline || "",
            companyGSTNumber: company?.companyGSTNumber || "",
            companyPersonName: company?.companyPersonName || "",
        },
    });

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const formData = form.getValues();
        onSubmit(formData);
    };

    return (
        <Form {...form}>
            <form className="max-w-full space-y-10">
                <div className="space-y-4">
                    <p className="font-semibold text-accent">Company Details</p>
                    <div className="grid gap-4">
                        <FormField control={form.control} name="companyName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                    <Input {...field} autoComplete="off" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="companyEmail" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Email</FormLabel>
                                <FormControl>
                                    <Input {...field} autoComplete="off" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="companyTelephone" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Telephone</FormLabel>
                                <FormControl>
                                    <Input {...field} autoComplete="off" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="companyAddress" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Address</FormLabel>
                                <FormControl>
                                    <Input {...field} autoComplete="off" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="companyCity" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company City</FormLabel>
                                <FormControl>
                                    <Input {...field} autoComplete="off" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="companyState" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company State</FormLabel>
                                <FormControl>
                                    <Input {...field} autoComplete="off" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="companyPostCode" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Post Code</FormLabel>
                                <FormControl>
                                    <Input {...field} autoComplete="off" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="companyCountry" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Country</FormLabel>
                                <FormControl>
                                    <Input {...field} autoComplete="off" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="companyTagline" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Tagline</FormLabel>
                                <FormControl>
                                    <Input {...field} autoComplete="off" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="companyGSTNumber" render={({ field }) => (
                            <FormItem>
                                <FormLabel>GST Number</FormLabel>
                                <FormControl>
                                    <Input {...field} autoComplete="off" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="companyPersonName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact Person</FormLabel>
                                <FormControl>
                                    <Input {...field} autoComplete="off" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
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
