import { useState, useEffect } from 'react';

const BillList = ({ onViewBill, refreshTrigger }) => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBills = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/v1/export');
            const result = await response.json();

            if (result.success) {
                setBills(result.data);
            } else {
                console.error('Error fetching bills:', result.message);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
    }, [refreshTrigger]);

    const deleteBill = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) return;

        try {
            const response = await fetch(`http://localhost:3000/api/v1/export/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (result.success) {
                setBills(bills.filter(bill => bill._id !== id));
                alert('Đã xóa hóa đơn thành công!');
            } else {
                alert('Lỗi: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi xóa hóa đơn');
        }
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <h2>Danh Sách Hóa Đơn</h2>
            {bills.length === 0 ? (
                <p>Chưa có hóa đơn nào.</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        border: '1px solid #ddd'
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                                    Khách hàng
                                </th>
                                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                                    Số sản phẩm
                                </th>
                                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'right' }}>
                                    Tổng tiền
                                </th>
                                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                                    Ngày tạo
                                </th>
                                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill) => (
                                <tr key={bill._id}>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                        {bill.customerName}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                        {bill.items.length}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'right' }}>
                                        {bill.totalAmount.toLocaleString('vi-VN')} VND
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                        {new Date(bill.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                                        <button
                                            onClick={() => onViewBill(bill)}
                                            style={{
                                                padding: '6px 12px',
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                marginRight: '5px'
                                            }}
                                        >
                                            Xem
                                        </button>
                                        <button
                                            onClick={() => deleteBill(bill._id)}
                                            style={{
                                                padding: '6px 12px',
                                                backgroundColor: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BillList;