// import React from 'react';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };
//   return (
//     <nav className="bg-green-600 p-5 text-white">
//       <div className="container mx-auto flex justify-between items-center">
//         <h1 className="text-2xl">Smart City Management System</h1>
//         <ul className="flex space-x-4">
//           <li><a href="#" className="hover:underline">Home</a></li>
//           <li><a href="#" className="hover:underline">Contact</a></li>
//           <li><a href="#" className="hover:underline">About</a></li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-black text-white h-15 p-3">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Smart City Management System</h1>
        <div className="block lg:hidden flex items-center">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg className="w-7 h-6 mt-[-60px] ml-[270px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              >
                
              </path>
            </svg>
          </button>
        </div>
        <ul className={`flex-col sm:flex-row ${isOpen ? 'flex' : 'hidden'} ml-[270px] bg-black p-2 z-20 sm:flex space-y-2 sm:space-y-0 sm:space-x-4`}>
          <li><a href="#" className="hover:underline">Home</a></li>
          <li><a href="#" className="hover:underline">Contact</a></li>
          <li><a href="#" className="hover:underline">About</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

