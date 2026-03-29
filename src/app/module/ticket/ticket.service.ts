const generateTickets = async (
  bookingId: string
) => {
  const seats =
    await prisma.seat.findMany({
      where: { bookingId },
    });

  const tickets = seats.map((seat) => ({
    bookingId,
    seatId: seat.id,
    ticketNumber:
      generateTicketNumber(),
  }));

  return prisma.ticket.createMany({
    data: tickets,
  });
};