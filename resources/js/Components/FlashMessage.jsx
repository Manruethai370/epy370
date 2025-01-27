import { useState, useEffect } from 'react';

const FlashMessage = ({ flash }) => {
    const [visible, setVisible] = useState(!!flash.success || !!flash.error);

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => setVisible(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!flash.success && !flash.error) return null; // ตรวจสอบ flash ก่อน render
    if (!visible) return null;

    return (
        <div
            className={`${
                flash.success
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
            } mb-4 rounded border p-4`}
        >
            <p>{flash.success || flash.error}</p>
        </div>
    );
};

export default FlashMessage;
