// Get the element with ID "listaPokemon"
const listaPokemon = document.querySelector("#listaPokemon"); 
 // Get all elements with class "btn-header"
const botonesHeader = document.querySelectorAll(".btn-header");
 // API URL for fetching Pokémon data
const URL = "https://pokeapi.co/api/v2/pokemon/";
// Array to store the fetch promises
const fetchPromises = []; 

// Fetch Pokémon data for IDs 1 to 151 and store the promises in fetchPromises array
for (let i = 1; i <= 999; i++) {
    fetchPromises.push(fetch(URL + i)
        .then(response => response.json()));
}

// Wait for all fetch promises to resolve using Promise.all()
Promise.all(fetchPromises)
    .then(pokemons => {
        // Sort the Pokémon by ID
        pokemons.sort((a, b) => a.id - b.id); 
        // Call the mostrarPokemon function for each Pokémon
        pokemons.forEach(pokemon => mostrarPokemon(pokemon)); 
    })
    .catch(error => {
        // Log an error if fetching Pokémon data fails
        console.error("Error al obtener los datos de los pokémon:", error); 
    });

// Function to display Pokémon data
function mostrarPokemon(poke) {
    // Generate HTML for Pokémon types
    const tipos = poke.types.map(type => `<p class="${type.type.name} tipo"> ${type.type.name} </p>`).join(''); 

    // Format the Pokémon ID
    let pokeId = poke.id.toString().padStart(3, '0'); 

    // Create a div element
    const div = document.createElement("div"); 
    // Add the "pokemon" class to the div
    div.classList.add("pokemon"); 
    // Set the inner HTML of the div with Pokémon data
    div.innerHTML = `
        <p class="pokemon-id-back"> #${pokeId} </p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id"> #${pokeId} </p>
                <h2 class="pokemon-nombre"> ${poke.name} </h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat"> ${poke.height} m </p>
                <p class="stat"> ${poke.weight} kg </p>
            </div>
        </div>
    `; 
    // Append the div to the "listaPokemon" element
    listaPokemon.append(div); 
}

// Add click event listeners to the header buttons
botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    // Get the ID of the clicked button
    const botonId = event.currentTarget.id; 

    // Clear the "listaPokemon" element
    listaPokemon.innerHTML = ""; 

    // Wait for all fetch promises to resolve using Promise.all()
    Promise.all(fetchPromises)
        .then(pokemons => {
            // Sort the Pokémon by ID
            pokemons.sort((a, b) => a.id - b.id); 

            pokemons.forEach(pokemon => {
                 // Get the Pokémon types
                const tipos = pokemon.types.map(type => type.type.name);

                if (botonId === "ver-todos") {
                    // Display all Pokémon if the "ver-todos" button is clicked
                    mostrarPokemon(pokemon); 
                } else {
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        // Display Pokémon of the clicked type
                        mostrarPokemon(pokemon); 
                    }
                }
            });
        })
        .catch(error => {
            // Log an error if fetching Pokémon data fails
            console.error("Error al obtener los datos de los pokémon:", error); 
        });
}));
