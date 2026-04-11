import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const CTASection = () => {
  return (
      <section className="py-24 relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to join our community?</h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Take the first step towards an exceptional educational journey. Our admissions office is ready to assist you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button size="lg" variant="secondary" asChild className="h-14 px-8 text-base shadow-lg hover:scale-105 transition-transform">
              <Link to="/admissions">Apply Now for 2026</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-14 px-8 text-base bg-transparent border-white text-white hover:bg-white/10">
              <Link to="/contact">Schedule a Campus Tour</Link>
            </Button>
          </div>
        </div>
      </section>
  )
}

export default CTASection