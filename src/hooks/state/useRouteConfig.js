import { useState, useEffect, useCallback } from 'react';
import { ROUTES_BY_PSM as STATIC_ROUTES_BY_PSM } from '../../config/routeConfig.js';
import { ROUTE_TO_PROVINCE as STATIC_ROUTE_TO_PROVINCE, OPERATOR_TO_PROVINCES as STATIC_OPERATOR_TO_PROVINCES } from '../../config/provinceConfig.js';
import { getActiveRoutes, seedRoutesIfEmpty } from '../../services/routeConfigService.js';

const buildMapsFromRows = (rows) => {
  const routesByPsm = { FIBRASOL: [], ISISTEL: [], ANGLOBAL: [] };
  const routeToProvince = {};

  rows.forEach(({ psm, route_name, province }) => {
    if (routesByPsm[psm]) routesByPsm[psm].push(route_name);
    routeToProvince[route_name] = province;
  });

  const operatorToProvinces = {};
  Object.entries(routeToProvince).forEach(([route, province]) => {
    const psm = rows.find(r => r.route_name === route)?.psm;
    if (!psm) return;
    if (!operatorToProvinces[psm]) operatorToProvinces[psm] = [];
    if (!operatorToProvinces[psm].includes(province)) {
      operatorToProvinces[psm].push(province);
    }
  });

  return { routesByPsm, routeToProvince, operatorToProvinces };
};

export const useRouteConfig = () => {
  const [routesByPsm, setRoutesByPsm] = useState(STATIC_ROUTES_BY_PSM);
  const [routeToProvince, setRouteToProvince] = useState(STATIC_ROUTE_TO_PROVINCE);
  const [operatorToProvinces, setOperatorToProvinces] = useState(STATIC_OPERATOR_TO_PROVINCES);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      await seedRoutesIfEmpty(STATIC_ROUTES_BY_PSM, STATIC_ROUTE_TO_PROVINCE);
      const { data, error } = await getActiveRoutes();
      if (error || !data || data.length === 0) throw new Error('empty');
      const maps = buildMapsFromRows(data);
      setRoutesByPsm(maps.routesByPsm);
      setRouteToProvince(maps.routeToProvince);
      setOperatorToProvinces(maps.operatorToProvinces);
    } catch {
      setRoutesByPsm(STATIC_ROUTES_BY_PSM);
      setRouteToProvince(STATIC_ROUTE_TO_PROVINCE);
      setOperatorToProvinces(STATIC_OPERATOR_TO_PROVINCES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { routesByPsm, routeToProvince, operatorToProvinces, loading, reload: load };
};
