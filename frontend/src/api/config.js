// API configuration
export const API_BASE_URL = 'http://192.168.250.114:3001/api';

export const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred while processing your request'
    }));
    
    // Handle rate limit exceeded with specific message
    if (response.status === 429) {
      const resetTime = error.reset ? new Date(error.reset) : null;
      // Use the backend's detailed message if available
      if (error.message) {
        throw new Error(error.message);
      }
      // Fallback message if backend doesn't provide one
      const limitType = error.limit_type === 'rpm' ? 'per minute' : 'per day';
      const resetMessage = resetTime ? 
        ` Limit resets ${formatResetTime(resetTime)}.` : 
        ' Please try again later.';
      throw new Error(`Rate limit exceeded (${error.limit || ''} requests ${limitType}).${resetMessage}`);
    }
    
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const createApiRequest = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error(`API request failed: ${error.message}`);
  }
};

// Helper function to format reset time message
const formatResetTime = (resetTime) => {
  const now = new Date();
  const reset = new Date(resetTime);
  const diffMinutes = Math.ceil((reset - now) / (1000 * 60));
  
  if (diffMinutes < 60) {
    return `in ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
  } else {
    const diffHours = Math.ceil(diffMinutes / 60);
    return `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  }
};
