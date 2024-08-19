"use client";

import { useState, useEffect } from "react";
import { FaFileUpload } from "react-icons/fa"; // Import file upload icon

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previousImageIndex, setPreviousImageIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Array of image URLs
  const images = ["/car1.avif", "/car2.avif", "/car3.avif", "/car4.jpeg"];

  useEffect(() => {
    // Change image every 5 seconds (2 seconds for image display + 3 seconds for fade transition)
    const interval = setInterval(() => {
      setIsFading(true);
      setPreviousImageIndex(currentImageIndex);
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);

      // Reset fading after transition duration
      setTimeout(() => {
        setIsFading(false);
      }, 3000); // Matches the total duration (2 seconds display + 1 second fade transition)
    }, 5000); // Interval for image transition (2 seconds + 3 seconds)

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [currentImageIndex, images.length]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(""); // Clear previous message when a new file is uploaded
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    window.location.reload();
  };

  const handlePredict = async () => {
    if (!file) {
      setMessage("Please upload an image first.");
      setIsModalOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/predict", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.result || "Error in prediction.");
      } else {
        setMessage("Error in prediction.");
      }
      setIsModalOpen(true);
    } catch (error) {
      setMessage("Error in prediction.");
      setIsModalOpen(true);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Previous image */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            isFading ? "opacity-0" : "opacity-100"
          }`}
          style={{ backgroundImage: `url('${images[previousImageIndex]}')` }}
        ></div>
        {/* Current image */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            isFading ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url('${images[currentImageIndex]}')` }}
        ></div>
      </div>

      <div className="z-10 flex flex-col items-center justify-center p-4">
        <h1 className="text-white text-3xl mb-6 font-bold drop-shadow-md">
          Upload Image for Prediction
        </h1>

        <div className="relative flex items-center">
          {/* Custom File Input */}
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-lg shadow-lg cursor-pointer hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <FaFileUpload className="w-4 h-4" />
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
          </label>

          {/* Display chosen file name or prompt */}
          <div className="ml-4 text-white font-semibold">
            {file ? (
              <span>
                Selected File: <span className="italic">{file.name}</span>
              </span>
            ) : (
              <span>Please choose an image</span>
            )}
          </div>
        </div>

        <button
          onClick={handlePredict}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-lg mt-4"
        >
          Predict
        </button>
      </div>

      {isModalOpen && (
        <div
          id="modal-container"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              Prediction Result
            </h2>
            <p className="text-center text-gray-700 mb-6">{message}</p>
            <div className="flex justify-center">
              <button
                onClick={handleOk}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
