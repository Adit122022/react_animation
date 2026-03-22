import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base query with auth token
const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
});

// Base query with re-authentication
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401 Unauthorized, logout the user
  if (result.error && result.error.status === 401) {
    // Clear auth state
    api.dispatch({ type: 'auth/logout' });
    
    // Redirect to login
    window.location.href = '/login';
  }

  return result;
};

// Create API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Resume', 'User', 'Template', 'Payment'],
  endpoints: (builder) => ({
    // ==========================================
    // AUTH ENDPOINTS
    // ==========================================
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    getCurrentUser: builder.query({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    updateUserDetails: builder.mutation({
      query: (data) => ({
        url: '/auth/updatedetails',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    updatePassword: builder.mutation({
      query: (data) => ({
        url: '/auth/updatepassword',
        method: 'PUT',
        body: data,
      }),
    }),

    // ==========================================
    // RESUME ENDPOINTS
    // ==========================================
    getResumes: builder.query({
      query: () => '/resumes',
      providesTags: (result) =>
        result
          ? [
              ...result.resumes.map(({ _id }) => ({ type: 'Resume', id: _id })),
              { type: 'Resume', id: 'LIST' },
            ]
          : [{ type: 'Resume', id: 'LIST' }],
    }),

    getResume: builder.query({
      query: (id) => `/resumes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Resume', id }],
    }),

    createResume: builder.mutation({
      query: (data) => ({
        url: '/resumes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Resume', id: 'LIST' }, 'User'],
    }),

    updateResume: builder.mutation({
      query: ({ id, data }) => ({
        url: `/resumes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Resume', id }],
      // Optimistic update
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getResume', id, (draft) => {
            Object.assign(draft.resume, data);
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    deleteResume: builder.mutation({
      query: (id) => ({
        url: `/resumes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Resume', id: 'LIST' }, 'User'],
    }),

    duplicateResume: builder.mutation({
      query: (id) => ({
        url: `/resumes/${id}/duplicate`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Resume', id: 'LIST' }, 'User'],
    }),

    // ==========================================
    // TEMPLATE ENDPOINTS
    // ==========================================
    getTemplates: builder.query({
      query: (params) => ({
        url: '/templates',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.templates.map(({ _id }) => ({ type: 'Template', id: _id })),
              { type: 'Template', id: 'LIST' },
            ]
          : [{ type: 'Template', id: 'LIST' }],
    }),

    getTemplate: builder.query({
      query: (id) => `/templates/${id}`,
      providesTags: (result, error, id) => [{ type: 'Template', id }],
    }),

    incrementTemplateUsage: builder.mutation({
      query: (id) => ({
        url: `/templates/${id}/use`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Template', id }],
    }),

    // ==========================================
    // PAYMENT ENDPOINTS
    // ==========================================
    createPaymentOrder: builder.mutation({
      query: (data) => ({
        url: '/payment/create-order',
        method: 'POST',
        body: data,
      }),
    }),

    verifyPayment: builder.mutation({
      query: (data) => ({
        url: '/payment/verify',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    getPaymentHistory: builder.query({
      query: () => '/payment/history',
      providesTags: ['Payment'],
    }),

    // ==========================================
    // PDF ENDPOINTS
    // ==========================================
    generatePDF: builder.mutation({
      query: (resumeId) => ({
        url: `/pdf/generate/${resumeId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, resumeId) => [{ type: 'Resume', id: resumeId }],
    }),

    downloadPDF: builder.query({
      query: (resumeId) => ({
        url: `/pdf/download/${resumeId}`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // ==========================================
    // ANALYTICS ENDPOINTS (Optional)
    // ==========================================
    getResumeAnalytics: builder.query({
      query: (resumeId) => `/analytics/resume/${resumeId}`,
    }),

    getDashboardStats: builder.query({
      query: () => '/analytics/dashboard',
    }),

    // ==========================================
    // SUBSCRIPTION ENDPOINTS (Optional)
    // ==========================================
    getSubscriptionDetails: builder.query({
      query: () => '/subscription/details',
      providesTags: ['User'],
    }),

    cancelSubscription: builder.mutation({
      query: () => ({
        url: '/subscription/cancel',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  // Auth
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useUpdateUserDetailsMutation,
  useUpdatePasswordMutation,

  // Resume
  useGetResumesQuery,
  useGetResumeQuery,
  useCreateResumeMutation,
  useUpdateResumeMutation,
  useDeleteResumeMutation,
  useDuplicateResumeMutation,

  // Template
  useGetTemplatesQuery,
  useGetTemplateQuery,
  useIncrementTemplateUsageMutation,

  // Payment
  useCreatePaymentOrderMutation,
  useVerifyPaymentMutation,
  useGetPaymentHistoryQuery,

  // PDF
  useGeneratePDFMutation,
  useDownloadPDFQuery,
  useLazyDownloadPDFQuery,

  // Analytics
  useGetResumeAnalyticsQuery,
  useGetDashboardStatsQuery,

  // Subscription
  useGetSubscriptionDetailsQuery,
  useCancelSubscriptionMutation,
} = apiSlice;

export default apiSlice;