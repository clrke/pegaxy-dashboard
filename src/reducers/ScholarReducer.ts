import Scholar from "../models/Scholar";
import Pega from "../models/Pega";
import Race from "../models/Race";

export const SET_SCHOLARS = 'SET_SCHOLARS';
export const ADD_SCHOLAR = 'ADD_SCHOLAR';
export const REMOVE_SCHOLAR = 'REMOVE_SCHOLAR';
export const SET_SCHOLAR_NAME = 'SET_SCHOLAR_NAME';
export const ADD_PEGA = 'ADD_PEGA';
export const REMOVE_PEGA = 'REMOVE_PEGA';
export const SET_PEGA = 'SET_PEGA';
export const SET_PEGA_ID = 'SET_PEGA_ID';
export const SET_PEGA_RACES = 'SET_PEGA_RACES';

export type ScholarAction = {
  type: typeof SET_SCHOLARS;
  value: Scholar[];
} | {
  type: typeof ADD_SCHOLAR;
} | {
  type: typeof REMOVE_SCHOLAR;
  id: number;
} | {
  type: typeof SET_SCHOLAR_NAME;
  id: number;
  value: string;
} | {
  type: typeof ADD_PEGA;
  id: number;
} | {
  type: typeof REMOVE_PEGA;
  id: number;
} | {
  type: typeof SET_PEGA;
  scholarId: number;
  pegaId: number;
  value: Pega;
} | {
  type: typeof SET_PEGA_ID;
  scholarId: number;
  pegaId: number;
  value: string;
} | {
  type: typeof SET_PEGA_RACES;
  scholarId: number;
  pegaId: number;
  value: Race[];
};

export default function scholarsReducer(state: Scholar[], action: ScholarAction): Scholar[] {
  switch (action.type) {
    case SET_SCHOLARS:
      return [...action.value];
    case ADD_SCHOLAR:
      return [...state, new Scholar()];
    case REMOVE_SCHOLAR:
      return [...state.slice(0, action.id), ...state.slice(action.id + 1)];
    case SET_SCHOLAR_NAME:
      return state.map((scholar, index) => {
        if (index !== action.id) return scholar;
        return new Scholar(action.value, scholar.pegas);
      });
    case ADD_PEGA:
      return state.map((scholar, index) => {
        if (index !== action.id) return scholar;
        return new Scholar(scholar.name, [...scholar.pegas, new Pega()]);
      });
    case REMOVE_PEGA:
      return state.map((scholar, index) => {
        if (index !== action.id) return scholar;
        return new Scholar(scholar.name, scholar.pegas.slice(0, scholar.pegas.length - 1));
      });
    case SET_PEGA:
      return state.map((scholar, scholarId) => {
        if (scholarId !== action.scholarId) return scholar;
        const pegas = scholar.pegas.map((pega, pegaId) => {
          if (pegaId !== action.pegaId) return pega;
          const newPega = action.value;
          return new Pega(
            newPega.id,
            newPega.name,
            newPega.energy,
            newPega.lastReduceEnergy,
            newPega.avatar,
            newPega.races
          );
        });
        return new Scholar(scholar.name, pegas);
      });
    case SET_PEGA_ID:
      return state.map((scholar, scholarId) => {
        if (scholarId !== action.scholarId) return scholar;
        const pegas = scholar.pegas.map((pega, pegaId) => {
          if (pegaId !== action.pegaId) return pega;
          return new Pega(
            action.value,
            pega.name,
            pega.energy,
            pega.lastReduceEnergy,
            pega.avatar,
            pega.races,
          );
        });
        return new Scholar(scholar.name, pegas);
      });
    case SET_PEGA_RACES:
      return state.map((scholar, scholarId) => {
        if (scholarId !== action.scholarId) return scholar;
        const pegas = scholar.pegas.map((pega, pegaId) => {
          if (pegaId !== action.pegaId) return pega;
          return new Pega(
            pega.id,
            pega.name,
            pega.energy,
            pega.lastReduceEnergy,
            pega.avatar,
            action.value
          );
        });
        return new Scholar(scholar.name, pegas);
      });
    default:
      return state;
  }
}
