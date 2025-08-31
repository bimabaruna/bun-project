import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, TrendingUp, DollarSign, Users, Package } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';

const chartConfig = {
  orders: {
    label: 'Orders',
    color: 'hsl(var(--primary))',
  },
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--accent))',
  },
  cashier: {
    label: 'Cashier Performance',
    color: 'hsl(var(--pos-secondary))',
  },
  products: {
    label: 'Top Products',
    color: 'hsl(var(--warning))',
  },
};

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--warning))',
  'hsl(var(--pos-secondary))',
  'hsl(var(--destructive))',
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });

  const {
    ordersPerDay,
    ordersEachDay,
    revenuePerDay,
    revenueEachDay,
    salesByCashier,
    mostSoldProducts,
    loading,
    error,
    fetchAnalytics
  } = useAnalytics();

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleFetchData = () => {
    if (dateRange?.from && dateRange?.to) {
      fetchAnalytics({
        startDate: format(dateRange.from, 'yyyy-MM-dd'),
        endDate: format(dateRange.to, 'yyyy-MM-dd'),
      });
    }
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              Error loading analytics: {error}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <DatePickerWithRange date={dateRange} onDateChange={handleDateChange} />
          <Button onClick={handleFetchData} disabled={loading}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {loading ? 'Loading...' : 'Update Data'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className='transition-all duration-200 hover:scale-105 hover:shadow-medium'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {ordersPerDay.reduce((sum, item) => sum + item.orderCount, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Total orders in period</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className='transition-all duration-200 hover:scale-105 hover:shadow-medium'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(revenuePerDay.reduce((sum, item) => sum + item.totalRevenue, 0))}
                </div>
                <p className="text-xs text-muted-foreground">Total revenue in period</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className='transition-all duration-200 hover:scale-105 hover:shadow-medium'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cashiers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-8" />
            ) : (
              <>
                <div className="text-2xl font-bold">{salesByCashier.length}</div>
                <p className="text-xs text-muted-foreground">Cashiers with sales</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className='transition-all duration-200 hover:scale-105 hover:shadow-medium'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-8" />
            ) : (
              <>
                <div className="text-2xl font-bold">{mostSoldProducts.length}</div>
                <p className="text-xs text-muted-foreground">Best selling items</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="flex flex-col gap-6">
        {/* Orders Per Day Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Orders</CardTitle>
            <CardDescription>Order volume over time</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ordersEachDay}>
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => format(new Date(value), 'MM/dd')}
                      style={{ fontSize: '10px' }}
                    />
                    <YAxis style={{ fontSize: '10px' }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="orderCount" fill="hsl(var(--primary))" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Revenue Per Day Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Revenue</CardTitle>
            <CardDescription>Revenue trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueEachDay}>
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => format(new Date(value), 'MM/dd')}
                      style={{ fontSize: '10px' }}
                    />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} style={{ fontSize: '10px' }} />
                    <ChartTooltip
                      content={<ChartTooltipContent
                        formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                      />}
                    />
                    <Line
                      type="monotone"
                      dataKey="totalRevenue"
                      stroke="hsl(var(--accent))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Sales by Cashier Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Cashier Performance</CardTitle>
            <CardDescription>Revenue by cashier</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesByCashier} layout="horizontal">
                    <XAxis type="category" dataKey="cashierName" width={80} style={{ fontSize: '10px' }} />
                    <YAxis type="number" tickFormatter={(value) => formatCurrency(value)} style={{ fontSize: '10px' }} />
                    <ChartTooltip
                      content={<ChartTooltipContent
                        formatter={(value) => [formatCurrency(Number(value)), ' Revenue']}
                      />}
                    />
                    <Bar dataKey="totalRevenue" fill="hsl(var(--pos-secondary))" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Most Sold Products Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Best Selling Products</CardTitle>
            <CardDescription>Top products by quantity sold</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mostSoldProducts}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="totalQuantitySold"
                      nameKey="productName"
                    >
                      {mostSoldProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}