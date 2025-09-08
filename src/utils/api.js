// API utility functions for making authenticated requests and managing user data

// Base API URL
const API_BASE_URL = 'http://localhost:5000/api'

/**
 * Get authentication headers from localStorage
 * @returns {Object} Headers object with auth data
 */
export function getAuthHeaders() {
  const authHeaders = localStorage.getItem('authHeaders')
  if (!authHeaders) {
    return {}
  }
  
  try {
    const { token, _id, userRole, userEmail } = JSON.parse(authHeaders)
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'id': _id,
      'user_role': userRole,
      'user_email': userEmail
    }
  } catch (error) {
    console.error('Error parsing auth headers:', error)
    return {}
  }
}

/**
 * Make an authenticated API request
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise} Fetch response
 */
export async function authenticatedFetch(url, options = {}) {
  const authHeaders = getAuthHeaders()
  
  // Merge auth headers with existing headers
  const headers = {
    ...authHeaders,
    ...options.headers
  }
  
  const response = await fetch(url, {
    ...options,
    headers
  })
  
  // Handle 401 Unauthorized responses
  if (response.status === 401) {
    console.log('Unauthorized access, clearing auth data')
    clearAuth()
    window.location.href = '/login'
    return response
  }
  
  return response
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid auth data
 */
export function isAuthenticated() {
  const authHeaders = localStorage.getItem('authHeaders')
  const authToken = localStorage.getItem('authToken')
  return !!(authHeaders && authToken)
}

/**
 * Get current user data
 * @returns {Object|null} User data or null
 */
export function getCurrentUser() {
  const userData = localStorage.getItem('userData')
  if (!userData) return null
  
  try {
    return JSON.parse(userData)
  } catch (error) {
    console.error('Error parsing user data:', error)
    return null
  }
}

/**
 * Clear all authentication and user data from localStorage
 */
export function clearAuth() {
  localStorage.removeItem('authToken')
  localStorage.removeItem('userData')
  localStorage.removeItem('authHeaders')
  // Don't clear profile data - it should persist across logins
  // localStorage.removeItem('freelancer_profile_completed')
  // localStorage.removeItem('client_profile_completed')
  // localStorage.removeItem('freelancer_profile_data')
  // localStorage.removeItem('client_profile_data')
  // localStorage.removeItem('freelancer_profile_id')
  // localStorage.removeItem('client_profile_id')
}

/**
 * Clear all data including profile data (use only on actual logout)
 */
export function clearAllData() {
  localStorage.removeItem('authToken')
  localStorage.removeItem('userData')
  localStorage.removeItem('authHeaders')
  localStorage.removeItem('freelancer_profile_completed')
  localStorage.removeItem('client_profile_completed')
  localStorage.removeItem('freelancer_profile_data')
  localStorage.removeItem('client_profile_data')
  localStorage.removeItem('freelancer_profile_id')
  localStorage.removeItem('client_profile_id')
  localStorage.removeItem('freelancer_personId')
  localStorage.removeItem('client_personId')
  localStorage.removeItem('current_user_id')
}

/**
 * Store authentication data in localStorage
 * @param {Object} authData - Authentication data
 */
export function storeAuthData(authData) {
  const { token, user } = authData
  
  // Store individual items
  localStorage.setItem('authToken', token)
  localStorage.setItem('userData', JSON.stringify(user))
  
  // Store auth headers for API calls
  const authHeaders = {
    token,
    _id: user._id,
    userRole: user.user_type,
    userEmail: user.email
  }
  localStorage.setItem('authHeaders', JSON.stringify(authHeaders))
}

// ============================================================================
// AUTHENTICATION API FUNCTIONS
// ============================================================================

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @returns {Promise} Login response
 */
export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
  
  const data = await response.json()
  
  if (response.ok) {
    storeAuthData(data)
  }
  
  return { response, data }
}

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Registration response
 */
export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  
  const data = await response.json()
  return { response, data }
}

// ============================================================================
// FREELANCER API FUNCTIONS
// ============================================================================

/**
 * Create freelancer profile
 * @param {Object} profileData - Freelancer profile data
 * @returns {Promise} Create response
 */
export async function createFreelancerProfile(profileData) {
  const response = await authenticatedFetch(`${API_BASE_URL}/freelancer/info`, {
    method: 'POST',
    body: JSON.stringify(profileData)
  })
  
  const data = await response.json()
  return { response, data }
}

/**
 * Update freelancer profile
 * @param {Object} profileData - Updated freelancer profile data
 * @returns {Promise} Update response
 */
export async function updateFreelancerProfile(profileData) {
  const response = await authenticatedFetch(`${API_BASE_URL}/freelancer/info/update`, {
    method: 'POST',
    body: JSON.stringify(profileData)
  })
  
  const data = await response.json()
  return { response, data }
}

/**
 * Check if freelancer profile exists
 * @param {string} userId - User ID (personId from tblpersonmaster)
 * @returns {Promise<boolean>} True if profile exists
 */
export async function checkFreelancerProfileExists(userId) {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/freelancer/info/update`, {
      method: 'POST',
      body: JSON.stringify({ personId: userId })
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.data && data.data.personId // Check if personId matches
    }
    return false
  } catch (error) {
    console.error('Error checking freelancer profile:', error)
    return false
  }
}

// ============================================================================
// CLIENT API FUNCTIONS
// ============================================================================

/**
 * Create client profile
 * @param {Object} profileData - Client profile data
 * @returns {Promise} Create response
 */
export async function createClientProfile(profileData) {
  const response = await authenticatedFetch(`${API_BASE_URL}/client/info`, {
    method: 'POST',
    body: JSON.stringify(profileData)
  })
  
  const data = await response.json()
  return { response, data }
}

/**
 * Update client profile
 * @param {Object} profileData - Updated client profile data
 * @returns {Promise} Update response
 */
export async function updateClientProfile(profileData) {
  const response = await authenticatedFetch(`${API_BASE_URL}/client/info/update`, {
    method: 'POST',
    body: JSON.stringify(profileData)
  })
  
  const data = await response.json()
  return { response, data }
}

/**
 * Check if client profile exists
 * @param {string} userId - User ID (personId from tblpersonmaster)
 * @returns {Promise<boolean>} True if profile exists
 */
export async function checkClientProfileExists(userId) {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/client/info/update`, {
      method: 'POST',
      body: JSON.stringify({ personId: userId })
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.data && data.data.personId // Check if personId matches
    }
    return false
  } catch (error) {
    console.error('Error checking client profile:', error)
    return false
  }
}

// ============================================================================
// SKILLS API FUNCTIONS
// ============================================================================

/**
 * Get all skills
 * @returns {Promise} Skills response
 */
export async function getSkills() {
  const response = await fetch(`${API_BASE_URL}/skills`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  const data = await response.json()
  return { response, data }
}

// ============================================================================
// PROJECT API FUNCTIONS
// ============================================================================

/**
 * Create new project
 * @param {Object} projectData - Project data
 * @returns {Promise} Create response
 */
export async function createProject(projectData) {
  const response = await authenticatedFetch(`${API_BASE_URL}/project/create`, {
    method: 'POST',
    body: JSON.stringify(projectData)
  })
  
  const data = await response.json()
  return { response, data }
}

/**
 * Get projects list
 * @param {Object} filters - Project filters
 * @returns {Promise} Projects response
 */
export async function getProjects(filters = {}) {
  const response = await authenticatedFetch(`${API_BASE_URL}/project/list`, {
    method: 'POST',
    body: JSON.stringify(filters)
  })
  
  const data = await response.json()
  return { response, data }
}

/**
 * Get freelancers list
 * @param {Object} filters - Freelancer filters
 * @returns {Promise} Freelancers response
 */
export async function getFreelancers(filters = {}) {
  const response = await authenticatedFetch(`${API_BASE_URL}/freelancer/list`, {
    method: 'POST',
    body: JSON.stringify(filters)
  })
  
  const data = await response.json()
  return { response, data }
}

/**
 * Update project
 * @param {Object} projectData - Updated project data
 * @returns {Promise} Update response
 */
export async function updateProject(projectData) {
  const response = await authenticatedFetch(`${API_BASE_URL}/project/update`, {
    method: 'POST',
    body: JSON.stringify(projectData)
  })
  
  const data = await response.json()
  return { response, data }
}

/**
 * Delete project
 * @param {string} projectId - Project ID
 * @returns {Promise} Delete response
 */
export async function deleteProject(projectId) {
  const response = await authenticatedFetch(`${API_BASE_URL}/project/delete`, {
    method: 'POST',
    body: JSON.stringify({ id: projectId })
  })
  
  const data = await response.json()
  return { response, data }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Handle API errors
 * @param {Response} response - Fetch response
 * @param {Object} data - Response data
 * @returns {Object} Error object
 */
export function handleApiError(response, data) {
  if (!response.ok) {
    return {
      error: true,
      message: data.message || 'An error occurred',
      status: response.status
    }
  }
  return { error: false }
}

/**
 * Get user type from localStorage
 * @returns {string|null} User type or null
 */
export function getUserType() {
  const user = getCurrentUser()
  return user ? user.user_type : null
}

/**
 * Check if user is freelancer
 * @returns {boolean} True if user is freelancer
 */
export function isFreelancer() {
  return getUserType() === 'freelancer'
}

/**
 * Check if user is client
 * @returns {boolean} True if user is client
 */
export function isClient() {
  return getUserType() === 'client'
}

/**
 * Get profile data from localStorage
 * @param {string} userType - User type ('freelancer' or 'client')
 * @returns {Object|null} Profile data or null
 */
export function getProfileData(userType) {
  const profileData = localStorage.getItem(`${userType}_profile_data`)
  if (!profileData) return null
  
  try {
    return JSON.parse(profileData)
  } catch (error) {
    console.error('Error parsing profile data:', error)
    return null
  }
}

/**
 * Store profile data in localStorage
 * @param {string} userType - User type ('freelancer' or 'client')
 * @param {Object} profileData - Profile data
 */
export function storeProfileData(userType, profileData) {
  localStorage.setItem(`${userType}_profile_data`, JSON.stringify(profileData))
  localStorage.setItem(`${userType}_profile_completed`, 'true')
  if (profileData._id) {
    localStorage.setItem(`${userType}_profile_id`, profileData._id)
  }
}

/**
 * Check if profile is completed
 * @param {string} userType - User type ('freelancer' or 'client')
 * @returns {boolean} True if profile is completed
 */
export function isProfileCompleted(userType) {
  const completed = localStorage.getItem(`${userType}_profile_completed`)
  const profileData = localStorage.getItem(`${userType}_profile_data`)
  return completed === 'true' && !!profileData
}

/**
 * Get API base URL
 * @returns {string} API base URL
 */
export function getApiBaseUrl() {
  return API_BASE_URL
}

/**
 * Make a simple GET request
 * @param {string} endpoint - API endpoint
 * @returns {Promise} Response
 */
export async function apiGet(endpoint) {
  const response = await authenticatedFetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET'
  })
  
  const data = await response.json()
  return { response, data }
}

/**
 * Make a simple POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request data
 * @returns {Promise} Response
 */
export async function apiPost(endpoint, data) {
  const response = await authenticatedFetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  
  const responseData = await response.json()
  return { response, data: responseData }
}

/**
 * Make a simple PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request data
 * @returns {Promise} Response
 */
export async function apiPut(endpoint, data) {
  const response = await authenticatedFetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  
  const responseData = await response.json()
  return { response, data: responseData }
}

/**
 * Make a simple DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise} Response
 */
export async function apiDelete(endpoint) {
  const response = await authenticatedFetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE'
  })
  
  const data = await response.json()
  return { response, data }
}