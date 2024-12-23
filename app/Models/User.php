<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'firebase_uid',
        'name',
        'email',
    ];

    protected $hidden = [
        'remember_token',
    ];

    public function incubators()
    {
        return $this->hasMany(Incubator::class);
    }
}
