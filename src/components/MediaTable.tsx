import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table";
import type { Media } from "../types/media";

interface Props {
  mediaList: Media[];
}

export default function MediaTable({ mediaList }: Props) {
  const [filterGenre, setFilterGenre] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const filteredData = useMemo(() => {
    return mediaList.filter((m) => {
      return (
        (filterGenre === "" || m.genre === filterGenre) &&
        (filterPlatform === "" || m.platform === filterPlatform) &&
        (filterStatus === "" || m.status === filterStatus)
      );
    });
  }, [mediaList, filterGenre, filterPlatform, filterStatus]);

  const columns = useMemo<ColumnDef<Media>[]>(
    () => [
      {
        header: "SL NO",
        cell: ({ table, row }) => {
          const sortedRows = table.getSortedRowModel().rows;
          const currentRow = row.original;
          const globalIndex = sortedRows.findIndex(
            (r) => r.original === currentRow
          );
          return globalIndex + 1;
        },
      },
      { header: "TITLE", accessorKey: "title" },
      {
        header: "TYPE",
        accessorKey: "type",
        accessorFn: (row) =>
          row.type
            .toLowerCase()
            .replace(/_/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
      },
      { header: "DIRECTOR", accessorKey: "director" },
      { header: "PLATFORM", accessorKey: "platform" },
      {
        header: "STATUS",
        accessorKey: "status",
        accessorFn: (row) =>
          row.status
            .toLowerCase()
            .replace(/_/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
      },
      { header: "GENRE", accessorKey: "genre" },
      {
        header: "EPISODES",
        cell: ({ row }) =>
          row.original.type === "tv" ? row.original.totalEpisodes ?? "?" : "-",
      },
      {
        header: "ACTION",
        cell: ({ row }) => (
          <Button
            component={Link}
            to={`/progress/${row.original.type}/${row.original.id}`}
            variant="contained"
            color="inherit"
            size="small"
          >
            Track Progress
          </Button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const genres = Array.from(new Set(mediaList.map((m) => m.genre)));
  const platforms = Array.from(new Set(mediaList.map((m) => m.platform)));
  const statuses = Array.from(new Set(mediaList.map((m) => m.status)));

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Genre</InputLabel>
          <Select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            label="Genre"
          >
            <MenuItem value="">All</MenuItem>
            {genres.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Platform</InputLabel>
          <Select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            label="Platform"
          >
            <MenuItem value="">All</MenuItem>
            {platforms.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            {statuses.map((s) => (
              <MenuItem key={s} value={s}>
                {s
                  .toLowerCase()
                  .replace(/_/g, " ")
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          onClick={() => {
            setFilterGenre("");
            setFilterPlatform("");
            setFilterStatus("");
          }}
          variant="outlined"
          size="small"
        >
          Clear Filters
        </Button>
      </Box>

      {(filterGenre || filterPlatform || filterStatus) && (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          {filterGenre && (
            <Typography variant="body2" color="text.secondary">
              Genre: <strong>{filterGenre}</strong>
            </Typography>
          )}
          {filterPlatform && (
            <Typography variant="body2" color="text.secondary">
              Platform: <strong>{filterPlatform}</strong>
            </Typography>
          )}
          {filterStatus && (
            <Typography variant="body2" color="text.secondary">
              Status: <strong>{filterStatus}</strong>
            </Typography>
          )}
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table size="small">
          <Tooltip title="click to sort asc/desc">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1976d2" }}>
                {table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      sx={{
                        cursor: "pointer",
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </TableCell>
                  ))
                )}
              </TableRow>
            </TableHead>
          </Tooltip>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Typography variant="body2" textAlign="center">
                    No media found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="center" gap={2}>
        <Button
          variant="outlined"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
