import { useForm, usePage } from '@inertiajs/react';

import FlashMessage from '@/Components/FlashMessage';

export default function Create({ departments }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        birth_date: '',
        gender: '',
        hire_date: '',
        dept_no: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/employee'); // ส่งข้อมูลไปยัง `store` method
    };

    const { flash } = usePage().props;

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-blue-50 to-blue-100 p-6">
            <h1 className="text-3xl font-extrabold text-gray-700 mb-8">No pictures</h1>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg space-y-6"
            >
                <FlashMessage flash={flash} />

                {/* First Name */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">First Name:</label>
                    <input
                        type="text"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        placeholder="Enter first name"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                    {errors.first_name && (
                        <span className="text-red-500 text-sm">{errors.first_name}</span>
                    )}
                </div>

                {/* Last Name */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Last Name:</label>
                    <input
                        type="text"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        placeholder="Enter last name"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                    {errors.last_name && (
                        <span className="text-red-500 text-sm">{errors.last_name}</span>
                    )}
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Gender:</label>
                    <select
                        value={data.gender}
                        onChange={(e) => setData('gender', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                    </select>
                    {errors.gender && (
                        <span className="text-red-500 text-sm">{errors.gender}</span>
                    )}
                </div>

                {/* Hire Date */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Hire Date:</label>
                    <input
                        type="date"
                        value={data.hire_date}
                        onChange={(e) => setData('hire_date', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                    {errors.hire_date && (
                        <span className="text-red-500 text-sm">{errors.hire_date}</span>
                    )}
                </div>

                {/* Birth Date */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Birth Date:</label>
                    <input
                        type="date"
                        value={data.birth_date}
                        onChange={(e) => setData('birth_date', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                    {errors.birth_date && (
                        <span className="text-red-500 text-sm">{errors.birth_date}</span>
                    )}
                </div>

                {/* Department */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Department:</label>
                    <select
                        value={data.dept_no}
                        onChange={(e) => setData('dept_no', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                            <option key={dept.dept_no} value={dept.dept_no}>
                                {dept.dept_name}
                            </option>
                        ))}
                    </select>
                    {errors.dept_no && (
                        <span className="text-red-500 text-sm">{errors.dept_no}</span>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData('profile_picture', e.target.files[0])}
                        disabled={processing}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                >
                    Add Employee
                </button>
            </form>
        </div>
    );
}
