import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import frenchToEnglishMap from "../utils/pokemonNameTranslations";
import statsTranslation from "../utils/pokemonStatsTranslations";
import typesTranslation from "../utils/pokemonTypeTranslations";

export default function PokemonSearch() {
  const [inputName, setInputName] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pokemonList, setPokemonList] = useState([]); // Liste des Pokémon
  const [suggestions, setSuggestions] = useState([]); // Suggestions filtrées
  const location = useLocation();

  useEffect(() => {
    // Récupérer tous les noms des Pokémon
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1000");
        setPokemonList(response.data.results.map((pokemon) => pokemon.name));
      } catch (error) {
        console.error("Erreur lors de la récupération des noms de Pokémon :", error);
      }
    };

    fetchPokemonList();

    // Récupérer les paramètres de recherche dans l'URL
    const searchParams = new URLSearchParams(location.search);
    const pokemonNameFromQuery = searchParams.get("pokemon");
    if (pokemonNameFromQuery) {
      fetchPokemon(pokemonNameFromQuery);
    }
  }, [location.search]);

  const normalizeInput = (name) => name.trim().toLowerCase();

  const TranslateToEnglishName = (name) => {
    const normalizedName = normalizeInput(name);
    return frenchToEnglishMap[normalizedName] || normalizedName;
  };

  const TranslateToFrenchStats = (stats) => statsTranslation[stats];

  const TranslateToFrenchTypes = (types) => types.map((type) => typesTranslation[type] || type);

  const fetchPokemon = async (name) => {
    const englishName = TranslateToEnglishName(name);
    setIsLoading(true);
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${englishName}`);
      const data = response.data;

      setSelectedPokemon({
        name: data.name,
        imageUrl: data.sprites.other["official-artwork"].front_default,
        stats: data.stats.map((stat) => ({
          name: TranslateToFrenchStats(stat.stat.name),
          value: stat.base_stat,
        })),
        types: TranslateToFrenchTypes(data.types.map((type) => type.type.name)),
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du Pokémon :", error);
      setSelectedPokemon(null);
      alert("Pokémon non trouvé. Veuillez vérifier l'orthographe.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputName(value);

    // Mettre à jour les suggestions
    const filteredSuggestions = pokemonList.filter((pokemon) =>
      pokemon.toLowerCase().startsWith(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions.slice(0, 5)); // Limiter à 5 suggestions
  };

  const handleSearch = () => {
    if (inputName.trim() !== "") {
      fetchPokemon(inputName);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputName(suggestion);
    setSuggestions([]);
    fetchPokemon(suggestion);
  };

  return (
    <div className="pokemon-search">
      <h2><a href="../">Poké Search</a></h2>
      <div className="search-input">
        <input
          type="text"
          value={inputName}
          onChange={handleInputChange}
          placeholder="Entrez un nom de Pokémon"
        />
        <button onClick={handleSearch}>Rechercher</button>
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-item"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {isLoading && <p>Chargement...</p>}

      {selectedPokemon && !isLoading && (
        <div className="pokemon-details">
          <img
            src={selectedPokemon.imageUrl}
            alt={selectedPokemon.name}
            className="pokemon-image"
          />
          <h3>{selectedPokemon.name}</h3>
          <p>
            <strong>Types :</strong>{" "}
            {selectedPokemon.types.map((type, index) => (
              <span key={index}>
                {type}
                {index < selectedPokemon.types.length - 1 && ", "}
              </span>
            ))}
          </p>
          <div className="pokemon-stats">
            <h4>Statistiques :</h4>
            <ul>
              {selectedPokemon.stats.map((stat, index) => (
                <li key={index}>
                  {stat.name} : {stat.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
