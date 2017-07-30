<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name','last_name','email', 'password', 'image', 'street_number', 'postalcode', 'city',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * A user belongs to a booking dates.
     *
     * @return \Illuminate\Database\Eloquent\Relations\belongsToMany
     */
    public function bookingDates()
    {
        return $this->belongsToMany('App\Bookingdate', 'bookingdate_user', 'user_id', 'bookingdate_id');
    }

    /**
     * A user has many reviews.
     *
     * @return \Illuminate\Database\Eloquent\Relations\hasMany
     */
    public function reviews()
    {
        return $this->hasMany('App\Review', 'author_id');
    }
}
