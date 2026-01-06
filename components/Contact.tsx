import React from 'react';
import { Mail, MessageSquare, Clock, ArrowLeft } from 'lucide-react';

interface ContactProps {
  onBack: () => void;
}

const Contact: React.FC<ContactProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back to Home</span>
      </button>
      
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-100/60 border border-white p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-indigo-50 rounded-xl">
            <Mail className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold font-serif text-slate-900">Contact Us</h1>
        </div>
        
        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <p className="text-xl text-slate-600 leading-relaxed font-light">
              Have questions, feedback, or suggestions? We'd love to hear from you. Choose the most appropriate channel below to get in touch with our team.
            </p>
          </section>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-8 border border-indigo-100">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="h-6 w-6 text-indigo-600" />
                <h2 className="text-xl font-serif font-bold text-slate-900">General Inquiries</h2>
              </div>
              <p className="text-slate-600 mb-4">
                For general questions about Alpha Quelle, how to use our platform, or partnership opportunities.
              </p>
              <a 
                href="mailto:hello@alphaquelle.com" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                <Mail className="h-4 w-4" />
                hello@alphaquelle.com
              </a>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-6 w-6 text-emerald-600" />
                <h2 className="text-xl font-serif font-bold text-slate-900">Technical Support</h2>
              </div>
              <p className="text-slate-600 mb-4">
                Experiencing issues with the platform? Found a bug? Let our technical team know.
              </p>
              <a 
                href="mailto:support@alphaquelle.com" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                <Mail className="h-4 w-4" />
                support@alphaquelle.com
              </a>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-6 w-6 text-amber-600" />
                <h2 className="text-xl font-serif font-bold text-slate-900">Privacy Concerns</h2>
              </div>
              <p className="text-slate-600 mb-4">
                Questions about how we handle your data or requests related to your privacy rights.
              </p>
              <a 
                href="mailto:privacy@alphaquelle.com" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
              >
                <Mail className="h-4 w-4" />
                privacy@alphaquelle.com
              </a>
            </div>
            
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-8 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-6 w-6 text-slate-600" />
                <h2 className="text-xl font-serif font-bold text-slate-900">Legal Matters</h2>
              </div>
              <p className="text-slate-600 mb-4">
                For legal inquiries, terms of service questions, or compliance-related matters.
              </p>
              <a 
                href="mailto:legal@alphaquelle.com" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
              >
                <Mail className="h-4 w-4" />
                legal@alphaquelle.com
              </a>
            </div>
          </div>
          
          <section className="bg-white rounded-2xl p-8 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-serif font-bold text-slate-900">Response Times</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              We strive to respond to all inquiries within 24-48 business hours. For urgent technical issues affecting your ability to use the platform, please include "URGENT" in your email subject line and we'll prioritize your request.
            </p>
          </section>
          
          <section className="bg-indigo-900 text-white rounded-2xl p-8">
            <h2 className="text-xl font-serif font-bold mb-4">Feedback Welcome</h2>
            <p className="text-indigo-100 leading-relaxed">
              Alpha Quelle is constantly evolving based on user feedback. If you have ideas for new features, improvements to our analysis methodology, or suggestions for additional data sources, we'd love to hear them. Your input helps us build a better product for everyone.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contact;
