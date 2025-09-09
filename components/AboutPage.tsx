import React from 'react';

interface AboutPageProps {
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  return (
    <section className="w-full max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 animate-fade-in text-gray-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
          About Thumbnail AI
        </h2>
        <button onClick={onBack} className="text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          &larr; Back to Generator
        </button>
      </div>

      <div className="space-y-6 text-lg leading-relaxed">
        <p>
          <strong>Thumbnail AI</strong> is a powerful tool designed to help content creators, marketers, and businesses generate stunning, click-worthy thumbnails in seconds. Forget spending hours in complex design software or hiring expensive graphic designers. With our AI, you can create professional-quality visuals with just a few clicks.
        </p>

        <div>
          <h3 className="text-2xl font-semibold text-indigo-300 mb-2">How It Works</h3>
          <p>
            Our application harnesses the advanced capabilities of <strong>Google's Gemini models</strong>. When you provide a video title, upload an image, or select a template, our system sends a detailed prompt to the Gemini API. The AI interprets your request, understands the context and style, and generates a unique, high-resolution thumbnail tailored to your needs. For image editing, it intelligently modifies your existing picture based on your text instructions.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-indigo-300 mb-2">Key Benefits</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Save Time & Effort:</strong> Generate multiple high-quality options in the time it takes to open traditional photo editing software.</li>
            <li><strong>No Design Skills Needed:</strong> Our intuitive interface and powerful AI mean anyone can create professional-looking thumbnails.</li>
            <li><strong>Boost Your Views:</strong> A compelling thumbnail is the most critical factor for increasing your click-through rate (CTR). Our AI is designed to create visuals that grab attention and entice viewers to click.</li>
            <li><strong>A/B Testing Made Easy:</strong> Quickly generate different styles for the same video to test which one performs best with your audience.</li>
          </ul>
        </div>

        <div className="text-center pt-4">
          <p>
            This application is powered by the next-generation generative AI from Google.
          </p>
          <a
            href="https://ai.google.dev/docs/gemini_api_overview"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
          >
            Learn more about the Google Gemini API &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;