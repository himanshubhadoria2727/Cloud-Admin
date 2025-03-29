import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState, AppDispatch } from "../store";

const getAuthToken = async () => {
  try {
    const token = localStorage.getItem("auth_Token");
    console.log("Auth Token in api:", token); // Log the auth token
    return token ? `Bearer ${token}` : "";
  } catch (error) {
    console.error("Failed to retrieve auth token from storage:", error);
    return "";
  }
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: async (args, api, extraOptions) => {
    const token = await getAuthToken();

    const baseQuery = fetchBaseQuery({
      //  baseUrl: 'http://digimonk.net:2783/api',
      baseUrl: `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/api`,
      prepareHeaders: (headers) => {
        if (token) {
          headers.set("Authorization", token);
        }
        return headers;
      },
    });

    // Extract relevant fields for logging
    const {
      url,
      method = "GET",
      body = {}, // Provide a default value for body
      params = {}, // Provide a default value for params
    } = typeof args === "object" ? args : { url: args };

    // Log the request details
    console.log("--- API Request Start ---");
    console.log("Request URL:", url);
    console.log("Request Method:", method);
    console.log("Request Body:", body);
    console.log("Request Params:", params);

    // Make the API request
    const result = await baseQuery(args, api, extraOptions);

    return result;
  },

  tagTypes: ["User", "Auth", "Property", "Booking", "Enquiry", "Content", "Category", "Review"], // Updated tag types
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "/user/register",
        method: "POST",
        body: userData,
      }),
      // Invalidate User and Auth queries upon registration
      invalidatesTags: ["User", "Auth"],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
      // Invalidate User and Auth queries upon login
      invalidatesTags: ["User", "Auth"],
    }),
    getUserDetails: builder.query({
      query: () => "/user/getUserDetails",
      providesTags: ["User"], // Tag this endpoint for future invalidation
    }),
    saveUserDetails: builder.mutation({
      query: (userDetails) => ({
        url: "/user/updateUser",
        method: "POST",
        body: userDetails,
      }),
      invalidatesTags: ["User"], // Invalidate the User tag after saving user details
    }),
    submitEnquiry: builder.mutation({
      query: (equiryDetails) => ({
        url: "/enquiry/submitEnquiry",
        method: "POST",
        body: equiryDetails,
      }),
      // Add invalidation tag for Enquiry
      invalidatesTags: ["Enquiry"],
    }),
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: "/booking/create",
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["Booking"],
    }),
    verifyOtp: builder.mutation({
      query: (otp) => ({
        url: "/user/verify",
        method: "POST",
        body: otp,
      }),
      invalidatesTags: ["Auth"], // Invalidate Auth tag after OTP verification
    }),
    getCategory: builder.query({
      query: () => "/category/getCategory",
    }),
    getPlans: builder.query({
      query: (country) => ({
        url: `/plan/getPlan`,
        params: {
          country: country || "", // Add the country as a query parameter (defaults to empty string if not provided)
        },
      }),
    }),
    getPlanByUserId: builder.query({
      query: (userId) => `/getPlanByUserId/${userId}`,
    }),
    getContent: builder.query({
      query: () => `/content/allContent`,
      providesTags: ["Content"],
    }),
    getMySubscriptions: builder.query({
      query: () => `/user/mySubscription`,
    }),
    getUserPlan: builder.query({
      query: (queryParams) => ({
        url: `/userplan`,
        params: queryParams,
      }),
    }),
    createSubscription: builder.mutation({
      query: (planId) => ({
        url: `/userplan`,
        method: "POST",
        body: planId,
      }),
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/user/delete/${userId}`, // DELETE endpoint
        method: "DELETE", // Use DELETE method for deleting
      }),
      // Invalidate tags related to users after deleting
      invalidatesTags: ["User"],
    }),

    // Property-related endpoints
    createProperty: builder.mutation({
      query: (formdata) => ({
        url: "/property",
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["Property"], // Invalidate Property tag after creating
    }),
    getProperties: builder.query({
      query: (queryParams) => ({
        url: "/property",
        params: queryParams, // Pass search queries as params
      }),
      providesTags: ["Property"], // Tag this endpoint for future invalidation
    }),
    getPropertyById: builder.query({
      query: (id) => `/property/${id}`,
      providesTags: (result, error, id) => [{ type: 'Property', id }],
    }),
    editProperty: builder.mutation({
      query: ({ id, data }) => ({
        url: `/property/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Property"], // Invalidate Property tag after editing
    }),
    updateProperty: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/property/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Property', id },
        'Property',
      ],
    }),
    deleteProperty: builder.mutation({
      query: (id) => ({
        url: `/property/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Property"], // Invalidate Property tag after deleting
    }),

    // Booking endpoints
    getBookings: builder.query({
      query: () => '/booking/all',
      providesTags: ['Booking'],
    }),
    getBookingById: builder.query({
      query: (id) => `/booking/${id}`,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/booking/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Booking', id },
        'Booking',
      ],
    }),
    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `/booking/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Booking'],
    }),
    
    // Enquiry endpoints
    getEnquiries: builder.query({
      query: () => '/enquiry/getEnquiries',
      providesTags: ['Enquiry'],
    }),
    deleteEnquiry: builder.mutation({
      query: (id) => ({
        url: `/enquiry/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Enquiry'],
    }),
    
    // Content endpoints
    updateContent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/content/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Content'],
    }),
    
    // Category endpoints
    getCategories: builder.query({
      query: () => '/category/getCategory',
      providesTags: ['Category'],
    }),

    // Dashboard analytics endpoints
    getDashboardStats: builder.query({
      query: (dateParams) => ({
        url: "/analytics/dashboard-stats",
        params: dateParams,
      }),
    }),
    getRevenueData: builder.query({
      query: (dateParams) => ({
        url: "/analytics/revenue-data",
        params: dateParams,
      }),
    }),
    getRecentMessages: builder.query({
      query: () => "/analytics/recent-messages",
    }),
    getRecentTransactions: builder.query({
      query: () => "/analytics/recent-transactions",
    }),

    // Reviews endpoints
    getAllReviews: builder.query({
      query: (params) => {
        // Filter out undefined/null values from parameters
        const validParams = Object.fromEntries(
          Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== null)
        );
        
        return {
          url: "/analytics/reviews",
          params: validParams,
        };
      },
      providesTags: ['Review'],
    }),
    getReviewById: builder.query({
      query: (reviewId) => `/analytics/reviews/${reviewId}`,
      providesTags: (result, error, reviewId) => [{ type: 'Review', id: reviewId }],
    }),
    getPropertyReviews: builder.query({
      query: (propertyId) => `/analytics/reviews/property/${propertyId}`,
      providesTags: ['Review'],
    }),
    updateReview: builder.mutation({
      query: ({ reviewId, ...data }) => ({
        url: `/analytics/reviews/${reviewId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['Review'],
    }),
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/analytics/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Review'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetUserDetailsQuery,
  useSaveUserDetailsMutation,
  useSubmitEnquiryMutation,
  useCreateBookingMutation,
  useVerifyOtpMutation,
  useGetCategoryQuery,
  useGetPlansQuery,
  useLazyGetPlanByUserIdQuery,
  useGetPlanByUserIdQuery,
  useGetContentQuery,
  useGetMySubscriptionsQuery,
  useGetUserPlanQuery,
  useCreateSubscriptionMutation,
  useDeleteUserMutation,
  useCreatePropertyMutation,
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useEditPropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation,
  useGetEnquiriesQuery,
  useDeleteEnquiryMutation,
  useUpdateContentMutation,
  useGetCategoriesQuery,
  useGetDashboardStatsQuery,
  useLazyGetDashboardStatsQuery,
  useGetRevenueDataQuery,
  useLazyGetRevenueDataQuery,
  useGetRecentMessagesQuery,
  useGetRecentTransactionsQuery,
  useGetAllReviewsQuery,
  useGetReviewByIdQuery,
  useGetPropertyReviewsQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = apiSlice;

// Function to handle logout and invalidate user queries
export const logoutAndInvalidateQueries = (dispatch: AppDispatch) => {
  localStorage.removeItem("auth_Token");
  // Invalidate all user-related queries
  dispatch(apiSlice.util.invalidateTags(["User", "Auth"]));
};
