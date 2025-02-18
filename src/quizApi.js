import { createApi } from "@reduxjs/toolkit/query/react";

const fakeBaseQuery = async (args, api, extraOptions) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (args.method === "DELETE") {
    return { data: { success: true, quizId: args.url.split("/").pop() } };
  }

  if (args.method === "POST") {
    const newQuiz = { ...args.body, id: Date.now() };
    return { data: newQuiz };
  }

  if (args.method === "PUT" || args.method === "PATCH") {
    return { data: args.body };
  }

  return { error: { status: 404, data: "Not found" } };
};

export const quizApi = createApi({
  reducerPath: "quizApi",
  baseQuery: fakeBaseQuery,
  endpoints: (builder) => ({
    removeQuiz: builder.mutation({
      query: (quizId) => ({
        url: `/quizzes/${quizId}`,
        method: "DELETE",
      }),
    }),
    addQuiz: builder.mutation({
      query: (newQuiz) => ({
        url: `/quizzes`,
        method: "POST",
        body: newQuiz,
      }),
    }),
    updateQuiz: builder.mutation({
      query: ({ quizId, updatedQuiz }) => ({
        url: `/quizzes/${quizId}`,
        method: "PUT",
        body: updatedQuiz,
      }),
    }),
  }),
});

export const {
  useRemoveQuizMutation,
  useAddQuizMutation,
  useUpdateQuizMutation,
} = quizApi;
