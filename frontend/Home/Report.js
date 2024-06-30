import React, { useState } from 'react';
import axios from 'axios';

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issueType: '',
    description: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Fetch the token from local storage
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include the authorization header with the token
        },
      };
      await axios.post(`http://localhost:9002/report-issue`, config); // Pass the config object to axios.get
      alert('Issue reported successfully');
  } catch (error) {
    alert('Error reporting issue');
    console.error(error);
  }
  };

  return (
    <div className="container mx-auto p-10 w-2/3">
      <h1 className="text-3xl font-bold mb-8">Report an Issue</h1>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <div className="mb-4 flex space-x-4">
          <label className="w-1/2">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4 flex space-x-4">
          <label className=" w-1/2">
            Your Email
          </label>
          <input
            id="email"
            type="text"
            placeholder="Enter your Email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4 flex space-x-4">
          <label className="w-1/2">
            Issue Type
          </label>
          <select
            id="issueType"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.issueType}
            onChange={handleChange}
          >
            <option value="">Select an issue type</option>
            <option value="waste">Waste Management</option>
            <option value="transportation">Public Transportation</option>
            <option value="safety">Safety</option>
            <option value="water">Water Management</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-6 flex">
          <label className="w-1/2">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Describe the issue"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="5"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="flex items-right justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportIssue;
