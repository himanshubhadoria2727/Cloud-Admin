import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Get all bookings
export const getAllBookings = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/booking/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get a single booking by ID
export const getBookingById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/booking/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update booking status
export const updateBookingStatus = async (id, status, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/booking/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a booking
export const deleteBooking = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/booking/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 