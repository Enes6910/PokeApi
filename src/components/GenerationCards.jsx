import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import pokemonTranslations from '../utils/pokemonTranslations';

function GenerationCards() {
  const [generations, setGenerations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenerations = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/generation');
        const generationDetails = await Promise.all(
          response.data.results.map(async (gen) => {
            const genResponse = await axios.get(gen.url);
            return genResponse.data;
          })
        );
        setGenerations(generationDetails);
      } catch (error) {
        console.error("Erreur lors de la récupération des générations :", error);
      }
    };

    fetchGenerations();
  }, []);

  const handleCardClick = (pokemonName) => {
    navigate(`/search?pokemon=${pokemonName}`);
  };

  return (
    <div className="generation-cards">
      {generations.map((gen, index) => (
        <div key={index} className="generation-section">
          <h2>{gen.name}</h2>
          <div className="cards-grid">
            {gen.pokemon_species
              .sort((a, b) => {
                // Trier les Pokémon par leur numéro dans le Pokédex
                const idA = parseInt(a.url.split('/')[6]);
                const idB = parseInt(b.url.split('/')[6]);
                return idA - idB;
              })
              .map((pokemon, pokemonIndex) => (
                <div
                  key={pokemonIndex}
                  className="pokemon-card"
                  onClick={() => handleCardClick(pokemon.name)}
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png`}
                    alt={pokemon.name}
                    className="pokemon-card-image"
                  />
                  <p className="pokemon-card-name">
                    {pokemonTranslations[pokemon.name] || pokemon.name}
                  </p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default GenerationCards;
