import React from 'react';

const samples = [
  { src: "https://img.youtube.com/vi/1LJGpvepf3Y/maxresdefault.jpg", alt: "Gaming thumbnail example 1" },
  { src: "https://img.youtube.com/vi/4nfJYJv3LDQ/maxresdefault.jpg", alt: "Gaming thumbnail example 2" },
  { src: "https://img.youtube.com/vi/mpUtWLdUY4Q/maxresdefault.jpg", alt: "Gaming thumbnail example 3" },
  { src: "https://img.youtube.com/vi/VjVzhlORN8g/maxresdefault.jpg", alt: "Gaming thumbnail example 4" },
];

const SampleThumbnails: React.FC = () => {
  return (
    <section className="mt-20">
      <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
        Examples of What You Can Create
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {samples.map((sample, index) => (
          <div key={index} className="group overflow-hidden rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
            <img 
              src={sample.src} 
              alt={sample.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SampleThumbnails;