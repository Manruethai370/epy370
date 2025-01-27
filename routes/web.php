<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EmployeeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// หน้าแรกของเว็บไซต์
Route::get('/', function () {
    return Inertia::render('Welcome', [ // แสดงหน้า Welcome
        'canLogin' => Route::has('login'), // ตรวจสอบเส้นทางล็อกอิน
        'canRegister' => Route::has('register'), // ตรวจสอบเส้นทางสมัครสมาชิก
        'laravelVersion' => Application::VERSION, // เวอร์ชัน Laravel
        'phpVersion' => PHP_VERSION, // เวอร์ชัน PHP
    ]);
});

// เส้นทางสำหรับ Dashboard
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard'); // แสดงหน้า Dashboard
})->middleware(['auth', 'verified']) // ต้องล็อกอินและยืนยันอีเมล
->name('dashboard'); // ชื่อเส้นทาง 'dashboard'

// กลุ่มเส้นทางที่ต้องล็อกอิน
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit'); // หน้าแก้ไขโปรไฟล์
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update'); // อัปเดตโปรไฟล์
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy'); // ลบโปรไฟล์
});

// เส้นทางสำหรับจัดการพนักงาน
Route::get('/employee', [EmployeeController::class, 'index'])->name('employees.index'); // แสดงรายการพนักงาน
Route::get('/employee/create', [EmployeeController::class, 'create'])->name('employees.create'); // แสดงฟอร์มเพิ่มพนักงาน
Route::post('/employee', [EmployeeController::class, 'store'])->name('employees.store'); // บันทึกพนักงานใหม่

// เส้นทางสำหรับระบบยืนยันตัวตน
require __DIR__ . '/auth.php';
