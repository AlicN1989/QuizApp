import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const PastResultsModal = ({ open, onClose, results }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Past Results
        </Typography>
        {results.map((result, index) => (
          <Box key={index} mb={2}>
            <Typography variant="body1">Date: {result.date}</Typography>
            <Typography variant="body1">
              Score: {result.score}/{result.totalQuestions}
            </Typography>
          </Box>
        ))}
        <Button variant="contained" color="primary" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default PastResultsModal;
