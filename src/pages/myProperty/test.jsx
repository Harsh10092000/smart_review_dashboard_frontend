import React, { useState, useEffect, useContext } from 'react';
import { 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  Chip, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  Paper,
  Checkbox,
  FormGroup
} from '@mui/material';
import { 
  IconEdit, 
  IconDeviceFloppy, 
  IconX, 
  IconMapPin, 
  IconHome, 
  IconCurrency, 
  IconBed, 
  IconBath, 
  IconCar, 
  IconBuilding, 
  IconRuler, 
  IconDirection, 
  IconCheck, 
  IconUsers, 
  IconInfoCircle,
} from '@tabler/icons-react';
import { AuthContext } from '../../context2/AuthContext';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { DateFormat, PropertyCurrentStatus, PropertyTypeFunction, ShowPrice } from '../../components/Functions';
import Loader from '../../components/loader/Loader';

const adTypes = [
  { label: 'Sale', icon: <IconHome size={16} /> },
  { label: 'Rent', icon: <IconCurrency size={16} /> },
];

const userTypes = [
  { label: 'Owner', icon: <IconUsers size={16} /> },
  { label: 'Agent', icon: <IconUsers size={16} /> },
  { label: 'Builder', icon: <IconBuilding size={16} /> },
];

const propertyTypes = [
  { value: 'Residential', icon: <IconHome size={16} /> },
  { value: 'Commercial', icon: <IconBuilding size={16} /> },
  { value: 'Land', icon: <IconMapPin size={16} /> },
];

const propertyResSubTypes = [
  { value: '1BHK', item: '1 BHK' },
  { value: '2BHK', item: '2 BHK' },
  { value: '3BHK', item: '3 BHK' },
  { value: '4BHK+', item: '4+ BHK' },
];

const propertyLandSubTypes = [
  { value: 'Plot', item: 'Plot' },
  { value: 'Land', item: 'Land' },
];

const propertyCommercialSubTypes = [
  { value: 'Shop', item: 'Shop' },
  { value: 'Office', item: 'Office' },
  { value: 'Warehouse', item: 'Warehouse' },
];

const ownershipOptions = ["Ownership", "Power of Attorney"];
const authorityOptions = ["HSVP", "MC", "DTP", "Other"];
const otherRoomsOptions = ["Puja Room", "Store Room", "Study Room"];
const facilitiesOptions = [
  "Schools",
  "Hospitals",
  "Public Transportation",
  "Shops/Malls",
  "Restaurants",
  "Parks/Green Spaces",
];

const initialFormState = {
  // Step 1
  adType: '',
  userType: '',
  propertyType: '',
  propertySubType: '',
  // Step 2
  location: '',
  plotNumber: '',
  state: '',
  city: '',
  subDistrict: '',
  locality: '',
  completeAddress: '',
  pinCode: '',
  // Step 3
  age: '',
  bedrooms: '',
  washrooms: '',
  balconies: '',
  parking: '',
  facing: '',
  furnishing: '',
  possession: '',
  floors: '',
  sides: '',
  plotSize: '',
  plotSizeUnit: 'Marla',
  roadWidth: '',
  roadWidthUnit: 'Feet',
  plotWidth: '',
  plotLength: '',
  // Step 4
  coverImage: null,
  otherImages: [],
  // Step 5
  ownership: '',
  authority: '',
  otherRooms: [],
  facilities: [],
  amount: '',
  negotiable: true,
  rented: false,
  corner: false,
  desc: '',
  // Step 6 (contact info, if any)
};

const MyProperty = () => {
  const { currentUser } = useContext(AuthContext);
  const { propertyId } = useParams();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [imageDialog, setImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  
  const [formData, setFormData] = useState(initialFormState);

  // TODO: Fetch property details and map to this structure if needed

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper for multi-select pills
  const handleMultiSelect = (arr, field, val) => {
    setFormData(prev => ({
      ...prev,
      [field]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]
    }));
  };

  // --- UI ---
  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2, maxWidth: 900, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconHome size={32} color="#1976d2" />
            <Typography variant="h4" fontWeight="bold" color="primary">
              My Property Details
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!editing ? (
              <Button variant="contained" startIcon={<IconEdit size={20} />} onClick={() => setEditing(true)} sx={{ borderRadius: 2 }}>Edit</Button>
            ) : (
              <>
                <Button variant="contained" color="success" startIcon={<IconDeviceFloppy size={20} />} sx={{ borderRadius: 2 }}>Save</Button>
                <Button variant="outlined" startIcon={<IconX size={20} />} onClick={() => setEditing(false)} sx={{ borderRadius: 2 }}>Cancel</Button>
              </>
            )}
          </Box>
        </Box>
        {/* --- Basic Details --- */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconInfoCircle size={20} color="#1976d2" /> Basic Details
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            {/* Ad Type Pills */}
            {adTypes.map(type => (
              <Button
                key={type.label}
                variant={formData.adType === type.label ? 'contained' : 'outlined'}
                color={formData.adType === type.label ? 'primary' : 'inherit'}
                startIcon={type.icon}
                onClick={() => editing && setFormData(f => ({ ...f, adType: type.label }))}
                sx={{ borderRadius: 5, minWidth: 100 }}
                disabled={!editing}
              >
                {type.label}
              </Button>
            ))}
            {/* User Type Pills */}
            {userTypes.map(type => (
              <Button
                key={type.label}
                variant={formData.userType === type.label ? 'contained' : 'outlined'}
                color={formData.userType === type.label ? 'primary' : 'inherit'}
                startIcon={type.icon}
                onClick={() => editing && setFormData(f => ({ ...f, userType: type.label }))}
                sx={{ borderRadius: 5, minWidth: 100 }}
                disabled={!editing}
              >
                {type.label}
              </Button>
            ))}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            {/* Property Type Pills */}
            {propertyTypes.map(type => (
              <Button
                key={type.value}
                variant={formData.propertyType === type.value ? 'contained' : 'outlined'}
                color={formData.propertyType === type.value ? 'primary' : 'inherit'}
                startIcon={type.icon}
                onClick={() => editing && setFormData(f => ({ ...f, propertyType: type.value, propertySubType: '' }))}
                sx={{ borderRadius: 5, minWidth: 120 }}
                disabled={!editing}
              >
                {type.value}
              </Button>
            ))}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {/* Property Sub Type Pills */}
            {(formData.propertyType === 'Residential' ? propertyResSubTypes : formData.propertyType === 'Land' ? propertyLandSubTypes : propertyCommercialSubTypes).map(type => (
              <Button
                key={type.value}
                variant={formData.propertySubType === type.value ? 'contained' : 'outlined'}
                color={formData.propertySubType === type.value ? 'primary' : 'inherit'}
                onClick={() => editing && setFormData(f => ({ ...f, propertySubType: type.value }))}
                sx={{ borderRadius: 5, minWidth: 120 }}
                disabled={!editing}
              >
                {type.item}
              </Button>
            ))}
          </Box>
        </Box>
        {/* --- Location --- */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconMapPin size={20} color="#1976d2" /> Location
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><TextField fullWidth label="Location (Google)" value={formData.location} onChange={e => setFormData(f => ({ ...f, location: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Plot Number" value={formData.plotNumber} onChange={e => setFormData(f => ({ ...f, plotNumber: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="State" value={formData.state} onChange={e => setFormData(f => ({ ...f, state: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="City" value={formData.city} onChange={e => setFormData(f => ({ ...f, city: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Sub District" value={formData.subDistrict} onChange={e => setFormData(f => ({ ...f, subDistrict: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Locality" value={formData.locality} onChange={e => setFormData(f => ({ ...f, locality: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Complete Address" value={formData.completeAddress} onChange={e => setFormData(f => ({ ...f, completeAddress: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Pin Code" value={formData.pinCode} onChange={e => setFormData(f => ({ ...f, pinCode: e.target.value }))} disabled={!editing} /></Grid>
          </Grid>
        </Box>
        {/* --- Property Details --- */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconBuilding size={20} color="#1976d2" /> Property Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}><TextField fullWidth label="Age" value={formData.age} onChange={e => setFormData(f => ({ ...f, age: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Bedrooms" value={formData.bedrooms} onChange={e => setFormData(f => ({ ...f, bedrooms: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Washrooms" value={formData.washrooms} onChange={e => setFormData(f => ({ ...f, washrooms: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Balconies" value={formData.balconies} onChange={e => setFormData(f => ({ ...f, balconies: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Parking" value={formData.parking} onChange={e => setFormData(f => ({ ...f, parking: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Facing" value={formData.facing} onChange={e => setFormData(f => ({ ...f, facing: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Furnishing" value={formData.furnishing} onChange={e => setFormData(f => ({ ...f, furnishing: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Possession" value={formData.possession} onChange={e => setFormData(f => ({ ...f, possession: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Floors" value={formData.floors} onChange={e => setFormData(f => ({ ...f, floors: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Sides" value={formData.sides} onChange={e => setFormData(f => ({ ...f, sides: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Plot Size" value={formData.plotSize} onChange={e => setFormData(f => ({ ...f, plotSize: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Plot Size Unit" value={formData.plotSizeUnit} onChange={e => setFormData(f => ({ ...f, plotSizeUnit: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Road Width" value={formData.roadWidth} onChange={e => setFormData(f => ({ ...f, roadWidth: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Road Width Unit" value={formData.roadWidthUnit} onChange={e => setFormData(f => ({ ...f, roadWidthUnit: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Plot Width" value={formData.plotWidth} onChange={e => setFormData(f => ({ ...f, plotWidth: e.target.value }))} disabled={!editing} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Plot Length" value={formData.plotLength} onChange={e => setFormData(f => ({ ...f, plotLength: e.target.value }))} disabled={!editing} /></Grid>
          </Grid>
        </Box>
        {/* --- Images Section (step4) --- */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconCheck size={20} color="#1976d2" /> Images
          </Typography>
          {/* Cover Image Uploader */}
          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              disabled={!editing}
              sx={{ mb: 1 }}
            >
              Upload Cover Image
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                disabled={!editing}
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setFormData(f => ({ ...f, coverImage: e.target.files[0] }));
                  }
                }}
              />
            </Button>
            {formData.coverImage && (
              <Box sx={{ mt: 1 }}>
                <img
                  src={typeof formData.coverImage === 'string' ? formData.coverImage : URL.createObjectURL(formData.coverImage)}
                  alt="cover"
                  style={{ width: 180, height: 120, objectFit: 'cover', borderRadius: 8 }}
                />
                {editing && (
                  <Button size="small" color="error" onClick={() => setFormData(f => ({ ...f, coverImage: null }))}>Remove</Button>
                )}
              </Box>
            )}
          </Box>
          {/* Other Images Uploader */}
          <Box>
            <Button
              variant="outlined"
              component="label"
              disabled={!editing}
              sx={{ mb: 1 }}
            >
              Upload Other Images
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                hidden
                disabled={!editing}
                onChange={e => {
                  if (e.target.files) {
                    setFormData(f => ({ ...f, otherImages: Array.from(e.target.files) }));
                  }
                }}
              />
            </Button>
            {formData.otherImages && formData.otherImages.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                {formData.otherImages.map((img, idx) => (
                  <Box key={idx} sx={{ position: 'relative' }}>
                    <img
                      src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                      alt={`other-${idx}`}
                      style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6 }}
                    />
                    {editing && (
                      <Button size="small" color="error" onClick={() => setFormData(f => ({ ...f, otherImages: f.otherImages.filter((_, i) => i !== idx) }))}>Remove</Button>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
        {/* --- Pricing & Amenities Section (step5) --- */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconCurrency size={20} color="#1976d2" /> Pricing & Amenities
          </Typography>
          {/* Ownership Pills */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            {ownershipOptions.map(opt => (
              <Button
                key={opt}
                variant={formData.ownership === opt ? 'contained' : 'outlined'}
                color={formData.ownership === opt ? 'primary' : 'inherit'}
                onClick={() => editing && setFormData(f => ({ ...f, ownership: opt }))}
                sx={{ borderRadius: 5, minWidth: 120 }}
                disabled={!editing}
              >
                {opt}
              </Button>
            ))}
          </Box>
          {/* Authority Pills */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            {authorityOptions.map(opt => (
              <Button
                key={opt}
                variant={formData.authority === opt ? 'contained' : 'outlined'}
                color={formData.authority === opt ? 'primary' : 'inherit'}
                onClick={() => editing && setFormData(f => ({ ...f, authority: opt }))}
                sx={{ borderRadius: 5, minWidth: 120 }}
                disabled={!editing}
              >
                {opt}
              </Button>
            ))}
          </Box>
          {/* Other Rooms Pills */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            {otherRoomsOptions.map(opt => (
              <Button
                key={opt}
                variant={formData.otherRooms.includes(opt) ? 'contained' : 'outlined'}
                color={formData.otherRooms.includes(opt) ? 'primary' : 'inherit'}
                onClick={() => editing && handleMultiSelect(formData.otherRooms, 'otherRooms', opt)}
                sx={{ borderRadius: 5, minWidth: 120 }}
                disabled={!editing}
              >
                {opt}
              </Button>
            ))}
          </Box>
          {/* Facilities Pills */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            {facilitiesOptions.map(opt => (
              <Button
                key={opt}
                variant={formData.facilities.includes(opt) ? 'contained' : 'outlined'}
                color={formData.facilities.includes(opt) ? 'primary' : 'inherit'}
                onClick={() => editing && handleMultiSelect(formData.facilities, 'facilities', opt)}
                sx={{ borderRadius: 5, minWidth: 120 }}
                disabled={!editing}
              >
                {opt}
              </Button>
            ))}
          </Box>
          {/* Amount */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Expected Amount"
              value={formData.amount}
              onChange={e => setFormData(f => ({ ...f, amount: e.target.value.replace(/[^0-9]/g, '') }))}
              disabled={!editing}
              InputProps={{ startAdornment: <IconCurrency size={18} style={{ marginRight: 8, color: '#666' }} /> }}
            />
          </Box>
          {/* Checkboxes */}
          <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
            <FormControlLabel
              control={<Checkbox checked={formData.negotiable} onChange={() => editing && setFormData(f => ({ ...f, negotiable: !f.negotiable }))} disabled={!editing} />}
              label="Price Negotiable"
            />
            <FormControlLabel
              control={<Checkbox checked={formData.rented} onChange={() => editing && setFormData(f => ({ ...f, rented: !f.rented }))} disabled={!editing} />}
              label="Already on Rented"
            />
            <FormControlLabel
              control={<Checkbox checked={formData.corner} onChange={() => editing && setFormData(f => ({ ...f, corner: !f.corner }))} disabled={!editing} />}
              label="Corner Property"
            />
          </Box>
          {/* Description */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Property Description"
              value={formData.desc}
              onChange={e => setFormData(f => ({ ...f, desc: e.target.value }))}
              disabled={!editing}
              multiline
              rows={3}
            />
          </Box>
        </Box>
        {/* --- Contact Section (step6, if any fields) --- */}
        {/* Add contact fields here if present in your add-property flow */}
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default MyProperty;
