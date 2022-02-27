import React, { Reducer, useEffect, useReducer, useState } from "react";
import styled, { css } from "styled-components";
import Scholar from "../models/Scholar";
import scholarsReducer, { ScholarAction, SET_PEGA, SET_SCHOLARS } from "../reducers/ScholarReducer";
import Race from "../models/Race";
import Pega from "../models/Pega";
import RawPega from "../rawmodels/RawPega";
import timeSince from "../helpers/timeSince";
import RawRace from "../rawmodels/RawRace";
import Button from "../components/Button";
import mergeRaces from "../helpers/mergeRaces";

const Container = styled.div`
  font-size: 20px;
  margin: 24px;
`;

const ModeSelection = styled.div`
  > * {
    margin-left: 16px;
  }

  > :first-child {
    margin-left: 0;
  }
`;

const StatsButton = styled(Button)`
  background-color: deepskyblue;
  color: white;
`;

const ScholarsTable = styled.table`
  border: 1px solid #222;
`;
const ScholarsThead = styled.thead`
  border: 1px solid #222;
`;
const ScholarsTbody = styled.tbody`
  border: 1px solid #222;
`;

const ScholarRow = styled.tr`
  border: 1px solid #222;
`;

const ScholarTh = styled.th`
  border: 1px solid #222;
  padding: 8px;
  text-transform: capitalize;
`;

interface ScholarTableCellProps {
  isBad?: boolean;
}

const ScholarTableCell = styled.td<ScholarTableCellProps>`
  border: 1px solid #222;
  padding: 8px;

  ${props => props.isBad && css`
    background-color: indianred;
    color: white;
  `}
`;

const ONE_DAY = 24 * 60 * 60 * 1000;

function ScoreCell(props: { value: string }) {
  return (
    <ScholarTableCell isBad={props.value === "0"}>{props.value}</ScholarTableCell>
  );
}

const LdsRing = styled.div`
  display: inline-block;
  position: relative;
  width: 20px;
  height: 20px;

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 16px;
    height: 16px;
    margin: 4px;
    border: 4px solid;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #61dafb transparent transparent transparent;
  }

  div:nth-child(1) {
    animation-delay: -0.45s;
  }

  div:nth-child(2) {
    animation-delay: -0.3s;
  }

  div:nth-child(3) {
    animation-delay: -0.15s;
  }

  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

function LoadingIndicator() {
  return (
    <LdsRing>
      <div />
      <div />
      <div />
      <div />
    </LdsRing>
  );
}


export default function ScholarsDashboard() {
  const initialValue = localStorage.getItem("pegaxy-data") || "";
  const [scholars, dispatch] = useReducer<Reducer<Scholar[], ScholarAction>>(scholarsReducer, []);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(1625547917265));

  const [statsLabel, setStatsLabel] = useState("VIS");
  const [statsFn, setStatsFn] = useState(() => (race: Race) => race.reward);
  const [statsAggregateFn, setStatsAggregateFn] = useState(
    () => (values: number[]) => (values.reduce((a, b) => a + b, 0) || 0).toFixed(0)
  );

  const dates = Array(Math.max(0, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))))
    .fill(0)
    .map((_, i) => new Date(startDate.getTime() + i * (1000 * 60 * 60 * 24))).reverse();

  useEffect(() => {
    const localScholars = (initialValue && JSON.parse(window.atob(initialValue)) as Scholar[]) || [
      new Scholar()
    ];
    dispatch({
      type: SET_SCHOLARS,
      value: localScholars,
    });
    (async () => {
      let scholarStartDate = new Date();
      let scholarEndDate = new Date(1625547917265);
      for (let scholarId = 0; scholarId < localScholars.length; scholarId++) {
        const scholar = localScholars[scholarId];
        for (let pegaId = 0; pegaId < scholar.pegas.length; pegaId++) {
          const pega = scholar.pegas[pegaId];
          try {
            const newPegaRaw: RawPega = (await (await fetch(
              `https://api-apollo.pegaxy.io/v1/game-api/pega/${pega.id}`
            )).json()).pega;
            const rawRaces: RawRace[] = (await (await fetch(
              `https://api-apollo.pegaxy.io/v1/game-api/race/history/pega/${pega.id}`
            )).json()).data;
            const racesFromStorage = JSON.parse(
              window.atob(
                localStorage.getItem(
                  `pegaxy-races-${pega.id}`
                ) || ""
              ) || "[]"
            );
            const mergedRawRaces = mergeRaces(racesFromStorage, rawRaces);
            localStorage.setItem(
              `pegaxy-races-${pega.id}`,
              window.btoa(JSON.stringify(mergedRawRaces))
            )
            const races = mergedRawRaces.map(rawRace => new Race(
              rawRace.id,
              rawRace.reward,
              new Date(rawRace.race.end * 1000),
            ))
            const newPega = new Pega(
              newPegaRaw.id,
              newPegaRaw.name,
              newPegaRaw.energy,
              new Date(newPegaRaw.lastReduceEnergy * 1000),
              newPegaRaw.design.avatar_2,
              races,
            );
            dispatch({
              type: SET_PEGA,
              scholarId,
              pegaId,
              value: newPega,
            });
            for (let raceId = 0; raceId < races.length; raceId++) {
              const race = races[raceId];
              if (race.endDate.getTime() && (scholarStartDate > race.endDate)) {
                scholarStartDate = race.endDate;
              }
              if (race.endDate.getTime() && (scholarEndDate < race.endDate)) {
                scholarEndDate = race.endDate;
              }
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
      console.log("Settings start and end dates...", scholarStartDate, scholarEndDate);
      setStartDate(scholarStartDate);
      setEndDate(scholarEndDate);
      console.log("Set start and end dates!");
      setStartDate(scholarStartDate);
    })();
  }, [initialValue]);

  return (
    <Container>
      <h1>Stats Mode</h1>
      <ModeSelection>
        <StatsButton disabled={statsLabel === "VIS"} onClick={() => {
          setStatsLabel("VIS");
          setStatsFn(() => (race: Race) => race.reward);
          setStatsAggregateFn(() => (values: number[]) => (values.reduce((a, b) => a + b, 0) || 0).toFixed(0));
        }}>VIS</StatsButton>
        <StatsButton disabled={statsLabel === "races"} onClick={() => {
          setStatsLabel("races");
          setStatsFn(() => () => 1);
          setStatsAggregateFn(() => (values: number[]) => (values.reduce((a, b) => a + b, 0) || 0).toFixed(0));
        }}>Races Count</StatsButton>
        <StatsButton disabled={statsLabel === "win rate"} onClick={() => {
          setStatsLabel("win rate");
          setStatsFn(() => (race: Race) => race.reward > 0 ? 1 : 0);
          setStatsAggregateFn(() => (values: number[]) =>
            `${(((values.reduce((a, b) => a + b, 0) / values.length) * 100) || 0).toFixed(2)}%`);
        }}>Win Rate</StatsButton>
      </ModeSelection>
      <h1>Analytics</h1>
      <ScholarsTable>
        <ScholarsThead>
          <tr>
            <ScholarTh rowSpan={2}>Scholar</ScholarTh>
            <ScholarTh rowSpan={2}>Pega #</ScholarTh>
            <ScholarTh rowSpan={2}>Pega Name</ScholarTh>
            <ScholarTh rowSpan={2}>Energy</ScholarTh>
            <ScholarTh rowSpan={2}>Last Energy</ScholarTh>
            <ScholarTh rowSpan={2}>{statsLabel}</ScholarTh>
            {dates.map((date, i) => (
              <ScholarTh key={i} colSpan={2}>
                {(date.getMonth() + 1).toString().padStart(2, "0")}/{date.getDate().toString().padStart(2, "0")}
              </ScholarTh>
            ))}
          </tr>
          <tr>
            {dates.map((date, i) => (
              <React.Fragment key={i}>
                <ScholarTh>
                  AM
                </ScholarTh>
                <ScholarTh>
                  PM
                </ScholarTh>
              </React.Fragment>
            ))}
          </tr>
        </ScholarsThead>
        <ScholarsTbody>
          {scholars.map(scholar => (
            scholar.pegas.map((pega, pegaId) => (
              <ScholarRow key={pegaId}>
                {pegaId === 0 && (
                  <React.Fragment key={pegaId}>
                    <ScholarTableCell rowSpan={scholar.pegas.length}>
                      {scholar.name}&nbsp;
                      ({
                      statsAggregateFn(
                        scholar.pegas.flatMap(pega => pega.races.map(statsFn))
                      )} {statsLabel})
                    </ScholarTableCell>
                  </React.Fragment>
                )}
                <ScholarTableCell>{pega.id}</ScholarTableCell>
                <ScholarTableCell>{pega.name}</ScholarTableCell>
                <ScholarTableCell>{pega.energy}</ScholarTableCell>
                <ScholarTableCell>
                  {(pega.races.length && timeSince(new Date(
                    pega.races
                      .map(race => race.endDate)
                      .map(date => date.getTime())
                      .reduce((a, b) => Math.max(a, b))
                  ))) || (
                    <LoadingIndicator />
                  )}
                </ScholarTableCell>
                <ScholarTableCell>{statsAggregateFn(pega.races.map(statsFn)) || 0}
                </ScholarTableCell>
                {dates.map((date, i) => (
                  <React.Fragment key={i}>
                    <ScoreCell
                      key={`${i}-0`}
                      value={statsAggregateFn(pega.races.filter(race =>
                        race.endDate >= new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0)
                        && race.endDate < new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12)
                      ).map(statsFn))}
                    />
                    <ScoreCell
                      key={`${i}-12`}
                      value={statsAggregateFn(pega.races.filter(race =>
                        race.endDate >= new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12)
                        && race.endDate < new Date(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0).getTime() + ONE_DAY)
                      ).map(statsFn))}
                    />
                  </React.Fragment>
                ))}
              </ScholarRow>
            ))
          ))}
        </ScholarsTbody>

      </ScholarsTable>
    </Container>
  )
}
