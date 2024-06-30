import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ButtonsSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getQueryParams = (query) => {
    return new URLSearchParams(query);
  };

  useEffect(() => {
    const queryParams = getQueryParams(location.search);
    const state = queryParams.get('state');
    console.log(state);
    if (state) {
      // If you still need to handle something when 'state' is present in the URL
      console.log(`State parameter detected: ${state}`);
    }
  }, [location.search]);

  const handlesearch = async () => {
    const queryParams = getQueryParams(location.search);
    const state = queryParams.get('state');
    try {
      if (state) {
        navigate(`/search?state=${state}`);
      } else {
        console.error('State is not defined in the query parameters');
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div className="my-8 mt-10 pt-10 mb-10 pb-10 container mx-auto text-center">
      <h2 className="text-3xl font-bold mb-10">Services</h2>
      <div className="flex justify-center space-x-4 mb-4">
        <button onClick={handlesearch} className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-700">Search for a venue</button>
        <button className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-700">Traffic Flow</button>
        <button className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-700">Weather Updates</button>
        <button className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-700">Public Transport</button>
      </div>
    </div>
  );
};

export default ButtonsSection;
