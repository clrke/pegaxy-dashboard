import mergeRaces from "./mergeRaces";
import RawRace from "../rawmodels/RawRace";

test('mergeRaces merges two overlapping races', () => {
  const rawRaces1: RawRace[] = [{id: "1", reward: 2, race: {end: 1}}, {id: "2", reward: 2, race: {end: 1}}]
  const rawRaces2: RawRace[] = [{id: "2", reward: 2, race: {end: 1}}, {id: "3", reward: 2, race: {end: 1}}]
  const mergedRaces = mergeRaces(rawRaces1, rawRaces2);
  expect(mergedRaces).toHaveLength(3);
  expect(mergedRaces[0]).toEqual(rawRaces1[0]);
  expect(mergedRaces[1]).toEqual(rawRaces1[1]);
  expect(mergedRaces[2]).toEqual(rawRaces2[1]);
});

test('mergeRaces merges two non-overlapping races', () => {
  const rawRaces1: RawRace[] = [{id: "1", reward: 2, race: {end: 1}}, {id: "2", reward: 2, race: {end: 1}}]
  const rawRaces2: RawRace[] = [{id: "3", reward: 2, race: {end: 1}}, {id: "4", reward: 2, race: {end: 1}}]
  const mergedRaces = mergeRaces(rawRaces1, rawRaces2);
  expect(mergedRaces).toHaveLength(4);
  expect(mergedRaces[0]).toEqual(rawRaces1[0]);
  expect(mergedRaces[1]).toEqual(rawRaces1[1]);
  expect(mergedRaces[2]).toEqual(rawRaces2[0]);
  expect(mergedRaces[3]).toEqual(rawRaces2[1]);
});
