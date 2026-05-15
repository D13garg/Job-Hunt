import api from './axios'

// ── Auth ──────────────────────────────────────────────────────────────────────
export const signup  = (data)        => api.post('/auth/signup', data)
export const login   = (data)        => api.post('/auth/login', data)
export const logout  = ()            => api.post('/auth/logout')

// ── Jobs ──────────────────────────────────────────────────────────────────────
export const getAllJobs   = (params)  => api.get('/jobs', { params })
export const getJobById  = (id)      => api.get(`/jobs/${id}`)
export const getMyJobs   = ()        => api.get('/jobs/recruiter/my-jobs')
export const createJob   = (data)    => api.post('/jobs', data)
export const updateJob   = (id, data)=> api.put(`/jobs/${id}`, data)
export const deleteJob   = (id)      => api.delete(`/jobs/${id}`)

// ── Applications ──────────────────────────────────────────────────────────────
export const applyToJob             = (jobId, data)          => api.post(`/applications/${jobId}`, data)
export const getMyApplications      = ()                     => api.get('/applications/my/applications')
export const withdrawApplication    = (appId)                => api.delete(`/applications/${appId}/withdraw`)
export const getApplicationsForJob  = (jobId, params)        => api.get(`/applications/job/${jobId}`, { params })
export const updateApplicationStatus= (appId, data)          => api.put(`/applications/${appId}/status`, data)

// ── Bookmarks ─────────────────────────────────────────────────────────────────
export const addBookmark    = (jobId) => api.post(`/bookmarks/${jobId}`)
export const getBookmarks   = ()      => api.get('/bookmarks')
export const removeBookmark = (jobId) => api.delete(`/bookmarks/${jobId}`)

// ── Admin ─────────────────────────────────────────────────────────────────────
export const getAdminStats   = ()           => api.get('/admin/stats')
export const getAllUsers      = (params)     => api.get('/admin/users', { params })
export const toggleBlacklist = (userId)     => api.put(`/admin/users/${userId}/blacklist`)
export const getAllJobsAdmin  = ()           => api.get('/admin/jobs')
export const adminUpdateJob  = (id, data)   => api.put(`/admin/jobs/${id}`, data)
export const adminDeleteJob  = (id)         => api.delete(`/admin/jobs/${id}`)
