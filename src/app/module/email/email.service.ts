// const sendTicketEmail = async (
//   bookingId: string
// ) => {
//   const booking =
//     await prisma.booking.findUnique({
//       where: { id: bookingId },
//       include: {
//         user: true,
//         tickets: true,
//       },
//     });

//   await transporter.sendMail({
//     to: booking.user.email,
//     subject: "Boat Ticket Confirmed",
//     html: `
// Booking Confirmed
// Tickets: ${booking.tickets.length}
// `,
//   });
// };