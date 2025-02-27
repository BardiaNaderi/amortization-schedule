import axios from 'axios';

export class FederalReserveService {
  private readonly baseUrl = 'https://api.stlouisfed.org/fred/series/observations';
  
  async getPrimeRate(): Promise<number> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          series_id: 'DPRIME',
          api_key: process.env.FRED_API_KEY,
          file_type: 'json',
          sort_order: 'desc',
          limit: 1
        }
      });

      return parseFloat(response.data.observations[0].value);
    } catch (error) {
      console.error('Error fetching prime rate:', error);
      throw new Error('Failed to fetch prime rate');
    }
  }
} 