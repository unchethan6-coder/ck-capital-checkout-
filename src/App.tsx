import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import TrustBar from './sections/TrustBar'
import VideoRiver from './sections/VideoRiver'
import HowItWorks from './sections/HowItWorks'
import Pricing from './sections/Pricing'
import WhyChooseUs from './sections/WhyChooseUs'
import Platforms from './sections/Platforms'
import Testimonials from './sections/Testimonials'
import FAQ from './sections/FAQ'
import CTA from './sections/CTA'

export default function App() {
  return (
    <div className="min-h-screen bg-ck-bg text-ck-text">
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <VideoRiver />
        <HowItWorks />
        <Pricing />
        <WhyChooseUs />
        <Platforms />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
