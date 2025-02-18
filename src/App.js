import React, { useState } from "react";
import QuizCreator from "./components/QuizCreator";
import QuizList from "./components/QuizList";
import QuizPlayer from "./components/QuizPlayer";
import { useSelector } from "react-redux";
import "./styles/quiz.css";

const App = () => {
  const [showQuizCreator, setShowQuizCreator] = useState(false);
  const currentQuiz = useSelector((state) => state.quiz.currentQuiz);

  return (
    <div className="app-container">
      <h1 className="app-title">Quiz App</h1>
      {!currentQuiz ? (
        <div className="quiz-setup">
          {!showQuizCreator ? (
            <button onClick={() => setShowQuizCreator(true)}>
              + Create New Quiz
            </button>
          ) : (
            <QuizCreator onQuizCreated={() => setShowQuizCreator(false)} />
          )}
          <QuizList />
        </div>
      ) : (
        <QuizPlayer />
      )}
    </div>
  );
};

export default App;
