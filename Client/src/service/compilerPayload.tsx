import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Tipos atualizados para corresponder ao payload real
interface Components {
  id: string;
  type: string;
  label: string;
  properties?: {
    pin?: string;
    mode?: 'direct' | 'pulse' | 'blink';
    delay?: number;
    duration?: number;
    frequency?: number;
  };
}

export interface Code {
  board: string;
  components: Components[];
}

export interface Response {
  success: boolean;
  message: string;
  data: {
    stdout: string;
    stderr: string;
  };
  generatedCode: string;
  hex: string; // Added hex field to the response
}

// New types for the raw compilation
export interface RawCodePayload {
  code: string;
  board: string;
}

export interface RawCompileResponse {
  success: boolean;
  message: string;
  hex: string;
}

export const compilerApi = createApi({
  reducerPath: 'compilerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/",
  }),
  tagTypes: ['Compiler'],
  endpoints: (builder) => ({
    sendCode: builder.mutation<Response, Partial<Code>>({
      query: (newCode) => ({
        url: 'compiler/codehub',
        method: 'POST',
        body: newCode,
      }),
      invalidatesTags: ['Compiler'],
    }),
    compileCode: builder.mutation<RawCompileResponse, RawCodePayload>({
      query: (payload) => ({
        url: 'compiler/compile',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const { useSendCodeMutation, useCompileCodeMutation } = compilerApi;
