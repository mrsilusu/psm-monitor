import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

function TestSupabase() {
  const [status, setStatus] = useState('🔄 Testando conexão...');
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);
function TestSupabase() {
  // DEBUG: Ver variáveis
  console.log('🔍 DEBUG VARIÁVEIS:');
  console.log('URL:', process.env.REACT_APP_SUPABASE_URL);
  console.log('KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Existe ✅' : 'Não existe ❌');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('Todas as env:', Object.keys(process.env).filter(k => k.startsWith('REACT_APP')));
  
  const [status, setStatus] = useState('loading');
  // resto do código...
  useEffect(() => {
    const testarConexao = async () => {
      try {
        console.log('🚀 [ONLINE] Iniciando teste Supabase...');
        
        // Verificar variáveis (vêm do Vercel em produção)
        const url = process.env.REACT_APP_SUPABASE_URL;
        const key = process.env.REACT_APP_SUPABASE_ANON_KEY;
        
        console.log('🌐 Ambiente:', process.env.NODE_ENV);
        console.log('📍 URL definida:', url ? '✅' : '❌');
        console.log('🔑 Key definida:', key ? '✅' : '❌');
        
        if (!url || !key) {
          throw new Error('⚠️ Variáveis não encontradas. Configure no Vercel: Settings > Environment Variables');
        }
        
        setStatus('✅ Variáveis OK. Conectando...');
        
        // Inserir dado de teste
        const timestamp = new Date().toISOString();
        const dadoTeste = {
          psm: 'FIBRASOL',
          week: 'W1',
          route: `Teste Online ${timestamp}`,
          year: 2025,
          quarter: 'Q1',
          provincia: 'Luanda',
          transporte: 100,
          indisponiveis: 10,
          total_reparadas: 5
        };
        
        console.log('📤 Inserindo:', dadoTeste.route);
        
        const { data: insertData, error: insertError } = await supabase
          .from('psm_data')
          .insert(dadoTeste)
          .select();

        if (insertError) {
          console.error('❌ Erro na inserção:', insertError);
          throw insertError;
        }

        console.log('✅ Inserido! ID:', insertData[0]?.id);
        setStatus('✅ Inserção OK! Buscando...');

        // Buscar últimos 5 registros
        const { data: selectData, error: selectError } = await supabase
          .from('psm_data')
          .select('id, psm, route, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (selectError) throw selectError;

        console.log('📊 Encontrados:', selectData.length, 'registros');
        setDados(selectData);
        setStatus('🎉 SUCESSO! Conectado ao Supabase via Vercel!');

      } catch (error) {
        console.error('❌ Erro:', error);
        setErro(error.message);
        setStatus('❌ Falha na conexão');
      }
    };

    testarConexao();
  }, []);

  return (
    <div style={{
      padding: '20px',
      margin: '20px',
      background: erro ? '#fee' : '#efe',
      border: `3px solid ${erro ? '#f00' : '#0a0'}`,
      borderRadius: '10px'
    }}>
      <h2>🌐 Teste Supabase (Ambiente Online)</h2>
      
      <div style={{ 
        padding: '15px',
        background: '#fff',
        borderRadius: '5px',
        marginBottom: '15px'
      }}>
        <strong>Status:</strong> {status}
      </div>

      {erro && (
        <div style={{ 
          padding: '15px',
          background: '#fdd',
          border: '2px solid #f00',
          borderRadius: '5px',
          marginBottom: '15px'
        }}>
          <h3 style={{ marginTop: 0 }}>❌ Erro</h3>
          <p>{erro}</p>
          
          <h4>🔧 Checklist:</h4>
          <ol style={{ marginTop: '10px' }}>
            <li>✅ SQL executado no Supabase?</li>
            <li>✅ Tabelas criadas? (psm_data, justificativas, etc)</li>
            <li>✅ Variáveis configuradas no Vercel?
              <ul>
                <li>REACT_APP_SUPABASE_URL</li>
                <li>REACT_APP_SUPABASE_ANON_KEY</li>
              </ul>
            </li>
            <li>✅ Deploy feito após configurar variáveis?</li>
          </ol>
        </div>
      )}
      
      {dados && (
        <div>
          <h3>📊 Últimos Registros</h3>
          <div style={{ 
            background: '#fff',
            padding: '15px',
            borderRadius: '5px',
            overflow: 'auto'
          }}>
            {dados.map((item, i) => (
              <div key={i} style={{ 
                padding: '8px',
                marginBottom: '8px',
                background: '#f9f9f9',
                borderLeft: '3px solid #0a0',
                paddingLeft: '12px'
              }}>
                <strong>#{item.id}</strong> - {item.psm} - {item.route}
                <br />
                <small>{new Date(item.created_at).toLocaleString('pt-PT')}</small>
              </div>
            ))}
          </div>
          
          <div style={{ 
            marginTop: '15px',
            padding: '10px',
            background: '#dfd',
            borderRadius: '5px'
          }}>
            ✅ Total: <strong>{dados.length}</strong> registros
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: '20px',
        padding: '10px',
        background: '#eef',
        borderRadius: '5px',
        fontSize: '12px'
      }}>
        💡 <strong>Ambiente Online:</strong> Variáveis vêm do Vercel, não do .env.local
      </div>
    </div>
  );
}

export default TestSupabase;b 