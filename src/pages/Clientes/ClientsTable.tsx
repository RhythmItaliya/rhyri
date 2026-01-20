import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { Skeleton } from "../../components/Skeleton";
import { useNavigate } from "react-router-dom";

import { Client } from "../../types";
import { ColumnDef } from "./schema";
import { ClientActions } from "../../components/action/ClientActions";

interface ClientsTableProps {
  clients?: Client[];
  isPending: boolean;
  columns: ColumnDef[];
}

export function ClientsTable({
  isPending,
  clients,
  columns,
}: ClientsTableProps) {
  const navigate = useNavigate();
  const visibleColumns = columns.filter((column) => column.isVisible);

  return (
    <div className="rounded-sm border">
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.map((column) => (
              <TableHead key={column.id}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending ? (
            <TableRow>
              <TableCell colSpan={visibleColumns.length}>
                <Skeleton className="w-full h-10" />
              </TableCell>
            </TableRow>
          ) : clients?.length ? (
            clients.map((client) => (
              <TableRow
                key={client.id}
                className="cursor-pointer"
                onClick={() => navigate(`/client/${client.id}`)}
              >
                {visibleColumns.map((column) => (
                  <TableCell key={column.id}>
                    {column.id === "name" &&
                      (client.clientName
                        ? client.clientName.toUpperCase()
                        : " - ")}
                    {column.id === "email" &&
                      (client.clientEmail
                        ? client.clientEmail.toLowerCase()
                        : " - ")}
                    {column.id === "telephone" &&
                      (client.clientTelephone
                        ? client.clientTelephone.toUpperCase()
                        : " - ")}
                    {column.id === "category" &&
                      (client.clientCategory
                        ? client.clientCategory.toUpperCase()
                        : " - ")}
                  </TableCell>
                ))}
                <TableCell>
                  <ClientActions clientId={client.id} isClientPage={false} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={visibleColumns.length}
                className="text-center h-24"
              >
                No Clients
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
