import React, { useEffect, useCallback } from 'react'; // 1. Import useEffect and useCallback
import { useTrains } from '../context/TrainContext';
import '../components/Card.css';
import '../index.css'; // For status badges

const MyFoodOrdersPage = () => {
    const { myFoodOrders, fetchFoodOrders } = useTrains();

    // 2. Wrap in useCallback
    const memoizedFetchFoodOrders = useCallback(() => {
        fetchFoodOrders();
    }, [fetchFoodOrders]);

    // 3. Add this useEffect hook
    useEffect(() => {
        memoizedFetchFoodOrders();
    }, [memoizedFetchFoodOrders]);

    return (
        <div className="page-container">
            <h1>My Food Orders</h1>
            {myFoodOrders.length === 0 ? (
                <p style={{ textAlign: 'center' }}>You have not placed any food orders.</p>
            ) : (
                myFoodOrders.map(order => (
                    <div key={order.id} className="card">
                        <div className="card-details">
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                                <h3 style={{ margin: 0 }}>Order for PNR: {order.bookingPnr}</h3>
                                <span className={`status-badge status-${order.status?.toLowerCase()}`}>{order.status}</span>
                            </div>
                            <p><strong>Total Price:</strong> ₹{order.totalPrice?.toFixed(2)}</p>
                            <h4 style={{marginTop: '1rem', marginBottom: '0.5rem'}}>Items:</h4>
                            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                                {order.items?.map((item, index) => (
                                    <li key={index} style={{ marginBottom: '0.25rem' }}>
                                        {item.quantity} x {item.foodItem?.name || `Item ID ${item.foodItemId}`}
                                    </li>
                                ))}
                            </ul>
                            <p style={{fontSize: '0.8rem', color: '#888', marginTop: '1rem'}}>
                                Ordered: {new Date(order.timestamp).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyFoodOrdersPage;