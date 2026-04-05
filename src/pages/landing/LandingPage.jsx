import Nav from './components/Nav';
import Footer from './components/Footer';
import HeroSection from './sections/HeroSection';
import SystemOverview from './sections/SystemOverview';
import SensorGrid from './sections/SensorGrid';
import ArchitectureSection from './sections/ArchitectureSection';
import UseCasesSection from './sections/UseCasesSection';
import InstallationBanner from './sections/InstallationBanner';
import SpecsSection from './sections/SpecsSection';
import CTASection from './sections/CTASection';

const LandingPage = () => (
  <>
    <a href="#main" className="skip-link">
      Skip to content
    </a>
    <Nav />
    <main id="main">
      <HeroSection />
      <SystemOverview />
      <SensorGrid />
      <ArchitectureSection />
      <UseCasesSection />
      <InstallationBanner />
      <SpecsSection />
      <CTASection />
    </main>
    <Footer />
  </>
);

export default LandingPage;
