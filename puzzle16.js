import React, { Component } from 'react';

import { AppRegistry,
	View, Text, TextInput, TouchableOpacity
} from 'react-native';

import Dimensions from 'Dimensions';

export class MyApp extends Component {

	constructor() {
		super()
		this.board =   [['A', 'B', 'C', 'D'],
						['E', 'F', 'G', 'H'],
						['I', 'J', 'K', 'L'],
						['M', 'N', 'O', ' ']]
	}

	render() {
		let {height, width} = Dimensions.get('window');
		let size = 80
		let startY = 40
		let startX = (width - size * this.board.length) / 2
		let items = []
		for (let i = 0; i < this.board.length; i++) {
			for (let j = 0; j < this.board[i].length; j++) {
				let s = { position:'absolute', padding:10,
					top: (i * size) + startY, left: (j * size) + startX,
					backgroundColor:'lightblue', width:size, height:size,
					borderWidth:1, borderColor:'blue' }
				if (this.board[i][j] == ' ') s.backgroundColor = 'white'
				let t = { textAlign:'center', fontSize:48 }
				let tile = (
					<TouchableOpacity style={s} key={i*100+j}
						onPress={this.press.bind(this, i, j)}>
						<Text style={t}>{this.board[i][j]}</Text>
					</TouchableOpacity>
				)
				items.push(tile)
			}
		}
		return <View>{ items }</View>
	}

	press(r, c) {
		if (r > 0 && this.board[r-1][c] == ' ') {
			this.board[r-1][c] = this.board[r][c]
			this.board[r][c] = ' '
		} else if (r < this.board.length - 1 && this.board[r+1][c] == ' ') {
			this.board[r+1][c] = this.board[r][c]
			this.board[r][c] = ' '
		} else if (c > 0 && this.board[r][c-1] == ' ') {
			this.board[r][c-1] = this.board[r][c]
			this.board[r][c] = ' '
		} else if (c < this.board[r].length - 1 && this.board[r][c+1] == ' ') {
			this.board[r][c+1] = this.board[r][c]
			this.board[r][c] = ' '
		}
		this.setState({})
	}
}

AppRegistry.registerComponent('MyApp', () => MyApp);
