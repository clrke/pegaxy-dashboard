import React, { Reducer, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import Scholar from "../models/Scholar";
import scholarsReducer, {
  ADD_PEGA,
  ADD_SCHOLAR, REMOVE_PEGA,
  REMOVE_SCHOLAR,
  ScholarAction, SET_PEGA_ID,
  SET_SCHOLAR_NAME, SET_SCHOLARS
} from "../reducers/ScholarReducer";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Container = styled.div`
  font-size: 20px;
`;

const Input = styled.input`
  border: 1px solid #222;
  padding: 16px;
  font-size: 20px;
`;

const ImportExportSection = styled.section`
  margin: 16px;

  > * {
    margin-left: 16px;
  }

  > :first-child {
    margin-left: 0;
  }
`;

const EncryptedDataInput = styled(Input)`
`;

const ExportButton = styled(Button)`
  background-color: limegreen;
  color: white;
`;

const ImportButton = styled(Button)`
  background-color: darkred;
  color: white;
`;

const DataInputSection = styled.section`
  margin: 16px;
`;

const DataInputRow = styled.section`
  > * {
    margin-left: 16px;
  }

  > :first-child {
    margin-left: 0;
  }
`;

const ScholarInput = styled(Input)`
  margin-bottom: 16px;
`;

const RemoveScholarButton = styled(Button)`
  background-color: darkred;
  color: white;
`;

const AddScholarButton = styled(Button)`
  background-color: limegreen;
  color: white;
`;

const RemovePegaButton = styled(Button)`
  background-color: darkred;
  color: white;
  margin-bottom: 16px;
`;

const AddPegaButton = styled(Button)`
  background-color: limegreen;
  color: white;
  margin-bottom: 16px;
`;

const ActionsSection = styled.section`
  margin: 16px;
`;

const GoToDashboardButton = styled(Button)`
  background-color: deepskyblue;
  color: white;
`;

export default function PegaSetup() {
  const navigate = useNavigate();
  const initialValue = localStorage.getItem("pegaxy-data") || "";
  const [encryptedData, setEncryptedData] = useState(initialValue);
  const [scholars, dispatch] = useReducer<Reducer<Scholar[], ScholarAction>>(
    scholarsReducer,
    (initialValue && JSON.parse(window.atob(initialValue)) as Scholar[]) || [
      new Scholar()
    ]
  );

  useEffect(() => {
    const value = window.btoa(JSON.stringify(scholars))
    setEncryptedData(value);
    localStorage.setItem("pegaxy-data", value);
  }, [scholars]);

  function handleExport() {
    alert("Copied to clipboard!");
  }

  function handleImport() {
    dispatch({
      type: SET_SCHOLARS,
      value: JSON.parse(window.atob(encryptedData))
    })
  }

  return (
    <Container>
      <ImportExportSection>
        <h1>Import/Export</h1>
        <EncryptedDataInput value={encryptedData} onChange={(e) => setEncryptedData(e.target.value)} />
        <ExportButton onClick={handleExport}>Export (Copy)</ExportButton>
        <ImportButton onClick={handleImport}>Import</ImportButton>
      </ImportExportSection>
      <DataInputSection>
        <h1>Scholars</h1>
        {scholars.map((scholar, scholarId) => (
          <DataInputRow key={scholarId}>
            {scholars.length > 1 && (
              <RemoveScholarButton onClick={() => dispatch({
                type: REMOVE_SCHOLAR,
                id: scholarId,
              })}>
                Remove
              </RemoveScholarButton>
            )}
            <ScholarInput placeholder="Name" value={scholar.name} onChange={(e) => dispatch({
              type: SET_SCHOLAR_NAME,
              id: scholarId,
              value: e.target.value
            })} />
            {scholar.pegas.map((pega, pegaId) => (
              <ScholarInput placeholder={`Pega #${pegaId + 1}`} key={pegaId} value={pega.id} onChange={(e) => {
                dispatch({
                  type: SET_PEGA_ID,
                  scholarId,
                  pegaId,
                  value: e.target.value,
                })
              }} />
            ))}
            {scholar.pegas[scholar.pegas.length - 1].id && (
              <AddPegaButton onClick={() => dispatch({
                type: ADD_PEGA,
                id: scholarId,
              })}>
                +
              </AddPegaButton>
            )}
            {scholar.pegas.length > 1 && (
              <RemovePegaButton onClick={() => dispatch({
                type: REMOVE_PEGA,
                id: scholarId,
              })}>
                -
              </RemovePegaButton>
            )}
          </DataInputRow>
        ))}
        {scholars[scholars.length - 1].name && (
          <AddScholarButton onClick={() => dispatch({
            type: ADD_SCHOLAR,
          })}>
            Add Scholar
          </AddScholarButton>
        )}
      </DataInputSection>
      <ActionsSection>
        <h1>Actions</h1>
        <GoToDashboardButton onClick={() => navigate("pegaxy-dashboard/scholars")}>
          Go to Dashboard
        </GoToDashboardButton>
      </ActionsSection>
    </Container>
  )
}
