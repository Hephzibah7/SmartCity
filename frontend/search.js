import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [state, setState] = useState('');
  const [type, setType] = useState('');
  const [places, setPlaces] = useState([]);

  const handleSearch = async () => {
    try {
        const token = localStorage.getItem('token'); // Fetch the token from local storage
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Include the authorization header with the token
          },
          params: { state, type }, // Include the state parameter in the config object
        };
        const response = await axios.get(`http://localhost:9002/places`, config); // Pass the config object to axios.get
      setPlaces(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search for Places</h1>
      <div className="mb-4">
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Enter state (latitude,longitude)"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <select
          className="border p-2 w-full"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Select type</option>
          <option value="hospital">Hospital</option>
          <option value="garden">Garden</option>
          <option value="hotel">Hotel</option>
          <option value="school">School</option>
          <option value="company">Company</option>
        </select>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2"
        onClick={handleSearch}
      >
        Search a venue
      </button>
      <div className="mt-4 flex flex-col items-start justify-start">
        {places.map((place) => (
          <div key={place.place_id} className="text-left border p-2 mb-2">
            <h2 className="text-xl font-bold">{place.name}</h2>
            <p>Address: {place.location.address}</p>
            <p>Country: {place.location.country}</p>
            <p>Full Address: {place.location.formatted_address}</p>
            <p>Locality: {place.location.locality}</p>
            <p>PostCode: {place.location.postcode}</p>
            <p>Region: {place.location.region}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
