import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Company } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/Skeleton';
import { PaginationState } from '../../pages/Companies/schema';

interface CompanyPopupProps {
    onSelect: (company: Company) => void;
    onClose: () => void;
}

const CompanyPopup: React.FC<CompanyPopupProps> = ({ onSelect, onClose }) => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [allCompanies, setAllCompanies] = useState<Company[]>([]);

    const [nameFilter, setNameFilter] = useState<string>('');
    const [emailFilter, setEmailFilter] = useState<string>('');

    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const isDarkTheme = theme === "dark";

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

    const fetchCompanies = async () => {
        if (!currentUser) {
            setError('User not authenticated');
            setLoading(false);
            return;
        }
        try {
            const companyQuery = query(
                collection(db, 'companies'),
                where('uid', '==', currentUser.uid),
            );
            const querySnapshot = await getDocs(companyQuery);
            const fetchedCompanies: Company[] = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            } as Company));

            setAllCompanies(fetchedCompanies);
            updateCompaniesForCurrentPage(fetchedCompanies);
        } catch (error) {
            console.error(error);
            setError('Failed to fetch companies');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, [currentUser]);

    useEffect(() => {
        updateCompaniesForCurrentPage(allCompanies);
    }, [pagination.pageIndex, allCompanies, nameFilter, emailFilter]);

    const updateCompaniesForCurrentPage = (companiesList: Company[]) => {
        const filteredCompanies = companiesList.filter(company =>
            company.companyName.toLowerCase().includes(nameFilter.toLowerCase()) &&
            company.companyEmail.toLowerCase().includes(emailFilter.toLowerCase())
        );
        const { pageIndex, pageSize } = pagination;
        const start = pageIndex * pageSize;
        const end = start + pageSize;
        setCompanies(filteredCompanies.slice(start, end));
    };

    const handleCompanySelection = (company: Company) => {
        setSelectedCompanyId(company.id);
        onSelect(company);
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
        if ((pagination.pageIndex + 1) * pagination.pageSize < allCompanies.length) {
            setPagination(prevState => ({
                ...prevState,
                pageIndex: prevState.pageIndex + 1,
            }));
        }
    };

    const handleClose = () => {
        setCompanies([]);
        setSelectedCompanyId(null);
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
    const hasNextPage = (pagination.pageIndex + 1) * pagination.pageSize < allCompanies.length;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className={`container max-w-full md:max-w-4xl bg-${isDarkTheme ? 'black text-white' : 'white text-black'} rounded-lg shadow-lg overflow-y-auto p-4 md:p-6`}>
                <div className="flex flex-col md:flex-row justify-between items-center p-2">
                    <p className="text-lg font-semibold">Select Company</p>
                    <Button type="button" onClick={handleClose} className="mt-2 md:mt-0">
                        Close
                    </Button>
                </div>

                <div className="mb-4 flex flex-col gap-4 md:flex-row md:gap-4">
                    <Input
                        type="text"
                        placeholder="Name"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        className="p-2 border rounded w-full md:w-1/3"
                        autoComplete="new-password"
                        name="name-filter"
                        id="name-filter"
                        inputMode="text"
                    />
                    <Input
                        type="text"
                        placeholder="Email"
                        value={emailFilter}
                        onChange={(e) => setEmailFilter(e.target.value)}
                        className="p-2 border rounded w-full md:w-1/3"
                        autoComplete="new-password"
                        name="email-filter"
                        id="email-filter"
                        inputMode="text"
                    />
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <div className="w-full">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-left">Name</TableHead>
                                <TableHead className="text-left">Email</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={2}>
                                        <Skeleton className='w-full h-32 rounded-md' />
                                    </TableCell>
                                </TableRow>
                            ) : companies.length > 0 ? (
                                companies.map((company) => (
                                    <TableRow
                                        key={company.id}
                                        onClick={() => handleCompanySelection(company)}
                                        className={`cursor-pointer ${selectedCompanyId === company.id ? 'bg-blue-100' : ''}`}
                                    >
                                        <TableCell>{company.companyName}</TableCell>
                                        <TableCell>{company.companyEmail}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2}>No companies found</TableCell>
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

interface CompanySelectButtonProps {
    onCompanySelect: (company: Company) => void;
}

const CompanySelectButton: React.FC<CompanySelectButtonProps> = ({ onCompanySelect }) => {
    const [showCompanyPopup, setShowCompanyPopup] = useState<boolean>(false);

    const handleSelect = (company: Company) => {
        setShowCompanyPopup(false);
        onCompanySelect(company);
    };

    const handleClose = () => {
        setShowCompanyPopup(false);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setShowCompanyPopup(true);
    };

    return (
        <>
            <Button type="button" onClick={handleClick}>
                Select Company
            </Button>

            {showCompanyPopup && (
                <CompanyPopup onSelect={handleSelect} onClose={handleClose} />
            )}
        </>
    );
};

export default CompanySelectButton;
