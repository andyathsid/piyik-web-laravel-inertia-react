<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Tabel untuk menyimpan data mentah sensor
        Schema::create('sensor_logs', function (Blueprint $table) {
            $table->id();
            // Mengubah user_id menjadi foreign key yang merujuk ke firebase_uid di tabel users
            $table->string('user_id');
            $table->foreign('user_id')
                  ->references('firebase_uid')
                  ->on('users')
                  ->onDelete('cascade');
            $table->string('incubator_id');
            $table->float('humidity')->nullable();
            $table->float('tempdht')->nullable();
            $table->float('thermocouple')->nullable();
            $table->timestamp('created_at');

            $table->index(['user_id', 'incubator_id', 'created_at']);
        });

        // Tabel untuk menyimpan data agregasi
        Schema::create('sensor_aggregations', function (Blueprint $table) {
            $table->id();
            $table->string('user_id');
            $table->foreign('user_id')
                  ->references('firebase_uid')
                  ->on('users')
                  ->onDelete('cascade');
            $table->string('incubator_id');

            // Data sensor rata-rata
            $table->float('humidity_avg')->nullable();
            $table->float('tempdht_avg')->nullable();
            $table->float('thermocouple_avg')->nullable();

            // Data sensor minimum
            $table->float('humidity_min')->nullable();
            $table->float('tempdht_min')->nullable();
            $table->float('thermocouple_min')->nullable();

            // Data sensor maximum
            $table->float('humidity_max')->nullable();
            $table->float('tempdht_max')->nullable();
            $table->float('thermocouple_max')->nullable();

            $table->timestamp('period_start');
            $table->timestamp('period_end');
            $table->string('aggregation_type'); // 'hourly', 'daily', 'weekly'

            $table->index(['user_id', 'incubator_id', 'aggregation_type', 'period_start']);
        });

        // Tabel untuk metadata incubator
        Schema::create('incubators', function (Blueprint $table) {
            $table->id();
            $table->string('user_id');
            $table->foreign('user_id')
                  ->references('firebase_uid')
                  ->on('users')
                  ->onDelete('cascade');
            $table->string('device_id');
            $table->string('name');
            $table->string('registered_by');
            $table->timestamp('registered_at');
            $table->timestamps();

            // Settings
            $table->boolean('is_incubating')->default(false);
            $table->string('jenis_telur')->nullable();
            $table->integer('remaining_days')->default(0);
            $table->integer('total_days')->default(0);

            $table->unique(['user_id', 'device_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('sensor_logs');
        Schema::dropIfExists('sensor_aggregations');
        Schema::dropIfExists('incubators');
    }
};
