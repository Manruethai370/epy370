<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     * ฟังก์ชันสำหรับแสดงรายการของพนักงาน
     */
    public function index(Request $request)
    {
        // รับค่าการค้นหา, คอลัมน์การเรียงลำดับ และทิศทางการเรียงลำดับจากคำขอ
        $query = $request->input('search');
        $sortColumn = $request->input('sort', 'emp_no'); // ถ้าไม่ได้กำหนดค่าจะใช้ 'emp_no' เป็นค่าเริ่มต้น
        $sortDirection = $request->input('direction', 'asc'); // ค่าเริ่มต้นคือ 'asc'

        // ดึงข้อมูลพนักงานจากฐานข้อมูลโดยมีการค้นหาและจัดเรียง
        $employees = DB::table('employees')
            ->where('first_name', 'like', '%' . $query . '%') // ค้นหาชื่อที่มีข้อความคล้ายกับ $query
            ->orWhere('last_name', 'like', '%' . $query . '%') // หรือค้นหานามสกุล
            ->orderBy($sortColumn, $sortDirection) // จัดเรียงตามคอลัมน์และทิศทางที่กำหนด
            ->paginate(20); // แบ่งข้อมูลเป็นหน้าละ 20 รายการ

        // ส่งข้อมูลไปยังหน้าที่ใช้ Inertia Render
        return Inertia::render('Employee/Index', [
            'employees' => $employees,
            'query' => $query,
            'sortColumn' => $sortColumn,
            'sortDirection' => $sortDirection,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     * ฟังก์ชันสำหรับแสดงแบบฟอร์มเพิ่มข้อมูลพนักงาน
     */
    public function create()
    {
        // ดึงรายชื่อแผนกจากฐานข้อมูลเพื่อนำไปแสดงในฟอร์ม
        $departments = DB::table('departments')->select('dept_no', 'dept_name')->get();

        // ส่งข้อมูลรายชื่อแผนกไปยังหน้าแบบฟอร์มด้วย Inertia
        return inertia('Employee/Create', ['departments' => $departments]);
    }

    /**
     * Store a newly created resource in storage.
     * ฟังก์ชันสำหรับบันทึกข้อมูลพนักงานใหม่ในฐานข้อมูล
     */
    public function store(Request $request)
    {
        try {
            // ตรวจสอบความถูกต้องของข้อมูลที่รับเข้ามา
            $validated = $request->validate([
                'first_name' => 'required|string|max:14', // ชื่อต้องไม่เกิน 14 ตัวอักษร
                'last_name' => 'required|string|max:16', // นามสกุลต้องไม่เกิน 16 ตัวอักษร
                'gender' => 'required|in:M,F', // เพศต้องเป็น M (ชาย) หรือ F (หญิง)
                'hire_date' => 'required|date', // วันที่เริ่มงานต้องเป็นรูปแบบวันที่
                'birth_date' => 'required|date', // วันเกิดต้องเป็นรูปแบบวันที่
                'dept_no' => 'required|exists:departments,dept_no', // รหัสแผนกต้องมีอยู่ในฐานข้อมูล
                'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // รูปภาพต้องเป็นไฟล์ที่รองรับและไม่เกิน 2MB
            ]);

            $profilePicturePath = null; // ตัวแปรสำหรับเก็บที่อยู่ไฟล์รูปโปรไฟล์
            if ($request->hasFile('profile_picture')) {
                // หากมีการอัปโหลดรูปภาพ จะทำการบันทึกในโฟลเดอร์ 'profile_pictures' ภายใต้ 'public'
                $profilePicturePath = $request->file('profile_picture')->store('profile_pictures', 'public');
            }

            // ใช้ Transaction เพื่อความปลอดภัยในการบันทึกข้อมูลหลายตาราง
            DB::transaction(function () use ($validated, $profilePicturePath) {
                // ดึงหมายเลขพนักงานล่าสุดจากฐานข้อมูล
                $latestEmpNo = DB::table('employees')->max('emp_no') ?? 0;
                $newEmpNo = $latestEmpNo + 1; // สร้างหมายเลขพนักงานใหม่โดยเพิ่ม 1

                // เพิ่มข้อมูลพนักงานในตาราง employees
                DB::table('employees')->insert([
                    'emp_no' => $newEmpNo,
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                    'gender' => $validated['gender'],
                    'hire_date' => $validated['hire_date'],
                    'birth_date' => $validated['hire_date'],
                    'profile_picture' => $profilePicturePath,
                ]);

                // เพิ่มข้อมูลความสัมพันธ์พนักงานกับแผนกในตาราง dept_emp
                DB::table('dept_emp')->insert([
                    'emp_no' => $newEmpNo,
                    'dept_no' => $validated['dept_no'],
                    'from_date' => now(), // วันที่เริ่มต้นเป็นวันที่ปัจจุบัน
                    'to_date' => '9999-01-01', // กำหนดวันที่สิ้นสุดเป็นอนาคตไกล
                ]);
            });

            // บันทึกข้อมูลที่ร้องขอใน log
            Log::info($request->all());

            // ส่งกลับไปยังหน้ารายการพนักงาน พร้อมแสดงข้อความสำเร็จ
            return redirect()->route('employees.index')
            ->with('success', 'Employee created successfully.');




        } catch (\Exception $e) {
            // บันทึกข้อผิดพลาดใน log
            Log::error($e->getMessage());

            // ส่งกลับไปยังหน้าเดิม พร้อมแสดงข้อความข้อผิดพลาด
            return back()->with('error', 'Failed to create employee. Please try again.');
        }
    }

    /**
     * Display the specified resource.
     * ฟังก์ชันสำหรับแสดงรายละเอียดพนักงาน (ยังไม่ถูกใช้งาน)
     */
    public function show(Employee $employee)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     * ฟังก์ชันสำหรับแสดงฟอร์มแก้ไขข้อมูลพนักงาน (ยังไม่ถูกใช้งาน)
     */
    public function edit(Employee $employee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     * ฟังก์ชันสำหรับอัปเดตข้อมูลพนักงาน (ยังไม่ถูกใช้งาน)
     */
    public function update(Request $request, Employee $employee)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     * ฟังก์ชันสำหรับลบข้อมูลพนักงาน (ยังไม่ถูกใช้งาน)
     */
    public function destroy(Employee $employee)
    {
        //
    }
}
