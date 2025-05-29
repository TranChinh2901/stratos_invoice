import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const BillDetail = ({ bill, onClose }) => {
    const billRef = useRef();

    const exportToPDF = async () => {
        const element = billRef.current;
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 30;

        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save(`hoa-don-${bill.customerName.replace(/\s+/g, '-')}.pdf`);
    };

    if (!bill) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                maxWidth: '800px',
                maxHeight: '90vh',
                overflow: 'auto',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer'
                    }}
                >
                    ×
                </button>

                <div ref={billRef} style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h1 style={{ margin: 0, color: '#333' }}>Hóa đơn điện tử</h1>
                        <p style={{ margin: '5px 0', color: '#666' }}>
                            Ngày: {new Date(bill.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ marginBottom: '10px' }}>Thông tin khách hàng:</h3>
                        <p style={{ margin: '5px 0', fontSize: '16px' }}>
                            <strong>Tên khách hàng:</strong> {bill.customerName}
                        </p>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ marginBottom: '15px' }}>Chi tiết sản phẩm:</h3>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            border: '1px solid #ddd'
                        }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa' }}>
                                    <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                                        STT
                                    </th>
                                    <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                                        Tên sản phẩm
                                    </th>
                                    <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'right' }}>
                                        Đơn giá
                                    </th>
                                    <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                                        Số lượng
                                    </th>
                                    <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'right' }}>
                                        Thành tiền
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {bill.items.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                                            {index + 1}
                                        </td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                            {item.name}
                                        </td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>
                                            {item.price.toLocaleString('vi-VN')} VND
                                        </td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                                            {item.quantity}
                                        </td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>
                                            {item.total.toLocaleString('vi-VN')} VND
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ textAlign: 'right', marginTop: '20px' }}>
                        <h2 style={{
                            margin: 0,
                            padding: '10px',
                            backgroundColor: '#f8f9fa',
                            border: '2px solid #007bff',
                            display: 'inline-block'
                        }}>
                            Tổng cộng: {bill.totalAmount.toLocaleString('vi-VN')} VND
                        </h2>
                    </div>

                    <div style={{
                        marginTop: '40px',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>Người lập</p>
                            <p><i>chinh</i></p>
                            <p style={{ margin: '20px 0 0 0' }}>
                                Trần Viết Chính
                            </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>Khách hàng</p>
                            {/* <p style={{ margin: '50px 0 0 0', borderTop: '1px solid #000', paddingTop: '5px' }}>
                                (Ký, ghi rõ họ tên)
                            </p> */}
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                        onClick={exportToPDF}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            marginRight: '10px'
                        }}
                    >
                        Xuất PDF
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillDetail;