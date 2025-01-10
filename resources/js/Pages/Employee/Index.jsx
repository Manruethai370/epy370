import { router } from '@inertiajs/react';
import React, { useState } from 'react';

const EmployeeList = ({ employees, query }) => {
    const [search, setSearch] = useState(query || '');
    //ข้อมูลของพนักงานที่ดึงมาจาก backend,ข้อมูลของพนักงานที่ดึงมาจาก backend

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/employees', { search });
    };
    //กำหนด state ชื่อ search ใช้เก็บค่าค้นหาเริ่มต้นเป็น query (หากมีค่า) หรือเป็นสตริงว่าง

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-8">
                Employee List
            </h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex justify-center mb-6">
                <div className="relative w-1/3">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Search employees..."
                    />
                    <button
                        type="submit"
                        className="absolute inset-y-0 right-0 px-4 text-white bg-indigo-500 rounded-r-lg hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-400"
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* Table */}
            <div className="mx-auto max-w-6xl shadow-lg rounded-lg overflow-hidden">
                {employees.data.length === 0 ? (
                    <div className="text-center text-gray-600 text-lg mt-8">No results found.</div>
                ) : (
                    <table className="min-w-full bg-white">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                                    ID
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                                    First Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                                    Last Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                                    Age
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {employees.data.map((employee, index) => (
                                <tr
                                    key={employee.emp_no}
                                    className={`${
                                        index % 2 === 0
                                            ? 'bg-gray-50'
                                            : 'bg-white'
                                    } hover:bg-indigo-100 transition`}
                                >
                                    <td className="px-6 py-4">{employee.emp_no}</td>
                                    <td className="px-6 py-4">{employee.first_name}</td>
                                    <td className="px-6 py-4">{employee.last_name}</td>
                                    <td className="px-6 py-4">{employee.birth_date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Paginationการแบ่งหน้า */}
            <div className="flex justify-center mt-8 space-x-2">
                {employees.links &&
                    employees.links.map((link, index) => (
                        <button
                            key={index}
                            onClick={() => router.get(link.url)}
                            className={`px-4 py-2 border rounded-lg ${
                                link.active
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-white text-indigo-600 hover:bg-indigo-100'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
            </div>
        </div>
    );
};

export default EmployeeList;
