// src/components/EditQuiz.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  editQuizTitle,
  editQuizQuestions,
  removeQuestion,
  addQuestion,
} from "../store/store";
import { useUpdateQuizMutation } from "../quizApi";
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

const EditQuiz = ({ quizId, onClose }) => {
  const dispatch = useDispatch();
  const quiz = useSelector((state) =>
    state.quiz.quizzes.find((q) => q.id === quizId)
  );

  const [newTitle, setNewTitle] = useState(quiz?.name || "");
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const [updateQuiz, { isLoading: isUpdating }] = useUpdateQuizMutation();

  useEffect(() => {
    if (quiz && !initialized) {
      setNewTitle(quiz.name);
      setQuestions([...quiz.questions]);
      setInitialized(true);
    }
  }, [quiz, initialized]);

  useEffect(() => {
    const validateQuiz = () => {
      if (!newTitle.trim()) {
        setError("Quiz title cannot be empty.");
        setIsValid(false);
        return;
      }

      for (const question of questions) {
        if (!question.text.trim()) {
          setError("Each question must have a text.");
          setIsValid(false);
          return;
        }
        if (question.options.some((option) => !option.trim())) {
          setError("Each question must have all options filled.");
          setIsValid(false);
          return;
        }
      }
      setError("");
      setIsValid(true);
    };

    validateQuiz();
  }, [newTitle, questions]);

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleQuestionChange = (index, text) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, qIndex) => (qIndex === index ? { ...q, text } : q))
    );
  };

  const handleOptionChange = (questionIndex, optionIndex, text) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, qIndex) =>
        qIndex === questionIndex
          ? {
              ...q,
              options: q.options.map((option, optIndex) =>
                optIndex === optionIndex ? text : option
              ),
            }
          : q
      )
    );
  };

  const handleCorrectAnswerChange = (questionIndex, correctOption) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, qIndex) =>
        qIndex === questionIndex ? { ...q, correctOption } : q
      )
    );
  };

  const addNewOption = (questionIndex) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, qIndex) =>
        qIndex === questionIndex ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const removeOption = (questionIndex, optionIndex) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, qIndex) =>
        qIndex === questionIndex
          ? {
              ...q,
              options: q.options.filter(
                (_, optIndex) => optIndex !== optionIndex
              ),
            }
          : q
      )
    );
  };

  const saveChanges = async () => {
    if (!isValid) return;

    const updatedQuizData = {
      name: newTitle,
      questions: questions,
    };

    try {
      await updateQuiz({ quizId, updatedQuiz: updatedQuizData }).unwrap();
      dispatch(editQuizTitle({ quizId, newTitle }));
      dispatch(editQuizQuestions({ quizId, updatedQuestions: questions }));
      onClose();
    } catch (error) {
      console.error("Failed to update quiz:", error);
    }
  };

  const addNewQuestion = () => {
    if (questions.length >= 10) {
      alert("Max 10 questions allowed per quiz.");
      return;
    }
    const newQuestion = {
      text: "",
      options: ["", ""],
      correctOption: 0,
    };

    setQuestions([...questions, newQuestion]);

    dispatch(addQuestion({ quizId, question: newQuestion }));
  };

  const removeQuestionHandler = (index) => {
    dispatch(removeQuestion({ quizId, questionIndex: index }));
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <Card className="edit-quiz-card">
      <CardContent>
        <Typography variant="h5">Edit Quiz</Typography>
        <TextField
          label="Quiz Title"
          value={newTitle}
          onChange={handleTitleChange}
          fullWidth
          margin="normal"
          error={!!error && !newTitle.trim()}
          helperText={error && !newTitle.trim() ? error : ""}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Edit Questions
        </Typography>
        {questions.map((q, index) => (
          <div key={index} className="question-edit">
            <TextField
              label={`Question ${index + 1}`}
              value={q.text}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              fullWidth
              margin="normal"
              error={!!error && !q.text.trim()}
              helperText={
                error && !q.text.trim() ? "Question cannot be empty" : ""
              }
            />
            {q.options.map((option, optIndex) => (
              <div
                key={optIndex}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <TextField
                  label={`Option ${optIndex + 1}`}
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(index, optIndex, e.target.value)
                  }
                  fullWidth
                  margin="dense"
                  error={!!error && !option.trim()}
                  helperText={
                    error && !option.trim() ? "Option cannot be empty" : ""
                  }
                />
                <Button
                  onClick={() => removeOption(index, optIndex)}
                  color="error"
                  disabled={q.options.length <= 2}
                >
                  ❌
                </Button>
              </div>
            ))}
            <Button
              onClick={() => addNewOption(index)}
              variant="outlined"
              color="primary"
              disabled={q.options.length >= 4}
              style={{ marginBottom: "10px" }}
            >
              + Add Option
            </Button>
            <Typography variant="body1">Select Correct Answer:</Typography>
            <RadioGroup
              value={q.correctOption}
              onChange={(e) =>
                handleCorrectAnswerChange(index, parseInt(e.target.value))
              }
            >
              {q.options.map((option, optIndex) => (
                <FormControlLabel
                  key={optIndex}
                  value={optIndex}
                  control={<Radio />}
                  label={option || `Option ${optIndex + 1}`}
                />
              ))}
            </RadioGroup>
            <Button
              onClick={() => removeQuestionHandler(index)}
              variant="contained"
              color="error"
              style={{ marginTop: "10px" }}
            >
              Delete Question
            </Button>
          </div>
        ))}
        <Button
          onClick={addNewQuestion}
          variant="contained"
          color="primary"
          style={{ marginTop: "15px" }}
        >
          + Add New Question
        </Button>
        <Button
          onClick={saveChanges}
          variant="contained"
          color="success"
          style={{ marginTop: "15px", marginLeft: "10px" }}
          disabled={!isValid || isUpdating || questions.length === 0}
        >
          {isUpdating ? "Saving..." : "Save All Changes"}
        </Button>

        <Button
          onClick={onClose}
          variant="contained"
          color="error"
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </Button>
      </CardContent>
    </Card>
  );
};

export default EditQuiz;
