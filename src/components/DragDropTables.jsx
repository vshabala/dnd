import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Checkbox,
  Tooltip,
  Snackbar,
  SnackbarContent,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import { Visibility } from "@mui/icons-material";
import { leftTableData, rightTableData } from "./data";

const HeaderRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  "& th": {
    color: "white",
    fontWeight: "bold",
  },
}));

const DragDropTables = () => {
  const [rightRows, setRightRows] = useState(() => {
    const stored = localStorage.getItem("rightTableData");
    return stored ? JSON.parse(stored) : rightTableData;
  });

  const [leftRows, setLeftRows] = useState(() => {
    const stored = localStorage.getItem("leftTableData");
    return stored ? JSON.parse(stored) : leftTableData;
  });

  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    localStorage.setItem("rightTableData", JSON.stringify(rightRows));
    localStorage.setItem("leftTableData", JSON.stringify(leftRows));
  }, [rightRows, leftRows]);

  const handleDragStart = (e, row) => {
    e.dataTransfer.setData("application/json", JSON.stringify(row));
  };

  const handleReset = () => {
    localStorage.removeItem("rightTableData");
    setRightRows(rightTableData);
    localStorage.removeItem("leftTableData");
    setLeftRows(leftTableData);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetRow) => {
    const data = JSON.parse(e.dataTransfer.getData("application/json"));
    let newRightRows = rightRows.filter((el) => el.id != data.id);
    setRightRows(newRightRows);

    let newLeftRows = leftRows.map((el) => {
      return el.id == targetRow.id
        ? {
            ...el,
            pid: el.pid != "" ? `${el.pid}, ${data.id}` : data.id,
            hint: el.hint != "" ? `${el.hint}, ${data.item}` : data.item,
          }
        : el;
    });
    setLeftRows(newLeftRows);
    setConfirm(true);
  };
  const handleClose = () => {
    setConfirm(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        p: 1,
      }}
    >
      <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
        <Snackbar open={confirm} autoHideDuration={3000} onClose={handleClose}>
          <SnackbarContent
            message="Id has been added"
            sx={{
              backgroundColor: "success.main",
              color: "white",
              padding: "6px 10px",
              borderRadius: "8px",
            }}
          />
        </Snackbar>
        <TableContainer component={Paper} sx={{ flex: "1.618" }}>
          <Table>
            <TableHead>
              <HeaderRow>
                <TableCell>ID</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Select</TableCell>
                <TableCell>Isolate</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Predecessors N.</TableCell>
              </HeaderRow>
            </TableHead>
            <TableBody>
              {leftRows.map((row) => (
                <TableRow
                  key={row.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, row)}
                  sx={{ cursor: "pointer" }}
                >
                  <Tooltip title={`${row.hint}`} arrow>
                    <TableCell
                      sx={{ backgroundColor: "grey.300", padding: "4px" }}
                    >
                      {row.pid}
                    </TableCell>
                  </Tooltip>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <Visibility />
                  </TableCell>
                  <TableCell>{row.startdate}</TableCell>
                  <TableCell>{row.enddate}</TableCell>
                  <TableCell>{row.pred}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Right Table (Drag source) */}
        <TableContainer component={Paper} sx={{ flex: 1 }}>
          <Table>
            <TableHead>
              <HeaderRow>
                <TableCell>Item</TableCell>
                <TableCell>ID</TableCell>
              </HeaderRow>
            </TableHead>
            <TableBody>
              {rightRows.map((row) => (
                <TableRow
                  key={row.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, row)}
                  sx={{ cursor: "grab" }}
                >
                  <TableCell>{row.item}</TableCell>
                  <TableCell>{row.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Button variant="contained" onClick={handleReset} sx={{ mt: 4 }}>
        Reset Tables
      </Button>
    </Box>
  );
};

export default DragDropTables;
