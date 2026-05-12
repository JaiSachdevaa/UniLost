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
  // NEW: state for image validation error
  const [imageError, setImageError] = useState("");
  const navigate = useNavigate();

  // Fixed categories
  const itemTypes = [
    "Mobile Phones",
    "Keys",
    "Notes & Books",
    "Lunches & Bottles",
    "Wearables",
    "Others",
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      // Clear image error as soon as a file is selected
      setImageError("");
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to submit a report");
      navigate("/login");
      return;
    }

    // NEW: Frontend validation — image is mandatory
    if (!formData.media) {
      setImageError("Please upload an image of the lost item before submitting.");
      return;
    }

    setLoading(true);
    try {
      const result = await api.submitReport(formData);
      if (result.success) {
        alert("✅ Report submitted successfully! Admin will review it shortly.");
        setFormData({
          item_type: "",
          location: "",
          time_found: "",
          description: "",
          media: null,
        });
        setImageError("");
        document.querySelector('input[type="file"]').value = "";
      } else {
        alert(result.message || "Failed to submit report");
      }
    } catch (error) {
      console.error("Submit report error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Report a Found Item
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dropdown for item type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type of Item
          </label>
          <select
            name="item_type"
            value={formData.item_type}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="">Select an item type</option>
            {itemTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
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
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Time Found */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Found
          </label>
          <input
            type="datetime-local"
            name="time_found"
            value={formData.time_found}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none"
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
            placeholder="Describe the item (color, brand, marks, etc.)"
            rows="4"
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none"
          ></textarea>
        </div>

        {/* Media Upload — NOW REQUIRED */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="media"
            accept="image/*,video/*"
            onChange={handleChange}
            className={`w-full border rounded-lg p-3 cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none ${
              imageError ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          />
          {/* NEW: Show error message if no image uploaded */}
          {imageError && (
            <p className="mt-1 text-sm text-red-600">{imageError}</p>
          )}
          {formData.media && !imageError && (
            <p className="text-xs text-gray-500 mt-1">
              Selected file: {formData.media.name}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:scale-105 transition-transform duration-200 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

export default Report;