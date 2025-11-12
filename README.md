# Sistema de Controle de Acesso para Caminhoneiros

Sistema completo para controle de entrada e saída de caminhoneiros com registro de dados, assinaturas digitais e gerenciamento de ajudantes.

## Funcionalidades

- ✅ Registro de entrada e saída com data/hora automática
- ✅ Dados do veículo (placa carreta e cavalo)
- ✅ Informações do motorista e documentos
- ✅ Gerenciamento de ajudantes
- ✅ Assinatura digital do motorista
- ✅ Assinatura/carimbo de liberação de saída
- ✅ Tipo de operação (descarregar/coletar)
- ✅ Identificação de cliente e transportadora

## Como executar localmente

1. Instale as dependências:
```bash
npm install
```

2. Execute o projeto:
```bash
npm start
```

3. Acesse no navegador: http://localhost:3000

## Como fazer deploy

### Vercel (Recomendado)
1. Faça push do código para o GitHub
2. Acesse https://vercel.com
3. Importe o repositório
4. Deploy automático!

### Build para produção
```bash
npm run build
```

## Tecnologias utilizadas

- React 18
- CSS (Tailwind-like)
- Canvas API para assinaturas
- LocalStorage para persistência

---
Desenvolvido para facilitar o controle de acesso de caminhoneiros
