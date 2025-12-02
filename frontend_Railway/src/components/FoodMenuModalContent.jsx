import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useTrains } from '../context/TrainContext';
import './FoodMenu.css';

const FoodMenuModalContent = ({ onClose }) => {
    const { foodMenu, fetchFoodMenu, submitFoodOrder } = useTrains();
    const [cart, setCart] = useState({}); // Stores { itemId: quantity }
    const [bookingPnr, setBookingPnr] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Wrap fetchFoodMenu in useCallback to prevent re-fetching on every render
    const memoizedFetchFoodMenu = useCallback(() => {
        fetchFoodMenu();
    }, [fetchFoodMenu]);


    useEffect(() => {
        memoizedFetchFoodMenu(); // Load menu when modal opens
    }, [memoizedFetchFoodMenu]); // Use the memoized version

    const handleAddToCart = (item) => {
        setCart(prevCart => ({
            ...prevCart,
            [item.id]: (prevCart[item.id] || 0) + 1
        }));
    };

    const handleRemoveFromCart = (item) => {
        setCart(prevCart => {
            const newQuantity = (prevCart[item.id] || 0) - 1;
            if (newQuantity <= 0) {
                const { [item.id]: _, ...rest } = prevCart; // Remove item if quantity is 0
                return rest;
            }
            return { ...prevCart, [item.id]: newQuantity };
        });
    };

    const calculateTotal = () => {
        return foodMenu.reduce((total, item) => {
            const quantity = cart[item.id] || 0;
            return total + (item.price * quantity);
        }, 0);
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setMessage('');
        if (Object.keys(cart).length === 0) {
            setMessage('Your cart is empty.');
            return;
        }
        if (!bookingPnr) {
            setMessage('Please enter your Booking PNR.');
            return;
        }
        setIsLoading(true);

        const orderedItems = Object.entries(cart).map(([itemId, quantity]) => ({
            foodItemId: parseInt(itemId),
            quantity: quantity
        }));

        try {
            const success = await submitFoodOrder({ bookingPnr, items: orderedItems });
            if (success) {
                setMessage('Order placed successfully!');
                setCart({});
                setBookingPnr('');
                setTimeout(onClose, 2000);
            } else {
                setMessage('Failed to place order. Please try again.');
            }
        } catch(error) {
            console.error("Order submission failed:", error);
            setMessage('Failed to place order. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    const total = calculateTotal();

    return (
        <div className="food-menu-container">
            {message && <p className={message.includes('success') ? 'form-success' : 'form-error'}>{message}</p>}
            <div className="menu-items">
                {foodMenu.length === 0 && <p>Loading menu...</p>}
                {foodMenu.map(item => (
                    <div key={item.id} className="menu-item">
                        <div className="item-info">
                            <h4>{item.name}</h4>
                            <p>₹{item.price.toFixed(2)}</p>
                        </div>
                        <div className="item-controls">
                            <button onClick={() => handleRemoveFromCart(item)} disabled={!cart[item.id]}>-</button>
                            <span>{cart[item.id] || 0}</span>
                            <button onClick={() => handleAddToCart(item)}>+</button>
                        </div>
                    </div>
                ))}
            </div>

            {Object.keys(cart).length > 0 && (
                <form onSubmit={handleSubmitOrder} className="order-summary form-container modal-form"> {/* Added modal-form */}
                    <h3>Order Summary</h3>
                    <input
                        type="text"
                        placeholder="Enter Booking PNR to order"
                        value={bookingPnr}
                        onChange={(e) => setBookingPnr(e.target.value.toUpperCase())}
                        className="form-input"
                        required
                    />
                    <p className="total-price">Total: ₹{total.toFixed(2)}</p>
                    <button type="submit" className="form-button form-button-full" disabled={isLoading}>
                        {isLoading ? 'Placing Order...' : 'Place Order'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default FoodMenuModalContent;