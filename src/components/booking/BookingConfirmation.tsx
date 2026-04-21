type BookingConfirmationProps = {
  message?: string
}

export default function BookingConfirmation({ message = 'Booking confirmed.' }: BookingConfirmationProps) {
  return <div className="badge badge-success">{message}</div>
}
