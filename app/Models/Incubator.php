<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Incubator extends Model
{
    protected $fillable = [
        'name',
        'jenis_telur',
        'is_incubating',
        'remaining_days',
        'total_days',
        'registered_at',
        'registered_by',
        'user_id'
    ];

    protected $casts = [
        'is_incubating' => 'boolean',
        'remaining_days' => 'integer',
        'total_days' => 'integer',
        'registered_at' => 'datetime'
    ];

    /**
     * Get the user that owns the incubator.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the sensor data records for the incubator.
     */
    public function hourlySensorData()
    {
        return $this->hasOne(HourlySensorData::class);
    }

    public function dailySensorData()
    {
        return $this->hasOne(DailySensorData::class);
    }

    public function weeklySensorData()
    {
        return $this->hasOne(WeeklySensorData::class);
    }

    
}
