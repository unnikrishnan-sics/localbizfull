import {
  Box,
  Button,
  Typography,
  Menu,
  MenuItem,
  Stack,
  alpha
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ShieldIcon from '@mui/icons-material/Shield';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminSidebar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();

  const handleUsersClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleClose();
  };

  const isActive = (path) => location.pathname === path;

  const NavButton = ({ label, icon, path, onClick, hasDropdown }) => (
    <Button
      fullWidth
      onClick={onClick || (() => navigate(path))}
      sx={{
        justifyContent: 'flex-start',
        height: "50px",
        px: 3,
        mb: 1,
        textTransform: 'none',
        borderRadius: '12px',
        color: isActive(path) ? '#e94560' : 'rgba(255, 255, 255, 0.7)',
        background: isActive(path) ? 'rgba(233, 69, 96, 0.1)' : 'transparent',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.05)',
          color: '#e94560'
        },
        transition: 'all 0.3s ease'
      }}
      startIcon={icon}
      endIcon={hasDropdown ? <ArrowDropDownIcon /> : null}
    >
      <Typography sx={{ fontSize: "15px", fontWeight: isActive(path) ? 700 : 500, ml: 1, flexGrow: 1, textAlign: 'left' }}>
        {label}
      </Typography>
    </Button>
  );

  return (
    <Box sx={{
      height: "calc(100vh - 40px)",
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(10px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      margin: "20px 0px 20px 20px",
      borderRadius: "24px",
      display: 'flex',
      flexDirection: 'column',
      width: '260px',
      overflow: 'hidden',
      position: 'sticky',
      top: 20
    }}>
      {/* Brand Header */}
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
            <ShieldIcon sx={{ fontSize: 32, color: '#e94560' }} />
            <Typography variant="h5" sx={{ fontWeight: 900, color: 'white', letterSpacing: '1px' }}>
              LOCAL<span style={{ color: '#e94560' }}>BIZ</span>
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', mt: 0.5, letterSpacing: '2px', fontWeight: 600 }}>
            ADMIN CONTROL PANEL
          </Typography>
        </motion.div>
      </Box>

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, mt: 2, px: 2 }}>
        <NavButton label="Dashboard" icon={<DashboardOutlinedIcon />} path="/admin/dashboard" />
        <NavButton label="Requests" icon={<TaskOutlinedIcon />} path="/admin/requests" />
        <NavButton label="Complaints" icon={<ReceiptLongOutlinedIcon />} path="/admin/complaints" />

        <NavButton
          label="Users"
          icon={<PersonOutlineOutlinedIcon />}
          onClick={handleUsersClick}
          hasDropdown
          path="/admin/viewusers" // Active if any sub is active? Simplification for now.
        />

        <Menu
          id="users-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: '220px',
              mt: 1,
              background: '#1a1a2e',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              borderRadius: '16px',
              '& .MuiMenuItem-root': {
                color: 'rgba(255,255,255,0.7)',
                m: 1,
                borderRadius: '8px',
                '&:hover': {
                  background: 'rgba(233, 69, 96, 0.1)',
                  color: '#e94560'
                }
              }
            }
          }}
        >
          <MenuItem onClick={() => handleMenuItemClick('/admin/viewusers')}>Customers</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('/admin/bussinessowners')}>Business Owners</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('/admin/organizations')}>Community Organizers</MenuItem>
        </Menu>
      </Box>

      {/* Footer Info */}
      <Box sx={{ p: 4, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <Box sx={{
          p: 2,
          borderRadius: '16px',
          background: 'linear-gradient(45deg, rgba(233, 69, 96, 0.1), rgba(111, 50, 191, 0.1))',
          textAlign: 'center'
        }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
            System Status
          </Typography>
          <Typography variant="body2" sx={{ color: '#00e676', fontWeight: 700, mt: 0.5 }}>
            ONLINE
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminSidebar;
