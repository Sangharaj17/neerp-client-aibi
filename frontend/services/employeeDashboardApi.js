import axiosInstance from '@/utils/axiosInstance';

// Get top employees by activity count within a date range
export const getTopEmployeesByActivity = async (startDate, endDate) => {
    try {
        const response = await axiosInstance.get('/api/employee-dashboard/top-activity-employees', {
            params: { startDate, endDate }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching top employees by activity:', error);
        throw error;
    }
};

// Get yearly monthly activity data for the last 12 months
export const getYearlyActivityData = async () => {
    try {
        const response = await axiosInstance.get('/api/employee-dashboard/yearly-activity');
        return response.data;
    } catch (error) {
        console.error('Error fetching yearly activity data:', error);
        throw error;
    }
};

// Get employee activities counts
export const getEmployeeActivitiesCounts = async (fromDate, toDate) => {
    try {
        const response = await axiosInstance.get('/api/employee-dashboard/employee/activities-counts', {
            params: { fromDate, toDate }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching employee activities counts:', error);
        throw error;
    }
};

// Get detailed activities for Initial Jobs
export const getActivities = async (from, to, empId, type) => {
    try {
        const response = await axiosInstance.get('/api/employee-dashboard/employeeDetails/activities/by/empId/JobActivityType/InititalJob', {
            params: { from, to, empId, type }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching initial job activities:', error);
        throw error;
    }
};

// Get detailed activities for Renewal Jobs
export const getRenewalJobActivities = async (from, to, empId, type) => {
    try {
        const response = await axiosInstance.get('/api/employee-dashboard/employeeDetails/activities/by/empId/JobActivityType/RenewalJob', {
            params: { from, to, empId, type }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching renewal job activities:', error);
        throw error;
    }
};
