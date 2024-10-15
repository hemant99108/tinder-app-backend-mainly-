import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios'; // For making API requests

const Feed = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch profiles from the backend
  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      const response = await axios.get('YOUR_BACKEND_API_URL/feed', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfiles(response.data); // Assuming response.data contains an array of profiles
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Handle swipe left (reject)
  const handleReject = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1); // Move to next profile
  };

  // Handle swipe right (accept)
  const handleAccept = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1); // Move to next profile
  };

  const currentProfile = profiles[currentIndex]; // Get the current profile

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-purple-400 to-pink-600">
      {currentProfile ? (
        <motion.div
          key={currentProfile.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="bg-white p-10 rounded-lg shadow-lg w-96"
        >
          <div className="text-center">
            <img
              src={currentProfile.image}
              alt={currentProfile.name}
              className="w-40 h-40 rounded-full mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800">{currentProfile.name}</h2>
            <p className="text-gray-600">{currentProfile.bio}</p>
          </div>
          <div className="flex justify-around mt-6">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleReject}
              className="bg-red-500 text-white px-4 py-2 rounded-full"
            >
              Reject
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAccept}
              className="bg-green-500 text-white px-4 py-2 rounded-full"
            >
              Accept
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <div className="text-white text-2xl">No more profiles to show!</div>
      )}
    </div>
  );
};

export default Feed;
