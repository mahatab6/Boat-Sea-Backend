import PDFDocument from 'pdfkit';
import { InvoiceData } from './payment.interface';

export const generateInvoicePdf = async (data: InvoiceData): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50,
            });

            const chunks: Buffer[] = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', (error) => reject(error));

            // --- Header ---
            doc.fontSize(24).font('Helvetica-Bold').text('BOOKING INVOICE', {
                align: 'center',
            });

            doc.moveDown(0.5);
            doc.fontSize(12).font('Helvetica-Bold').text('BOAT SEA', { align: 'center' });
            doc.fontSize(10).font('Helvetica').text('Explore the Horizons with Us', { align: 'center' });

            doc.moveDown(1);
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
            doc.moveDown(1);

            // --- Invoice & Trip Info (Two Column Style) ---
            const topY = doc.y;
            
            // Left Column: Passenger Info
            doc.fontSize(11).font('Helvetica-Bold').text('Passenger Details', 50, topY);
            doc.fontSize(10).font('Helvetica')
                .text(`Name: ${data.passengerName}`)
                .text(`Email: ${data.passengerEmail}`);

            // Right Column: Booking Info
            doc.fontSize(11).font('Helvetica-Bold').text('Booking Details', 350, topY);
            doc.fontSize(10).font('Helvetica')
                .text(`Booking #: ${data.bookingNumber}`, 350)
                .text(`Invoice ID: ${data.invoiceId}`, 350)
                .text(`Date: ${new Date(data.paymentDate).toLocaleDateString()}`, 350);

            doc.moveDown(2);

            // --- Boat & Trip Details ---
            const tripY = doc.y;
            doc.fontSize(11).font('Helvetica-Bold').text('Trip Information', 50, tripY);
            doc.fontSize(10).font('Helvetica')
                .text(`Vessel Name: ${data.boatName}`)
                .text(`Departure Date: ${new Date(data.tripDate).toLocaleDateString()}`)
                .text(`Transaction ID: ${data.transactionId}`);

            doc.moveDown(1.5);
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
            doc.moveDown(1);

            // --- Payment Summary Table ---
            const tableTop = doc.y;
            const col1X = 50;
            const col2X = 400;

            doc.fontSize(11).font('Helvetica-Bold').text('Payment Summary', col1X, tableTop);
            doc.moveDown(1);

            // Table Header
            doc.fontSize(10).font('Helvetica-Bold');
            doc.text('Description', col1X, doc.y);
            doc.text('Price', col2X, doc.y, { align: 'right', width: 100 });
            
            doc.moveDown(0.5);
            doc.moveTo(col1X, doc.y).lineTo(545, doc.y).lineWidth(0.5).stroke();
            doc.moveDown(0.8);

            // Row: Ticket Charge
            doc.font('Helvetica').text(`Boat Rental / Ticket Fare (${data.boatName})`, col1X, doc.y);
            doc.text(`${data.amount.toFixed(2)} ${data.currency}`, col2X, doc.y, { align: 'right', width: 100 });

            doc.moveDown(1.5);

            // Total Section
            doc.moveTo(350, doc.y).lineTo(545, doc.y).stroke();
            doc.moveDown(0.5);
            doc.fontSize(12).font('Helvetica-Bold');
            doc.text('Total Paid', 350, doc.y);
            doc.text(`${data.amount.toFixed(2)} ${data.currency}`, col2X, doc.y, { align: 'right', width: 100 });

            // --- Footer ---
            doc.moveDown(5);
            doc.fontSize(9).font('Helvetica').fillColor('#555555');
            doc.text(
                'Thank you for sailing with Boat Sea! Please present this invoice at the dock.',
                { align: 'center' }
            );
            doc.moveDown(0.3);
            doc.text('Electronic receipt - No signature required.', { align: 'center' });
            doc.text('Support: support@boatsea.com | Secure Payment via Stripe', { align: 'center' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};