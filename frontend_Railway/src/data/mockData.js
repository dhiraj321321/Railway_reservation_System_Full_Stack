// This is your fake database
export const MOCK_TRAINS = [
  {
    id: "T123",
    name: "Rajdhani Express",
    from: "NDLS", // New Delhi
    to: "BOM", // Mumbai
    departure: "17:00",
    arrival: "09:00",
    duration: "16h 0m",
    price: 2500,
    seatsAvailable: 50,
  },
  {
    id: "T456",
    name: "Duronto Express",
    from: "NDLS", // New Delhi
    to: "HWH", // Howrah
    departure: "19:00",
    arrival: "11:00",
    duration: "16h 0m",
    price: 2200,
    seatsAvailable: 100,
  },
  {
    id: "T789",
    name: "Shatabdi Express",
    from: "BOM", // Mumbai
    to: "ADI", // Ahmedabad
    departure: "06:00",
    arrival: "13:00",
    duration: "7h 0m",
    price: 1200,
    seatsAvailable: 20,
  }
];

export const MOCK_USERS = [
  {
    id: "u1",
    username: "user",
    password: "password123", // In a real app, this would be hashed
    role: "user",
  },
  {
    id: "a1",
    username: "admin",
    password: "admin123",
    role: "admin",
  }
];