import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import BenefitsSection from './sections/BenefitsSection';
import ContactSection from './sections/ContactSection';

const LandingPage = () => {
  return (
    <>
      <Helmet>
        <title>DNS & IP Analyse Tools | Armann Systems GmbH</title>
        <meta name="description" content="Professionelle DNS, Blacklist & IP Analyse Tools für Unternehmen. Kostenlose DNS Tests, SMTP Diagnose, SSL Zertifikat Check und Blacklist Prüfung. Sicher und ohne Datenspeicherung." />
        <meta name="keywords" content="DNS Analyse, Blacklist Prüfung, SMTP Test, SSL Zertifikat Check, DNS Records, Email Server Test, IP Reputation, DNS Tools, DMARC Check, SPF Check" />
        <meta property="og:title" content="DNS & IP Analyse Tools | Armann Systems GmbH" />
        <meta property="og:description" content="Professionelle DNS, Blacklist & IP Analyse Tools für Unternehmen. Kostenlose DNS Tests, SMTP Diagnose und Blacklist Prüfung." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Armann Systems" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DNS & IP Analyse Tools | Armann Systems GmbH" />
        <meta name="twitter:description" content="Professionelle DNS, Blacklist & IP Analyse Tools für Unternehmen. Kostenlose DNS Tests, SMTP Diagnose und Blacklist Prüfung." />
        <link rel="canonical" href="https://webanalytics.armann-systems.com" />
      </Helmet>
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <ContactSection />
    </>
  );
};

export default LandingPage;
