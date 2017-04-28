import React, { Component } from 'react';
import { AppRegistry, Image, Text, TouchableOpacity, View } 
  from 'react-native';
class HelloWorldApp extends Component {
  render() {
    let b = { backgroundColor:'pink', width:40, height: 40, borderRadius:20,
               position:'absolute', textAlign:'center'}
    let map = [ ]
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        let b0 = { }
        for (let k in b) b0[k] = b[k]
        b0.left = j * 40
        b0.top  = i * 40
        let item = <Text>{this.map[i][j]}</Text>
        if (this.map[i][j] == 'X') {
          item = <Image source={{uri:'https://codestar.work/cartoon.png'}} 
                   style={{width:35, height:35, left:2}} />
        }
        map.push(<TouchableOpacity style={b0} 
                   onPress={ () => this.click(i, j) }>
            {item}
          </TouchableOpacity>)
      }
    }
    return <View>{map} 
      <Text style={{marginTop:200, textAlign:'center'}}>{this.score}</Text>
    </View>
  }
  click(row, col) {
    if (this.map[row][col] == 'X') {
      this.score++
      this.map[row][col] = ' '
    } else {
      this.score--
    }
    this.forceUpdate()
  }
  change() {
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        let r = Math.random()
        if (r > 0.8) {
          this.map[i][j] = 'X'
        } else {
          this.map[i][j] = ' '
        }
      }
    }
    this.forceUpdate()
  }
  constructor() {
    super()
    this.score = 0
    setInterval( () => this.change(), 3000)
    this.map = [
      [' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ']
    ]
  }
}
AppRegistry.registerComponent('HelloWorldApp', () => HelloWorldApp)
