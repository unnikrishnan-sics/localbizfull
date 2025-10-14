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

// Styled components for specific visual tweaks (reused from ViewTrainingsTable)
const StyledTableHeadCell = styled(TableCell)(() => ({
  color: purpleColor, // Purple text for header
  fontWeight: 'normal', // Standard font weight for headers
  fontSize: '1rem', // Adjust font size if needed
  borderBottom: `2px solid ${purpleColor}`, // Purple bottom border for headers
  paddingBottom: 8, // Add some padding below the border
}));

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(() => ({
  fontSize: '0.9rem', // Font size for body cells
  padding: '12px 16px', // Adjust padding for cell content
}));

const StyledEditButton = styled(Button)(() => ({
  backgroundColor: purpleColor, // Purple background for the button
  color: 'white', // White text
  borderRadius: '8px', // Rounded corners for the button
  textTransform: 'none', // Prevent uppercase text
  padding: '4px 16px', // Adjust padding
  '&:hover': {
    backgroundColor: '#7b4fc2', // Darker purple on hover
  },
}));

import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ViewWorkshopsTable() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await axiosInstance.get('api/community/events');
        // Check if response.data exists and has events array
        const events = response?.data?.data || [];
        console.log(events);
        
        const filteredWorkshops = events.filter(event => event.type === 'workshop');
        setWorkshops(filteredWorkshops);
      } catch (err) {
        setError(err);
        toast.error('Failed to fetch workshops.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  const handleEdit = (workshopId) => {
    navigate(`/organiser/EditWorkShop/${workshopId}`);
  };

  if (loading) {
    return (
      <div>
        <OrganiserNavbar />
        <Container component="main" maxWidth="lg" sx={{ pt: 8, pb: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">Loading workshops...</Typography>
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
            View Workshops
          </Typography>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{
          borderRadius: '16px',
          border: '1px solid #e0e0e0',
          overflowX: 'auto',
        }}>
          <Table sx={{ minWidth: 650 }} aria-label="workshops table">
            <TableHead>
              <TableRow>
                <StyledTableHeadCell>S NO</StyledTableHeadCell>
                <StyledTableHeadCell>Workshop Type</StyledTableHeadCell>
                <StyledTableHeadCell>Organizer</StyledTableHeadCell>
                <StyledTableHeadCell>Description</StyledTableHeadCell>
                <StyledTableHeadCell>Date</StyledTableHeadCell>
                <StyledTableHeadCell align="center">Action</StyledTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workshops.length > 0 ? (
                workshops.map((workshop, index) => (
                  <StyledTableRow key={workshop._id || index}>
                    <StyledTableCell component="th" scope="row">
                      {index + 1}.
                    </StyledTableCell>
                    <StyledTableCell>{workshop.type || 'N/A'}</StyledTableCell>
                    <StyledTableCell>{workshop.organizer || 'N/A'}</StyledTableCell>
                    <StyledTableCell>{workshop.description || 'N/A'}</StyledTableCell>
                    <StyledTableCell>
                      {workshop.date ? new Date(workshop.date).toLocaleDateString() : 'N/A'}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <StyledEditButton
                        variant="contained"
                        onClick={() => handleEdit(workshop._id)}
                      >
                        Edit
                      </StyledEditButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={6} align="center">
                    No workshops found
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
<Footer userRole="organiser" />    </div>
  );
}

export default ViewWorkshopsTable;