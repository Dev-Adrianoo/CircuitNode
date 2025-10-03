import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

/*Aqui o Redux Toolkit está sendo utilizado para gerenciar nosssas requisições na
 *API de forma dinâmica, economizando tempo e espaço
 */
interface Components {
  id: string,
  type: string,
  label: string,
  properties?: {
    pin?: string,
    delay?: string,
  }
}
export interface Code {
  board: string;
  components: Components[]
}
export interface Response{

      success: boolean;
      message: string
      data:{
          stdout:string,
          stderr:string
      }
      generatedCode: string;
  
}


/*
  pin:{
        analog_pin?: string
        digital_pin?: number
    };
*/
export const compilerApi = createApi({
  reducerPath: 'compilerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/"
  }),
  tagTypes: ['Compiler'],
  endpoints: (builder) => ({

    sendCode: builder.mutation<Response, Partial<Code>>({
      query: (newCode) => ({
        url: 'compiler/codehub',
        method: 'POST',
        body: newCode,

      }),
   
      invalidatesTags: ['Compiler']
    }),
  }),

})

export const { useSendCodeMutation } = compilerApi;

