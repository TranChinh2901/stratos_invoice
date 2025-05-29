import { useState } from 'react';
import CreateBill from './CreateBill';
import BillList from './BillList';
import BillDetail from './BillDetail';

const Home = () => {
    const [activeTab, setActiveTab] = useState('create');
    const [selectedBill, setSelectedBill] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleBillCreated = (newBill) => {
        setRefreshTrigger(prev => prev + 1);
        setActiveTab('list');
    };

    const handleViewBill = (bill) => {
        setSelectedBill(bill);
    };

    const handleCloseBillDetail = () => {
        setSelectedBill(null);
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <nav style={{
                backgroundColor: '#007bff',
                padding: '1rem 0',
                marginBottom: '2rem'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <h1 style={{ color: 'white', margin: 0, textAlign: 'center' }}>
                        Hệ Thống Quản Lý Hóa Đơn Xuất
                    </h1>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '1rem',
                        gap: '1rem'
                    }}>
                        <button
                            onClick={() => setActiveTab('create')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: activeTab === 'create' ? '#0056b3' : 'transparent',
                                color: 'white',
                                border: '2px solid white',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Tạo Hóa Đơn
                        </button>
                        <button
                            onClick={() => setActiveTab('list')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: activeTab === 'list' ? '#0056b3' : 'transparent',
                                color: 'white',
                                border: '2px solid white',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Danh Sách Hóa Đơn
                        </button>
                    </div>
                </div>
            </nav>

            <main>
                {activeTab === 'create' && (
                    <CreateBill onBillCreated={handleBillCreated} />
                )}
                {activeTab === 'list' && (
                    <BillList
                        onViewBill={handleViewBill}
                        refreshTrigger={refreshTrigger}
                    />
                )}
            </main>

            {selectedBill && (
                <BillDetail
                    bill={selectedBill}
                    onClose={handleCloseBillDetail}
                />
            )}
        </div>
    );
};

export default Home;