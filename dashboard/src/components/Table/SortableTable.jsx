import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import ReactTooltip from "react-tooltip";
import GenericToolTip from '../Modal/GenericToolTip';
import FinanceToolTip from '../Modal/FinanceToolTip';
import FitToolTip from '../Modal/FitToolTip';


function descendingComparator(a, b, orderBy) {
  // sort by district
  if (orderBy === 'district') {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  // sorting sentiment
  if (orderBy === 'personalFit') {
    if (b[orderBy].probability < a[orderBy].probability) {
      return -1;
    }
    if (b[orderBy].probability > a[orderBy].probability) {
      return 1;
    }
    return 0;
  }

  // sorting sentiment
  if (orderBy === 'publicPerception') {
    if ((b[orderBy].sentiment === 'N/A') || (b[orderBy].sentiment < a[orderBy].sentiment)) {
      return -1;
    }
    if ((a[orderBy].sentiment === 'N/A') || (b[orderBy].sentiment > a[orderBy].sentiment)) {
      return 1;
    }
    return 0;
  }

  // sorting financial outlook 
  if (orderBy === 'financialOutlook') {
    if ((b[orderBy].year_5 === 'N/A') || (b[orderBy].year_5 < a[orderBy].year_5)) {
      return -1;
    }
    if ((a[orderBy].year_5 === 'N/A') || (b[orderBy].year_5 > a[orderBy].year_5)) {
      return 1;
    }
    return 0;
  }
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'district', numeric: false, disablePadding: false, label: 'District' },
  { id: 'personalFit', numeric: true, disablePadding: false, label: 'Personal Fit' },
  { id: 'publicPerception', numeric: true, disablePadding: false, label: 'Public Perception' },
  { id: 'financialOutlook', numeric: true, disablePadding: false, label: 'Financial Outlook' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          headCell.id !== 'district' ?
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              data-tip="" 
              data-for={headCell.id}
            >
              <ReactTooltip id={headCell.id} border={true} borderColor="gray">
                {
                  headCell.id === 'personalFit' ? 
                    <span>Probability that, based on your profile, you possess the characteristics of a typical person in this district</span> : 
                  headCell.id === 'publicPerception' ? 
                    <span>Weighted average sentiment per district based on twitter tweets; percentage counts of tweets are depicted in a histogram</span>:
                    <span>The 5 year forcasted return is shown; chart displays historical and projected house value</span>
                }
              </ReactTooltip>
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell> : 
          <TableCell
            key={headCell.id}
            data-tip="" 
            data-for={headCell.id}
          > 
            {headCell.label}
            <ReactTooltip id={headCell.id} border={true} borderColor="gray">
              <span>Districts in New York City</span>
            </ReactTooltip>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function SortableTable(props) {
	const [rows, setRows] = useState(props.rows);
  const classes = useStyles();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('personalFit');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const buckets = [
    '-1 to -0.8', '-0.8 to -0.6', '-0.6 to -0.4', '-0.4 to -0.2', '-0.2 to 0',
    '0 to 0.2', '0.2 to 0.4', '0.4 to 0.6', '0.6 to 0.8', '0.8 to 1'
  ];
  const attributes = [
    'median_age', 'median_income', 'median_bed', 'median_veh'
  ];

	useEffect(() => setRows(props.rows), [props.rows]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size='medium'
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.district}
                    >
                      <TableCell component="th" scope="row">
                        {row.district}
                      </TableCell>
                      <TableCell align="right" data-tip="" data-for={row.district + 'Personal'} >
                        {row.personalFit.probability}
                        <ReactTooltip id={row.district + 'Personal'} backgroundColor="white" border={true} borderColor="gray">
                          <FitToolTip data={row.personalFit} yRange={attributes} type={'bar'}/>
                        </ReactTooltip>
                      </TableCell>
                      <TableCell align="right" data-tip="" data-for={row.district + 'Sentiment'}>
                        {row.publicPerception.sentiment === ("N/A" || undefined) ? "N/A" : Number(row.publicPerception.sentiment.toFixed(3))}
                        {row.publicPerception.sentiment !== "N/A" ? 
                          <ReactTooltip id={row.district + 'Sentiment'} backgroundColor="white" border={true} borderColor="gray">
                            <GenericToolTip data={row.publicPerception.histogram} yRange={buckets} type={'bar'}/>
                          </ReactTooltip> : ""}
                      </TableCell>
                      <TableCell align="right" data-tip="" data-for={row.district + 'Finance'}>
                        {row.financialOutlook.year_5 === ("N/A" || undefined) ? "N/A" : Number(row.financialOutlook.year_5.toFixed(3))}
                        {row.financialOutlook.year_5 !== "N/A" ? 
                          <ReactTooltip id={row.district + 'Finance'} backgroundColor="white" border={true} borderColor="gray">
                            <FinanceToolTip historical={row.financialOutlook.current} projection={row.financialOutlook.projection} />
                          </ReactTooltip> : ""}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}