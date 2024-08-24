import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Client } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Button } from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { PaginationState } from '../../pages/Clientes/schema';
import { Input } from '../ui/Input';
import { Skeleton } from '../Skeleton';
import { useNavigate } from 'react-router-dom';

interface ClientPopupProps {
    onSelect: (client: Client) => void;
    onClose: () => void;
}

const ClientPopup: React.FC<ClientPopupProps> = ({ onSelect, onClose }) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [allClients, setAllClients] = useState<Client[]>([]);

    const [combinedFilter, setCombinedFilter] = useState<string>('');

    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const isDarkTheme = theme === "dark";
    const navigate = useNavigate();

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
        pageAction: null,
        lastIndex: null,
        firstIndex: null,
        categoryFilterValue: undefined,
        startAfterDoc: null,
    });

    if (!currentUser) return null;

    const fetchClients = async () => {
        if (!currentUser) {
            setError('User not authenticated');
            setLoading(false);
            return;
        }
        try {
            const clientQuery = query(
                collection(db, 'clients'),
                where('uid', '==', currentUser.uid),
            );
            const querySnapshot = await getDocs(clientQuery);
            const fetchedClients: Client[] = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            } as Client));

            setAllClients(fetchedClients);
            updateClientsForCurrentPage(fetchedClients);
        } catch (error) {
            console.error(error);
            setError('Failed to fetch clients');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, [currentUser]);

    useEffect(() => {
        updateClientsForCurrentPage(allClients);
    }, [pagination.pageIndex, allClients, combinedFilter]);

    const updateClientsForCurrentPage = (clientsList: Client[]) => {
        const filteredClients = clientsList.filter(client => {
            const searchString = `${client.clientName} ${client.clientEmail} ${client.clientTelephone || ''}`.toLowerCase();
            return searchString.includes(combinedFilter.toLowerCase());
        });
        const { pageIndex, pageSize } = pagination;
        const start = pageIndex * pageSize;
        const end = start + pageSize;
        setClients(filteredClients.slice(start, end));
    };

    const handleClientSelection = (client: Client) => {
        setSelectedClientId(client.id);
        onSelect(client);
    };

    const handleGetPrevPage = () => {
        if (pagination.pageIndex > 0) {
            setPagination(prevState => ({
                ...prevState,
                pageIndex: prevState.pageIndex - 1,
            }));
        }
    };

    const handleGetNextPage = () => {
        if ((pagination.pageIndex + 1) * pagination.pageSize < allClients.length) {
            setPagination(prevState => ({
                ...prevState,
                pageIndex: prevState.pageIndex + 1,
            }));
        }
    };

    const handleClose = () => {
        setClients([]);
        setSelectedClientId(null);
        setPagination({
            pageIndex: 0,
            pageSize: 5,
            pageAction: null,
            lastIndex: null,
            firstIndex: null,
            categoryFilterValue: undefined,
            startAfterDoc: null,
        });
        onClose();
    };

    const hasPrevPage = pagination.pageIndex > 0;
    const hasNextPage = (pagination.pageIndex + 1) * pagination.pageSize < allClients.length;

    const highlightMatch = (text: string, filter: string) => {
        if (!filter) return text;

        const highlightColor = isDarkTheme ? 'bg-[#666600]' : 'bg-[#FFD700]';

        const parts = text.split(new RegExp(`(${filter})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === filter.toLowerCase() ? (
                <span key={index} className={highlightColor}>{part}</span>
            ) : (
                part
            )
        );
    };

    const handleNavigate = (event: React.MouseEvent) => {
        event.stopPropagation();
        navigate('/client/new');
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className={`container max-w-full md:max-w-4xl bg-${isDarkTheme ? 'black text-white' : 'white text-black'} rounded-lg shadow-lg overflow-y-auto p-4 md:p-6`}>
                <div className="flex flex-col md:flex-row justify-between items-center p-2">
                    <p className="text-lg font-semibold">Select Client</p>
                    <div className="flex space-x-2 gap-5">
                        <Button
                            type="button"
                            className="py-1 px-2 text-sm"
                            onClick={handleNavigate}
                        >
                            Add New
                        </Button>
                        <Button
                            type="button"
                            className="py-1 px-2 text-sm"
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                    </div>
                </div>

                <div className="my-2 flex flex-col gap-4 md:flex-row md:gap-4">
                    <Input
                        type="text"
                        placeholder="Search by Name, Email, or Phone"
                        value={combinedFilter}
                        onChange={(e) => setCombinedFilter(e.target.value)}
                        className="p-2 border rounded w-full"
                        autoComplete="new-password"
                        name="combined-filter"
                        id="combined-filter"
                        inputMode="text"
                    />
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <div className="w-full">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-left">Name</TableHead>
                                <TableHead className="text-left">Telephone</TableHead>
                                <TableHead className="text-left">Email</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <Skeleton className='w-full h-32 rounded-md' />
                                    </TableCell>
                                </TableRow>
                            ) : clients.length > 0 ? (
                                clients.map((client) => (
                                    <TableRow
                                        key={client.id}
                                        onClick={() => handleClientSelection(client)}
                                        className={`cursor-pointer ${selectedClientId === client.id ? 'bg-blue-100' : ''}`}
                                    >
                                        <TableCell className='uppercase'>{highlightMatch(client.clientName, combinedFilter)}</TableCell>
                                        <TableCell>{highlightMatch(client.clientTelephone || '', combinedFilter)}</TableCell>
                                        <TableCell>{highlightMatch(client.clientEmail, combinedFilter)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3}>No clients found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 justify-end mt-4">
                    <Button
                        variant="outline"
                        sizes="sm"
                        aria-label="Get previous page"
                        onClick={handleGetPrevPage}
                        disabled={!hasPrevPage}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        sizes="sm"
                        aria-label="Get next page"
                        onClick={handleGetNextPage}
                        disabled={!hasNextPage}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

interface ClientSelectButtonProps {
    onClientSelect: (client: Client) => void;
}

const ClientSelectButton: React.FC<ClientSelectButtonProps> = ({ onClientSelect }) => {
    const [showClientPopup, setShowClientPopup] = useState<boolean>(false);

    const handleSelect = (client: Client) => {
        setShowClientPopup(false);
        onClientSelect(client);
    };

    const handleClose = () => {
        setShowClientPopup(false);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setShowClientPopup(true);
    };

    return (
        <>
            <Button type="button" onClick={handleClick}>Select Client</Button>

            {showClientPopup && (
                <div>
                    <ClientPopup onSelect={handleSelect} onClose={handleClose} />
                </div>
            )}
        </>
    );
};

export default ClientSelectButton;
