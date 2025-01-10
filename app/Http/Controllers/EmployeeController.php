<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(Request $request): Response
    {
        $query = $request->input('search');

        $employees = DB::table('employees')
        ->where(function($q) use ($query) { //เงื่อนไขของการค้นหา
            $q->where('first_name', 'like', '%' . $query . '%') //การค้นหาชื่อ
              ->orWhere('last_name', 'like', '%' . $query . '%')//ค้นหานามสกุล
              ->orWhere('emp_no', 'like', '%' . $query . '%');
              
        })
        ->paginate(20);
        // $data = json_decode(json_encode($employees), true); // ใช้ json ในการแสดงผล array
        // Log::info($data);
        // return response($data);
        return Inertia::render('Employee/Index', [
            'employees' => $employees, //ตัวแปรที่เก็บข้อมูลพนักงาน โดยข้อมูลนี้จะถูกส่งไปยัง view หรือ component ที่ใช้แสดงผล
            'query' => $query, //การค้นหา
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Employee $employee)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Employee $employee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Employee $employee)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee)
    {
        //
    }
}
