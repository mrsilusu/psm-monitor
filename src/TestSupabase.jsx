// ============================================
// TESTE DE CONEXAO SUPABASE
// Arquivo: src/TestSupabase.jsx
// ============================================

import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, Loader } from 'lucide-react';

function TestSupabase() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Testando conexão com Supabase...');
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const testarConexao = async () => {
      // Definir variáveis NO INÍCIO, fora do try
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      try {
        console.log('🧪 [TESTE SUPABASE] Iniciando...');
        console.log('🌐 [TESTE] URL definida:', url ? '✅' : '❌', url);
        console.log('🔑 [TESTE] Key definida:', key ? '✅' : '❌');
        console.log('📦 [TESTE] MODE:', import.meta.env.MODE);
        console.log('📋 [TESTE] Todas VITE_*:', 
          Object.keys(import.meta.env).filter(k => k.startsWith('VITE_'))
        );
        
        if (!url || !key) {
          throw new Error('Variáveis de ambiente não configuradas. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
        }
        
        setDetails({
          url: '✅ Configurada',
          key: '✅ Configurada',
          urlValue: url,
          ambiente: import.meta.env.MODE || 'development'
        });
        
        setStatus('success');
        setMessage('✅ Conexão com Supabase OK! Variáveis configuradas.');
        
        console.log('✅ [TESTE SUPABASE] Sucesso!');
        
      } catch (error) {
        console.error('❌ [TESTE SUPABASE] Erro:', error);
        setStatus('error');
        setMessage(error.message);
        setDetails({
          url: url ? '✅ Configurada' : '❌ Não configurada',
          key: key ? '✅ Configurada' : '❌ Não configurada',
          urlValue: url || 'undefined',
          ambiente: import.meta.env.MODE || 'development'
        });
      }
    };

    testarConexao();
  }, []);

  // Se estiver carregando
  if (status === 'loading') {
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        background: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minWidth: '300px'
      }}>
        <Loader size={20} className="animate-spin text-blue-500" />
        <span style={{ fontSize: '14px', color: '#666' }}>
          Testando Supabase...
        </span>
      </div>
    );
  }

  // Se deu sucesso
  if (status === 'success') {
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        background: '#d4edda',
        border: '2px solid #28a745',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        minWidth: '350px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <CheckCircle size={24} style={{ color: '#28a745' }} />
          <strong style={{ fontSize: '14px', color: '#155724' }}>
            Conexão OK!
          </strong>
        </div>
        
        <div style={{ fontSize: '12px', color: '#155724', marginLeft: '34px' }}>
          <div><strong>URL:</strong> {details?.url}</div>
          <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '2px' }}>
            {details?.urlValue}
          </div>
          <div style={{ marginTop: '5px' }}><strong>Key:</strong> {details?.key}</div>
          <div style={{ marginTop: '8px', fontSize: '11px', opacity: 0.8 }}>
            <strong>Ambiente:</strong> {details?.ambiente}
          </div>
        </div>
      </div>
    );
  }

  // Se deu erro
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      background: '#f8d7da',
      border: '2px solid #dc3545',
      padding: '15px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      minWidth: '350px',
      maxWidth: '450px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <XCircle size={24} style={{ color: '#dc3545' }} />
        <strong style={{ fontSize: '14px', color: '#721c24' }}>
          Erro na Conexão
        </strong>
      </div>
      
      <div style={{ fontSize: '12px', color: '#721c24', marginLeft: '34px' }}>
        <div style={{ marginBottom: '8px' }}>{message}</div>
        
        {details && (
          <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(255,255,255,0.5)', borderRadius: '4px' }}>
            <div><strong>URL:</strong> {details.url}</div>
            <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '2px' }}>
              {details.urlValue}
            </div>
            <div style={{ marginTop: '5px' }}><strong>Key:</strong> {details.key}</div>
            <div style={{ marginTop: '8px', fontSize: '11px', opacity: 0.8 }}>
              <strong>Ambiente:</strong> {details.ambiente}
            </div>
          </div>
        )}
        
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
          <strong>Solução:</strong>
          <ol style={{ margin: '5px 0 0 15px', padding: 0, fontSize: '11px' }}>
            <li>Criar .env.production com as variáveis</li>
            <li>Ou configurar no Vercel Dashboard</li>
            <li>Fazer Redeploy</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default TestSupabase;