import React from 'react';
import { Users, Target, Lightbulb, TrendingUp, ArrowLeft } from 'lucide-react';

interface AboutProps {
  onBack: () => void;
}

const About: React.FC<AboutProps> = ({ onBack }) => {
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
            <Users className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold font-serif text-slate-900">About Alpha Quelle</h1>
        </div>
        
        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <p className="text-xl text-slate-600 leading-relaxed font-light">
              Alpha Quelle (German for "Alpha Source") is an AI-powered sentiment analysis platform designed to help investors understand the gap between Wall Street expectations and executive communications.
            </p>
          </section>
          
          <section className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-8 border border-indigo-100">
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-3">
              <Target className="h-6 w-6 text-indigo-600" />
              Our Mission
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We believe that informed investors make better decisions. Our mission is to democratize access to sentiment analysis tools that were previously only available to institutional investors with large research budgets. By leveraging artificial intelligence and natural language processing, we aim to provide retail investors with actionable insights derived from publicly available information.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-3">
              <Lightbulb className="h-6 w-6 text-indigo-600" />
              What We Do
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Alpha Quelle aggregates and analyzes data from multiple public sources to generate sentiment scores and signals:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2">News Sentiment</h3>
                <p className="text-slate-600 text-sm">We analyze news articles from major financial publications to gauge market sentiment around specific companies.</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2">Executive Communications</h3>
                <p className="text-slate-600 text-sm">We process earnings call transcripts and executive statements to understand management's outlook and confidence levels.</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2">Analyst Expectations</h3>
                <p className="text-slate-600 text-sm">We track Wall Street analyst ratings and price targets to understand market expectations.</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2">Alpha Spread Analysis</h3>
                <p className="text-slate-600 text-sm">We calculate the divergence between executive sentiment and market expectations to identify potential opportunities.</p>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
              Our Technology
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Alpha Quelle utilizes advanced natural language processing (NLP) and machine learning algorithms to analyze text data. Our proprietary models are trained to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Identify sentiment polarity (positive, negative, neutral) in financial text</li>
              <li>Detect subtle linguistic cues that may indicate executive confidence or concern</li>
              <li>Compare current communications against historical baselines</li>
              <li>Aggregate multiple data sources into unified sentiment scores</li>
            </ul>
          </section>
          
          <section className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-3">Important Note</h2>
            <p className="text-slate-600 leading-relaxed">
              Alpha Quelle is designed as an educational and informational tool. Our analysis should be used as one of many inputs in your investment research process, not as the sole basis for investment decisions. Always conduct your own due diligence and consult with qualified financial professionals before making investment decisions.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Get in Touch</h2>
            <p className="text-slate-600 leading-relaxed">
              We love hearing from our users. Whether you have questions, feedback, or suggestions for improvement, please don't hesitate to reach out at <a href="mailto:hello@alphaquelle.com" className="text-indigo-600 hover:text-indigo-800 underline">hello@alphaquelle.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
