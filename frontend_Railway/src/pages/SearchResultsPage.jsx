// import React from 'react';
// import { useTrains } from '../context/TrainContext';
// import { Link } from 'react-router-dom';

// const SearchResultsPage = () => {
//   const { searchResults, searchParams } = useTrains();

//   if (searchResults.length === 0) {
//     return (
//       <div style={{ padding: '2rem' }}>
//         <h2>No trains found from {searchParams.from} to {searchParams.to}.</h2>
//         <Link to="/">Search Again</Link>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>Showing Trains from {searchParams.from} to {searchParams.to}</h2>
//       {searchResults.map(train => (
//         <div key={train.id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
//           <h3>{train.name} ({train.id})</h3>
//           <p>Departure: {train.departure}</p>
//           <p>Arrival: {train.arrival}</p>
//           <p>Price: ₹{train.price}</p>
//           <p>{train.seatsAvailable} seats available</p>
//           <Link to={`/book/${train.id}`}>
//             <button>Book Now</button>
//           </Link>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SearchResultsPage;


import React from 'react';
import { useTrains } from '../context/TrainContext';
import { Link } from 'react-router-dom';
import '../components/Card.css'; // Import card styles
import '../components/Form.css'; // Import form styles (for the button)

const SearchResultsPage = () => {
  const { searchResults, searchParams } = useTrains();

  if (searchResults.length === 0) {
    return (
      <div className="page-container" style={{ textAlign: 'center' }}>
        <h2>No trains found from {searchParams.from} to {searchParams.to}.</h2>
        <Link to="/">Search Again</Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Showing Trains from {searchParams.from} to {searchParams.to}</h1>
      
      <div className="train-list">
        {searchResults.map(train => (
          <div key={train.id} className="card">
            <div className="card-row">
              <div className="card-details">
                <h3>{train.name} ({train.id})</h3>
                <p>
                  <strong>Departs:</strong> {train.departure} | <strong>Arrives:</strong> {train.arrival}
                </p>
                <p><strong>Duration:</strong> {train.duration}</p>
                <p>{train.seatsAvailable} seats available</p>
                <p className="price">₹{train.price}</p>
              </div>
              <div className="card-actions">
                <Link to={`/book/${train.id}`}>
                  <button className="form-button">Book Now</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResultsPage;