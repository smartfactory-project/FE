import apiClient from './api.js'

export const statisticsAPI = {
  getOverview: async (factory) => {
    const params = factory ? { params: { factory } } : {};
    return (await apiClient.get('/api/statistics/overview', params)).data;
  },
  getLines: async () => (await apiClient.get('/api/statistics/lines')).data
}

export default statisticsAPI
export const getOverview = statisticsAPI.getOverview;
