import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from 'react-router-dom';
import pokemonTranslations from '../utils/pokemonTranslations';

function GenerationCarousel() {
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

  const handleSpriteClick = (pokemonName) => {
    navigate(`/search?pokemon=${pokemonName}`);
  };

  return (
    <Carousel showArrows={true} showStatus={false} showThumbs={false} dynamicHeight={false}>
      {generations.map((gen, index) => {
        const pokemonRows = [];
        for (let i = 0; i < gen.pokemon_species.length; i += 5) {
          pokemonRows.push(gen.pokemon_species.slice(i, i + 5));
        }

        return (
          <div
            key={index}
            className={`generation-slide ${gen.pokemon_species.length <= 10 ? 'small-generation' : ''}`}
          >
            <h2>{gen.name}</h2>
            <div className="pokemon-grid">
              {pokemonRows.map((row, rowIndex) => (
                <div key={rowIndex} className="pokemon-row">
                  {row.map((pokemon, pokemonIndex) => (
                    <div key={pokemonIndex} className="pokemon-item">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png`}
                        alt={pokemon.name}
                        className="pokemon-sprite"
                        onClick={() => handleSpriteClick(pokemon.name)}
                      />
                      <p className="pokemon-name">
                        {pokemonTranslations[pokemon.name] || pokemon.name}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </Carousel>
  );
}

export default GenerationCarousel;
