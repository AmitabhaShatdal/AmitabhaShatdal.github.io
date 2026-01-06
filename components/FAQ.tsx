import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, ArrowLeft } from 'lucide-react';

interface FAQProps {
  onBack: () => void;
}

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-medium text-slate-900">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-indigo-600 shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-slate-600 leading-relaxed border-t border-slate-100">
          <div className="pt-4">{answer}</div>
        </div>
      )}
    </div>
  );
};

const FAQ: React.FC<FAQProps> = ({ onBack }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is sentiment analysis?",
      answer: (
        <>
          <p className="mb-3">
            Sentiment analysis is a natural language processing (NLP) technique that identifies and extracts subjective information from text. In financial contexts, it's used to determine whether a piece of text (such as a news article, earnings call transcript, or social media post) expresses a positive, negative, or neutral opinion about a company or its stock.
          </p>
          <p>
            By analyzing large volumes of text data, sentiment analysis can help identify trends and shifts in market perception that may not yet be reflected in stock prices.
          </p>
        </>
      ),
    },
    {
      question: "How does Alpha Quelle calculate sentiment scores?",
      answer: (
        <>
          <p className="mb-3">
            Alpha Quelle uses advanced machine learning models trained on financial text data to calculate sentiment scores. Our process involves several steps:
          </p>
          <ol className="list-decimal pl-5 space-y-2 mb-3">
            <li><strong>Data Collection:</strong> We aggregate text from news articles, earnings calls, and other public sources.</li>
            <li><strong>Preprocessing:</strong> Text is cleaned and normalized to remove noise.</li>
            <li><strong>Feature Extraction:</strong> We identify key phrases, entities, and linguistic patterns.</li>
            <li><strong>Sentiment Classification:</strong> Our AI models assign sentiment scores ranging from -100 (very negative) to +100 (very positive).</li>
            <li><strong>Aggregation:</strong> Individual scores are weighted and combined into overall sentiment metrics.</li>
          </ol>
        </>
      ),
    },
    {
      question: "What is the 'Alpha Spread'?",
      answer: (
        <>
          <p className="mb-3">
            The Alpha Spread is a proprietary metric that measures the divergence between executive sentiment (how positive or negative company leadership sounds) and market expectations (what analysts and the market expect).
          </p>
          <p className="mb-3">
            <strong>Positive Alpha Spread:</strong> Executives are more optimistic than the market expects. This could indicate undervaluation or positive surprises ahead.
          </p>
          <p className="mb-3">
            <strong>Negative Alpha Spread:</strong> Executives are more cautious than the market expects. This could signal potential disappointments or overvaluation.
          </p>
          <p>
            The Alpha Spread is meant to identify potential disconnects between insider knowledge and market perception, though it should always be used alongside other research.
          </p>
        </>
      ),
    },
    {
      question: "How often is the data updated?",
      answer: (
        <p>
          Alpha Quelle aggregates data in real-time from public RSS feeds and news sources. When you search for a ticker, we fetch the latest available information and run our analysis on demand. This means you're always seeing the most current sentiment picture based on publicly available data at the moment of your search.
        </p>
      ),
    },
    {
      question: "What data sources does Alpha Quelle use?",
      answer: (
        <>
          <p className="mb-3">We aggregate data from multiple public sources, including:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Major financial news outlets (Reuters, Bloomberg, CNBC, etc.)</li>
            <li>Company press releases and SEC filings</li>
            <li>Earnings call transcripts</li>
            <li>Analyst reports and ratings changes</li>
            <li>Industry-specific publications</li>
          </ul>
        </>
      ),
    },
    {
      question: "Is Alpha Quelle suitable for day trading?",
      answer: (
        <p>
          Alpha Quelle is designed as a research and educational tool for understanding market sentiment. While our analysis updates in real-time, sentiment analysis is generally better suited for medium to long-term investment decisions rather than short-term trading. Day trading requires different tools optimized for speed and technical analysis. We recommend using Alpha Quelle as part of a comprehensive research process, not as a sole trading signal.
        </p>
      ),
    },
    {
      question: "Why might sentiment scores differ from stock performance?",
      answer: (
        <>
          <p className="mb-3">
            Sentiment and stock prices don't always move together for several reasons:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Timing:</strong> Sentiment changes may lead or lag price movements.</li>
            <li><strong>Market efficiency:</strong> Sentiment may already be priced into the stock.</li>
            <li><strong>Other factors:</strong> Macro events, sector rotation, and technical factors also drive prices.</li>
            <li><strong>Noise:</strong> Not all sentiment signals are meaningful or accurate.</li>
          </ul>
          <p className="mt-3">
            This is why we emphasize that Alpha Quelle is an informational tool and should be used alongside other forms of analysis.
          </p>
        </>
      ),
    },
    {
      question: "Is the analysis provided financial advice?",
      answer: (
        <p className="font-medium text-amber-700 bg-amber-50 p-4 rounded-lg">
          No. Alpha Quelle provides informational analysis for educational purposes only. Nothing on this site constitutes financial advice, investment recommendations, or an offer to buy or sell securities. Always consult with a qualified financial advisor before making investment decisions. Past sentiment patterns are not indicative of future results.
        </p>
      ),
    },
  ];

  const glossaryTerms = [
    { term: "Sentiment Score", definition: "A numerical value (typically -100 to +100) representing the overall positive or negative tone of text about a company." },
    { term: "NLP (Natural Language Processing)", definition: "A field of AI that helps computers understand, interpret, and generate human language." },
    { term: "Alpha", definition: "In investing, alpha represents the excess return of an investment relative to its benchmark. In our context, it refers to potential informational advantages." },
    { term: "Bearish", definition: "A negative or pessimistic outlook on a stock or the market, expecting prices to fall." },
    { term: "Bullish", definition: "A positive or optimistic outlook on a stock or the market, expecting prices to rise." },
    { term: "Earnings Call", definition: "A conference call between a company's management and investors/analysts to discuss financial results and outlook." },
    { term: "Market Sentiment", definition: "The overall attitude of investors toward a particular security or the market as a whole." },
    { term: "RSS Feed", definition: "A standardized format for delivering regularly updated content, used by news sites and blogs." },
  ];

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
            <HelpCircle className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold font-serif text-slate-900">FAQ & Learning Center</h1>
        </div>
        
        <div className="space-y-12">
          {/* FAQ Section */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </div>
          </section>
          
          {/* Glossary Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-indigo-600" />
              <h2 className="text-2xl font-serif font-bold text-slate-900">Financial Glossary</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {glossaryTerms.map((item, index) => (
                <div key={index} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-1">{item.term}</h3>
                  <p className="text-slate-600 text-sm">{item.definition}</p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Still have questions */}
          <section className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-8 border border-indigo-100 text-center">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-3">Still Have Questions?</h2>
            <p className="text-slate-600 mb-4">
              We're here to help. Reach out to our team and we'll get back to you as soon as possible.
            </p>
            <a 
              href="mailto:support@alphaquelle.com" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
            >
              Contact Support
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
