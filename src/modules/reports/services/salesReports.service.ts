import { reportHttpClient } from '@/services/http';

import type { BestSellersFilters, SalesReportFilters, SalesReportItem } from '../types/salesReport.types';

// ---------------------------------------------------------------------------
// Sales reports service — both endpoints use POST multipart/form-data.
// Uses reportHttpClient (120s timeout) because report queries can be slow.
//
// Do NOT set Content-Type manually — React Native's XMLHttpRequest sets it
// automatically with the correct multipart boundary when sending FormData.
// Manual override strips the boundary and causes 422 on every request.
// ---------------------------------------------------------------------------

function buildSalesFormData(filters: SalesReportFilters): FormData {
  const form = new FormData();

  form.append('fecha_inicio', filters.fecha_inicio);

  if (filters.fecha_fin) {
    form.append('fecha_fin', filters.fecha_fin);
  }

  if (filters.sucursal !== undefined) {
    form.append('sucursal', String(filters.sucursal));
  }

  return form;
}

export const salesReportsService = {
  /**
   * Fetches the general sales report for a date range.
   * NOT paginated — server returns all records at once.
   * Requires: fecha_inicio. Optional: fecha_fin, sucursal.
   */
  async getGeneralReport(filters: SalesReportFilters): Promise<SalesReportItem[]> {
    const form = buildSalesFormData(filters);

    const response = await reportHttpClient.post<SalesReportItem[]>(
      '/sales/reports/general',
      form,
      { timeout: 120_000 },
    );

    return response.data;
  },

  /**
   * Fetches the best-sellers report — top N products by total sales.
   * NOT paginated — server returns all records at once.
   * Requires: fecha_inicio, ranking. Optional: fecha_fin, sucursal.
   */
  async getBestSellers(filters: BestSellersFilters): Promise<SalesReportItem[]> {
    const form = buildSalesFormData(filters);

    // ranking is always required for this endpoint — encoded as string
    form.append('ranking', String(filters.ranking));

    const response = await reportHttpClient.post<SalesReportItem[]>(
      '/sales/reports/masvendido',
      form,
      { timeout: 120_000 },
    );

    return response.data;
  },
};
