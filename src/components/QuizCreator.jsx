import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useAddQuizMutation } from "../quizApi";
import { addQuiz } from "../store/store";
import { Button, TextField, Card, CardContent } from "@mui/material";
import QuestionForm from "./QuestionForm";

const QuizCreator = ({ onQuizCreated }) => {
  const dispatch = useDispatch();
  const [quizName, setQuizName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [quizTimer, setQuizTimer] = useState("");
  const [timerError, setTimerError] = useState("");
  const [addQuizMutation, { isLoading, error }] = useAddQuizMutation();

  const handleAddQuestion = (question) => {
    setQuestions([...questions, question]);
  };

  const handleSaveQuiz = async () => {
    if (!quizName.trim()) return;
    if (questions.length === 0) return;

    let timerValue;
    if (quizTimer.trim()) {
      timerValue = Number(quizTimer);
      if (!timerValue || timerValue <= 0) {
        setTimerError("Please enter a valid time in seconds.");
        return;
      }
      setTimerError("");
    }

    const newQuiz = {
      name: quizName,
      questions,
      ...(timerValue ? { timer: timerValue } : {}),
    };

    try {
      const addedQuiz = await addQuizMutation(newQuiz).unwrap();
      console.log("Quiz added via API:", addedQuiz);

      dispatch(addQuiz(addedQuiz));

      setQuizName("");
      setQuestions([]);
      setQuizTimer("");
      onQuizCreated();
    } catch (err) {
      console.error("Failed to add quiz:", err);
    }
  };

  return (
    <Card className="quiz-creator">
      <CardContent>
        <h2>Create a New Quiz</h2>
        <TextField
          fullWidth
          label="Quiz Name"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          type="number"
          label="Time Limit (seconds) - Optional"
          value={quizTimer}
          onChange={(e) => setQuizTimer(e.target.value)}
          margin="normal"
          error={!!timerError}
          helperText={timerError}
        />
        <QuestionForm onAddQuestion={handleAddQuestion} />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveQuiz}
          disabled={questions.length === 0 || !quizName.trim() || isLoading}
          style={{ marginTop: "10px" }}
        >
          {isLoading ? "Saving..." : "Save Quiz"}
        </Button>
        {error && (
          <p style={{ color: "red" }}>
            {error.data
              ? error.data
              : "An error occurred while adding the quiz."}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizCreator;
