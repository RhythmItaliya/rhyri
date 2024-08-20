import { Timestamp } from '@firebase/firestore';
import { InvoiceData, TransformedData, Item } from '../../types/invoiceTypes';
import Decimal from 'decimal.js';
import { toWords } from 'number-to-words';

const transformItems = (itemList?: Item[]): Item[] => {
    if (!itemList) return [];
    return itemList.map(item => {
        const name = item.item?.trim() || 'No Name Provided';
        const qty = new Decimal(item.quantity || '0');
        const rate = new Decimal(item.price || '0');

        return {
            name,
            qty: qty.toNumber(),
            rate: rate.toNumber(),
            total: qty.times(rate).toNumber()
        };
    });
};

const formatDate = (date: string | Date | Timestamp | undefined): string => {
    if (!date) return 'N/A';

    let d: Date;

    if (date instanceof Timestamp) {
        d = date.toDate();
    } else if (typeof date === 'string' || date instanceof Date) {
        d = new Date(date);
    } else {
        return 'N/A';
    }

    if (isNaN(d.getTime())) return 'N/A';

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
};

export const transformInvoiceData = (data: InvoiceData): TransformedData => {

    const transformedItems = transformItems(data.itemList as Item[] | undefined);

    const totalQty = transformedItems.reduce((total, item) => total.plus(new Decimal(item.qty)), new Decimal(0));
    const totalRate = transformedItems.reduce((total, item) => total.plus(new Decimal(item.rate)), new Decimal(0));

    const amount = new Decimal(data.amount || 0);
    const discountPercentage = new Decimal(data.discountPercentage || '0');
    const discountAmount = new Decimal(data.discountAmount || 0);
    const gst = new Decimal(data.gst || '0');
    const sgst = new Decimal(data.sgst || '0');
    const otherTaxPercentage = new Decimal(data.otherTaxPercentage || '0');
    const otherTaxAmount = new Decimal(data.otherTaxAmount || '0');

    const discountType = data.discountType ? String(data.discountType).toLowerCase() : 'percentage';
    const otherTaxType = data.otherTaxType ? String(data.otherTaxType).toLowerCase() : 'percentage';

    const discountApplied = discountType === "percentage"
        ? amount.times(discountPercentage).div(100)
        : discountAmount;

    const totalAfterDiscount = amount.minus(discountApplied);

    const gstAmount = totalAfterDiscount.times(gst).div(100);
    const sgstAmount = totalAfterDiscount.times(sgst).div(100);

    const otherTaxFinal = otherTaxType === "percentage"
        ? totalAfterDiscount.times(otherTaxPercentage).div(100)
        : otherTaxAmount;

    const finalAmount = totalAfterDiscount.plus(gstAmount).plus(sgstAmount).plus(otherTaxFinal);
    const roundedAmount = finalAmount.toDecimalPlaces(0, Decimal.ROUND_HALF_UP);

    const amountInWords = toWords(roundedAmount.toNumber()).replace(/,/g, '').replace(/\s+/g, ' ');

    const transformedData: TransformedData = {
        company: {
            companyName: data.companyName || "N/A",
            companyEmail: data.companyEmail || "N/A",
            companyTelephone: data.companyTelephone || "N/A",
            companyAddress: data.companyAddress || "N/A",
            companyCity: data.companyCity || "N/A",
            companyPostCode: data.companyPostCode || "N/A",
            companyCountry: data.companyCountry || "N/A",
            companyTagline: data.companyTagline || "N/A",
            companyState: data.companyState || "N/A",
            companyGSTNumber: data.companyGSTNumber || "N/A",
            companyPersonName: data.companyPersonName || "N/A",
        },
        invoice: {
            invoiceNumber: data.id || 'N/A',
            challanNumber: data.challanNumber || "N/A",
            creationDate: formatDate(data.invoiceDate),
            dueDate: formatDate(data.dueDate),
            invoiceCustomNumber: data.invoiceCustomNumber || 'N/A',
        },
        customer: {
            clientName: data.clientName || 'N/A',
            clientGSTNumber: data.clientGSTNumber || "N/A",
            clientTelephone: data.clientTelephone || 'N/A',
            clientEmail: data.clientEmail || 'N/A',
        },
        items: transformedItems,
        totals: {
            totalQty: totalQty.toNumber(),
            totalItems: totalRate.toNumber(),
            totalAmount: amount.toNumber(),
            discountPercent: discountPercentage.toNumber(),
            discountAmount: discountAmount.toNumber(),
            discountApplied: discountApplied.toNumber(),
            totalBeforeTax: totalAfterDiscount.toNumber(),
            gstPercent: gst.toNumber(),
            gstAmount: gstAmount.toNumber(),
            sgstPercent: sgst.toNumber(),
            sgstAmount: sgstAmount.toNumber(),
            otherTaxPercent: otherTaxPercentage.toNumber(),
            otherTaxAmount: otherTaxAmount.toNumber(),
            finalAmount: finalAmount.toNumber(),
            roundedAmount: roundedAmount.toNumber(),
            discountType: discountType,
            otherTaxType: otherTaxType
        },
        bankDetails: {
            bankName: data.bankName || "N/A",
            bankAccountNumber: data.bankAccountNumber || "N/A",
            bankBranchName: data.bankBranchName || "N/A",
            bankIfscCode: data.bankIfscCode || "N/A",
        },
        totalInWords: amountInWords,
        termsAndConditions: [
            "Term 1: Payment is due within 30 days.",
            "Term 2: Late payments will incur a 5% fee.",
            "Term 3: All sales are final."
        ]
    };

    return transformedData;
};
