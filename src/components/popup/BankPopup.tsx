import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Bank } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Button } from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { PaginationState } from '../../pages/Clientes/schema';
import { Input } from '../ui/Input';
import { Skeleton } from '../Skeleton';
import { useNavigate } from 'react-router-dom';

interface BankPopupProps {
    onSelect: (bank: Bank) => void;
    onClose: () => void;
}

const BankPopup: React.FC<BankPopupProps> = ({ onSelect, onClose }) => {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [allBanks, setAllBanks] = useState<Bank[]>([]);

    const [combinedFilter, setCombinedFilter] = useState<string>('');

    const navigate = useNavigate();

    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const isDarkTheme = theme === "dark";

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
        pageAction: null,
        lastIndex: null,
        firstIndex: null,
        categoryFilterValue: undefined,
        startAfterDoc: null,
    });

    if (!currentUser) return null;

    const fetchBanks = async () => {
        if (!currentUser) {
            setError('User not authenticated');
            setLoading(false);
            return;
        }
        try {
            const bankQuery = query(
                collection(db, 'banks'),
                where('uid', '==', currentUser.uid),
            );
            const querySnapshot = await getDocs(bankQuery);
            const fetchedBanks: Bank[] = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            } as Bank));

            setAllBanks(fetchedBanks);
            updateBanksForCurrentPage(fetchedBanks);
        } catch (error) {
            console.error(error);
            setError('Failed to fetch banks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanks();
    }, [currentUser]);

    useEffect(() => {
        updateBanksForCurrentPage(allBanks);
    }, [pagination.pageIndex, allBanks, combinedFilter]);

    const updateBanksForCurrentPage = (banksList: Bank[]) => {
        const filteredBanks = banksList.filter(bank => {
            const searchString = `${bank.bankName} ${bank.bankAccountNumber} ${bank.bankBranchName || ''}`.toLowerCase();
            return searchString.includes(combinedFilter.toLowerCase());
        });
        const { pageIndex, pageSize } = pagination;
        const start = pageIndex * pageSize;
        const end = start + pageSize;
        setBanks(filteredBanks.slice(start, end));
    };

    const handleBankSelection = (bank: Bank) => {
        setSelectedBankId(bank.id);
        onSelect(bank);
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
        if ((pagination.pageIndex + 1) * pagination.pageSize < allBanks.length) {
            setPagination(prevState => ({
                ...prevState,
                pageIndex: prevState.pageIndex + 1,
            }));
        }
    };

    const handleClose = () => {
        setBanks([]);
        setSelectedBankId(null);
        setPagination({
            pageIndex: 0,
            pageSize: 10,
            pageAction: null,
            lastIndex: null,
            firstIndex: null,
            categoryFilterValue: undefined,
            startAfterDoc: null,
        });
        onClose();
    };

    const hasPrevPage = pagination.pageIndex > 0;
    const hasNextPage = (pagination.pageIndex + 1) * pagination.pageSize < allBanks.length;

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
        navigate('/bank/new');
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className={`container max-w-full md:max-w-4xl bg-${isDarkTheme ? 'black text-white' : 'white text-black'} rounded-lg shadow-lg overflow-y-auto p-4 md:p-6`}>
                <div className="flex flex-col md:flex-row justify-between items-center p-2">
                    <p className="text-lg font-semibold">Select Bank</p>
                    <div className="flex space-x-2 gap-5">
                        <Button
                            type="button"
                            className="py-1 px-2 text-sm"
                            onClick={handleNavigate}>Add New</Button>
                        <Button type="button" className="py-1 px-2 text-sm" onClick={handleClose}>Close</Button>
                    </div>
                </div>

                <div className="my-2 flex flex-col gap-4 md:flex-row md:gap-4">
                    <Input
                        type="text"
                        placeholder="Search by Name or Account Number"
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
                                <TableHead className="text-left">Bank Name</TableHead>
                                <TableHead className="text-left">Account Number</TableHead>
                                <TableHead className="text-left">Branch Name</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <Skeleton className='w-full h-32 rounded-md' />
                                    </TableCell>
                                </TableRow>
                            ) : banks.length > 0 ? (
                                banks.map((bank) => (
                                    <TableRow
                                        key={bank.id}
                                        onClick={() => handleBankSelection(bank)}
                                        className={`cursor-pointer ${selectedBankId === bank.id ? 'bg-blue-100' : ''}`}
                                    >
                                        <TableCell className='uppercase'>{highlightMatch(bank.bankName, combinedFilter)}</TableCell>
                                        <TableCell>{highlightMatch(bank.bankAccountNumber || '', combinedFilter)}</TableCell>
                                        <TableCell className='uppercase'>{highlightMatch(bank.bankBranchName || '', combinedFilter)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3}>No banks found</TableCell>
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
        </div >
    );
};

interface BankSelectButtonProps {
    onBankSelect: (bank: Bank) => void;
}

const BankSelectButton: React.FC<BankSelectButtonProps> = ({ onBankSelect }) => {
    const [showBankPopup, setShowBankPopup] = useState<boolean>(false);

    const handleSelect = (bank: Bank) => {
        setShowBankPopup(false);
        onBankSelect(bank);
    };

    const handleClose = () => {
        setShowBankPopup(false);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setShowBankPopup(true);
    };


    return (
        <>
            <Button type="button" onClick={handleClick}>
                Select Bank
            </Button>

            {showBankPopup && (
                <BankPopup onSelect={handleSelect} onClose={handleClose} />
            )}
        </>
    );
};

export default BankSelectButton;
