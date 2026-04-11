import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    // Mock API call to SMTP backend
    setTimeout(() => {
      setFormState('success');
      // Reset form after a few seconds
      setTimeout(() => setFormState('idle'), 4000);
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      
      {/* 1. Subtle Header */}
      <section className="pt-32 pb-16 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
          >
            Get in <span className="text-primary">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto"
          >
            Have a question about admissions, academic programs, or life at EduCore? We're here to help.
          </motion.p>
        </div>
      </section>

      {/* 2. Main Content */}
      <section className="py-24 relative overflow-hidden flex-grow">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -z-10"></div>

        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
            
            {/* Left Side: Contact Information */}
            <div className="lg:w-2/5 p-10 md:p-14 bg-slate-950 text-white relative overflow-hidden flex flex-col justify-between">
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-2">Contact Details</h3>
                <p className="text-slate-400 mb-12">Reach out to us through any of these channels.</p>
                
                <div className="space-y-10">
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Visit Us</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        123 Education Boulevard, <br />
                        Knowledge City, ED 45678, <br />
                        United States
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Call Us</h4>
                      <p className="text-slate-400 text-sm">
                        Main Office: +1 (555) 123-4567 <br />
                        Admissions: +1 (555) 123-4568
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Email Us</h4>
                      <p className="text-slate-400 text-sm">
                        info@educore.edu <br />
                        admissions@educore.edu
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Inquiry Form */}
            <div className="lg:w-3/5 p-10 md:p-14">
              <h3 className="text-3xl font-bold text-slate-900 mb-2">Send an Inquiry</h3>
              <p className="text-slate-500 mb-10">We will typically respond within 24-48 business hours.</p>

              <div className="relative min-h-[400px]">
                <AnimatePresence mode="wait">
                  
                  {formState !== 'success' ? (
                    <motion.form 
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" required className="bg-slate-50 border-slate-200" placeholder="John" disabled={formState === 'submitting'} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" required className="bg-slate-50 border-slate-200" placeholder="Doe" disabled={formState === 'submitting'} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" required className="bg-slate-50 border-slate-200" placeholder="john@example.com" disabled={formState === 'submitting'} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number (Optional)</Label>
                          <Input id="phone" type="tel" className="bg-slate-50 border-slate-200" placeholder="+1 (555) 000-0000" disabled={formState === 'submitting'} />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <select 
                           id="subject"
                           className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                           required
                           disabled={formState === 'submitting'}
                        >
                          <option value="" disabled selected>Select an inquiry type</option>
                          <option value="admissions">Admissions</option>
                          <option value="academics">Academics</option>
                          <option value="general">General Query</option>
                          <option value="feedback">Feedback</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea 
                           id="message" 
                           required 
                           rows={5} 
                           className="bg-slate-50 border-slate-200 resize-none" 
                           placeholder="How can we help you?"
                           disabled={formState === 'submitting'}
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full h-14" disabled={formState === 'submitting'}>
                         {formState === 'submitting' ? (
                            <span className="flex items-center gap-2">
                               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                               Sending...
                            </span>
                         ) : (
                            <span className="flex items-center gap-2">
                               Send Message <Send className="w-4 h-4" />
                            </span>
                         )}
                      </Button>
                    </motion.form>
                  ) : (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-emerald-50 rounded-2xl border border-emerald-100"
                    >
                      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600 shadow-inner">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <h4 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h4>
                      <p className="text-slate-600 max-w-sm">Thank you for reaching out. A member of our team will get back to you shortly.</p>
                    </motion.div>
                  )}
                  
                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. Map Section */}
      <section className="h-96 w-full relative">
        {/* Placeholder for map as Google Maps embed requires API key or standard src */}
        <iframe 
          title="Google Maps Embed"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1689255621876!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="bg-slate-200 grayscale contrast-125 hover:grayscale-0 transition-all duration-1000"
        />
      </section>

    </div>
  );
}