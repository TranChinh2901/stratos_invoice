import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Button, Typography, Row, Col, Divider, Spin } from 'antd';
import { PrinterOutlined, ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
import Layout from '../components/Layout/Layout';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const { Title, Text } = Typography;

const BillDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBillDetail();
    }, [id]);

    const fetchBillDetail = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/export/${id}`);
            const result = await response.json();

            if (result.success) {
                setBill(result.data);
            } else {
                console.error('Error fetching bill:', result.message);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        // Thêm CSS cho print
        const printStyles = `
            <style>
                @media print {
                    * {
                        visibility: hidden;
                    }
                    #bill-content, #bill-content * {
                        visibility: visible;
                    }
                    #bill-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none !important;
                    }
                    body {
                        margin: 0;
                        padding: 20px;
                    }
                    .ant-card {
                        border: none !important;
                        box-shadow: none !important;
                    }
                    .ant-table-bordered .ant-table-container {
                        border: 1px solid #000 !important;
                    }
                    .ant-table-bordered .ant-table-cell {
                        border: 1px solid #000 !important;
                    }
                }
            </style>
        `;

        // Thêm style vào head
        const existingStyle = document.querySelector('#print-styles');
        if (existingStyle) {
            existingStyle.remove();
        }

        const styleElement = document.createElement('div');
        styleElement.id = 'print-styles';
        styleElement.innerHTML = printStyles;
        document.head.appendChild(styleElement);

        // In
        window.print();

        // Xóa style sau khi in
        setTimeout(() => {
            const styleToRemove = document.querySelector('#print-styles');
            if (styleToRemove) {
                styleToRemove.remove();
            }
        }, 1000);
    };

    const handleDownloadPDF = async () => {
        const element = document.getElementById('bill-content');
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF();
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`hoa-don-${bill.billNumber}.pdf`);
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            align: 'right',
            render: (price) => `${price.toLocaleString('vi-VN')} VNĐ`,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
        },
        {
            title: 'Thành tiền',
            dataIndex: 'total',
            key: 'total',
            align: 'right',
            render: (total) => `${total.toLocaleString('vi-VN')} VNĐ`,
        },
    ];

    if (loading) {
        return (
            <Layout>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                </div>
            </Layout>
        );
    }

    if (!bill) {
        return (
            <Layout>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Text>Không tìm thấy hóa đơn</Text>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                {/* Buttons - sẽ bị ẩn khi in */}
                <div className="no-print" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/list')}
                    >
                        Quay lại
                    </Button>
                    <Button
                        type="primary"
                        icon={<PrinterOutlined />}
                        onClick={handlePrint}
                    >
                        In hóa đơn
                    </Button>
                    <Button
                        icon={<DownloadOutlined />}
                        onClick={handleDownloadPDF}
                    >
                        Tải PDF
                    </Button>
                </div>

                {/* Bill Content - chỉ phần này được in */}
                <Card id="bill-content" style={{ backgroundColor: 'white', marginTop: '20px' }}>
                    <div>
                        Tên cửa hàng: <Text strong>ABC Store</Text>
                    </div>
                    <div>
                        Địa chỉ: 18/06/02b Phạm Nhữ Tăng, Quận Thanh Khê, TP. Đà Nẵng
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '15px' }}>
                        <Title level={3} style={{ marginBottom: '5px' }}>
                            HÓA ĐƠN BÁN HÀNG
                        </Title>
                        <Text strong>Số: {bill.billNumber}</Text>
                    </div>

                    <Row gutter={[16, 16]} style={{ marginBottom: '30px' }}>
                        <Col span={12}>
                            <div>
                                <Text strong>Khách hàng: </Text>
                                <Text>{bill.customerName}</Text>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div style={{ textAlign: 'right' }}>
                                <Text strong>Ngày tạo: </Text>
                                <Text>{new Date(bill.createdAt).toLocaleDateString('vi-VN')}</Text>
                            </div>
                        </Col>
                    </Row>

                    <Table
                        columns={columns}
                        dataSource={bill.items.map((item, index) => ({ ...item, key: index }))}
                        pagination={false}
                        bordered
                        size="small"
                        summary={() => (
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={4}>
                                    <Text strong>Tổng cộng:</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1} align="right">
                                    <Text strong style={{ fontSize: '16px', color: '#f50' }}>
                                        {bill.totalAmount.toLocaleString('vi-VN')} VNĐ
                                    </Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        )}
                    />

                    <Divider />

                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <Text italic>Cảm ơn quý khách đã sử dụng dịch vụ!</Text>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default BillDetail;