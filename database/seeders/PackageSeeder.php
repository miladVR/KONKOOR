<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        $packages = [
            [
                'name' => 'برنزی',
                'slug' => 'bronze-1-month',
                'price' => 290000,
                'duration_days' => 30,
                'description' => "دسترسی به تمام آزمون‌ها\nبرنامه مطالعاتی پایه\nپشتیبانی تیکت",
                'is_active' => true,
            ],
            [
                'name' => 'نقره‌ای',
                'slug' => 'silver-3-months',
                'price' => 790000,
                'duration_days' => 90,
                'description' => "دسترسی به تمام آزمون‌ها\nبرنامه مطالعاتی پیشرفته\nدسترسی به منابع آموزشی\nمشاوره ماهانه",
                'is_active' => true,
            ],
            [
                'name' => 'طلایی',
                'slug' => 'gold-6-months',
                'price' => 1490000,
                'duration_days' => 180,
                'description' => "دسترسی نامحدود به همه بخش‌ها\nبرنامه مطالعاتی شخصی‌سازی شده\nمشاور اختصاصی\nتحلیل دقیق آزمون‌ها",
                'is_active' => true,
            ],
        ];

        foreach ($packages as $pkg) {
            Package::updateOrCreate(['slug' => $pkg['slug']], $pkg);
        }
    }
}
