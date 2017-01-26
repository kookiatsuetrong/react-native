import React, { Component } from 'react';

import { AppRegistry,
	View, Text, TextInput, TouchableOpacity
} from 'react-native';

import Dimensions from 'Dimensions';

export class MyApp extends Component {

	constructor() {
		super();
		this.state = {};
		this.button = { borderRadius:4, backgroundColor:'lightslategray',
						padding:4, margin:4, width:100 };
		this.reset();
	}

	reset() {
		this.board = [];
		this.row = 8;
		this.col = 8;
		for (let i = 0; i <= this.row + 1; i++) this.board[i] = [];
		for (let i = 0; i <= this.row + 1; i++) {
			for (let j = 0; j <= this.col + 1; j++) {
				this.board[i][j] = 0;
				this.board[0][j] = -1;
				this.board[this.row + 1][j] = -1;
			}
			this.board[i][0] = -1;
			this.board[i][this.col + 1] = -1;
		}
		this.board[this.row / 2    ][this.col / 2    ] =
		this.board[this.row / 2 + 1][this.col / 2 + 1] = 1;
		this.board[this.row / 2    ][this.col / 2 + 1] =
		this.board[this.row / 2 + 1][this.col / 2    ] = 2;
		this.turn = 2;
		let {height, width} = Dimensions.get('window');
		this.width = width;
		this.height = height;
		this.tileSize = 40;
		this.tilePad = 0;
		this.tileStyle = { position:'absolute', borderColor:'lightslategray',
			width:this.tileSize, height:this.tileSize, borderWidth:1, padding:2};
	}

	render() {
		let tiles  = [];
		let startX = (this.width -
				(this.col * (this.tileSize + this.tilePad)) + this.tilePad) / 2;
		let startY = 60;
		let u = {
			position:'absolute', width:this.tileSize-8, height:this.tileSize-8,
			borderRadius: (this.tileSize - 6) / 2, backgroundColor: 'lightblue',
			marginTop:3, marginLeft:3};
		let c = {};
		Object.assign(c, u);
		c.backgroundColor = 'lightpink';
		for (let i = 1; i <= this.row; i++) {
			tiles[i - 1] = [];
			for (let j = 1; j <= this.col; j++) {
				let b = {}; Object.assign(b, this.tileStyle);
				b.left = (j-1) * (this.tileSize + this.tilePad) + startX;
				b.top  =     i * (this.tileSize + this.tilePad) + startY;
				let p = {row: i, col: j};
				let s = {}
				if (this.board[i][j] == 1) s = c;
				if (this.board[i][j] == 2) s = u;
				tiles[i-1][j-1] = (
					<TouchableOpacity style={b}
						onPress={this.click.bind(this, p)}
					><View style={s}></View>
					</TouchableOpacity>);
			}
		}
		let count1 = this.count(1, this.board);
		let count2 = this.count(2, this.board);
		let board1 = { backgroundColor:'lightpink', color:'white',
				width:this.width / 2, position:'absolute', textAlign:'center',
				top: (this.row + 1) * this.tileSize + startY, fontSize:20,
			 	marginTop: 4 };
		let board2 = {};
		Object.assign(board2, board1);
		board2.backgroundColor = 'lightblue';
		board2.left = this.width / 2;
		return (
		<View style={{ paddingTop: 24, alignItems:'center' }} >
			<TouchableOpacity style={this.button}
				onPress={ () => { this.reset(); this.setState({}); }} >
				<Text style={{ textAlign:'center', color:'white'}} >New</Text>
			</TouchableOpacity>
			<TouchableOpacity style={this.button}
				onPress={ () => { this.turn = 1; this.greedy(); }} >
				<Text style={{ textAlign:'center', color:'white'}} >Pass</Text>
			</TouchableOpacity>
			{tiles}
			<Text style={board1}>{count1}</Text>
			<Text style={board2}>{count2}</Text>
		</View>);
	}

	click(p) {
		if (this.turn == 2) {
			if (this.board[p.row][p.col] == 0) {
				let count = this.flip(p, 2, false);
				if (count > 0) {
					this.flip(p, 2, true);
					this.turn = 1;
					this.setState({});
					this.greedy();
				}
			}
		}
	}

	count(cur, board) {
		let score = 0;
		for (let i = 1; i <= this.row; i++)
		for (let j = 1; j <= this.col; j++)
			if (board[i][j] == cur) score++;
		return score;
	}

	flip(p, cur, real) {
		let board = [];
		if (real) {
			board = this.board;
		} else {
			for (let i = 0; i <= this.row+1; i++) {
				board[i] = [];
				for (let j = 0; j <= this.col+1; j++) {
					board[i][j] = this.board[i][j];
				}
			}
		}
		board[p.row][p.col] = cur;
		let opp = cur == 1 ? 2 : 1;
		let count = 0;
		for (let r = -1; r <= 1; r++)
		for (let c = -1; c <= 1; c++) {
			if (r == 0 && c == 0) { /* nothing */ } else {
				let f = 0;
				let nr = p.row + r;
				let nc = p.col + c;
				let endCur = false;
				while  (board[nr][nc] != -1) {
					if (board[nr][nc] == 0) break;
					if (board[nr][nc] == cur) { endCur = true; break; };
					if (board[nr][nc] == opp) f++;
					nr += r; nc += c;
				}
				if (endCur) {
					count += f;
					nr = p.row + r;
					nc = p.col + c;
					while  (board[nr][nc] != -1) {
						if (board[nr][nc] == 0) break;
						if (board[nr][nc] == cur) break;
						if (board[nr][nc] == opp) board[nr][nc] = cur;
						nr += r; nc += c;
					}
				}
			}
		}
		return count;
	}

	greedy() {
		let max = 0;
		let best = {};
		for (let r = 1; r <= this.row; r++) {
			for (let c = 1; c <= this.col; c++) {
				if (this.board[r][c] == 0) {
					let count = this.flip({row:r, col:c}, 1, false);
					if (count > 0) { // this position is ok
						if (max < count) {
							max = count;
							best.row = r;
							best.col = c;
						}
					}
				}
			}
		}
		if (max > 0) this.flip(best, 1, true);
		setTimeout( () => {
			this.turn = 2;
			this.setState({});
		}, 1000);
	}
}

AppRegistry.registerComponent('MyApp', () => MyApp);
