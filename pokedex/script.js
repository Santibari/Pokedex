const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const surpriseButton = document.getElementById('surprise-button');
const sortDropdown = document.getElementById('sort-dropdown');
const pokemonGallery = document.getElementById('pokemon-gallery');
const pokemonDetails = document.getElementById('pokemon-details');
const closeDetailsButton = document.getElementById('close-details');
const overlay = document.getElementById('overlay');

async function loadAllPokemons() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
        const data = await response.json();
        const pokemons = await Promise.all(data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return res.json();
        }));
        displayPokemonGallery(pokemons);
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
    }
}

function displayPokemonGallery(pokemons) {
    pokemonGallery.innerHTML = pokemons.map(pokemon => `
        <div class="pokemon-card" onclick="showPokemonDetails(${pokemon.id})">
            <div class="pokemon-image-container">
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" class="pokemon-image">
            </div>
            <div class="pokemon-info">
                <h3 class="pokemon-name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                <p>Número: #${pokemon.id.toString().padStart(3, '0')}</p>
                <p>Tipo: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
            </div>
        </div>
    `).join('');
}

async function showPokemonDetails(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const pokemon = await response.json();
        
        const types = pokemon.types.map(type => 
            `<span class="type-tag type-${type.type.name}">${type.type.name}</span>`
        ).join('');

        const statsChart = pokemon.stats.map(stat => `
            <div class="stat-bar-container">
                <span class="stat-name">${stat.stat.name}</span>
                <div class="stat-bar" style="width: ${stat.base_stat}%"></div>
                <span class="stat-value">${stat.base_stat}</span>
            </div>
        `).join('');

        const pokemonHtml = `
            <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
            <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" style="width: 200px; height: 200px;">
            <p>Altura: ${pokemon.height / 10} m</p>
            <p>Peso: ${pokemon.weight / 10} kg</p>
            <p>Tipos: ${types}</p>
            <h3>Estadísticas</h3>
            <div class="stats-chart">${statsChart}</div>
        `;

        pokemonDetails.innerHTML = pokemonHtml + '<button id="close-details" class="close-button">×</button>';
        pokemonDetails.style.display = 'block';
        overlay.style.display = 'block';

        document.getElementById('close-details').addEventListener('click', closePokemonDetails);
    } catch (error) {
        console.error('Error fetching Pokémon details:', error);
    }
}

function closePokemonDetails() {
    pokemonDetails.style.display = 'none';
    overlay.style.display = 'none';
}

async function searchPokemon() {
    const query = searchInput.value.toLowerCase();
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        const data = await response.json();
        displayPokemonGallery([data]);
    } catch (error) {
        console.error('Error fetching Pokemon:', error);
        pokemonGallery.innerHTML = '<p>Pokémon no encontrado. Intenta de nuevo.</p>';
    }
}

async function getRandomPokemon() {
    const randomId = Math.floor(Math.random() * 151) + 1;
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const data = await response.json();
        displayPokemonGallery([data]);
    } catch (error) {
        console.error('Error fetching random Pokemon:', error);
    }
}

searchButton.addEventListener('click', searchPokemon);
surpriseButton.addEventListener('click', getRandomPokemon);
sortDropdown.addEventListener('change', function() {
    // Falta agregar funcion ordenarlos
});

overlay.addEventListener('click', closePokemonDetails);

loadAllPokemons();

