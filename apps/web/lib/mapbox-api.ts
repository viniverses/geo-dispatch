import axios from 'axios';

import { MAPBOX_BASE_URL } from '@/config/mapbox';

export const mapboxApi = axios.create({
  baseURL: MAPBOX_BASE_URL,
  params: {
    access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  },
});
