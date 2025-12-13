<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 10, 0); // مبلغ به تومان
            $table->enum('gateway', ['zarinpal', 'nextpay', 'manual'])->default('zarinpal');
            $table->enum('status', ['pending', 'success', 'failed'])->default('pending');
            $table->string('tracking_code')->nullable(); // کد پیگیری
            $table->string('reference_id')->nullable(); // شماره مرجع
            $table->timestamp('verified_at')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
