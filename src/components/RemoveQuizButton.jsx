import React from "react";
import { Button } from "@mui/material";
import { useRemoveQuizMutation } from "../quizApi";
import { useDispatch } from "react-redux";
import { removeQuiz } from "../store/store";

const RemoveQuizButton = ({ quizId }) => {
  const dispatch = useDispatch();
  const [removeQuizMutation, { isLoading }] = useRemoveQuizMutation();

  const handleRemoveQuiz = async () => {
    try {
      await removeQuizMutation(quizId).unwrap();
      dispatch(removeQuiz(quizId));
    } catch (err) {
      console.error("Failed to remove quiz:", err);
    }
  };

  return (
    <Button
      variant="contained"
      color="error"
      onClick={handleRemoveQuiz}
      disabled={isLoading}
      sx={{ width: "100%" }}
      className="remove-quiz-button"
    >
      {isLoading ? "Removing..." : "Remove Quiz"}
    </Button>
  );
};

export default RemoveQuizButton;
