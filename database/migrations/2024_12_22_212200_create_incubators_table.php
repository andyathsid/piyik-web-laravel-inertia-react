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
        Schema::create('incubators', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('jenis_telur');
            $table->boolean('is_incubating')->default(false);
            $table->integer('remaining_days')->nullable();
            $table->integer('total_days')->nullable();
            $table->timestamp('registered_at');
            $table->string('registered_by');
            $table->foreignIdFor(\App\Models\User::class)->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incubators');
    }
};
