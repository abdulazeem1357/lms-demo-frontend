import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts';

// Services
import { getEngagementStats } from '../../../../services/analytics';

// Components
import Spinner from '../../../common/Spinner/Spinner';
import StateDisplay from '../../../common/StateDisplay/StateDisplay';

// Types
import { IEngagementDataPoint, IEngagementStatsParams } from '../../../../types/analytics.types';
import { useAuth } from '../../../../contexts/AuthContext';

// Types for props
export interface EngagementChartProps {
  courseId?: string;
  period?: 'daily' | 'weekly' | 'monthly';
  dateRange?: '7days' | '30days' | '90days';
  className?: string;
}

type MetricType = 'overallEngagement' | 'activeTime' | 'resourcesAccessed' | 'activityCompletion';

/**
 * Component that displays student engagement data as a line chart
 */
const EngagementChart: React.FC<EngagementChartProps> = ({ 
  courseId,
  period = 'daily',
  dateRange = '30days',
  className = ''
}) => {
  const { user } = useAuth();
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('overallEngagement');
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  
  // Calculate date range based on dateRange prop
  const dateParams = useMemo(() => {
    const endDate = new Date();
    let startDate;
    
    switch (dateRange) {
      case '7days':
        startDate = subDays(endDate, 7);
        break;
      case '90days':
        startDate = subDays(endDate, 90);
        break;
      case '30days':
      default:
        startDate = subDays(endDate, 30);
    }
    
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
  }, [dateRange]);
  
  // Query params for fetching engagement data
  const queryParams: IEngagementStatsParams = useMemo(() => ({
    userId: user?.id,
    courseId,
    period,
    ...dateParams
  }), [user?.id, courseId, period, dateParams]);
  
  // Fetch engagement data
  const {
    data: engagementStats,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['engagementStats', queryParams],
    queryFn: () => getEngagementStats(queryParams),
    enabled: !!user?.id,
  });

  // Format the data for the chart by including formatted dates for display
  const chartData = useMemo(() => {
    if (!engagementStats) return [];

    return engagementStats.metrics[selectedMetric].map((dataPoint: IEngagementDataPoint) => {
      const date = new Date(dataPoint.timestamp);
      return {
        ...dataPoint,
        formattedDate: format(date, period === 'daily' ? 'MMM d' : period === 'weekly' ? 'MMM d' : 'MMM'),
      };
    });
  }, [engagementStats, selectedMetric, period]);

  // Metric buttons for switching between different engagement metrics
  const renderMetricButtons = () => {
    const metrics = [
      { id: 'overallEngagement', label: 'Overall' },
      { id: 'activeTime', label: 'Active Time' },
      { id: 'resourcesAccessed', label: 'Resources' },
      { id: 'activityCompletion', label: 'Activities' }
    ];
    
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {metrics.map((metric) => (
          <button
            key={metric.id}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors
              ${selectedMetric === metric.id 
                ? 'bg-primary-500 text-white' 
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
            onClick={() => setSelectedMetric(metric.id as MetricType)}
          >
            {metric.label}
          </button>
        ))}
      </div>
    );
  };

  // Chart type toggle
  const renderChartTypeToggle = () => {
    return (
      <div className="flex items-center space-x-4 mb-4">
        <span className="text-sm text-neutral-500">Chart Type:</span>
        <button
          className={`text-sm px-2 py-1 rounded ${chartType === 'line' ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-600'}`}
          onClick={() => setChartType('line')}
        >
          Line
        </button>
        <button
          className={`text-sm px-2 py-1 rounded ${chartType === 'area' ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-600'}`}
          onClick={() => setChartType('area')}
        >
          Area
        </button>
      </div>
    );
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className={`${className} h-80`}>
        <div className="flex justify-center items-center h-full">
          <Spinner size="lg" label="Loading engagement data..." />
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className={`${className}`}>
        <StateDisplay 
          type="error"
          title="Failed to load engagement data"
          message={error instanceof Error ? error.message : 'An error occurred while fetching data'}
          actionButton={
            <button 
              className="mt-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          }
        />
      </div>
    );
  }

  // Empty state when no data is available
  if (!chartData.length) {
    return (
      <div className={`${className}`}>
        <StateDisplay 
          type="empty"
          title="No engagement data"
          message="There is no engagement data available for this period."
        />
      </div>
    );
  }

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-neutral-200 shadow-md rounded-md">
          <p className="font-medium text-neutral-800">{payload[0].payload.formattedDate}</p>
          <p className="text-sm text-primary-600">
            <span className="font-medium">Value: </span>
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // Get appropriate chart title based on selected metric
  const getChartTitle = () => {
    switch (selectedMetric) {
      case 'overallEngagement': return 'Overall Engagement';
      case 'activeTime': return 'Active Learning Time';
      case 'resourcesAccessed': return 'Resources Accessed';
      case 'activityCompletion': return 'Activity Completion';
      default: return 'Engagement Metrics';
    }
  };

  // Main chart render
  return (
    <div className={className}>
      <div className="flex flex-col mb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
          <h3 className="text-lg font-medium text-neutral-800 mb-2 sm:mb-0">{getChartTitle()}</h3>
          <div className="flex items-center space-x-2">
            {renderChartTypeToggle()}
          </div>
        </div>
        {renderMetricButtons()}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                width={30}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              <Line
                name={selectedMetric === 'overallEngagement' ? 'Overall Engagement' : 
                      selectedMetric === 'activeTime' ? 'Active Time' :
                      selectedMetric === 'resourcesAccessed' ? 'Resources Accessed' : 'Activity Completion'}
                type="monotone"
                dataKey="value"
                stroke="#f97316" // primary-500
                strokeWidth={2}
                activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2, fill: '#fff' }}
              />
            </LineChart>
          ) : (
            <ComposedChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                width={30}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              <Area
                name={selectedMetric === 'overallEngagement' ? 'Overall Engagement' : 
                      selectedMetric === 'activeTime' ? 'Active Time' :
                      selectedMetric === 'resourcesAccessed' ? 'Resources Accessed' : 'Activity Completion'}
                type="monotone"
                dataKey="value"
                fill="#ffedd5" // primary-100
                stroke="#f97316" // primary-500
                fillOpacity={0.8}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#f97316" // primary-500
                dot={{ stroke: '#f97316', strokeWidth: 2, fill: '#fff' }}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EngagementChart;