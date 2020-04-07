import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


class ResultsTable extends Component {
    constructor(props) {
		super(props);
		this.state = {
			classes: makeStyles({
                table: {
                  minWidth: 650,
                },
            }),
			rows: props.rows,
		}
    }

    componentDidUpdate(prevProps) {
        if (prevProps.rows !== this.props.rows) {
            this.setState({ 
                rows: this.props.rows,
            });
        }
    }

    render () {
        return (
            <TableContainer component={Paper}>
                <Table className={this.state.classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">District</TableCell>
                            <TableCell align="center">Personal Fit</TableCell>
                            <TableCell align="center">Public Perception</TableCell>
                            <TableCell align="center">Financial Outlook</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.rows.map((row) => (
                        <TableRow key={row.district}>
                            <TableCell component="th" scope="row" align="left">{row.district}</TableCell>
                            <TableCell align="center">{row.personalFit}</TableCell>
                            <TableCell align="center">{row.publicPerception}</TableCell>
                            <TableCell align="center">{row.financialOutlook}</TableCell>
                        </TableRow>
                        ))
                    }
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

export default ResultsTable;
