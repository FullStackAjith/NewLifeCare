import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';

// Page-level code splitting: each page is its own chunk, loaded on demand.
const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const TreatmentPrograms = lazy(() => import('./pages/TreatmentPrograms.jsx'));
const RehabilitationJourney = lazy(() => import('./pages/RehabilitationJourney.jsx'));
const Facilities = lazy(() => import('./pages/Facilities.jsx'));
const Team = lazy(() => import('./pages/Team.jsx'));
const FamilySupport = lazy(() => import('./pages/FamilySupport.jsx'));
const Aftercare = lazy(() => import('./pages/Aftercare.jsx'));
const Gallery = lazy(() => import('./pages/Gallery.jsx'));
const Testimonials = lazy(() => import('./pages/Testimonials.jsx'));
const Faq = lazy(() => import('./pages/Faq.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const ConfidentialEnquiry = lazy(() => import('./pages/ConfidentialEnquiry.jsx'));
const Privacy = lazy(() => import('./pages/Privacy.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="treatment-programs" element={<TreatmentPrograms />} />
        <Route path="rehabilitation-journey" element={<RehabilitationJourney />} />
        <Route path="facilities" element={<Facilities />} />
        <Route path="team" element={<Team />} />
        <Route path="family-support" element={<FamilySupport />} />
        <Route path="aftercare" element={<Aftercare />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="faq" element={<Faq />} />
        <Route path="contact" element={<Contact />} />
        <Route path="confidential-enquiry" element={<ConfidentialEnquiry />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
