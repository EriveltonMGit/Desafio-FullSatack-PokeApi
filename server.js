const express = require('express');
const axios = require('axios');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8100',
    methods: ['GET', 'POST']
  }
});

app.use(cors({ origin: 'http://localhost:8100' }));
app.use(express.json());

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

// Função para formatar os dados
function transformPokemonData(data, description) {
  const types = data.types.map((typeInfo) => typeInfo.type.name);
  return {
    id: data.id,
    name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    type: types.map((type) => type.charAt(0).toUpperCase() + type.slice(1)).join('/'),
    types: types,
    description: description.replace(/\n|\f/g, ' '),
    imageUrl: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
    level: Math.floor(Math.random() * 100) + 1,
    height: data.height / 10,
    weight: data.weight / 10,
  };
}

// Endpoint para lista de Pokémons
app.get('/api/pokemons', async (req, res) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;

  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    const pokemonList = response.data.results;

    if (!pokemonList || pokemonList.length === 0) {
      return res.json([]);
    }

    const detailedRequests = pokemonList.map(async (pokemon) => {
      const detailResponse = await axios.get(pokemon.url);
      const detail = detailResponse.data;

      const speciesResponse = await axios.get(`${POKEAPI_BASE_URL}/pokemon-species/${detail.id}`);
      const speciesData = speciesResponse.data;

      const flavorTextEntry =
        speciesData.flavor_text_entries.find((entry) => entry.language.name === 'pt') ||
        speciesData.flavor_text_entries.find((entry) => entry.language.name === 'en');

      return transformPokemonData(detail, flavorTextEntry?.flavor_text || 'Descrição indisponível');
    });

    const detailedPokemons = await Promise.all(detailedRequests);
    res.json(detailedPokemons);
  } catch (error) {
    console.error('Erro ao buscar Pokémons:', error.message);
    res.status(500).json({ message: 'Erro ao buscar Pokémons', error: error.message });
  }
});

// Endpoint para detalhes de um Pokémon específico
app.get('/api/pokemon/:id', async (req, res) => {
  const pokemonId = req.params.id;

  try {
    const pokemonResponse = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${pokemonId}`);
    const pokemonData = pokemonResponse.data;

    const speciesResponse = await axios.get(`${POKEAPI_BASE_URL}/pokemon-species/${pokemonId}`);
    const speciesData = speciesResponse.data;

    const flavorTextEntry =
      speciesData.flavor_text_entries.find((entry) => entry.language.name === 'pt') ||
      speciesData.flavor_text_entries.find((entry) => entry.language.name === 'en');

    const transformedData = transformPokemonData(pokemonData, flavorTextEntry?.flavor_text || 'Descrição indisponível');
    res.json(transformedData);
  } catch (error) {
    console.error(`Erro ao buscar detalhes do Pokémon ${pokemonId}:`, error.message);
    res.status(404).json({ message: 'Pokémon não encontrado ou erro na API', error: error.message });
  }
});

// Simulação de WebHook com emissão via WebSocket
app.post('/webhook/pokemon-status-update', (req, res) => {
  const { pokemonId, newStatus } = req.body;

  if (!pokemonId || !newStatus) {
    return res.status(400).send('Bad Request: pokemonId and newStatus are required.');
  }

  console.log(`WebHook recebido: Pokémon ID ${pokemonId} com novo status: ${newStatus}`);

  io.emit('pokemonStatusUpdated', {
    id: pokemonId,
    status: newStatus,
    timestamp: new Date().toISOString(),
  });

  console.log(`Evento WebSocket 'pokemonStatusUpdated' emitido para Pokémon ID ${pokemonId}`);

  res.status(200).send('WebHook processado com sucesso e evento WebSocket emitido.');
});

// WebSocket: conexão do cliente
io.on('connection', (socket) => {
  console.log('Cliente conectado via WebSocket:', socket.id);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado do WebSocket:', socket.id);
  });
});

// Iniciar servidor HTTP e WebSocket
server.listen(PORT, () => {
  console.log(`Servidor back-end rodando em http://localhost:${PORT}`);
  console.log(`Servidor WebSocket rodando em ws://localhost:${PORT}`);
});
