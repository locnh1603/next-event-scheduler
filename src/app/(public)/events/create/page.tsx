'use client'
import {
  Box,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material';
import React, {useState} from 'react';
import {EventDTO, EventModel} from '@/app/models/event.model';
import Button from '@mui/material/Button';
import {DatePicker, DateValidationError, LocalizationProvider, PickerChangeHandlerContext} from '@mui/x-date-pickers';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import moment, {Moment} from 'moment';
import {IResponseBody} from '@/app/models/fetch.model';
import {useCookiesNext} from 'cookies-next';
import {EventCommands} from '@/app/enums/event.enum';
import {useRouter} from 'next/navigation';

const CreateEventForm = () => {
  const [formData, setFormData] = useState<EventDTO>(new EventDTO({date: moment().valueOf()}));
  const { getCookies } = useCookiesNext();
  const Cookie = JSON.stringify(getCookies());
  const router = useRouter();
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/events`;
    const body = JSON.stringify({
      payload: formData,
      command: EventCommands.createEvent
    });
    const data = await fetch(url, {
      method: 'POST',
      body,
      headers: {
        Cookie
      }
    });
    const { payload }: IResponseBody<EventModel> = await data.json();
    router.push(`/events/${payload?.id}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!name) return;
    setFormData((prev: EventDTO) => ({
      ...prev,
      [name]: name === 'date' ? new Date(value as string).getTime() : value
    }));
  };
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    if (!name) return;
    setFormData((prev: EventDTO) => ({
      ...prev,
      [name]: value as string,
    }));
  };
  const handleDateChange = (date: Moment | null, context: PickerChangeHandlerContext<DateValidationError>) => {
    if (!date || context.validationError) return;
    setFormData((prev: EventDTO) => ({
      ...prev,
      date: moment(date).valueOf(),
    }));
  }
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Data Form
      </Typography>
      <FormGroup sx={{ gap: 3 }}>
        <FormControl fullWidth>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            multiline
            rows={4}
          />
        </FormControl>
        <FormControl fullWidth>
          <DatePicker
            value={moment(formData.date)}
            label="Date"
            name="date"
            onChange={handleDateChange}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleSelectChange}
            required
          >
            <MenuItem value="event">Once</MenuItem>
            <MenuItem value="meeting">Repeat</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
          Submit
        </Button>
      </FormGroup>
    </Box>
  );
};

const CreateEvent = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <CreateEventForm />
    </LocalizationProvider>
  );
};

export default CreateEvent;
