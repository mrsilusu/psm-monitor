import React, { useState, useEffect } from 'react';

const ALL_OPERATORS = ['FIBRASOL', 'ISISTEL', 'ANGLOBAL'];

const OperatorSettings = ({ settings, onSave }) => {
  const [active, setActive] = useState([]);

  useEffect(() => {
    setActive(settings.active_operators || ALL_OPERATORS);
  }, [settings.active_operators]);

  const toggle = (op) => {
    setActive(prev =>
      prev.includes(op) ? prev.filter(o => o !== op) : [...prev, op]
    );
  };

  const handleSave = () => {
    onSave({ active_operators: active });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
      <h3 className="font-semibold text-gray-900">Operadores Ativos</h3>
      <div className="space-y-2">
        {ALL_OPERATORS.map(op => (
          <label key={op} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={active.includes(op)}
              onChange={() => toggle(op)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{op}</span>
          </label>
        ))}
      </div>
      <button
        onClick={handleSave}
        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
      >
        Aplicar operadores
      </button>
    </div>
  );
};

export default OperatorSettings;
