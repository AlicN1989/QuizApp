import React, { useState } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";

const QuestionForm = ({ onAddQuestion }) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctOption, setCorrectOption] = useState(0);
  const [error, setError] = useState("");

  const validateInputs = () => {
    if (!newQuestion.trim()) {
      setError("Question text cannot be empty.");
      return false;
    }
    if (options.some((option) => !option.trim())) {
      setError("All options must be filled.");
      return false;
    }
    setError("");
    return true;
  };

  const handleAddQuestion = () => {
    if (!validateInputs()) return;

    onAddQuestion({ text: newQuestion, options, correctOption });
    setNewQuestion("");
    setOptions(["", ""]);
    setCorrectOption(0);
  };

  return (
    <div className="question-form">
      <TextField
        fullWidth
        label="Question Text"
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        margin="normal"
        error={!!error && !newQuestion.trim()}
        helperText={error && !newQuestion.trim() ? error : ""}
      />

      {options.map((option, index) => (
        <TextField
          key={index}
          fullWidth
          label={`Option ${index + 1}`}
          value={option}
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[index] = e.target.value;
            setOptions(newOptions);
          }}
          margin="dense"
          error={!!error && !option.trim()}
          helperText={error && !option.trim() ? "Option cannot be empty" : ""}
        />
      ))}

      <Button
        onClick={() => setOptions([...options, ""])}
        disabled={options.length >= 4}
        style={{ marginTop: "10px" }}
      >
        + Add Option
      </Button>
      <Button
        onClick={() => options.length > 2 && setOptions(options.slice(0, -1))}
        disabled={options.length <= 2}
        style={{ marginLeft: "10px", marginTop: "10px" }}
      >
        - Remove Option
      </Button>
      <FormControl
        fullWidth
        margin="normal"
        style={{ marginTop: "10px" }}
        error={!!error && correctOption === 0}
        helperText={
          error && correctOption === 0 ? "Please choose a correct answer" : ""
        }
      >
        <InputLabel id="correct-answer-label">Correct Answer</InputLabel>
        <Select
          value={correctOption}
          onChange={(e) => setCorrectOption(Number(e.target.value))}
          labelId="correct-answer-label"
          label="Correct Answer"
        >
          {options.map((_, index) => (
            <MenuItem key={index} value={index}>
              {index + 1}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {error && (
        <Typography color="error" style={{ marginTop: "10px" }}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        color="secondary"
        onClick={handleAddQuestion}
        style={{ marginTop: "10px" }}
        disabled={
          !newQuestion.trim() || options.some((option) => !option.trim())
        }
      >
        Add Question
      </Button>
    </div>
  );
};

export default QuestionForm;
