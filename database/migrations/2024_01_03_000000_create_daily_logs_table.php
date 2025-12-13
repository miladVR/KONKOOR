<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('log_date');
            $table->string('subject'); // درس
            $table->string('topic')->nullable(); // مبحث
            $table->decimal('hours_studied', 4, 2); // ساعت مطالعه
            $table->integer('test_count')->default(0); // تعداد تست
            $table->tinyInteger('quality_score')->nullable(); // نمره کیفیت 1-10
            $table->text('notes')->nullable(); // یادداشت
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique(['user_id', 'log_date', 'subject']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_logs');
    }
};
