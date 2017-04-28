import React, { Component } from 'react'
import { AppRegistry, Text, TouchableOpacity, View } from 'react-native'
class Kangaroo extends Component {
  render() {
    let b = { backgroundColor: 'pink', padding:8, margin:2,
              width:30, height:30, borderRadius:15, textAlign:'center'}
    let box = [ ]
    for (let i in this.data) {
      box.push(<TouchableOpacity style={b} onPress={ () => this.click(i) }>
          <Text> { this.data[i] } </Text>
      </TouchableOpacity>)
    }
    return <View style={{ textAlign:'center'}}>
      <View style={{flexDirection:'row', justifyContent:'center'}}>
        {box}
      </View>
      <Text>{this.status}</Text>
      <TouchableOpacity onPress={ () => this.reset() }>
        <Text>Reset</Text>
      </TouchableOpacity>
    </View>
  }
  click(i) {
    var space = -1
    for (let i in this.data) {
      if (this.data[i] == ' ') {
        space = i
      }
    }
    if (space - i <= 2 && space - i >= -2) {
      this.data[space] = this.data[i]
      this.data[i] = ' '
    }
    if (this.finish()) {
      this.status = 'Done'
    }
    this.forceUpdate()
  }
  finish() {
    var b = true
    for (let i = 0; i < (this.data.length - 1) / 2; i++) {
      if (this.data[i] == 'A') {
        b = false
      }
    }
    if (this.data[ (this.data.length - 1) / 2 ] != ' ') {
      b = false
    }
    for (let i = (this.data.length - 1) / 2 + 1; i < this.data.length; i++) {
      if (this.data[i] == 'B') {
        b = false
      }
    }
    return b
  }
  reset() {
    this.data = ['A', 'A', ' ', 'B', 'B']
    this.status = '...'
    this.forceUpdate()
  }
  constructor() {
    super()
    this.reset()
  }
}
AppRegistry.registerComponent('Kangaroo', () => Kangaroo)
