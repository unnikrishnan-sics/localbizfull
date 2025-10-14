import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Container,
  Paper,
} from '@mui/material';
import { styled } from '@mui/system';
import Footer from '../Footer/Footer';
import OrganiserNavbar from '../Navbar/OrganiserNavbar';
import { Link } from 'react-router-dom';
// Define your custom purple color
const purpleColor = '#9B70D3';

// Styled components for specific visual tweaks
const StyledTableHeadCell = styled(TableCell)(() => ({
  color: purpleColor,
  fontWeight: 'normal',
  fontSize: '1rem',
  borderBottom: `2px solid ${purpleColor}`,
  paddingBottom: 8,
}));

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(() => ({
  fontSize: '0.9rem',
  padding: '12px 16px',
}));

const StyledEditButton = styled(Button)(() => ({
  backgroundColor: purpleColor,
  color: 'white',
  borderRadius: '8px',
  textTransform: 'none',
  padding: '4px 16px',
  '&:hover': {
    backgroundColor: '#7b4fc2',
  },
}));

import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ViewTrainingsTable() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await axiosInstance.get('api/community/events');
        const filteredTrainings = response.data.data.filter(event => event.type === 'training');
        console.log(filteredTrainings);
        
        setTrainings(filteredTrainings);
      } catch (err) {
        setError(err);
        toast.error('Failed to fetch trainings.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  const handleEdit = (trainingId) => {
    navigate(`/organiser/EditTrainning/${trainingId}`);
  };

  if (loading) {
    return (
      <div>
        <OrganiserNavbar />
        <Container component="main" maxWidth="lg" sx={{ pt: 8, pb: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">Loading trainings...</Typography>
        </Container>
<Footer userRole="organiser" />      </div>
    );
  }

  if (error) {
    return (
      <div>
        <OrganiserNavbar />
        <Container component="main" maxWidth="lg" sx={{ pt: 8, pb: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error">Error: {error.message}</Typography>
        </Container>
<Footer userRole="organiser" />      </div>
    );
  }

  return (
    <div>
      <OrganiserNavbar />
      <Container component="main" maxWidth="lg" sx={{ pt: 8, pb: 4 }}>
        <Box sx={{ textAlign: 'center', marginBottom: 6 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              color: purpleColor,
              fontWeight: 'normal',
              fontSize: '2.5rem',
            }}
          >
            View Trainings
          </Typography>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{
          borderRadius: '16px',
          border: '1px solid #e0e0e0',
          overflowX: 'auto',
        }}>
          <Table sx={{ minWidth: 650 }} aria-label="trainings table">
            <TableHead>
              <TableRow>
                <StyledTableHeadCell>S NO</StyledTableHeadCell>
                <StyledTableHeadCell>Training Date</StyledTableHeadCell>
                <StyledTableHeadCell>Description</StyledTableHeadCell>
                <StyledTableHeadCell>Organizer</StyledTableHeadCell>
                <StyledTableHeadCell align="center">Action</StyledTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trainings.map((training, index) => {
                // Format the date to be more readable
                const trainingDate = new Date(training.date);
                const formattedDate = trainingDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
                
                return (
                  <StyledTableRow key={training._id}>
                    <StyledTableCell component="th" scope="row">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell>{formattedDate}</StyledTableCell>
                    <StyledTableCell>{training.description}</StyledTableCell>
                    <StyledTableCell>{training.organizer}</StyledTableCell>
                    <StyledTableCell align="center">
                      <StyledEditButton
                        variant="contained"
                        onClick={() => handleEdit(training._id)}
                      >
                        Edit
                      </StyledEditButton>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
<Footer userRole="organiser" />    </div>
  );
}

export default ViewTrainingsTable;