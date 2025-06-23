import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const Travel = () => {
  const navigate = useNavigate();

  const guides = [
    {
      id: 1,
      name: "Nimal Perera",
      description: "Your local storyteller and hiking companion around the Galle Fort and countryside.",
      languages: ["English"],
      rating: "+ 4.7 / 1",
      color: "bg-gradient-to-br from-amber-400 to-amber-600",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      name: "Dilani Fernando",
      description: "Offers peaceful cultural tours and spiritual site visits near the unawatuna.",
      languages: ["English", "Japanese"],
      rating: "+ 4.8 / 1",
      color: "bg-gradient-to-br from-blue-400 to-blue-600",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      name: "Kavinda Japasconiya",
      description: "Adventure lover with kayaking, jungle trails, and eco-tour experiences across Unawatuna and beyond.",
      languages: ["English", "Tamil"],
      rating: "+ 4.3 / 1",
      color: "bg-gradient-to-br from-emerald-400 to-emerald-600",
      image: "https://randomuser.me/api/portraits/men/75.jpg"
    },
    {
      id: 4,
      name: "Rashmi",
      description: "Specializes in food tours, cooking sessions, and hidden village markets in southern Sri Lanka.",
      languages: ["English", "Fremia", "Chinese"],
      rating: "+ 4.9 / 1",
      color: "bg-gradient-to-br from-purple-400 to-purple-600",
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  const handleGuideClick = (guideId) => {
    navigate(`/guides/${guideId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="relative h-64 md:h-96 w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80" 
          alt="Travel adventure" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">
            Meet Our Expert Guides
          </h1>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {guides.map((guide) => (
            <div 
              key={guide.id}
              onClick={() => handleGuideClick(guide.id)}
              className={`${guide.color} rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer`}
            >
              <div className="p-6 text-white">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <img 
                    src={guide.image} 
                    alt={guide.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-white"
                  />
                  <h2 className="text-xl font-bold mb-3 text-center">{guide.name}</h2>
                  <p className="mb-4 text-center">
                    {guide.description.split('\n')[0]}...
                  </p>
                  <div className="text-center">
                    <span className="font-semibold">Languages:</span> {guide.languages.join(', ')}
                    <div className="mt-2 font-bold">
                      {guide.rating}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Travel;