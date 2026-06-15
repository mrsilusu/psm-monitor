import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../services/supabaseClient.js';
import { logAction } from '../../../services/auditService.js';

const SETTINGS_TABLE = 'app_settings';

const DEFAULT_SETTINGS = {
  app_name: 'PSM Monitor',
  active_operators: ['FIBRASOL', 'ISISTEL', 'ANGLOBAL'],
  available_years: ['2024', '2025', '2026'],
  max_quarters: 3,
  psm_list: ['FIBRASOL', 'ISISTEL', 'ANGLOBAL'],
  provinces_by_psm: {
    FIBRASOL: ['Zaire', 'Uíge', 'Malanje', 'Cuanza Norte'],
    ISISTEL: ['Cabinda'],
    ANGLOBAL: ['Lunda Norte', 'Lunda Sul', 'Moxico'],
  },
};

export const useSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from(SETTINGS_TABLE)
        .select('*')
        .limit(1)
        .maybeSingle();
      if (err) throw err;
      if (data) setSettings({ ...DEFAULT_SETTINGS, ...data });
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (updates) => {
    setSaving(true);
    setError(null);
    try {
      const { error: err } = await supabase
        .from(SETTINGS_TABLE)
        .upsert({ id: 1, ...settings, ...updates });
      if (err) throw err;
      setSettings(prev => ({ ...prev, ...updates }));
      await logAction({ action: 'UPDATE', entity: 'settings', newValue: updates });
      setSaving(false);
      return {};
    } catch (e) {
      setError(e.message);
      setSaving(false);
      return { error: e };
    }
  };

  return { settings, loading, error, saving, save, reload: load };
};
