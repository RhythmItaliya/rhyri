import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { Card, CardContent } from "../../components/ui/Card";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCompany } from "./fetchCompany";
import { catchError } from "../../lib/utils";
import { CompanyActions } from "../../components/action/CompanyActions";
import { UserSkeleton } from "../UserSkeleton";

export function CompanyPage() {
  const { id } = useParams();
  const { currentUser } = useAuth();

  if (!currentUser || !id) return null;

  const {
    data: company,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["company", currentUser.uid, id],
    queryFn: () => fetchCompany(id, currentUser.uid),
  });

  if (error) {
    catchError(error);
  }

  return (
    <>
      {isLoading ? (
        <UserSkeleton />
      ) : company ? (
        <div className="space-y-4 w-full max-w-5xl mx-auto">
          <Card>
            <CardContent className="flex-between pt-4">
              <div className="text-lg font-semibold">{company.companyName}</div>
              <div className="flex items-center space-x-4">
                <CompanyActions
                  companyId={company.id}
                  isCompanyPage={true}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-8 p-8">
              <div className="flex items-start flex-col sm:flex-row gap-4 justify-between">
                <div className="space-y-2">
                  <p className="font-semibold text-sm ">Name</p>
                  <p className="font-sm uppercase">{company.companyName || ' - '}</p>

                  <p className="font-semibold text-sm ">Email</p>
                  <p className="text-sm ">{company.companyEmail || ' - '}</p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-sm ">Telephone</p>
                  <p className="text-sm uppercase">{company.companyTelephone || ' - '}</p>

                  <p className="font-semibold text-sm ">Address</p>
                  <p className="text-sm uppercase">{company.companyAddress || ' - '}</p>

                  <p className="font-semibold text-sm ">Country</p>
                  <p className="text-sm uppercase">{company.companyCountry || ' - '}</p>

                  <p className="font-semibold text-sm ">City</p>
                  <p className="text-sm uppercase">{company.companyCity || ' - '}</p>

                  <p className="font-semibold text-sm ">Post Code</p>
                  <p className="text-sm uppercase">{company.companyPostCode || ' - '}</p>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-1">
                  <p className=" text-sm">State</p>
                  <p className="uppercase">{company.companyState || ' - '}</p>
                </div>

                <div className="space-y-1">
                  <p className=" text-sm">GST Number</p>
                  <p className="uppercase">{company.companyGSTNumber || ' - '}</p>
                </div>
              </div>

              <div className="border rounded-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Details</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Company Name</TableCell>
                      <TableCell className="uppercase">{company.companyName || ' - '}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell className="lowercase">{company.companyEmail || ' - '}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Telephone</TableCell>
                      <TableCell className="uppercase">{company.companyTelephone || ' - '}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Address</TableCell>
                      <TableCell className="uppercase">{company.companyAddress || ' - '}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Country</TableCell>
                      <TableCell className="uppercase">{company.companyCountry || ' - '}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>City</TableCell>
                      <TableCell className="uppercase">{company.companyCity || ' - '}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Post Code</TableCell>
                      <TableCell className="uppercase">{company.companyPostCode || ' - '}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>State</TableCell>
                      <TableCell className="uppercase">{company.companyState || ' - '}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>GST Number</TableCell>
                      <TableCell className="uppercase">{company.companyGSTNumber || ' - '}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Navigate to="/companies" />
      )}
    </>
  );
}
