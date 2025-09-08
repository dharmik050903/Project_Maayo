import { Link } from "react-router-dom"
import Header from "../components/Header"
import Button from "../components/Button"
import hero from "../assets/medium-shot-woman-typing-keyboard.jpg"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-gradient text-white">
      <Header />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between flex-1 max-w-7xl mx-auto px-6 pt-28">
        <div className="max-w-xl space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Find the right <span className="text-mint">freelancer</span> for your project
          </h1>
          <p className="text-lg text-white/80">
            Maayo connects businesses with talented professionals across the globe. 
            Secure, fast, and easy to use.
          </p>
          <div className="flex gap-4">
            <Link to="/signup">
              <Button variant="accent">Get Started</Button>
            </Link>
            <Link to="/browse">
              <Button variant="primary">Browse Projects</Button>
            </Link>
          </div>
        </div>
        <div className="mt-10 md:mt-0">
          <img src={hero} alt="Woman typing on keyboard" className="w-[360px] md:w-[420px] rounded-xl shadow-soft border border-white/15 object-cover" />
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
          <div className="card p-6 text-center bg-white/95">
            <h3 className="text-xl font-semibold text-graphite mb-3">Trusted Talent</h3>
            <p className="text-coolgray">Verified professionals ready to bring your ideas to life.</p>
          </div>
          <div className="card p-6 text-center bg-white/95">
            <h3 className="text-xl font-semibold text-graphite mb-3">Secure Payments</h3>
            <p className="text-coolgray">Escrow protection so your money is safe until work is done.</p>
          </div>
          <div className="card p-6 text-center bg-white/95">
            <h3 className="text-xl font-semibold text-graphite mb-3">Fast Hiring</h3>
            <p className="text-coolgray">Post project and start receiving proposals in minutes.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16">
        <h2 className="text-3xl font-semibold mb-4">Ready to get started?</h2>
        <p className="mb-6 text-white/85">Join Maayo today and unlock your project’s potential.</p>
        <Link to="/signup">
          <Button variant="accent">Create an Account</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-white/20">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 text-white/85">
          <p className="text-sm">© {new Date().getFullYear()} Maayo. All rights reserved.</p>
          <div className="flex gap-4 text-sm">
            <Link to="/about" className="hover:text-mint">About</Link>
            <Link to="/privacy" className="hover:text-mint">Privacy</Link>
            <Link to="/terms" className="hover:text-mint">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
