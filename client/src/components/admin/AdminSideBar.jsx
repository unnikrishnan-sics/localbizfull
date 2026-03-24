import {
  Box,
  Button,
  Typography,
  Stack,
  alpha,
  Drawer,
  Collapse,
  List
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ShieldIcon from '@mui/icons-material/Shield';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminSidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();
  const [usersOpen, setUsersOpen] = useState(
    location.pathname === '/admin/viewusers' ||
    location.pathname === '/admin/bussinessowners' ||
    location.pathname === '/admin/organizations'
  );
  const navigate = useNavigate();

  const handleUsersClick = () => {
    setUsersOpen(!usersOpen);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    if (mobileOpen && handleDrawerToggle) {
      handleDrawerToggle();
    }
  };

  const isActive = (path) => location.pathname === path;

  const NavButton = ({ label, icon, path, onClick, hasDropdown, isOpen }) => (
    <Button
      fullWidth
      onClick={onClick || (() => handleMenuItemClick(path))}
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
      endIcon={hasDropdown ? (isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />) : null}
    >
      <Typography sx={{ fontSize: "15px", fontWeight: isActive(path) ? 700 : 500, ml: 1, flexGrow: 1, textAlign: 'left' }}>
        {label}
      </Typography>
    </Button>
  );

  const SubNavButton = ({ label, path }) => (
    <Button
      fullWidth
      onClick={() => handleMenuItemClick(path)}
      sx={{
        justifyContent: 'flex-start',
        height: "40px",
        pl: 6,
        pr: 3,
        mb: 0.5,
        textTransform: 'none',
        borderRadius: '12px',
        color: isActive(path) ? '#e94560' : 'rgba(255, 255, 255, 0.5)',
        background: isActive(path) ? 'rgba(233, 69, 96, 0.1)' : 'transparent',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.05)',
          color: '#e94560'
        },
        transition: 'all 0.3s ease'
      }}
    >
      <Typography sx={{ fontSize: "14px", fontWeight: isActive(path) ? 700 : 500, textAlign: 'left' }}>
        {label}
      </Typography>
    </Button>
  );

  const drawerContent = (
    <Box sx={{
      height: "100%",
      background: 'rgba(10, 10, 26, 0.95)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      flexDirection: 'column',
      width: '260px',
      overflowX: 'hidden',
      overflowY: 'auto',
      '&::-webkit-scrollbar': { width: '4px' },
      '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }
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
          isOpen={usersOpen}
          path="/admin/viewusers"
        />

        <Collapse in={usersOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <SubNavButton label="Customers" path="/admin/viewusers" />
            <SubNavButton label="Business Owners" path="/admin/bussinessowners" />
            <SubNavButton label="Community Organizers" path="/admin/organizations" />
          </List>
        </Collapse>
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

  return (
    <Box component="nav" sx={{ width: { md: 260 }, flexShrink: { md: 0 } }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 260,
            background: 'transparent',
            border: 'none'
          },
        }}
      >
        <Box sx={{
          height: "100%",
          borderRadius: "0px 24px 24px 0px",
          overflow: 'hidden',
        }}>
          {drawerContent}
        </Box>
      </Drawer>

      {/* Desktop Permanent Sidebar */}
      <Box sx={{
        display: { xs: 'none', md: 'block' },
        height: "calc(100vh - 40px)",
        margin: "20px 0px 20px 20px",
        borderRadius: "24px",
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        position: 'sticky',
        top: 20
      }}>
        {drawerContent}
      </Box>
    </Box>
  );
};

export default AdminSidebar;
