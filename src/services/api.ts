import { mockApi } from '@/mocks/generateMockData';

let api = mockApi();

export function resetApi() {
  api = mockApi();
}

export default api;