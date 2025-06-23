import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const GuideDetail = () => {

  // Sample data with package images
  const guide = {
    id: 1,
    name: "Nimal Perera",
    tagline: "Your local storyteller and biking companion around the Galle Fort and countryside",
    rating: "4 / 5",
    languages: ["English"],
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    packages: [
      {
        title: "Galle Fort Heritage Walk",
        destination: "Galle Fort, Dutch Reformed Church, Lighthouse, Auckland Museum",
        days: "1/2 (half-day tour)",
        transport: "Not included (meeting point at Galle Fort Gate)",
        image: "https://do6raq9h04ex.cloudfront.net/sites/8/2021/07/galle-fort-1050x700-1.jpg",
        price: {
          adult: "$55 per person",
          child: "$45 per person"
        },
        color: "bg-gradient-to-br from-amber-100 to-amber-50"
      },
      {
        title: "Unawatuna Beach & Jungle Hike",
        destination: "Unawatuna Beach, Rumassala Sanctuary, Japanese Peace Pagoda",
        days: "1",
        transport: "Included (pickup from Wega Villa)",
        image: "https://www.wondersofceylon.com/content/images/2024/01/WoC-Unawatuna-Beach-Featured.webp",
        price: "$3,000 per person",
        color: "bg-gradient-to-br from-blue-50 to-blue-100"
      },
      {
        title: "Galle to Hikkaduwa Exploration",
        destination: "Coral Sanctuary, Turtle Hatchery, Hikkaduwa Beach",
        days: "1",
        transport: "Included",
        image: "https://www.lakpura.com/images/LK94008326-02-E.JPG",
        price: "$3,500 per person",
        color: "bg-gradient-to-br from-green-50 to-green-100"
      },
      {
        title: "Cultural Gems & Hidden Temples Tour",
        destination: "Yatagala Raja Maha Viharaya, Japanese Peace Pagoda, and Rumassala",
        days: "1",
        transport: "Included",
        image: "https://devalayah.com/wp-content/uploads/2023/05/2021-03-14.jpg",
        price: "$3,000 per person",
        color: "bg-gradient-to-br from-purple-50 to-purple-100"
      }
    ],
    // Add this contact object to fix the error
    contact: {
      address: "Hikkaduma Park Mountain: club",
      region: "Kerala/Sanatolia",
      email: "vittoria@hikkaduma.com"
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      {/* Guide Header Section */}
      <div className="bg-amber-100 py-12">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-8">
          <img 
            src={guide.image} 
            alt={guide.name}
            className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{guide.name}</h1>
            <p className="text-lg italic text-gray-700 mb-4">"{guide.tagline}"</p>
            <div className="flex items-center gap-4">
              <span className="font-medium">Language: {guide.languages.join(', ')}</span>
              <span className="font-bold text-amber-700">{guide.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Section */}
      <main className="flex-grow container mx-auto px-4 py-12 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-2">Packages</h2>
          
          {guide.packages.map((pkg, index) => (
            <div 
              key={index} 
              className={`mb-10 rounded-lg shadow-md overflow-hidden ${pkg.color} border-l-4 border-amber-500`}
            >
              <div className="flex flex-col md:flex-row">
                {/* Package Image - Front and Center */}
                <div className="md:w-1/3 h-48 md:h-auto">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Package Details */}
                <div className="p-6 md:w-2/3">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{pkg.title}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="font-semibold text-gray-700">Destination:</p>
                      <p className="text-gray-600">{pkg.destination}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Days:</p>
                      <p className="text-gray-600">{pkg.days}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Transport:</p>
                      <p className="text-gray-600">{pkg.transport}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Payment:</p>
                      {typeof pkg.price === 'object' ? (
                        <div className="text-gray-600">
                          <p>Adult: {pkg.price.adult}</p>
                          <p>Child: {pkg.price.child}</p>
                        </div>
                      ) : (
                        <p className="text-gray-600">US{pkg.price}</p>
                      )}
                    </div>
                  </div>
                  
                  <button className="mt-4 bg-amber-600 hover:bg-amber-700 text-white py-2 px-6 rounded-md transition">
                    Book This Tour
                  </button>
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

export default GuideDetail;