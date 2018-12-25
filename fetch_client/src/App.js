import React, { Component } from 'react';
import {Row, Col, Button, Icon, Input} from 'react-materialize'

import './App.css';

class App extends Component {
  state = {
    text: "",
      response: ""
  };

  componentWillMount() {
      this.startBind();
  }

  startBind = async() => {
      var xhr = new XMLHttpRequest();

      xhr.open('GET', 'http://localhost:3000/users', true);
      xhr.send();

      if (xhr.status !== 200) {
          console.log( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
      } else {
          console.log( xhr.responseText ); // responseText -- текст ответа.
      }
      xhr.onreadystatechange = (status) => {
          const parts = status.target.responseText.split("|");
          this.setState({response: parts[parts.length - 1]});
      }
  }

  fetchData = async(text) => {
      await this.setState({text: text});
      let myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json',);
      myHeaders.append("Content-Type", "text/json");
      myHeaders.append("Content-Length", text.length.toString());
      myHeaders.append("X-Custom-Header", "ProcessThisImmediately");

      const res = await fetch("http://localhost:3000/users", {
          method: 'POST',
          headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
          },
          cache: 'no-cache',
          // mode: 'no-cors',
          credentials: 'include',
          body: JSON.stringify({
            text: this.state.text
          })
      })
          // .then(status => console.log(status))
          // .then(res => res.json())
          .then(res => res.json())
          .then(function(res) {
              // console.log(res);
          });
  };

  render() {
    return (
      <div className="App">
        <Row className="chat">
            <Col className="users">
            </Col>
            <Col className="chat-column">
              <Row className="messages">
                  <div>{this.state.response}</div>
              </Row>
              <Row className="inputMessages">
                  <Input s={12} type='textarea' className="input"
                         value={this.state.text}
                  onChange={(event, text) => this.fetchData(text)}/>
              </Row>
            </Col>
        </Row>
      </div>
    );
  }
}

export default App;
