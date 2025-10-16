import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const compileApi = createApi({
  reducerPath: 'compileApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }), // Adjust the base URL as needed
  endpoints: (builder) => ({
    compileCode: builder.mutation<{ success: boolean; message: string; hex: string }, { code: string; board: string }>({ 
      query: (body) => ({
        url: 'compiler/compile',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCompileCodeMutation } = compileApi;
