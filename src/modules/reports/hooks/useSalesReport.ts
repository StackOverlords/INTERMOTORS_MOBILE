import { useQuery } from '@tanstack/react-query';

import { salesReportsService } from '../services/salesReports.service';
import type { SalesReportFilters } from '../types/salesReport.types';

// ---------------------------------------------------------------------------
// useSalesReport — on-submit query for POST /sales/reports/general.
//
// The query does NOT fire on mount. Pass null to keep it disabled.
// Call setSubmittedFilters(filters) on "Aplicar" to trigger the request.
//
// Returns the standard react-query shape: { data, isLoading, isError, error }
// ---------------------------------------------------------------------------
export function useSalesReport(filters: SalesReportFilters | null) {
  return useQuery({
    queryKey: ['sales-report', filters],
    queryFn: () => salesReportsService.getGeneralReport(filters!),
    enabled: filters !== null,
  });
}
