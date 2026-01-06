import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
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
            <Shield className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold font-serif text-slate-900">Privacy Policy</h1>
        </div>
        
        <p className="text-slate-500 text-sm mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Introduction</h2>
            <p className="text-slate-600 leading-relaxed">
              Alpha Quelle ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Information We Collect</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We may collect information about you in a variety of ways. The information we may collect on the Site includes:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li><strong>Usage Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Site.</li>
              <li><strong>Search Queries:</strong> Stock ticker symbols you search for to provide analysis results. This data is processed in real-time and is not permanently stored.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Use of Cookies and Tracking Technologies</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Third-Party Advertising</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We use Google AdSense to display advertisements on our Site. Google AdSense uses cookies to serve ads based on your prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our Site and/or other sites on the Internet.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline">Google Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline">www.aboutads.info</a>.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Third-Party Websites</h2>
            <p className="text-slate-600 leading-relaxed">
              The Site may contain links to third-party websites and applications of interest, including advertisements and external services, that are not affiliated with us. Once you have used these links to leave the Site, any information you provide to these third parties is not covered by this Privacy Policy, and we cannot guarantee the safety and privacy of your information.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Data Security</h2>
            <p className="text-slate-600 leading-relaxed">
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Children's Privacy</h2>
            <p className="text-slate-600 leading-relaxed">
              We do not knowingly solicit information from or market to children under the age of 13. If we learn that we have collected personal information from a child under age 13 without verification of parental consent, we will delete that information as quickly as possible.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-slate-600 leading-relaxed">
              We may update this Privacy Policy from time to time in order to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Contact Us</h2>
            <p className="text-slate-600 leading-relaxed">
              If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@alphaquelle.com" className="text-indigo-600 hover:text-indigo-800 underline">privacy@alphaquelle.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
