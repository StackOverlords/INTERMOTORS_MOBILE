import { useQuery } from '@tanstack/react-query';

import { salesReportsService } from '../services/salesReports.service';
import type { BestSellersFilters } from '../types/salesReport.types';

// ---------------------------------------------------------------------------
// useBestSellers — on-submit query for POST /sales/reports/masvendido.
//
// Separate cache key from useSalesReport (queryKey uses 'best-sellers').
// The query does NOT fire on mount. Pass null to keep it disabled.
// Requires ranking >= 1 in the filters object.
// ---------------------------------------------------------------------------
export function useBestSellers(filters: BestSellersFilters | null) {
  return useQuery({
    queryKey: ['best-sellers', filters],
    queryFn: () => salesReportsService.getBestSellers(filters!),
    enabled: filters !== null,
  });
}
