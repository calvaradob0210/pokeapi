const pokedexContainer = document.getElementById("pokedex");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-button");
const previousButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");

let currentPokemonId = null; // Variable para almacenar el ID actual del Pokémon

// Traducción de tipos de Pokémon
const typeTranslations = {
    normal: "Normal", fire: "Fuego", water: "Agua", grass: "Planta", electric: "Eléctrico",
    ice: "Hielo", fighting: "Lucha", poison: "Veneno", ground: "Tierra", flying: "Volador",
    psychic: "Psíquico", bug: "Bicho", rock: "Roca", ghost: "Fantasma", dark: "Siniestro",
    dragon: "Dragón", steel: "Acero", fairy: "Hada"
};

async function fetchPokemon(nameOrId) {
    try {
        // Convierte a minúsculas solo si nameOrId es una cadena
        const query = typeof nameOrId === 'string' ? nameOrId.toLowerCase() : nameOrId;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        
        if (!response.ok) {
            throw new Error("Pokémon no encontrado");
        }
        
        const data = await response.json();
        displayPokemon(data);
        currentPokemonId = data.id; // Guardar el ID actual del Pokémon
    } catch (error) {
        pokedexContainer.innerHTML = `<p>${error.message}</p>`;
    }
}

function displayPokemon(pokemon) {
    const translatedTypes = pokemon.types
        .map(type => typeTranslations[type.type.name] || type.type.name)
        .join(", ");
        
    const abilities = pokemon.abilities
        .map(ability => ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1))
        .join(", ");

    pokedexContainer.innerHTML = `
        <div class="pokemon-card">
            <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} (#${pokemon.id})</h3>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <p><strong>Tipo:</strong> ${translatedTypes}</p>
            <p><strong>Habilidades:</strong> ${abilities}</p>
            <div class="stats">
                <p><strong>HP:</strong> ${pokemon.stats[0].base_stat}</p>
                <p><strong>Ataque:</strong> ${pokemon.stats[1].base_stat}</p>
                <p><strong>Defensa:</strong> ${pokemon.stats[2].base_stat}</p>
                <p><strong>Ataque Especial:</strong> ${pokemon.stats[3].base_stat}</p>
                <p><strong>Defensa Especial:</strong> ${pokemon.stats[4].base_stat}</p>
                <p><strong>Velocidad:</strong> ${pokemon.stats[5].base_stat}</p>
            </div>
        </div>
    `;
}

// Evento para el botón de buscar
searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchPokemon(query);
    } else {
        pokedexContainer.innerHTML = "<p>Por favor ingresa un nombre o ID de Pokémon.</p>";
    }
});

// Evento para el botón de Pokémon anterior
previousButton.addEventListener("click", () => {
    if (currentPokemonId > 1) { // Evitar números de ID menores a 1
        fetchPokemon(currentPokemonId - 1);
    }
});

// Evento para el botón de siguiente Pokémon
nextButton.addEventListener("click", () => {
    fetchPokemon(currentPokemonId + 1);
});
