import { useState } from "react";
import api from "../config/api";
import { useNavigate } from "react-router-dom";

const Report = () => {
  const [formData, setFormData] = useState({
    item_type: "",
    location: "",
    time_found: "",
    description: "",
    media: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to submit a report');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const result = await api.submitReport(formData);
      
      if (result.success) {
        alert("Thank you for reporting the found item!");
        // Reset form
        setFormData({
          item_type: "",
          location: "",
          time_found: "",
          description: "",
          media: null,
        });
        // Reset file input
        document.querySelector('input[type="file"]').value = '';
      } else {
        alert(result.message || "Failed to submit report");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Report Found Item
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type of Item */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type of Item
          </label>
          <input
            type="text"
            name="item_type"
            value={formData.item_type}
            onChange={handleChange}
            placeholder="e.g. Wallet, Phone, Bag"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none"
            required
          />
        </div>

        {/* Location Found */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location Found
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Where did you find it?"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none"
            required
          />
        </div>

        {/* Time Found */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Found
          </label>
          <input
            type="time"
            name="time_found"
            value={formData.time_found}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description / Characteristics
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the item you found..."
            rows="4"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none"
            required
          ></textarea>
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Media (proof)
          </label>
          <input
            type="file"
            name="media"
            accept="image/*,video/*"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:scale-105 transition-transform duration-200 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default Report;