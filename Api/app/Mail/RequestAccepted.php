<?php

namespace App\Mail;

use App\Bookingdate;
use App\User;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class RequestAccepted extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * User instance.
     *
     * @var \App\User  $user
     */
    private $user;

    /**
     * Host instance.
     *
     * @var \App\User  $user
     */
    private $host;

    /**
     * Host instance.
     *
     * @var \App\Booking  $booking
     */
    private $booking;

    /**
     * Datetime instance
     *
     * @var Carbon $datetime
     */
    private $datetime;

    /**
     * Create a new message instance.
     *
     * @param \App\User  $user
     * @param \App\User  $host
     * @param \App\Bookingdate  $bookingdate
     */
    public function __construct(User $user, User $host, Bookingdate $bookingdate)
    {
        $this->user = $user;
        $this->host = $host;
        $this->booking = $bookingdate->booking->first();
        $this->datetime = Carbon::parse($bookingdate->date)->format('l jS \\of F Y h:i A');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('info@d2g.com')
            ->subject('Your request was accepted!')
            ->view('emails.request-accepted')
            ->with([
                'user' => $this->user,
                'host' => $this->host,
                'booking' => $this->booking,
                'datetime' => $this->datetime
            ]);
    }
}
