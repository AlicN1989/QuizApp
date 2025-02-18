import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  answerQuestion,
  endQuiz,
  resetQuiz,
  storeQuizResult,
} from "../store/store";
import EndQuizDialog from "./EndQuizDialog";
import { Button, Typography, Card, CardContent, Stack } from "@mui/material";
import "../styles/quiz.css";
import "./QuizPlayer.css";

const QuizPlayer = () => {
  const dispatch = useDispatch();
  const {
    currentQuiz,
    currentQuestionIndex,
    score,
    quizCompleted,
    lastQuestionAnswered,
  } = useSelector((state) => state.quiz);

  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(currentQuiz ? currentQuiz.timer : 0);
  const totalQuestions = currentQuiz ? currentQuiz.questions.length : 0;

  const [resultStored, setResultStored] = useState(false);

  useEffect(() => {
    setResultStored(false);
  }, [currentQuiz]);

  useEffect(() => {
    if (currentQuiz && currentQuiz.timer) {
      setTimeLeft(currentQuiz.timer);
    }
  }, [currentQuiz]);

  useEffect(() => {
    if (quizCompleted || !currentQuiz?.timer) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerInterval);
          dispatch(endQuiz());
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [quizCompleted, dispatch, currentQuiz]);

  useEffect(() => {
    if (quizCompleted && currentQuiz && !resultStored) {
      const result = {
        date: new Date().toLocaleString(),
        score,
        totalQuestions,
      };
      dispatch(storeQuizResult({ quizId: currentQuiz.id, result }));
      setResultStored(true);
    }
  }, [
    quizCompleted,
    currentQuiz,
    resultStored,
    score,
    totalQuestions,
    dispatch,
  ]);

  if (!currentQuiz)
    return (
      <Typography variant="h6" className="quiz-header">
        No quiz selected
      </Typography>
    );

  const question = currentQuiz.questions[currentQuestionIndex] || null;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const percentage = totalQuestions
    ? ((score / totalQuestions) * 100).toFixed(2)
    : 0;
  const passed = percentage >= 60;

  const handleEndQuiz = () => {
    setOpen(true);
  };

  const confirmEndQuiz = () => {
    dispatch(endQuiz());
    setOpen(false);
  };

  return (
    <Card className="quiz-card play-mode">
      <CardContent>
        <Typography variant="h6" className="quiz-progress">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </Typography>

        {currentQuiz.timer && (
          <Typography
            variant="h6"
            className="quiz-timer"
            style={{ marginTop: "10px" }}
          >
            Time Left: {timeLeft} second{timeLeft !== 1 && "s"}
          </Typography>
        )}

        {!quizCompleted ? (
          <>
            {question ? (
              <Typography
                variant="h5"
                className="quiz-question"
                style={{ marginTop: "20px" }}
              >
                {question.text}
              </Typography>
            ) : (
              <Typography variant="h5" className="quiz-question">
                No more questions. Click 'End Quiz' to finish.
              </Typography>
            )}

            <div className="quiz-options">
              {question?.options?.map((option, index) => (
                <Button
                  key={index}
                  variant="contained"
                  onClick={() =>
                    dispatch(answerQuestion({ selectedOption: index }))
                  }
                  className="quiz-button"
                  disabled={lastQuestionAnswered}
                >
                  {option}
                </Button>
              ))}

              {isLastQuestion && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleEndQuiz}
                  className="remove-quiz-button"
                  disabled={!lastQuestionAnswered}
                >
                  End Quiz
                </Button>
              )}
            </div>
          </>
        ) : (
          <Stack spacing={2}>
            <Typography variant="h5" className="quiz-header">
              Quiz Completed!
            </Typography>
            <Typography variant="h6" className="quiz-score">
              Your Score: {score}/{totalQuestions} ({percentage}%)
            </Typography>
            <Typography
              variant="h6"
              className={passed ? "quiz-passed" : "quiz-failed"}
            >
              {passed
                ? "🎉 Congratulations! You Passed!"
                : "❌ You Failed. Try Again!"}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => dispatch(resetQuiz())}
              className="quiz-button"
            >
              Restart
            </Button>
          </Stack>
        )}
      </CardContent>

      <EndQuizDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={confirmEndQuiz}
      />
    </Card>
  );
};

export default QuizPlayer;
