import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button, Checkbox, Tooltip
} from '@mui/material';

import { Visibility } from '@mui/icons-material';

import { leftTableData, rightTableData } from './data';

const DragDropTables = () => {

  const [rightRows, setRightRows] = useState(() => {
    const stored = localStorage.getItem('rightTableData');
    return stored ? JSON.parse(stored) : rightTableData;
  });

  const [leftRows, setLeftRows] = useState(() => {
    const stored = localStorage.getItem('leftTableData');
    return stored ? JSON.parse(stored) : leftTableData;
  });
  
  useEffect(() => {
    localStorage.setItem('rightTableData', JSON.stringify(rightRows));
  }, [rightRows]);

  useEffect(() => {
    localStorage.setItem('leftTableData', JSON.stringify(leftRows));
  }, [leftRows]);

  const handleDragStart = (e, row) => {
    e.dataTransfer.setData('application/json', JSON.stringify(row));
  };
  
  const handleReset = () => {
    localStorage.removeItem('rightTableData');
    setRightRows(rightTableData);
    localStorage.removeItem('leftTableData');
    setLeftRows(leftTableData);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); 
  };

  const handleDrop = (e, targetRow) => {
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    let newRightRows = rightRows.filter(el => el.id!=data.id);
    setRightRows(newRightRows);

    let newLeftRows = leftRows.map(el => 
      {return (el.id ==targetRow.id)?  {...el, pid: el.pid !="" ? `${el.pid}, ${data.id}`: data.id,
      hint: el.hint !="" ? `${el.hint}, ${data.item}`: data.item} : el })
     setLeftRows(newLeftRows)
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%',  alignItems: 'center', p: 1 }}>
    <Box sx={{ display: 'flex',  width: '100%', gap: 2 }}>
      <TableContainer component={Paper} sx={{ flex: '1.618' }}>
        <Table>
          <TableHead sx={{ color: '#fff'}} >
            <TableRow sx={{ backgroundColor: 'primary.main'}}>
              <TableCell sx={{ color: 'white' }}>ID</TableCell>
              <TableCell sx={{ color: 'white' }}>Description</TableCell>
              <TableCell sx={{ color: 'white' }}>Select</TableCell>
              <TableCell sx={{ color: 'white' }}>Isolate</TableCell>
              <TableCell sx={{ color: 'white' }}>Start Date</TableCell>
              <TableCell sx={{ color: 'white' }}>End Date</TableCell>
              <TableCell sx={{ color: 'white' }}>Predecessors</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leftRows.map((row) => (
              <TableRow
                key={row.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, row)}
                sx={{ cursor: 'pointer' }}
              >
                <Tooltip title={`${row.hint}`} arrow>
                <TableCell  sx={{backgroundColor: 'grey.300', padding: '4px' }}>{row.pid}</TableCell>
                </Tooltip>
                <TableCell>{row.description}</TableCell>
                <TableCell><Checkbox/></TableCell>
                <TableCell><Visibility /></TableCell>
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
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white' }}>Item</TableCell>
              <TableCell sx={{ color: 'white' }}>ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rightRows.map((row) => (
              <TableRow
                key={row.id}
                draggable
                onDragStart={(e) => handleDragStart(e, row)}
                sx={{ cursor: 'grab' }}
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
