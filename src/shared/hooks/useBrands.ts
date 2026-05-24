import { useQuery } from '@tanstack/react-query';

import { commonService } from '../services/common.service';

export function useBrands() {
  return useQuery({
    queryKey: ['shared', 'brands'],
    queryFn: () => commonService.getBrands(),
    staleTime: 1000 * 60 * 15,
  });
}
