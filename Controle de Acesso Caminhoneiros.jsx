function App() {
  const [registros, setRegistros] = React.useState([]);
  const [mostrarFormulario, setMostrarFormulario] = React.useState(false);
  const [assinandoMotorista, setAssinandoMotorista] = React.useState(false);
  const [assinandoSaida, setAssinandoSaida] = React.useState(false);
  const [registroAtual, setRegistroAtual] = React.useState(null);

  const [formData, setFormData] = React.useState({
    dataEntrada: '',
    horaEntrada: '',
    dataSaida: '',
    horaSaida: '',
    transportadora: '',
    placaCarreta: '',
    placaCavalo: '',
    nomeMotorista: '',
    rgMotorista: '',
    temAjudante: 'nao',
    ajudantes: [],
    operacao: 'descarregar',
    cliente: '',
    assinaturaMotorista: '',
    assinaturaSaida: ''
  });

  const [ajudanteTemp, setAjudanteTemp] = React.useState({
    nome: '',
    documento: '',
    tipoDoc: 'RG'
  });

  const canvasRefMotorista = React.useRef(null);
  const canvasRefSaida = React.useRef(null);
  const [isDrawing, setIsDrawing] = React.useState(false);

  React.useEffect(() => {
    const now = new Date();
    const data = now.toISOString().split('T')[0];
    const hora = now.toTimeString().split(' ')[0].substring(0, 5);
    setFormData(prev => ({
      ...prev,
      dataEntrada: data,
      horaEntrada: hora
    }));
  }, [mostrarFormulario]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const adicionarAjudante = () => {
    if (ajudanteTemp.nome && ajudanteTemp.documento) {
      setFormData(prev => ({
        ...prev,
        ajudantes: [...prev.ajudantes, { ...ajudanteTemp }]
      }));
      setAjudanteTemp({ nome: '', documento: '', tipoDoc: 'RG' });
    }
  };

  const removerAjudante = (index) => {
    setFormData(prev => ({
      ...prev,
      ajudantes: prev.ajudantes.filter((_, i) => i !== index)
    }));
  };

  const iniciarAssinatura = (tipo) => {
    if (tipo === 'motorista') {
      setAssinandoMotorista(true);
      setTimeout(() => {
        const canvas = canvasRefMotorista.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }, 100);
    } else {
      setAssinandoSaida(true);
      setTimeout(() => {
        const canvas = canvasRefSaida.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }, 100);
    }
  };

  const startDrawing = (e, canvasRef) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e, canvasRef) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const limparAssinatura = (canvasRef) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const salvarAssinatura = (tipo) => {
    const canvas = tipo === 'motorista' ? canvasRefMotorista.current : canvasRefSaida.current;
    const assinatura = canvas.toDataURL();

    if (tipo === 'motorista') {
      setFormData(prev => ({ ...prev, assinaturaMotorista: assinatura }));
      setAssinandoMotorista(false);
    } else {
      setFormData(prev => ({ ...prev, assinaturaSaida: assinatura }));
      setAssinandoSaida(false);
    }
  };

  const salvarRegistro = () => {
    if (!formData.transportadora || !formData.placaCarreta || !formData.nomeMotorista || !formData.rgMotorista || !formData.cliente) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    if (!formData.assinaturaMotorista) {
      alert('Por favor, colete a assinatura do motorista!');
      return;
    }

    const novoRegistro = {
      ...formData,
      id: Date.now()
    };

    setRegistros(prev => [...prev, novoRegistro]);
    setFormData({
      dataEntrada: '',
      horaEntrada: '',
      dataSaida: '',
      horaSaida: '',
      transportadora: '',
      placaCarreta: '',
      placaCavalo: '',
      nomeMotorista: '',
      rgMotorista: '',
      temAjudante: 'nao',
      ajudantes: [],
      operacao: 'descarregar',
      cliente: '',
      assinaturaMotorista: '',
      assinaturaSaida: ''
    });
    setMostrarFormulario(false);
    alert('Registro de entrada salvo com sucesso!');
  };

  const registrarSaida = (registro) => {
    setRegistroAtual(registro);
    const now = new Date();
    const data = now.toISOString().split('T')[0];
    const hora = now.toTimeString().split(' ')[0].substring(0, 5);

    setFormData({
      ...registro,
      dataSaida: data,
      horaSaida: hora
    });
    setMostrarFormulario(true);
  };

  const finalizarSaida = () => {
    if (!formData.assinaturaSaida) {
      alert('Por favor, colete a assinatura/carimbo de liberação de saída!');
      return;
    }

    setRegistros(prev => prev.map(reg => 
      reg.id === registroAtual.id ? { ...formData } : reg
    ));

    setRegistroAtual(null);
    setFormData({
      dataEntrada: '',
      horaEntrada: '',
      dataSaida: '',
      horaSaida: '',
      transportadora: '',
      placaCarreta: '',
      placaCavalo: '',
      nomeMotorista: '',
      rgMotorista: '',
      temAjudante: 'nao',
      ajudantes: [],
      operacao: 'descarregar',
      cliente: '',
      assinaturaMotorista: '',
      assinaturaSaida: ''
    });
    setMostrarFormulario(false);
    alert('Saída registrada com sucesso!');
  };

  const cancelar = () => {
    setMostrarFormulario(false);
    setRegistroAtual(null);
    setFormData({
      dataEntrada: '',
      horaEntrada: '',
      dataSaida: '',
      horaSaida: '',
      transportadora: '',
      placaCarreta: '',
      placaCavalo: '',
      nomeMotorista: '',
      rgMotorista: '',
      temAjudante: 'nao',
      ajudantes: [],
      operacao: 'descarregar',
      cliente: '',
      assinaturaMotorista: '',
      assinaturaSaida: ''
    });
  };

  if (assinandoMotorista || assinandoSaida) {
    const tipo = assinandoMotorista ? 'motorista' : 'saida';
    const canvasRef = assinandoMotorista ? canvasRefMotorista : canvasRefSaida;

    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">
            {assinandoMotorista ? 'Assinatura do Motorista' : 'Assinatura/Carimbo de Liberação'}
          </h2>
          <div className="border-2 border-gray-300 rounded mb-4">
            <canvas
              ref={canvasRef}
              width={500}
              height={200}
              className="w-full cursor-crosshair"
              onMouseDown={(e) => startDrawing(e, canvasRef)}
              onMouseMove={(e) => draw(e, canvasRef)}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => limparAssinatura(canvasRef)}
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Limpar
            </button>
            <button
              onClick={() => salvarAssinatura(tipo)}
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Salvar Assinatura
            </button>
            <button
              onClick={() => {
                setAssinandoMotorista(false);
                setAssinandoSaida(false);
              }}
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mostrarFormulario) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-3xl font-bold mb-6 text-blue-800">
            {registroAtual ? 'Registrar Saída' : 'Novo Registro de Entrada'}
          </h2>

          <div className="space-y-6">
            {/* Data e Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Data de Entrada *</label>
                <input
                  type="date"
                  name="dataEntrada"
                  value={formData.dataEntrada}
                  onChange={handleInputChange}
                  disabled={registroAtual}
                  className="w-full border-2 border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Hora de Entrada *</label>
                <input
                  type="time"
                  name="horaEntrada"
                  value={formData.horaEntrada}
                  onChange={handleInputChange}
                  disabled={registroAtual}
                  className="w-full border-2 border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>

            {registroAtual && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Data de Saída *</label>
                  <input
                    type="date"
                    name="dataSaida"
                    value={formData.dataSaida}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Hora de Saída *</label>
                  <input
                    type="time"
                    name="horaSaida"
                    value={formData.horaSaida}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
            )}

            {/* Transportadora e Cliente */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Transportadora *</label>
                <input
                  type="text"
                  name="transportadora"
                  value={formData.transportadora}
                  onChange={handleInputChange}
                  disabled={registroAtual}
                  className="w-full border-2 border-gray-300 rounded px-3 py-2"
                  placeholder="Nome da transportadora"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Cliente *</label>
                <input
                  type="text"
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleInputChange}
                  disabled={registroAtual}
                  className="w-full border-2 border-gray-300 rounded px-3 py-2"
                  placeholder="Nome do cliente"
                />
              </div>
            </div>

            {/* Placas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Placa da Carreta *</label>
                <input
                  type="text"
                  name="placaCarreta"
                  value={formData.placaCarreta}
                  onChange={handleInputChange}
                  disabled={registroAtual}
                  className="w-full border-2 border-gray-300 rounded px-3 py-2 uppercase"
                  placeholder="ABC-1234"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Placa do Cavalo</label>
                <input
                  type="text"
                  name="placaCavalo"
                  value={formData.placaCavalo}
                  onChange={handleInputChange}
                  disabled={registroAtual}
                  className="w-full border-2 border-gray-300 rounded px-3 py-2 uppercase"
                  placeholder="XYZ-5678"
                />
              </div>
            </div>

            {/* Motorista */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Nome do Motorista *</label>
                <input
                  type="text"
                  name="nomeMotorista"
                  value={formData.nomeMotorista}
                  onChange={handleInputChange}
                  disabled={registroAtual}
                  className="w-full border-2 border-gray-300 rounded px-3 py-2"
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">RG do Motorista *</label>
                <input
                  type="text"
                  name="rgMotorista"
                  value={formData.rgMotorista}
                  onChange={handleInputChange}
                  disabled={registroAtual}
                  className="w-full border-2 border-gray-300 rounded px-3 py-2"
                  placeholder="RG ou CPF"
                />
              </div>
            </div>

            {/* Operação */}
            <div>
              <label className="block text-sm font-semibold mb-2">Operação *</label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="operacao"
                    value="descarregar"
                    checked={formData.operacao === 'descarregar'}
                    onChange={handleInputChange}
                    disabled={registroAtual}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="text-lg">Descarregar</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="operacao"
                    value="coletar"
                    checked={formData.operacao === 'coletar'}
                    onChange={handleInputChange}
                    disabled={registroAtual}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="text-lg">Coletar</span>
                </label>
              </div>
            </div>

            {/* Ajudante */}
            <div>
              <label className="block text-sm font-semibold mb-2">Veio com ajudante? *</label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="temAjudante"
                    value="sim"
                    checked={formData.temAjudante === 'sim'}
                    onChange={handleInputChange}
                    disabled={registroAtual}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="text-lg">☑ Sim</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="temAjudante"
                    value="nao"
                    checked={formData.temAjudante === 'nao'}
                    onChange={handleInputChange}
                    disabled={registroAtual}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="text-lg">☐ Não</span>
                </label>
              </div>
            </div>

            {/* Lista de Ajudantes */}
            {formData.temAjudante === 'sim' && !registroAtual && (
              <div className="border-2 border-blue-300 rounded p-4 bg-blue-50">
                <h3 className="font-bold text-lg mb-3">Dados dos Ajudantes</h3>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <input
                    type="text"
                    value={ajudanteTemp.nome}
                    onChange={(e) => setAjudanteTemp({...ajudanteTemp, nome: e.target.value})}
                    className="border-2 border-gray-300 rounded px-3 py-2"
                    placeholder="Nome do ajudante"
                  />
                  <input
                    type="text"
                    value={ajudanteTemp.documento}
                    onChange={(e) => setAjudanteTemp({...ajudanteTemp, documento: e.target.value})}
                    className="border-2 border-gray-300 rounded px-3 py-2"
                    placeholder="RG ou CPF"
                  />
                  <select
                    value={ajudanteTemp.tipoDoc}
                    onChange={(e) => setAjudanteTemp({...ajudanteTemp, tipoDoc: e.target.value})}
                    className="border-2 border-gray-300 rounded px-3 py-2"
                  >
                    <option value="RG">RG</option>
                    <option value="CPF">CPF</option>
                  </select>
                </div>

                <button
                  onClick={adicionarAjudante}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-3"
                >
                  + Adicionar Ajudante
                </button>

                {formData.ajudantes.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-semibold mb-2">Ajudantes Cadastrados:</h4>
                    {formData.ajudantes.map((ajudante, index) => (
                      <div key={index} className="flex justify-between items-center bg-white p-2 rounded mb-2">
                        <span>{ajudante.nome} - {ajudante.tipoDoc}: {ajudante.documento}</span>
                        <button
                          onClick={() => removerAjudante(index)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {formData.temAjudante === 'sim' && registroAtual && formData.ajudantes.length > 0 && (
              <div className="border-2 border-blue-300 rounded p-4 bg-blue-50">
                <h4 className="font-semibold mb-2">Ajudantes:</h4>
                {formData.ajudantes.map((ajudante, index) => (
                  <div key={index} className="bg-white p-2 rounded mb-2">
                    {ajudante.nome} - {ajudante.tipoDoc}: {ajudante.documento}
                  </div>
                ))}
              </div>
            )}

            {/* Assinaturas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Assinatura do Motorista *</label>
                {formData.assinaturaMotorista ? (
                  <div className="border-2 border-green-500 rounded p-2">
                    <img src={formData.assinaturaMotorista} alt="Assinatura Motorista" className="w-full" />
                    {!registroAtual && (
                      <button
                        onClick={() => iniciarAssinatura('motorista')}
                        className="w-full mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Refazer Assinatura
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => iniciarAssinatura('motorista')}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Coletar Assinatura
                  </button>
                )}
              </div>

              {registroAtual && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Assinatura/Carimbo de Liberação *</label>
                  {formData.assinaturaSaida ? (
                    <div className="border-2 border-green-500 rounded p-2">
                      <img src={formData.assinaturaSaida} alt="Assinatura Saída" className="w-full" />
                      <button
                        onClick={() => iniciarAssinatura('saida')}
                        className="w-full mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Refazer Assinatura
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => iniciarAssinatura('saida')}
                      className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Coletar Assinatura/Carimbo
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={cancelar}
                className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={registroAtual ? finalizarSaida : salvarRegistro}
                className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600"
              >
                {registroAtual ? 'Finalizar Saída' : 'Salvar Entrada'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-blue-800">
              <i className="fas fa-truck mr-3"></i>
              Controle de Acesso - Caminhoneiros
            </h1>
            <button
              onClick={() => setMostrarFormulario(true)}
              className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600"
            >
              + Nova Entrada
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Registros Ativos</h2>

          {registros.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum registro encontrado. Clique em "Nova Entrada" para começar.</p>
          ) : (
            <div className="space-y-4">
              {registros.map((registro) => (
                <div key={registro.id} className={`border-2 rounded-lg p-4 ${registro.dataSaida ? 'bg-gray-100 border-gray-300' : 'bg-green-50 border-green-500'}`}>
                  <div className="grid grid-cols-4 gap-4 mb-3">
                    <div>
                      <span className="font-semibold">Entrada:</span>
                      <p>{registro.dataEntrada} às {registro.horaEntrada}</p>
                    </div>
                    {registro.dataSaida && (
                      <div>
                        <span className="font-semibold">Saída:</span>
                        <p>{registro.dataSaida} às {registro.horaSaida}</p>
                      </div>
                    )}
                    <div>
                      <span className="font-semibold">Transportadora:</span>
                      <p>{registro.transportadora}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Cliente:</span>
                      <p>{registro.cliente}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-3">
                    <div>
                      <span className="font-semibold">Placa Carreta:</span>
                      <p className="uppercase">{registro.placaCarreta}</p>
                    </div>
                    {registro.placaCavalo && (
                      <div>
                        <span className="font-semibold">Placa Cavalo:</span>
                        <p className="uppercase">{registro.placaCavalo}</p>
                      </div>
                    )}
                    <div>
                      <span className="font-semibold">Motorista:</span>
                      <p>{registro.nomeMotorista}</p>
                    </div>
                    <div>
                      <span className="font-semibold">RG:</span>
                      <p>{registro.rgMotorista}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <span className="font-semibold">Operação:</span>
                      <p className="capitalize">{registro.operacao}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Ajudante:</span>
                      <p>{registro.temAjudante === 'sim' ? '☑ Sim' : '☐ Não'}</p>
                    </div>
                  </div>

                  {registro.ajudantes.length > 0 && (
                    <div className="mb-3">
                      <span className="font-semibold">Ajudantes:</span>
                      {registro.ajudantes.map((ajudante, idx) => (
                        <p key={idx} className="ml-4">• {ajudante.nome} - {ajudante.tipoDoc}: {ajudante.documento}</p>
                      ))}
                    </div>
                  )}

                  {!registro.dataSaida && (
                    <button
                      onClick={() => registrarSaida(registro)}
                      className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 font-semibold"
                    >
                      Registrar Saída
                    </button>
                  )}

                  {registro.dataSaida && (
                    <span className="inline-block bg-gray-600 text-white px-4 py-2 rounded font-semibold">
                      ✓ Finalizado
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}