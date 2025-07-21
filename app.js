import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
  CircularProgress,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

// Main App component
const App = () => {
  // State for adding a new flight
  const [newFlightNumber, setNewFlightNumber] = useState('');
  const [newAirline, setNewAirline] = useState('');
  const [newFlightDate, setNewFlightDate] = useState('');
  const [isAddingFlight, setIsAddingFlight] = useState(false);

  // State for tracked flights
  const [trackedFlights, setTrackedFlights] = useState(() => {
    // Initialize from local storage or with mock data
    const savedFlights = localStorage.getItem('trackedFlights');
    return savedFlights ? JSON.parse(savedFlights) : [
      {
        id: 'F001', flightNumber: 'UA234', airline: 'United Airlines', origin: 'LAX', destination: 'JFK',
        departureTime: '2025-08-10 08:00 AM', arrivalTime: '2025-08-10 04:30 PM',
        estimatedDeparture: '2025-08-10 08:00 AM', estimatedArrival: '2025-08-10 04:30 PM',
        status: 'On Time', gate: 'B23', terminal: 'Terminal 7', baggageClaim: 'Carousel 5',
        lastUpdated: new Date().toLocaleString()
      },
      {
        id: 'F002', flightNumber: 'DL567', airline: 'Delta Airlines', origin: 'ATL', destination: 'ORD',
        departureTime: '2025-08-10 10:15 AM', arrivalTime: '2025-08-10 12:00 PM',
        estimatedDeparture: '2025-08-10 10:15 AM', estimatedArrival: '2025-08-10 12:00 PM',
        status: 'On Time', gate: 'A12', terminal: 'Terminal S', baggageClaim: 'Carousel 3',
        lastUpdated: new Date().toLocaleString()
      },
      {
        id: 'F003', flightNumber: 'AA987', airline: 'American Airlines', origin: 'DFW', destination: 'MIA',
        departureTime: '2025-08-10 01:00 PM', arrivalTime: '2025-08-10 04:15 PM',
        estimatedDeparture: '2025-08-10 01:00 PM', estimatedArrival: '2025-08-10 04:15 PM',
        status: 'On Time', gate: 'C30', terminal: 'Terminal D', baggageClaim: 'Carousel 8',
        lastUpdated: new Date().toLocaleString()
      },
    ];
  });

  // Save tracked flights to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('trackedFlights', JSON.stringify(trackedFlights));
  }, [trackedFlights]);

  // Simulate real-time flight status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTrackedFlights(prevFlights =>
        prevFlights.map(flight => {
          if (flight.id === 'F001' && flight.status === 'On Time') {
            // Simulate a delay for F001 after some time
            return {
              ...flight,
              status: 'Delayed',
              estimatedDeparture: '2025-08-10 09:00 AM', // 1 hour delay
              estimatedArrival: '2025-08-10 05:30 PM',
              lastUpdated: new Date().toLocaleString()
            };
          } else if (flight.id === 'F002' && flight.status === 'On Time') {
            // Simulate F002 departing
            return {
              ...flight,
              status: 'Departed',
              lastUpdated: new Date().toLocaleString()
            };
          }
          return flight;
        })
      );
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  // Function to handle adding a new flight
  const handleAddFlight = () => {
    if (!newFlightNumber || !newAirline || !newFlightDate) {
      // In a real app, you'd show a user-friendly error message
      console.error('Please fill all fields to add a flight.');
      return;
    }

    setIsAddingFlight(true);
    // Simulate API call to fetch flight details based on input
    setTimeout(() => {
      const newId = `F${(trackedFlights.length + 1).toString().padStart(3, '0')}`;
      const mockNewFlight = {
        id: newId,
        flightNumber: newFlightNumber.toUpperCase(),
        airline: newAirline,
        origin: 'N/A', // In a real app, fetch from API
        destination: 'N/A', // In a real app, fetch from API
        departureTime: `${newFlightDate} 00:00 AM`, // Placeholder
        arrivalTime: `${newFlightDate} 00:00 PM`, // Placeholder
        estimatedDeparture: `${newFlightDate} 00:00 AM`,
        estimatedArrival: `${newFlightDate} 00:00 PM`,
        status: 'Scheduled',
        gate: 'TBD',
        terminal: 'TBD',
        baggageClaim: 'TBD',
        lastUpdated: new Date().toLocaleString()
      };
      setTrackedFlights(prevFlights => [...prevFlights, mockNewFlight]);
      setNewFlightNumber('');
      setNewAirline('');
      setNewFlightDate('');
      setIsAddingFlight(false);
    }, 1000); // Simulate 1 second delay
  };

  // Function to handle removing a flight
  const handleRemoveFlight = (idToRemove) => {
    setTrackedFlights(prevFlights => prevFlights.filter(flight => flight.id !== idToRemove));
  };

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'On Time':
        return <CheckCircleOutlineIcon className="text-green-500" />;
      case 'Delayed':
        return <AccessTimeIcon className="text-orange-500" />;
      case 'Departed':
        return <FlightTakeoffIcon className="text-blue-500" />;
      case 'Arrived':
        return <FlightLandIcon className="text-purple-500" />;
      case 'Cancelled':
        return <CancelIcon className="text-red-500" />;
      case 'Scheduled':
        return <HourglassEmptyIcon className="text-gray-500" />;
      default:
        return null;
    }
  };

  // Tailwind CSS classes for consistent styling
  const inputClasses = "w-full rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500";
  const buttonClasses = "w-full py-3 rounded-lg font-semibold text-white transition duration-200 ease-in-out transform hover:scale-105";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4 font-inter">
      <Paper elevation={10} className="p-8 md:p-12 bg-white rounded-3xl shadow-2xl max-w-4xl w-full">
        <Typography variant="h4" component="h1" className="text-center text-gray-800 mb-8 font-bold">
          <span className="text-blue-600">Flighty</span> <span className="text-indigo-600">Clone</span>
        </Typography>

        {/* Add New Flight Form */}
        <Box className="mb-10 p-6 bg-blue-50 rounded-2xl shadow-inner">
          <Typography variant="h5" component="h2" className="text-center text-gray-700 mb-6 font-semibold">
            Track a New Flight
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                label="Flight Number"
                variant="outlined"
                value={newFlightNumber}
                onChange={(e) => setNewFlightNumber(e.target.value)}
                className={inputClasses}
                placeholder="e.g., UA234"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Airline"
                variant="outlined"
                value={newAirline}
                onChange={(e) => setNewAirline(e.target.value)}
                className={inputClasses}
                placeholder="e.g., United Airlines"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Flight Date"
                type="date"
                variant="outlined"
                value={newFlightDate}
                onChange={(e) => setNewFlightDate(e.target.value)}
                className={inputClasses}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddFlight}
                disabled={isAddingFlight || !newFlightNumber || !newAirline || !newFlightDate}
                className={`${buttonClasses} bg-blue-600 hover:bg-blue-700`}
                startIcon={isAddingFlight ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isAddingFlight ? 'Adding Flight...' : 'Add Flight to Track'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Tracked Flights Display */}
        <Box>
          <Typography variant="h5" component="h2" className="text-center text-gray-700 mb-6 font-semibold">
            My Tracked Flights
          </Typography>
          {trackedFlights.length > 0 ? (
            <Grid container spacing={3}>
              {trackedFlights.map((flight) => (
                <Grid item xs={12} key={flight.id}>
                  <Paper elevation={3} className="p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow duration-200">
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="h6" className="text-blue-800 font-bold">{flight.airline}</Typography>
                        <Typography variant="body1" className="text-gray-700">Flight: {flight.flightNumber}</Typography>
                        <Typography variant="body2" className="text-gray-600">{flight.origin} to {flight.destination}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={5}>
                        <Box className="flex items-center mb-1">
                          {getStatusIcon(flight.status)}
                          <Typography variant="body1" className={`ml-2 font-semibold ${
                            flight.status === 'On Time' ? 'text-green-600' :
                            flight.status === 'Delayed' ? 'text-orange-600' :
                            flight.status === 'Departed' ? 'text-blue-600' :
                            flight.status === 'Arrived' ? 'text-purple-600' :
                            flight.status === 'Cancelled' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            Status: {flight.status}
                          </Typography>
                        </Box>
                        <Typography variant="body2" className="text-gray-700">Departs: {flight.estimatedDeparture}</Typography>
                        <Typography variant="body2" className="text-gray-700">Arrives: {flight.estimatedArrival}</Typography>
                        <Typography variant="caption" className="text-gray-500">Last Updated: {flight.lastUpdated}</Typography>
                      </Grid>
                      <Grid item xs={12} md={3} className="text-right">
                        <Typography variant="body2" className="text-gray-700">Gate: {flight.gate}</Typography>
                        <Typography variant="body2" className="text-gray-700">Terminal: {flight.terminal}</Typography>
                        {flight.status === 'Arrived' && (
                          <Typography variant="body2" className="text-gray-700">Baggage: {flight.baggageClaim}</Typography>
                        )}
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleRemoveFlight(flight.id)}
                          className="text-red-500 hover:text-red-700 mt-2"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" className="text-center text-gray-500 mt-4">
              No flights being tracked. Add a flight above to get started!
            </Typography>
          )}
        </Box>
      </Paper>
    </div>
  );
};

export default App;
