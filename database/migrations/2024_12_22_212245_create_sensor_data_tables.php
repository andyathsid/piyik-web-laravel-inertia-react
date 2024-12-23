<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hourly_sensor_data', function (Blueprint $table) {
            $table->id();

            $table->foreignIdFor(\App\Models\Incubator::class)->constrained()->cascadeOnDelete();
            $table->float('humidity');
            $table->float('tempdht');
            $table->float('thermocouple');
            $table->timestamp('recorded_at');
            $table->boolean('is_initial')->default(true);
            $table->timestamps();
        });

        Schema::create('daily_sensor_data', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\Incubator::class)->constrained()->cascadeOnDelete();;
            $table->float('humidity');
            $table->float('tempdht');
            $table->float('thermocouple');
            $table->timestamp('recorded_at');
            $table->boolean('is_initial')->default(true);
            $table->timestamps();
        });

        Schema::create('weekly_sensor_data', function (Blueprint $table) {
            $table->id();
        
            $table->foreignIdFor(\App\Models\Incubator::class)->constrained()->cascadeOnDelete();
            $table->float('humidity');
            $table->float('tempdht');
            $table->float('thermocouple');
            $table->timestamp('recorded_at');
            $table->boolean('is_initial')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sensor_data_tables');
    }
};
