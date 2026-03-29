export interface InvoiceData {
    invoiceId: string;
    email: string;
    bookingDate: Date;
    bookingNumber: string;
    passengerName: string;
    passengerEmail: string;
    boatName: string;
    tripDate: Date;
    amount: number;
    currency: string;
    transactionId: string;
    paymentDate: string;

}