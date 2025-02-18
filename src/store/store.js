import { configureStore, createSlice } from "@reduxjs/toolkit";
import { quizApi } from "../quizApi";

const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    quizzes: [],
    currentQuiz: null,
    currentQuestionIndex: 0,
    score: 0,
    editingQuizId: null,
    quizCompleted: false,
    lastQuestionAnswered: false,
  },
  reducers: {
    setLastQuestionAnswered: (state, action) => {
      state.lastQuestionAnswered = action.payload;
    },
    addQuiz: (state, action) => {
      const { name, questions, timer } = action.payload;
      state.quizzes.push({
        id: Date.now(),
        name,
        questions,
        timer,
        results: [],
      });
    },
    addQuestion: (state, action) => {
      const { quizId, question } = action.payload;
      const quiz = state.quizzes.find((q) => q.id === quizId);
      if (quiz) {
        quiz.questions = [...quiz.questions, { ...question }];
      }
      if (state.currentQuiz?.id === quizId) {
        state.currentQuiz.questions = [
          ...state.currentQuiz.questions,
          { ...question },
        ];
      }
    },
    editQuizTitle: (state, action) => {
      const { quizId, newTitle } = action.payload;
      const quiz = state.quizzes.find((q) => q.id === quizId);
      if (quiz) {
        quiz.name = newTitle;
      }
      if (state.currentQuiz?.id === quizId) {
        state.currentQuiz.name = newTitle;
      }
    },
    editQuizQuestions: (state, action) => {
      const { quizId, updatedQuestions } = action.payload;
      const quiz = state.quizzes.find((q) => q.id === quizId);
      if (quiz) {
        quiz.questions = [...updatedQuestions];
      }
      if (state.currentQuiz?.id === quizId) {
        state.currentQuiz.questions = [...updatedQuestions];
      }
    },
    startQuiz: (state, action) => {
      const quiz = state.quizzes.find((q) => q.id === action.payload);
      if (quiz) {
        state.currentQuiz = JSON.parse(JSON.stringify(quiz));
        state.currentQuestionIndex = 0;
        state.score = 0;
        state.quizCompleted = false;
        state.lastQuestionAnswered = false;
      }
    },
    answerQuestion: (state, action) => {
      if (!state.currentQuiz) return;
      const isLastQuestion =
        state.currentQuestionIndex === state.currentQuiz.questions.length - 1;
      const { selectedOption } = action.payload;
      const currentQuestion =
        state.currentQuiz.questions[state.currentQuestionIndex] || null;
      if (currentQuestion && currentQuestion.correctOption === selectedOption) {
        state.score += 1;
      }
      if (!isLastQuestion) {
        state.currentQuestionIndex += 1;
      } else {
        state.lastQuestionAnswered = true;
      }
    },
    endQuiz: (state) => {
      state.quizCompleted = true;
    },
    resetQuiz: (state) => {
      state.currentQuiz = null;
      state.currentQuestionIndex = 0;
      state.score = 0;
      state.quizCompleted = false;
      state.lastQuestionAnswered = false;
    },
    setEditingQuiz: (state, action) => {
      state.editingQuizId = action.payload;
    },
    removeQuestion: (state, action) => {
      const { quizId, questionIndex } = action.payload;
      const quiz = state.quizzes.find((q) => q.id === quizId);
      if (quiz) {
        quiz.questions = quiz.questions.filter((_, i) => i !== questionIndex);
      }
      if (state.currentQuiz?.id === quizId) {
        state.currentQuiz.questions = state.currentQuiz.questions.filter(
          (_, i) => i !== questionIndex
        );
      }
    },
    removeQuiz: (state, action) => {
      state.quizzes = state.quizzes.filter(
        (quiz) => quiz.id !== action.payload
      );
      if (state.editingQuizId === action.payload) {
        state.editingQuizId = null;
      }
      if (state.currentQuiz?.id === action.payload) {
        state.currentQuiz = null;
      }
    },
    storeQuizResult: (state, action) => {
      const { quizId, result } = action.payload;
      const quiz = state.quizzes.find((q) => q.id === quizId);
      if (quiz) {
        quiz.results = quiz.results ? [...quiz.results, result] : [result];
      }
    },
  },
});

export const {
  addQuiz,
  addQuestion,
  startQuiz,
  editQuizTitle,
  editQuizQuestions,
  answerQuestion,
  endQuiz,
  resetQuiz,
  setEditingQuiz,
  removeQuiz,
  setLastQuestionAnswered,
  removeQuestion,
  storeQuizResult,
} = quizSlice.actions;

export const store = configureStore({
  reducer: {
    quiz: quizSlice.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(quizApi.middleware),
});
