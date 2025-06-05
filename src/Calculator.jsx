import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CalculatorPage.css';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    List,
    ListItem,
    Divider,
    Paper,
    TextField,
    ThemeProvider,
    createTheme,
    AppBar,
    Toolbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { wishlistPrices, getAllCategories, isUserDefinedPrice } from './data/wishlistpriceData';
import domtoimage from 'dom-to-image-more';
import * as XLSX from 'xlsx';
import calculatorLogo from '/asset/icon/CalculatorLogo.png';

// Create a dark theme
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#323342',
            paper: '#323342',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                },
            },
        },
    },
});

const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

const Calculator = () => {
    const navigate = useNavigate();
    const wishlistRef = useRef(null);
    const [wishlist, setWishlist] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [customPrice, setCustomPrice] = useState('');
    const [showWelcomeDialog, setShowWelcomeDialog] = useState(true);
    const categories = getAllCategories();

    // Update width and zoom for mobile devices
    useEffect(() => {
        const updateWidth = () => {
            const isMobile = window.innerWidth < 1024;
            if (isMobile) {
                const zoom = (window.innerWidth / 1024);
                // Apply zoom to the calculator page container instead of body
                const container = document.querySelector('.calculator-page');
                if (container) {
                    container.style.transform = `scale(${zoom})`;
                    // Adjust the height to account for the scaling
                    document.body.style.minHeight = `${Math.ceil(window.innerHeight / zoom)}px`;
                }
            } else {
                const container = document.querySelector('.calculator-page');
                if (container) {
                    container.style.transform = 'none';
                }
                document.body.style.minHeight = 'auto';
            }
        };

        // Initial update
        updateWidth();

        // Update on resize
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setSelectedCategory(category);
        
        // Load default price for user-defined items if available
        if (isUserDefinedPrice(category)) {
            const categoryInfo = categories.find(cat => cat.name === category);
            if (categoryInfo && categoryInfo.price) {
                setCustomPrice(categoryInfo.price.toString());
            } else {
                setCustomPrice('');
            }
        }
    };

    const handleReset = () => {
        setWishlist([]);
        setSelectedCategory('');
        setCustomPrice('');
    };

    const handleAddItem = () => {
        if (!selectedCategory) return;

        const categoryInfo = categories.find(cat => cat.name === selectedCategory);
        if (!categoryInfo) return;

        const newItem = {
                id: Date.now(),
                category: selectedCategory,
            price: isUserDefinedPrice(selectedCategory) ? parseInt(customPrice) || 0 : categoryInfo.price,
            quantity: 1,
            description: '',
            type: categoryInfo.type,
            unit: categoryInfo.unit
        };

        setWishlist([...wishlist, newItem]);
        setSelectedCategory('');
        setCustomPrice('');
    };

    const handleRemoveItem = (id) => {
        setWishlist(wishlist.filter(item => item.id !== id));
    };

    const handleQuantityChange = (id, value) => {
        const quantity = Math.max(1, parseInt(value) || 1);
        setWishlist(wishlist.map(item => 
            item.id === id ? { ...item, quantity } : item
        ));
    };

    const handlePriceChange = (id, value) => {
        const price = Math.max(0, parseInt(value) || 0);
        setWishlist(wishlist.map(item => 
            item.id === id ? { ...item, price } : item
        ));
    };

    const handleDescriptionChange = (id, value) => {
        setWishlist(wishlist.map(item => 
            item.id === id ? { ...item, description: value } : item
        ));
    };

    const calculateTotal = () => {
        return wishlist.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleSaveImage = async () => {
        if (!wishlistRef.current || wishlist.length === 0) return;

        try {
            // Create a temporary container with dark background
            const tempContainer = document.createElement('div');
            tempContainer.style.backgroundColor = '#323342';
            tempContainer.style.padding = '20px';
            tempContainer.style.borderRadius = '8px';

            // Clone the wishlist content
            const wishlistClone = wishlistRef.current.cloneNode(true);
            
            // Remove any buttons and unnecessary interactive elements
            const elementsToRemove = wishlistClone.querySelectorAll('button, .MuiIconButton-root');
            elementsToRemove.forEach(el => el.remove());

            // Add the total to the bottom
            const totalDiv = document.createElement('div');
            totalDiv.style.textAlign = 'right';
            totalDiv.style.marginTop = '16px';
            totalDiv.style.color = 'white';
            totalDiv.style.fontSize = '20px';
            totalDiv.style.fontWeight = '500';
            totalDiv.innerHTML = `Total: ${formatPrice(calculateTotal())}`;

            // Add content to container
            tempContainer.appendChild(wishlistClone);
            tempContainer.appendChild(totalDiv);

            // Add to document temporarily
            document.body.appendChild(tempContainer);

            const options = {
                quality: 1.0,
                bgcolor: '#323342',
                style: {
                    'background-color': '#323342'
                }
            };

            try {
                const dataUrl = await domtoimage.toPng(tempContainer, options);
                const link = document.createElement('a');
                link.download = 'jkt48-wishlist.png';
                link.href = dataUrl;
                link.click();
            } catch (pngError) {
                console.warn('PNG generation failed, trying blob...', pngError);
                const blob = await domtoimage.toBlob(tempContainer, options);
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = 'jkt48-wishlist.png';
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
            }

            // Clean up
            document.body.removeChild(tempContainer);
        } catch (error) {
            console.error('Error saving wishlist:', error);
            alert('Failed to save image. Please try again or use a screenshot instead.');
        }
    };

    const handleExportToExcel = () => {
        if (wishlist.length === 0) return;

        // Prepare data for Excel
        const excelData = wishlist.map(item => ({
            Category: item.category,
            Description: item.description || '-',
            'Price per Unit': item.price,
            Quantity: item.quantity,
            'Total Price': item.price * item.quantity
        }));

        // Add total row
        excelData.push({
            Category: 'TOTAL',
            Description: '',
            'Price per Unit': '',
            Quantity: '',
            'Total Price': calculateTotal()
        });

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(excelData);

        // Set column widths
        const colWidths = [
            { wch: 30 }, // Category
            { wch: 40 }, // Description
            { wch: 15 }, // Price per Unit
            { wch: 10 }, // Quantity
            { wch: 15 }, // Total Price
        ];
        ws['!cols'] = colWidths;

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'JKT48 Wishlist');

        // Save file
        XLSX.writeFile(wb, 'jkt48-wishlist.xlsx');
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <div className="calculator-page">
                {/* Welcome Dialog */}
                <Dialog
                    open={showWelcomeDialog}
                    onClose={() => setShowWelcomeDialog(false)}
                    PaperProps={{
                        style: {
                            backgroundColor: '#323342',
                            color: 'white',
                            maxWidth: '600px'
                        }
                    }}
                    sx={{
                        '& .MuiDialog-container': {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0
                        },
                        position: 'fixed'
                    }}
                    keepMounted
                >
                    <DialogTitle sx={{ 
                        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                        color: 'white'
                    }}>
                        Selamat Datang di Wishlist Calculator JKT48
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                        <Typography paragraph>
                            1. Calculator ini dibuat untuk kalian para fans yang ingin mencari tahu total harga wishlist kalian di JKT48.
                        </Typography>
                        <Typography paragraph>
                            2. Kalian bisa menambah kategori, jumlah tiket/barang yang kalian beli, ubah harga (untuk beberapa barang yang memiliki harga yang berbeda-beda) dan juga menambah deskripsi.
                        </Typography>
                        <Typography paragraph>
                            3. Kalian bisa save Wishlist ini dengan tombol Save As Image atau Save ke Excel File dengan tombol Export to Excel
                        </Typography>
                        <Typography 
                            sx={{ 
                                mt: 2, 
                                p: 2, 
                                bgcolor: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: 1
                            }}
                        >
                            <strong>Disclaimer:</strong> Wishlist ini tidak termasuk Pajak, Biaya Admin Topup JKT48 Point, Biaya Admin Online Shop, dan lain-lain.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
                        <Button 
                            onClick={() => setShowWelcomeDialog(false)}
                            variant="contained"
                            sx={{
                                bgcolor: 'white',
                                color: '#323342',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.9)'
                                }
                            }}
                        >
                            Mengerti
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Header */}
                <header className="header">
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => navigate('/')}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <img 
                        src={calculatorLogo} 
                        alt="Calculator Logo" 
                        className="header-logo"
                    />
                    <Typography variant="h6" className="header-title">
                JKT48 Wishlist Calculator
            </Typography>
                </header>

                {/* Main Content */}
                <div className="calculator-container">
                    <div className="content-container">
                        <div className="calculator-card">
                            <div className="form-container">
                                <FormControl 
                                    fullWidth 
                                    size="small"
                                >
                            <InputLabel>Select Category</InputLabel>
                            <Select
                                value={selectedCategory}
                                label="Select Category"
                                        onChange={handleCategoryChange}
                                    >
                                        {categories.map((category) => (
                                            <MenuItem key={category.name} value={category.name}>
                                                {category.name} {!isUserDefinedPrice(category.name) && `- ${formatPrice(category.price)}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                                {selectedCategory && isUserDefinedPrice(selectedCategory) && (
                                    <TextField
                                        label="Price"
                                        type="number"
                                        value={customPrice}
                                        onChange={(e) => setCustomPrice(e.target.value)}
                                        size="small"
                                        sx={{ width: '200px' }}
                                        InputProps={{
                                            inputProps: { min: 0 }
                                        }}
                                    />
                        )}

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAddItem}
                                    disabled={!selectedCategory || (isUserDefinedPrice(selectedCategory) && !customPrice)}
                                    sx={{
                                        bgcolor: '#be2016',
                                        '&:hover': {
                                            bgcolor: '#a11b13'
                                        }
                                    }}
                        >
                            Add
                        </Button>
                            </div>

                            <div className="wishlist-container" ref={wishlistRef}>
                        <List>
                            {wishlist.map((item, index) => (
                                <React.Fragment key={item.id}>
                                            <ListItem
                                                sx={{
                                                    flexDirection: 'column',
                                                    alignItems: 'stretch',
                                                    gap: 1,
                                                    py: 2
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box>
                                                        <Typography variant="subtitle1" sx={{ color: 'white' }}>
                                                            {item.category}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                            {formatPrice(item.price)} × {item.quantity} = {formatPrice(item.price * item.quantity)}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        {isUserDefinedPrice(item.category) && (
                                                            <TextField
                                                                label="Price"
                                                                type="number"
                                                                value={item.price}
                                                                onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                                                InputProps={{ inputProps: { min: 0 } }}
                                                                sx={{ width: '120px' }}
                                                                size="small"
                                                            />
                                                        )}
                                                        <TextField
                                                            label="Qty"
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                            InputProps={{ inputProps: { min: 1 } }}
                                                            sx={{ width: '80px' }}
                                                            size="small"
                                                        />
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => handleRemoveItem(item.id)}
                                                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                                    </Box>
                                                </Box>
                                                <TextField
                                                    fullWidth
                                                    label="Description (optional)"
                                                    value={item.description}
                                                    onChange={(e) => handleDescriptionChange(item.id, e.target.value)}
                                                    multiline
                                                    rows={1}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                    </ListItem>
                                            {index < wishlist.length - 1 && (
                                                <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
                                            )}
                                </React.Fragment>
                            ))}
                        </List>
                            </div>

                            <div className="button-container">
                                <div className="action-buttons">
                                    <Button
                                        variant="outlined"
                                        startIcon={<SaveIcon />}
                                        onClick={handleSaveImage}
                                        disabled={wishlist.length === 0}
                                    >
                                        Save as Image
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<SaveIcon />}
                                        onClick={handleExportToExcel}
                                        disabled={wishlist.length === 0}
                                    >
                                        Export to Excel
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={handleReset}
                                        disabled={wishlist.length === 0}
                                    >
                                        Reset
                                    </Button>
                                </div>
                                <Typography className="total-text">
                            Total: {formatPrice(calculateTotal())}
                        </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default Calculator;
