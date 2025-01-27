import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import FlashMessage from '@/Components/FlashMessage';
import { usePage } from '@inertiajs/react';



const EmployeeList = ({ employees, query }) => {
    const { flash } = usePage().props; // ดึง flash จาก props

    console.log(flash); // Debug: ดูว่า flash มีค่าอะไร

    const [search, setSearch] = useState(query || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/employee', { search });
    };

    return (


        <div className="min-h-screen bg-gray-50 py-10">

            <FlashMessage flash={flash} />
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
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                                    Photo
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
                                    <td style={{ padding: '10px', border: '1px solid #f0f0f0', textAlign: 'center' }}>
                                {employee.profile_picture ? (
                                    <img
                                    src={`/storage/${employee.profile_picture}`} // เพิ่ม /storage/ นำหน้า
                                        alt={`${employee.first_name} ${employee.last_name}`}
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            display: 'block', // ทำให้ img เป็น block เพื่อจัดกึ่งกลาง
                                            margin: '0 auto', // จัดให้อยู่ตรงกลางแนวนอน
                                        }}
                                    />
                                ) : (
                                    <span style={{ color: '#888' }}>ไม่มีรูปค่าาาา</span>
                                )}
                            </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
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
