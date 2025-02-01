'use client'
import {Box, Typography} from '@mui/material';
import {useState} from 'react';

const CreateEvent = () => {
  const [form, setForm] = useState({});
  console.log(form);
  return (
    <Box>
      <Typography variant="h5">Create Event</Typography>
    </Box>
  );
};

export default CreateEvent;
