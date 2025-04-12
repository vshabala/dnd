import React, { useState, useEffect } from "react"
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
} from "@mui/material"

import { styled } from "@mui/material/styles"
import { Visibility } from "@mui/icons-material"
import { leftTableData, rightTableData } from "./data"

const HeaderRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  "& th": {
    color: "white",
    fontWeight: "bold",
  },
}))

const useStored = (name, defaultValue) => {
  const stored = localStorage.getItem(name)
  const initialValue = stored ? JSON.parse(stored) : defaultValue
  const [value, setValue] = useState(initialValue)
  useEffect(() => {
    localStorage.setItem(name, JSON.stringify(value))
  }, [value])
  return [value, setValue]
}

const DragDropTables = () => {
  const [rightRows, setRightRows] = useStored("rightTableData", rightTableData)
  const [leftRows, setLeftRows] = useStored("leftTableData", leftTableData)
  const [movedItems, setMovedItems] = useStored("movedItems", [])
  const [confirm, setConfirm] = useState(false)

  const handleDragStart = (e, row) => {
    e.dataTransfer.setData("application/json", JSON.stringify(row))
  }

  const handleUndo = () => {
    const newMovedItems = [...movedItems]
    const step = newMovedItems.pop()
    const { number, target_id, ...row } = step
    setMovedItems(newMovedItems)

    const newRightRows = [...rightRows]
    newRightRows.splice(number, 0, row)
    setRightRows(newRightRows)

    const newLeftRows = leftRows.map((el) => {
      if (el.id === target_id) {
        return {
          ...el,
          pid: el.pid.filter((val) => val !== row.id),
          hint: el.hint.filter((val) => val !== row.item),
        }
      }
      return el
    })
    setLeftRows(newLeftRows)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, targetRow) => {
    const data = JSON.parse(e.dataTransfer.getData("application/json"))
    let newRightRows = rightRows.filter((el) => el.id != data.id)
    setRightRows(newRightRows)

    let newLeftRows = leftRows.map((el) => {
      return el.id == targetRow.id
        ? {
            ...el,
            pid: Array.isArray(el.pid) ? [...el.pid, data.id] : [data.id],
            hint: Array.isArray(el.hint)
              ? [...el.hint, data.item]
              : [data.item],
          }
        : el
    })
    setLeftRows(newLeftRows)
    const newMovedItems = [...movedItems, { ...data, target_id: targetRow.id }]
    setMovedItems(newMovedItems)
    setConfirm(true)
  }
  const handleClose = () => {
    setConfirm(false)
  }

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
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "flex-end",
          width: "100%",
          p: 0.5,
        }}
      >
        <Button
          variant="contained"
          onClick={handleUndo}
          sx={{
            mt: 2,
            opacity: movedItems.length > 0 ? 1 : 0.5,
            transition: "opacity 0.5s",
          }}
        >
          Undo
        </Button>
      </Box>
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
                >
                  <Tooltip
                    title={Array.isArray(row.hint) && row.hint.join(", ")}
                    arrow
                  >
                    <TableCell
                      sx={{ backgroundColor: "grey.300", padding: "4px" }}
                    >
                      {Array.isArray(row.pid) && row.pid.join(", ")}
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
              {rightRows.map((row, index) => (
                <TableRow
                  key={row.id}
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e, { ...row, number: index })
                  }
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
    </Box>
  )
}

export default DragDropTables
