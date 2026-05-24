import { useQuery } from '@tanstack/react-query';

import { commonService } from '../services/common.service';

export function useCategories() {
  return useQuery({
    queryKey: ['shared', 'categories'],
    queryFn: () => commonService.getCategories(),
    staleTime: 1000 * 60 * 15, // 15 min — catálogos de referencia, cambian poco
  });
}
