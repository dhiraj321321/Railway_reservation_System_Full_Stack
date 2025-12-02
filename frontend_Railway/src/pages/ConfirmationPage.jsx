// import React from 'react';
// import { useLocation } from 'react-router-dom';

// const ConfirmationPage = () => {
//   // You would pass the booking details here via route state
//   // const { state } = useLocation();
//   // const { booking } = state; // (You need to implement this part)

//   return (
//     <div style={{ padding: '2rem', textAlign: 'center' }}>
//       <h2>Booking Confirmed!</h2>
//       <p>Your ticket has been successfully booked.</p>
//       {/* TODO: Show PNR and other booking details */}
//       {/* <p><strong>PNR:</strong> {booking.pnr}</p> */}
//     </div>
//   );
// };

// export default ConfirmationPage;



import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const ConfirmationPage = () => {
  const { state } = useLocation();
  
  // Get the booking object from the navigation state
  // state?.booking is "optional chaining", it prevents errors if state is null
  const { booking } = state || {}; 

  // If no booking details were passed, show an error
  if (!booking) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Oops! Something went wrong.</h2>
        <p>No booking details found.</p>
        <Link to="/">Go to Home</Link>
      </div>
    );
  }

  // If booking details are present, show them!
  return (
    <div style={{ padding: '2rem', textAlign: 'center', maxWidth: '600px', margin: 'auto' }}>
      <h2 style={{ color: '#28a745' }}>Booking Confirmed!</h2>
      <p>Your ticket has been successfully booked.</p>
      
      <div style={{ border: '1px solid #ccc', padding: '1.5rem', marginTop: '2rem', textAlign: 'left', borderRadius: '8px' }}>
        <h3 style={{ textAlign: 'center', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
          PNR: {booking.pnr}
        </h3>
        <p><strong>Train:</strong> {booking.train.name} ({booking.train.id})</p>
        <p><strong>From:</strong> {booking.train.from} <strong>To:</strong> {booking.train.to}</p>
        <p><strong>Departure:</strong> {booking.train.departure}</p>
        <p><strong>Status:</strong> {booking.status}</p>
        
        <h4 style={{ marginTop: '1.5rem' }}>Passenger Details:</h4>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {booking.passengers.map((p, index) => (
            <li key={index} style={{ padding: '0.5rem 0', borderBottom: '1px solid #f4f4f4' }}>
              {index + 1}. {p.name} ({p.age}, {p.gender})
            </li>
          ))}
        </ul>
      </div>
      
      <Link to="/my-bookings" style={{ display: 'inline-block', marginTop: '2rem', textDecoration: 'none' }}>
        <button style={{ padding: '0.75rem 1.5rem' }}>View in My Bookings</button>
      </Link>
    </div>
  );
};

export default ConfirmationPage;