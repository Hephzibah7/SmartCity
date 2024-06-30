import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import ButtonsSection from './Button';
import ReportIssue from './Report';
import CityNews from './CityNews';

function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <ButtonsSection />
      <ReportIssue />
      <CityNews />
    </div>
  );
}

export default Home;
