import { 
  IEngagementStats, 
  IEngagementStatsParams 
} from '../types/analytics.types';
import { subDays, differenceInDays, eachDayOfInterval, eachWeekOfInterval, format, parseISO } from 'date-fns';

// Generate a series of data points for a given date range
function generateTimeSeriesData(
  baseValue: number, 
  variance: number, 
  startDate: Date, 
  endDate: Date, 
  period: 'daily' | 'weekly' | 'monthly'
): { timestamp: string; value: number }[] {
  const data = [];
  
  // Handle different periods
  if (period === 'daily') {
    // Generate daily data points
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    days.forEach((date) => {
      // Create random value with specified base and variance
      const randomVariance = (Math.random() * 2 - 1) * variance;
      const value = Math.min(100, Math.max(0, baseValue + randomVariance));
      
      data.push({
        timestamp: date.toISOString(),
        value: Math.round(value)
      });
    });
  } else if (period === 'weekly') {
    // Generate weekly data points
    const weeks = eachWeekOfInterval({ start: startDate, end: endDate });
    
    weeks.forEach((date) => {
      // Create random value with specified base and variance
      const randomVariance = (Math.random() * 2 - 1) * variance;
      const value = Math.min(100, Math.max(0, baseValue + randomVariance));
      
      data.push({
        timestamp: date.toISOString(),
        value: Math.round(value)
      });
    });
  } else {
    // Monthly data - simplify by using first day of each month in range
    const months = new Set();
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const monthKey = format(currentDate, 'yyyy-MM');
      if (!months.has(monthKey)) {
        months.add(monthKey);
        
        // Create random value with specified base and variance
        const randomVariance = (Math.random() * 2 - 1) * variance;
        const value = Math.min(100, Math.max(0, baseValue + randomVariance));
        
        data.push({
          timestamp: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString(),
          value: Math.round(value)
        });
      }
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }
  
  return data;
}

// Helper to calculate average value from data points
function calculateAverage(dataPoints: { value: number }[]): number {
  if (!dataPoints.length) return 0;
  const sum = dataPoints.reduce((acc, point) => acc + point.value, 0);
  return Math.round(sum / dataPoints.length);
}

/**
 * Mock implementation of getEngagementStats
 * @param params - Optional parameters for filtering data
 * @returns Promise resolving to mock engagement statistics
 */
export async function getEngagementStats(params?: IEngagementStatsParams): Promise<IEngagementStats> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Default date range if not specified
  const endDate = params?.endDate ? new Date(params.endDate) : new Date();
  const startDate = params?.startDate ? new Date(params.startDate) : subDays(endDate, 30);
  const period = params?.period || 'daily';
  
  // Adjust base values based on course/user - for demonstration only
  const courseSpecificOffset = params?.courseId ? 
    (parseInt(params.courseId.replace(/\D/g, '') || '0', 10) % 20) - 10 : 0;
    
  // Create mock data with different base levels and variance
  const activeTimeData = generateTimeSeriesData(70 + courseSpecificOffset, 15, startDate, endDate, period);
  const resourcesAccessedData = generateTimeSeriesData(65 + courseSpecificOffset, 20, startDate, endDate, period);
  const activityCompletionData = generateTimeSeriesData(80 + courseSpecificOffset, 10, startDate, endDate, period);
  
  // Overall engagement is a weighted average of the other metrics
  const overallEngagementData = activeTimeData.map((point, index) => {
    const activeValue = point.value;
    const resourcesValue = resourcesAccessedData[index]?.value || 0;
    const activityValue = activityCompletionData[index]?.value || 0;
    
    // Weighted average: 30% active time, 30% resources, 40% activities
    const weightedValue = (activeValue * 0.3) + (resourcesValue * 0.3) + (activityValue * 0.4);
    
    return {
      timestamp: point.timestamp,
      value: Math.round(weightedValue)
    };
  });
  
  // Calculate summary metrics (averages)
  const summary = {
    activeTime: calculateAverage(activeTimeData),
    resourcesAccessed: calculateAverage(resourcesAccessedData),
    activityCompletion: calculateAverage(activityCompletionData),
    overallEngagement: calculateAverage(overallEngagementData)
  };
  
  const mockData: IEngagementStats = {
    userId: params?.userId || 'user-1',
    courseId: params?.courseId,
    period: period,
    metrics: {
      activeTime: activeTimeData,
      resourcesAccessed: resourcesAccessedData,
      activityCompletion: activityCompletionData,
      overallEngagement: overallEngagementData
    },
    summary
  };
  
  return mockData;
}