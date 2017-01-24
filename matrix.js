import React, { Component } from 'react';

import { AppRegistry,
	View, Text, TextInput, TouchableOpacity
} from 'react-native';

import Dimensions from 'Dimensions';

export class MyApp extends Component {

	constructor() {
		super();
		this.state = {};
		this.reset();
	}

	reset() {
		this.width = Dimensions.get('window').width;
		this.height = Dimensions.get('window').height;
		this.row = 14;
		this.col = 8;
		this.board = [];
		for (let i = 0; i < this.row; i++) {
			this.board[i] = [];
			for (let j = 0; j < this.col; j++) {
				this.board[i][j] = 0;
			}
		}
		this.parity = true;
		this.color = ['#f7f7f7', 'lightpink', 'lightblue', 'lightgreen'];
		this.block = 3;
		if (this.interval) clearInterval(this.interval);
		this.interval = setInterval( () => this.fall(), 500);
	}

	newItem() {
		let c = this.col/2;
		if (this.parity) c--;
		this.parity = !this.parity;
		if (this.board[this.block][c] != 0) this.reset();
		for (let i = 0; i < this.block; i++)
			this.board[i][c] = 1 + parseInt(Math.random() * (this.color.length - 1));
		this.lowest = {row: this.block-1, col: c};
		this.setState({});
	}

	fall() {
		let count = 0;
		let lowest = null;
		for (let i = this.row - 1; i > 0; i--)
		for (let j = 0; j < this.col; j++) {
			if (this.board[i  ][j] == 0 &&
				this.board[i-1][j] != 0) {
				this.board[i  ][j] = this.board[i-1][j];
				this.board[i-1][j] = 0;
				if (count == 0) this.lowest = {row: i, col: j};
				count++;
			}
		}
		if (count > 0) { this.setState({}); }
		else {
			for (let i = this.row - 1; i > 0; i--) {
				let ok = true;
				for (let j = 0; j < this.col; j++) {
					if (this.board[i][0] != this.board[i][j])
						ok = false;
				}
				if (ok) {
					count++;
					for (let j = 0; j < this.col; j++) {
						this.board[i  ][j] = this.board[i-1][j];
						this.board[i-1][j] = 0;
					}
				}
			}
			if (count > 0) this.setState({});
			this.newItem();
		}
	}

	render() {
		let tileSize = 24;
		let tilePad  = 1;

		let startX = (this.width -
				(this.col * (tileSize + tilePad)) + tilePad) / 2;
		let startY = 40;
		let tiles  = [];

		let blank = {
			position:'absolute', width:tileSize, height:tileSize,
			backgroundColor:'#f7f7f7',
		};
		for (let i = 0; i < this.row; i++) {
			tiles[i] = [];
			for (let j = 0; j < this.col; j++) {
				let s = {}; Object.assign(s, blank);
				s.left = j * (tileSize + tilePad) + startX;
				s.top  = i * (tileSize + tilePad) + startY;
				s.backgroundColor = this.color[this.board[i][j]];
				tiles[i][j] = (
					<TouchableOpacity style={s}>
					</TouchableOpacity>);
			}
		}

		let buttons = [];
		let button = {backgroundColor:'lightslategray', borderRadius:4,
			position:'absolute',
			width: tileSize*2, height: tileSize*2 };
		let b = [{},{},{},{}];
		Object.assign(b[0], button);
		b[0].left = (tileSize+tilePad)*(this.col/2-1) + startX;
		b[0].top  = (tileSize+tilePad)*(this.row+1) + startY;
		buttons[0] = (<TouchableOpacity style={b[0]}
							onPress={this.top.bind(this)} key='0' >
						</TouchableOpacity>);
		Object.assign(b[1], button);
		b[1].left = (tileSize+tilePad)*(this.col/2+1) + startX;
		b[1].top  = (tileSize+tilePad)*(this.row+3) + startY;
		buttons[1] = (<TouchableOpacity style={b[1]}
							onPress={this.right.bind(this)} key='1' >
						</TouchableOpacity>);
		Object.assign(b[2], button);
		b[2].left = (tileSize+tilePad)*(this.col/2-1) + startX;
		b[2].top  = (tileSize+tilePad)*(this.row+5) + startY;
		buttons[2] = (<TouchableOpacity style={b[2]}
							onPress={this.bottom.bind(this)} key='2' >
						</TouchableOpacity>);
		Object.assign(b[3], button);
		b[3].left = (tileSize+tilePad)*(this.col/2-3) + startX;
		b[3].top  = (tileSize+tilePad)*(this.row+3) + startY;
		buttons[3] = (<TouchableOpacity style={b[3]}
							onPress={this.left.bind(this)} key='3' >
						</TouchableOpacity>);
		return (
			<View style={{ paddingTop: 24 }} >
				{tiles}
				{buttons}
			</View>);
	}

	top() {
		let tmp =
		this.board[this.lowest.row  ][this.lowest.col];
		this.board[this.lowest.row  ][this.lowest.col]=
		this.board[this.lowest.row-1][this.lowest.col];
		this.board[this.lowest.row-1][this.lowest.col]=
		this.board[this.lowest.row-2][this.lowest.col];
		this.board[this.lowest.row-2][this.lowest.col]= tmp;
		this.setState({});
	}

	left() {
		if (this.lowest.col > 0) {
			let ok = true;
			for (let k = 0; k < this.block; k++)
				if (this.board[this.lowest.row-k][this.lowest.col-1] != 0)
					ok = false;
			if (ok) {
				for (let k = 0; k < this.block; k++) {
					this.board[this.lowest.row-k][this.lowest.col-1] =
					this.board[this.lowest.row-k][this.lowest.col  ];
					this.board[this.lowest.row-k][this.lowest.col  ] = 0;
				}
				this.lowest.col--;
				this.setState({});
			}
		}
	}

	right() {
		if (this.lowest.col < this.col-1) {
			let ok = true;
			for (let k = 0; k < this.block; k++)
				if (this.board[this.lowest.row-k][this.lowest.col+1] != 0)
					ok = false;
			if (ok) {
				for (let k = 0; k < this.block; k++) {
					this.board[this.lowest.row-k][this.lowest.col+1] =
					this.board[this.lowest.row-k][this.lowest.col  ];
					this.board[this.lowest.row-k][this.lowest.col  ] = 0;
				}
				this.lowest.col++;
				this.setState({});
			}
		}
	}

	bottom() {
		this.fall();
	}

}

AppRegistry.registerComponent('MyApp', () => MyApp);
