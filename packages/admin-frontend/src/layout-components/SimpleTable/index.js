import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {Button} from '@material-ui/core';

export default function index({ rows }) {
  
    const goFlow = (id) => {
    return window.open(`https://flow.gestdoc.cl/procedure/${id}`);
  };

  const formaDate = (date) => {
    let newdate = new Date(date);
    return newdate.toLocaleString();
  };

  return (
    <TableContainer component={Paper}>
      <Table style={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Ir</TableCell>
            <TableCell align="right">Documento</TableCell>
            <TableCell align="right">Fecha</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.bpmn._id}>
              <TableCell scope="row">
                  <Button 
										className="m-2 btn-primary" onClick={() => goFlow(row.bpmn._id)}>
                      Ir al documento
                  </Button>
                  </TableCell>
              <TableCell align="right">{row.bpmn._nameSchema}</TableCell>
              <TableCell align="right">{formaDate(row.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
