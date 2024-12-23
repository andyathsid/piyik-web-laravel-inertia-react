<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeeklySensorData extends Model
{
    protected $fillable = [
        'incubator_id',
        'humidity',
        'tempdht',
        'thermocouple',
        'recorded_at',
        'is_initial'
    ];

    protected $casts = [
        'recorded_at' => 'datetime',
        'is_initial' => 'boolean'
    ];

    public function incubator()
    {
        return $this->belongsTo(Incubator::class);
    }
}
