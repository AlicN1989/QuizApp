import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { startQuiz, setEditingQuiz } from "../store/store";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
} from "@mui/material";
import EditQuiz from "./EditQuiz";
import PastResultsModal from "./PastResultsModal";
import RemoveQuizButton from "./RemoveQuizButton";

const QuizList = () => {
  const quizzes = useSelector((state) => state.quiz.quizzes);
  const editingQuizId = useSelector((state) => state.quiz.editingQuizId);
  const [openEditQuiz, setOpenEditQuiz] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [resultsQuizId, setResultsQuizId] = useState(null);
  const dispatch = useDispatch();

  const sortedQuizzes = [...quizzes].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "questions") {
      return a.questions.length - b.questions.length;
    }
    return 0;
  });

  return (
    <Box className="quiz-list">
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ mt: 2, mb: 3 }}>
          Available Quizzes
        </Typography>
        {quizzes.length > 0 && (
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="name">Quiz Name</MenuItem>
              <MenuItem value="questions">Number of Questions</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>

      <Grid
        container
        spacing={3}
        justifyContent={sortedQuizzes.length === 1 ? "center" : "flex-start"}
      >
        {sortedQuizzes.map((quiz) => (
          <Grid
            item
            key={quiz.id}
            xs={12}
            sm={sortedQuizzes.length === 1 ? 10 : 6}
          >
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent>
                <Typography variant="h6">{quiz.name}</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {quiz.questions.length}{" "}
                  {quiz.questions.length === 1 ? "question" : "questions"}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        dispatch(setEditingQuiz(quiz.id));
                        setOpenEditQuiz(quiz.id);
                      }}
                      sx={{ width: "100%" }}
                    >
                      Edit Quiz
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => dispatch(startQuiz(quiz.id))}
                      sx={{ width: "100%" }}
                    >
                      Play Quiz
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <RemoveQuizButton quizId={quiz.id} />
                  </Grid>
                  {quiz.results && quiz.results.length > 0 && (
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        color="info"
                        onClick={() => setResultsQuizId(quiz.id)}
                        sx={{ width: "100%" }}
                      >
                        Past Results
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {openEditQuiz && (
        <EditQuiz
          quizId={openEditQuiz}
          onClose={() => {
            dispatch(setEditingQuiz(null));
            setOpenEditQuiz(null);
          }}
        />
      )}

      {resultsQuizId && (
        <PastResultsModal
          open={true}
          onClose={() => setResultsQuizId(null)}
          results={
            quizzes.find((quiz) => quiz.id === resultsQuizId)?.results || []
          }
        />
      )}
    </Box>
  );
};

export default QuizList;
