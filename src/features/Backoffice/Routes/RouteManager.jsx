import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useRouteManager } from './useRouteManager.js';
import RouteForm from './RouteForm.jsx';

const PSM_TABS = [
  { id: 'FIBRASOL', color: 'bg-blue-500', light: 'bg-blue-50 text-blue-700 border-blue-300' },
  { id: 'ISISTEL', color: 'bg-green-500', light: 'bg-green-50 text-green-700 border-green-300' },
  { id: 'ANGLOBAL', color: 'bg-orange-500', light: 'bg-orange-50 text-orange-700 border-orange-300' },
];

const RouteManager = ({ onAddRoute }) => {
  const { routes, loading, error, createRoute, updateRoute, deleteRoute, toggleActive } = useRouteManager();
  const [activePsm, setActivePsm] = useState('FIBRASOL');
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const openAdd = () => {
    setEditingRoute(null);
    setShowForm(true);
  };

  if (onAddRoute) onAddRoute.current = openAdd;

  const openEdit = (route) => {
    setEditingRoute(route);
    setShowForm(true);
  };

  const handleSave = async (formData) => {
    setFormLoading(true);
    let result;
    if (editingRoute) {
      result = await updateRoute(editingRoute.id, formData);
    } else {
      result = await createRoute(formData);
    }
    setFormLoading(false);
    if (!result.error) {
      setShowForm(false);
      setEditingRoute(null);
    }
    return result;
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apagar esta rota permanentemente?')) return;
    await deleteRoute(id);
  };

  const psmRoutes = routes.filter(r => r.psm === activePsm);
  const activeCount = psmRoutes.filter(r => r.is_active).length;
  const totalCount = psmRoutes.length;

  const activeTab = PSM_TABS.find(t => t.id === activePsm);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
        A carregar rotas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* PSM Tab selector */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {PSM_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActivePsm(tab.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activePsm === tab.id
                  ? `${tab.color} text-white border-transparent`
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
              }`}
            >
              {tab.id}
            </button>
          ))}
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar Rota
        </button>
      </div>

      {/* Counter */}
      <p className="text-sm text-gray-500">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${activeTab?.light}`}>
          {activePsm}
        </span>
        {' '}{activeCount} rotas activas de {totalCount} total
      </p>

      {/* Routes table */}
      {psmRoutes.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm border border-dashed border-gray-200 rounded-lg">
          Nenhuma rota configurada para {activePsm}
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nome da Rota</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Província</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {psmRoutes.map(route => (
                <tr key={route.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-800 font-medium">{route.route_name}</td>
                  <td className="px-4 py-3 text-gray-500">{route.province}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      route.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {route.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleActive(route.id, route.is_active)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded transition-colors"
                        title={route.is_active ? 'Desativar' : 'Ativar'}
                      >
                        {route.is_active
                          ? <ToggleRight className="w-4 h-4" />
                          : <ToggleLeft className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openEdit(route)}
                        className="p-1.5 text-gray-400 hover:text-purple-600 rounded transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(route.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors"
                        title="Apagar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <RouteForm
          route={editingRoute}
          selectedPsm={activePsm}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingRoute(null); }}
          loading={formLoading}
        />
      )}
    </div>
  );
};

export default RouteManager;
