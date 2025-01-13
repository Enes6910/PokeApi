import React from 'react';
import GenerationCards from './components/GenerationCards';
import PokemonSearch from './components/PokemonSearch';

export default function Home() {
  return (
    <main className="container">
      <h1 className="title">Pokédex</h1>
      <GenerationCards />
      <div className="search-container">
        <PokemonSearch />
      </div>
    </main>
  );
}


