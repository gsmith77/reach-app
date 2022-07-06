import {useCallback, useState} from 'react';
import {Box, TextField} from '@mui/material';
import axios from 'axios';
import capitalize from 'lodash.capitalize';
import {LoadingButton} from '@mui/lab';
import {Moves, Types} from '../types/types';

export default function Home() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pokemon, setPokemon] = useState([]);
  const [searchParam, setSearchParam] = useState('');

  const search = useCallback(async () => {
    try {
      setLoading(true);
      const {data} = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${searchParam.toLowerCase()}`
      );
      let _pokemon: {
        moves: Moves;
        name: string;
        types: Types;
      }[] = [];
      console.log('_pokemon', _pokemon);
      if (searchParam) {
        _pokemon.push({
          moves: data.moves,
          name: data.name,
          types: data.types,
        });
      } else {
        throw new Error('Missing param. Input needed to search pokemon api.');
      }

      if (!!_pokemon.length) {
        setError('');
        setLoading(false);
        // @ts-ignore:
        setPokemon(_pokemon);
      }
    } catch (e: any) {
      console.log('EE', e.response.status === 404);
      if (e.response.status === 404) {
        setLoading(false);
        return setError(
          'Could not find any Pokemon using that search parameter.'
        );
      }
      setLoading(false);
      setError(e?.message);
    }
  }, [searchParam]);

  const listPokemon = useCallback(() => {
    if (pokemon.length) {
      return (
        <div>
          {pokemon.map(
            ({
              moves,
              name,
              types,
              url,
            }: {
              moves?: Moves;
              name: string;
              types?: Types;
              url?: string;
            }) => {
              return (
                <div className='pokemon center-items'>
                  <h2>Name: {capitalize(name)}</h2>
                  {url && (
                    <a href={url} target='_blank' rel='noreferrer'>
                      Click here to see {name}
                    </a>
                  )}
                  {moves?.length ? (
                    <>
                      <h4>Moves:</h4>
                      <br />
                      {moves?.map(m => {
                        return (
                          <>
                            Name: {capitalize(m.move.name)}
                            <a
                              href={m.move.url}
                              target='_blank'
                              rel='noreferrer'
                            >
                              Click here to see {name} move {m.move.name}
                            </a>
                          </>
                        );
                      })}
                    </>
                  ) : null}
                  {types?.length ? (
                    <>
                      <h4>Types:</h4>
                      <br />
                      {types?.map(t => {
                        return (
                          <>
                            Name: {capitalize(t.type.name)}
                            <a
                              href={t.type.url}
                              target='_blank'
                              rel='noreferrer'
                            >
                              Click here to see {name} type {t.type.name}
                            </a>
                          </>
                        );
                      })}
                    </>
                  ) : null}
                </div>
              );
            }
          )}
        </div>
      );
    }
    return [];
  }, [pokemon]);

  return (
    <div className='center-items'>
      <span
        style={{
          color:
            error === 'Could not find any Pokemon using that search parameter.'
              ? ''
              : 'red',
        }}
      >
        {error}
      </span>
      <h4>
        Some pokemon to search for: Charizard, Charmander, Pikachu, Squirtle,
        Venusaur
      </h4>
      <Box
        component='form'
        sx={{
          '& > :not(style)': {m: 1, width: '25ch'},
        }}
        noValidate
        autoComplete='off'
      >
        <TextField
          onChange={e => setSearchParam(e.target.value)}
          id='outlined-basic'
          label='Type your favorite pokemon here'
          variant='outlined'
        />
        <LoadingButton loading={loading} onClick={search} variant='contained'>
          Submit
        </LoadingButton>
      </Box>
      <div className='scrollable-pokemon'>{listPokemon()}</div>
    </div>
  );
}
