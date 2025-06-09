import React, { useState, useEffect, useMemo } from 'react';
import { 
    Container,
    Typography,
    Box,
    Paper,
    TableContainer,
    TablePagination,
    Alert,
    Link,
    Button,
    Chip,
    Grid
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowBack, Download, Refresh } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format, parse, startOfMonth } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const PointHistory = () => {
    const [pointsData, setPointsData] = useState([]);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();

    const loadPointsHistory = () => {
        console.log('[JKT48 App] Attempting to load points history');
        try {
            const savedData = localStorage.getItem('jkt48_points_history');
            console.log('[JKT48 App] Raw data from localStorage:', savedData);
            
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                console.log('[JKT48 App] Parsed data:', parsedData);
                
                setPointsData(parsedData.data || []);
                setLastUpdate(parsedData.timestamp);
                setError('');
                
                console.log('[JKT48 App] Data loaded successfully');
            } else {
                console.log('[JKT48 App] No data found in localStorage');
                setError('No points history found. Please use the Chrome extension to save your points history first.');
            }
        } catch (error) {
            console.error('[JKT48 App] Error loading points history:', error);
            setError('Error loading points history: ' + error.message);
        }
    };

    useEffect(() => {
        console.log('[JKT48 App] Component mounted');
        loadPointsHistory();

        const handleUpdate = (event) => {
            console.log('[JKT48 App] Received update event:', event);
            loadPointsHistory();
        };

        window.addEventListener('JKT48_POINTS_HISTORY_UPDATED', handleUpdate);
        window.addEventListener('storage', (e) => {
            if (e.key === 'jkt48_points_history') {
                console.log('[JKT48 App] Storage event detected:', e);
                loadPointsHistory();
            }
        });

        return () => {
            window.removeEventListener('JKT48_POINTS_HISTORY_UPDATED', handleUpdate);
            window.removeEventListener('storage', handleUpdate);
        };
    }, []);

    const calculateCurrentPoints = () => {
        return pointsData.reduce((total, row) => {
            const points = parseInt(row.buyPoints?.replace(/[P,]/g, '').trim()) || 0;
            return total + points;
        }, 0);
    };

    const calculateTotalSpend = () => {
        return pointsData.reduce((total, row) => {
            const points = parseInt(row.buyPoints?.replace(/[P,]/g, '').trim()) || 0;
            return total + (points < 0 ? Math.abs(points) : 0);
        }, 0);
    };

    const chartData = useMemo(() => {
        const categoryData = {};
        const monthlyData = {};
        const yearlyData = {};

        console.log('Processing points data for charts:', pointsData);

        pointsData.forEach(row => {
            if (row.purpose.trim() === 'JKT48 POINTS') {
                console.log('Skipping topup:', row);
                return;
            }

            const points = parseInt(row.buyPoints?.replace(/[P,]/g, '').trim()) || 0;
            
            if (points >= 0) {
                console.log('Skipping non-spending transaction:', row);
                return;
            }

            let category = 'Others';
            const purpose = row.purpose.toLowerCase().trim();
            console.log('Processing purpose:', purpose);

            if (purpose === 'tiket teater') {
                category = 'Theater Ticket';
            } else if (purpose === 'video call') {
                category = 'Video Call';
            }

            console.log('Detected category:', category, 'for purpose:', purpose);

            const spendingAmount = Math.abs(points);
            if (!categoryData[category]) {
                categoryData[category] = 0;
            }
            categoryData[category] += spendingAmount;

            try {
                const [day, month, year] = row.date.split(' ');
                const monthMap = {
                    'Januari': 'January',
                    'Februari': 'February',
                    'Maret': 'March',
                    'April': 'April',
                    'Mei': 'May',
                    'Juni': 'June',
                    'Juli': 'July',
                    'Agustus': 'August',
                    'September': 'September',
                    'Oktober': 'October',
                    'November': 'November',
                    'Desember': 'December'
                };
                
                const englishMonth = monthMap[month] || month;
                const date = new Date(`${year}-${englishMonth}-${day}`);
                const monthKey = format(startOfMonth(date), 'MMM yyyy');
                const yearKey = year;
                
                if (!monthlyData[monthKey]) {
                    monthlyData[monthKey] = 0;
                }
                monthlyData[monthKey] += spendingAmount;

                if (!yearlyData[yearKey]) {
                    yearlyData[yearKey] = 0;
                }
                yearlyData[yearKey] += spendingAmount;
            } catch (error) {
                console.error('Error parsing date:', error, 'for row:', row);
            }
        });

        console.log('Final category data:', categoryData);
        console.log('Final monthly data:', monthlyData);
        console.log('Final yearly data:', yearlyData);

        const sortedMonthly = Object.entries(monthlyData)
            .sort((a, b) => {
                const dateA = new Date(a[0]);
                const dateB = new Date(b[0]);
                return dateA - dateB;
            })
            .map(([month, amount]) => ({
                month,
                amount
            }));

        const sortedYearly = Object.entries(yearlyData)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([year, amount]) => ({
                year,
                amount
            }));

        const categories = Object.entries(categoryData)
            .filter(([_, value]) => value > 0)
            .map(([name, value]) => ({
                name,
                value
            }));

        console.log('Processed categories:', categories);
        console.log('Processed monthly data:', sortedMonthly);
        console.log('Processed yearly data:', sortedYearly);

        return {
            categories,
            monthly: sortedMonthly,
            yearly: sortedYearly
        };
    }, [pointsData]);

    const handleExportCSV = () => {
        if (!pointsData.length) return;

        const headers = ['Operation', 'ID', 'Date', 'Purpose', 'Quantity', 'Bonus Points', 'Buy Points', 'Status'];
        const csvContent = [
            headers,
            ...pointsData.map(row => [
                row.operation,
                row.id,
                row.date,
                row.purpose,
                row.quantity,
                row.bonusPoints,
                row.buyPoints,
                row.status
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'jkt48_points_history.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    const columns = [
        { field: 'id', headerName: 'No. Transaction', flex: 1.2 },
        { field: 'date', headerName: 'Date', flex: 1 },
        { field: 'purpose', headerName: 'Purpose', flex: 1.5 },
        { field: 'quantity', headerName: 'Quantity', flex: 0.7 },
        { field: 'bonusPoints', headerName: 'Bonus Points', flex: 1 },
        { field: 'buyPoints', headerName: 'Buy Points', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 0.7 }
    ];

    const rows = pointsData.map(row => ({
        date: row.date,
        purpose: row.purpose,
        quantity: row.quantity,
        bonusPoints: row.bonusPoints,
        buyPoints: row.buyPoints,
        status: row.status,
        id: row.id
    }));

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/')}
                    sx={{ mr: 2 }}
                >
                    Back
                </Button>
                <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
                    JKT48 Points History
                </Typography>
                <Button
                    startIcon={<Refresh />}
                    onClick={loadPointsHistory}
                    sx={{ mr: 1 }}
                >
                    Refresh
                </Button>
                <Button
                    startIcon={<Download />}
                    onClick={handleExportCSV}
                    disabled={!pointsData.length}
                >
                    Export CSV
                </Button>
            </Box>

            {lastUpdate && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                        Last updated: {format(new Date(lastUpdate), 'dd MMM yyyy HH:mm:ss')}
                    </Typography>
                </Box>
            )}

            {!pointsData.length ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                    No points history found. To get started:
                    <Box sx={{ mt: 2 }}>
                        <ol style={{ marginTop: 8, marginBottom: 0 }}>
                            <li>Install the JKT48 Points History Exporter extension</li>
                            <li>Login to <Link href="https://jkt48.com" target="_blank" rel="noopener">JKT48.com</Link></li>
                            <li>Go to <Link href="https://jkt48.com/mypage/point-history?lang=id" target="_blank" rel="noopener">Points History page</Link></li>
                            <li>Click the extension icon and click "Export Points History"</li>
                            <li>The data will automatically appear on this page</li>
                        </ol>
                    </Box>
                </Alert>
            ) : (
                <>
                    <Box sx={{ mb: 3 }}>
                        <Paper sx={{ p: 2 }}>
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                gap: 2
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="h6" sx={{ mr: 2, minWidth: 160 }}>
                                        Current Points:
                                    </Typography>
                                    <Chip 
                                        label={`${calculateCurrentPoints().toLocaleString()} P`}
                                        color="primary"
                                        sx={{ 
                                            fontSize: '1.2rem',
                                            padding: '20px 10px',
                                            backgroundColor: '#ff69b4',
                                            '& .MuiChip-label': { px: 2 }
                                        }}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="h6" sx={{ mr: 2, minWidth: 160 }}>
                                        Total Spend:
                                    </Typography>
                                    <Chip 
                                        label={`${calculateTotalSpend().toLocaleString()} P`}
                                        color="primary"
                                        sx={{ 
                                            fontSize: '1.2rem',
                                            padding: '20px 10px',
                                            backgroundColor: '#4CAF50',
                                            '& .MuiChip-label': { px: 2 }
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Paper>
                    </Box>

                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h6" gutterBottom>
                                    Spending by Category
                                </Typography>
                                <Box sx={{ flex: 1, position: 'relative' }}>
                                    <ResponsiveContainer width="100%" height="85%">
                                        <PieChart>
                                            <Pie
                                                data={chartData.categories}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={120}
                                                label={({ name, value }) => `${name}: ${value.toLocaleString()} P`}
                                                labelLine={true}
                                            >
                                                {chartData.categories.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                formatter={(value) => `${value.toLocaleString()} P`}
                                                labelFormatter={(name) => `Category: ${name}`}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <Box sx={{ 
                                        width: '100%', 
                                        display: 'flex', 
                                        justifyContent: 'center',
                                        mt: 2
                                    }}>
                                        {chartData.categories.map((entry, index) => (
                                            <Box 
                                                key={entry.name}
                                                sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center',
                                                    mx: 1
                                                }}
                                            >
                                                <Box 
                                                    sx={{ 
                                                        width: 10, 
                                                        height: 10, 
                                                        backgroundColor: COLORS[index % COLORS.length],
                                                        mr: 1
                                                    }} 
                                                />
                                                <Typography variant="body2">
                                                    {entry.name}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h6" gutterBottom>
                                    Yearly Spending
                                </Typography>
                                <Box sx={{ flex: 1, position: 'relative' }}>
                                    <ResponsiveContainer width="100%" height="85%">
                                        <BarChart 
                                            data={chartData.yearly}
                                            margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="year" />
                                            <YAxis tickFormatter={(value) => `${(value / 1000)}k`} />
                                            <Tooltip formatter={(value) => `${value.toLocaleString()} P`} />
                                            <Bar 
                                                dataKey="amount" 
                                                name="Points Spent" 
                                                fill="#82ca9d"
                                                label={{ 
                                                    position: 'top',
                                                    formatter: (value) => `${(value / 1000)}k`
                                                }}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h6" gutterBottom>
                                    Monthly Spending
                                </Typography>
                                <Box sx={{ flex: 1, position: 'relative' }}>
                                    <ResponsiveContainer width="100%" height="85%">
                                        <BarChart 
                                            data={chartData.monthly}
                                            margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis tickFormatter={(value) => `${(value / 1000)}k`} />
                                            <Tooltip formatter={(value) => `${value.toLocaleString()} P`} />
                                            <Bar 
                                                dataKey="amount" 
                                                name="Points Spent" 
                                                fill="#8884d8"
                                                label={{ 
                                                    position: 'top',
                                                    formatter: (value) => `${(value / 1000)}k`
                                                }}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={rowsPerPage}
                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                            onPageSizeChange={(newPageSize) => setRowsPerPage(newPageSize)}
                            pagination
                            autoHeight
                            disableSelectionOnClick
                            sx={{
                                '& .MuiDataGrid-cell': {
                                    whiteSpace: 'normal',
                                    lineHeight: 'normal',
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingY: 1
                                },
                                '& .MuiDataGrid-row': {
                                    alignItems: 'center'
                                },
                                '& .MuiTablePagination-root': {
                                    color: 'black'
                                },
                                '& .MuiTablePagination-selectLabel': {
                                    color: 'black'
                                },
                                '& .MuiTablePagination-select': {
                                    color: 'black'
                                },
                                '& .MuiTablePagination-displayedRows': {
                                    color: 'black'
                                },
                                '& .MuiSelect-icon': {
                                    color: 'black'
                                },
                                '& .MuiInputBase-root': {
                                    color: 'black'
                                },
                                '& .MuiTablePagination-menuItem': {
                                    color: 'black'
                                }
                            }}
                        />
                    </Paper>
                </>
            )}
        </Container>
    );
};

export default PointHistory; 