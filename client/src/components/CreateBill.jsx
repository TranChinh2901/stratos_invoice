import { useState } from 'react';

const CreateBill = ({ onBillCreated }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        items: [{ name: '', price: '', quantity: 1 }]
    });
    const [loading, setLoading] = useState(false);

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { name: '', price: '', quantity: 1 }]
        });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const updateItem = (index, field, value) => {
        const newItems = formData.items.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setFormData({ ...formData, items: newItems });
    };


    const handlePriceChange = (index, value) => {
        // Cho phép nhập số, dấu chấm và trống
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            updateItem(index, 'price', value);
        }
    };


    const handlePriceChangeSimple = (index, value) => {
        updateItem(index, 'price', value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const processedData = {
                ...formData,
                items: formData.items.map(item => ({
                    ...item,
                    price: parseFloat(item.price) || 0
                }))
            };

            const response = await fetch('http://localhost:3000/api/v1/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(processedData),
            });

            const result = await response.json();

            if (result.success) {
                alert('Hóa đơn đã được tạo thành công!');
                setFormData({
                    customerName: '',
                    items: [{ name: '', price: '', quantity: 1 }]
                });
                if (onBillCreated) onBillCreated(result.data);
            } else {
                alert('Lỗi: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi tạo hóa đơn');
        } finally {
            setLoading(false);
        }
    };

    const calculateItemTotal = (item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return price * quantity;
    };

    const calculateGrandTotal = () => {
        return formData.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    };

    return (
        <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{
                textAlign: 'center',
                marginBottom: '30px',
                color: '#333',
                borderBottom: '2px solid #007bff',
                paddingBottom: '10px'
            }}>
                Tạo Hóa Đơn Xuất
            </h2>

            <form onSubmit={handleSubmit}>
                {/* Thông tin khách hàng */}
                <div style={{ marginBottom: '25px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '500',
                        color: '#555'
                    }}>
                        Tên khách hàng:
                    </label>
                    <input
                        type="text"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        required
                        placeholder="Nhập tên khách hàng"
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontSize: '14px'
                        }}
                    />
                </div>

                {/* Danh sách sản phẩm */}
                <div style={{ marginBottom: '25px' }}>
                    <h3 style={{ marginBottom: '15px', color: '#555' }}>Danh sách sản phẩm</h3>

                    {formData.items.map((item, index) => (
                        <div key={index} style={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '6px',
                            padding: '15px',
                            marginBottom: '15px',
                            backgroundColor: '#fafafa'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '10px'
                            }}>
                                <span style={{ fontWeight: '500', color: '#666' }}>
                                    Sản phẩm {index + 1}
                                </span>
                                {formData.items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        style={{
                                            background: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '4px 8px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                    >
                                        Xóa
                                    </button>
                                )}
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr 1fr',
                                gap: '10px',
                                marginBottom: '10px'
                            }}>
                                <input
                                    type="text"
                                    placeholder="Tên sản phẩm"
                                    value={item.name}
                                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                                    required
                                    style={{
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}
                                />
                                {/* Thay đổi input giá để dễ nhập hơn */}
                                <input
                                    type="number"
                                    placeholder="Giá"
                                    value={item.price}
                                    onChange={(e) => updateItem(index, 'price', e.target.value)}
                                    required
                                    min="0"
                                    step="0.01"
                                    style={{
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        textAlign: 'right'
                                    }}
                                />
                                <input
                                    type="number"
                                    placeholder="SL"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                    required
                                    min="1"
                                    style={{
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        textAlign: 'center'
                                    }}
                                />
                            </div>

                            <div style={{
                                textAlign: 'right',
                                color: '#28a745',
                                fontWeight: '500'
                            }}>
                                Thành tiền: {calculateItemTotal(item).toLocaleString('vi-VN')} VND
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addItem}
                        style={{
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '10px 20px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        + Thêm sản phẩm
                    </button>
                </div>

                {/* Tổng tiền */}
                <div style={{
                    background: '#f8f9fa',
                    border: '2px solid #007bff',
                    borderRadius: '6px',
                    padding: '20px',
                    textAlign: 'center',
                    marginBottom: '25px'
                }}>
                    <div style={{ fontSize: '16px', marginBottom: '5px', color: '#666' }}>
                        Tổng thanh toán
                    </div>
                    <div style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#007bff'
                    }}>
                        {calculateGrandTotal().toLocaleString('vi-VN')} VND
                    </div>
                </div>

                {/* Nút submit */}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        background: loading ? '#6c757d' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '15px',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Đang tạo...' : 'Tạo hóa đơn'}
                </button>
            </form>
        </div>
    );
};

export default CreateBill;