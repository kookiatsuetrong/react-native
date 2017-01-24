import React, { Component } from 'react';

import { AppRegistry,
	View, Text, TextInput, TouchableOpacity
} from 'react-native';

import Dimensions from 'Dimensions';

export class MyApp extends Component {

	constructor() {
		super();
		this.state = {};
		this.viewStyle = { paddingTop: 24 };
		this.reset();
	}

	reset() {
		this.state.board = [];
		this.state.row   = 10;
		this.state.col   = 6;
		this.state.color = 5;
		for (let i = 0; i < this.state.row; i++) {
			this.state.board[i] = [];
			for (let j = 0; j < this.state.col; j++) {
				this.state.board[i][j] = 1 + parseInt(
					Math.random() * this.state.color);
			}
		}

		let {height, width} = Dimensions.get('window');
		this.width = width;
		this.height = height;
		this.correctRow = parseInt(Math.random() * this.state.row);
		this.correctCol = parseInt(Math.random() * this.state.col);
		this.tileSize = 40;
		this.tilePad  = 2;
		this.tileStyle = {
			position: 'absolute',
			width: this.tileSize,
			height: this.tileSize,
			backgroundColor: 'lightslategray',
			borderRadius: this.tileSize / 2
		};
		this.failCount = 0;
	}

	render() {
		let tiles  = [];
		let startX = (this.width -
					(this.state.col * (this.tileSize + this.tilePad)) +
						this.tilePad) / 2;

		for (let i = 0; i < this.state.row; i++) {
			tiles[i] = [];
			for (let j = 0; j < this.state.col; j++) {
				let s = {};
				for (let k in this.tileStyle) {
					s[k] = this.tileStyle[k];
				}
				switch (this.state.board[i][j]) {
					case 1: s.backgroundColor  = 'lightsalmon'; break;
					case 2: s.backgroundColor  = 'lightpink'; break;
					case 3: s.backgroundColor  = 'lightgreen'; break;
					case 4: s.backgroundColor  = 'lightblue'; break;
					case 5: s.backgroundColor  = 'plum'; break;
					default: s.backgroundColor = 'white'; break;
				}

				s.left = startX + j * (this.tileSize + this.tilePad);
				s.top  =    (i + 1) * (this.tileSize + this.tilePad);
				let p = {row: i, col: j};
				tiles[i][j] = (
					<TouchableOpacity style={s}
						onPress={this.click.bind(this, p)}
					></TouchableOpacity>
				);
			}
		}

		return <View style={this.viewStyle}>{tiles}</View>;
	}

	click(p) {
		let color = this.state.board[p.row][p.col];
		if (color == 0) {
			this.failCount++;
			if (this.failCount >= 3) {
				this.reset();
			}
		} else {
			this.failCount = 0;
			this.remove(color, p);
			this.fall();
			this.left();
		}
		this.setState({});
	}

	remove(color, p) {
		let dir = [ {row: -1, col:  0}, {row: +1, col:  0},
					{row:  0, col: -1}, {row:  0, col: +1} ];
		for (let k = 0; k < dir.length; k++) {
			let q = {row: p.row + dir[k].row, col: p.col + dir[k].col};
			if (q.row >= 0 && q.row <  this.state.row &&
				q.col >= 0 && q.col <  this.state.col) {
				if (color == this.state.board[q.row][q.col]) {
					this.state.board[q.row][q.col] = 0;
					this.remove(color, q);
				}
			}
		}
	}

	fall() {
		for (let i = this.state.row - 1; i >= 0; i--) {
			for (let j = 0; j < this.state.row; j++) {
				if (this.state.board[i][j] == 0) {
					let p = i;
					while (p >= 0 && this.state.board[p][j] == 0) {
						p--;
					}
					if (p >= 0) {
						this.state.board[i][j] = this.state.board[p][j];
						this.state.board[p][j] = 0;
					}
				}
			}
		}
	}

	left() {
		for (let j = 0; j < this.state.col; j++) {
			if (this.state.board[this.state.row - 1][j] == 0) {
				let p = j;
				while (p < this.state.col &&
					this.state.board[this.state.row - 1][p] == 0) {
					p++;
				}
				if (p < this.state.col) {
					for (let i = 0; i < this.state.row; i++) {
						this.state.board[i][j] = this.state.board[i][p];
						this.state.board[i][p] = 0;
					}
				}
			}
		}
	}
}

AppRegistry.registerComponent('MyApp', () => MyApp);
