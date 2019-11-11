import React, { Component } from "react";
import { withAuthenticator } from "aws-amplify-react";
import { API, graphqlOperation } from "aws-amplify";
import { createNote } from "./graphql/mutations";
import "./app.css";

class App extends Component {
  state = {
    note: ""
  };

  handleInputChange = event =>
    this.setState({
      note: event.target.value
    });
  handleSubmitForm = event => {
    event.preventDefault();
    const { note } = this.state;
    API.graphql(graphqlOperation(createNote, { input: { note } }));
  };

  render() {
    //const { note } = this.state;

    return (
      <div className="App">
        <h1 className="main-heading">Amplify Notes</h1>
        <form onSubmit={this.handleSubmitForm} className="form">
          <input
            className="inputForm"
            type="text"
            placeholder="Write here"
            onChange={this.handleInputChange}
          />
          <button type="submit">Add Note</button>
        </form>
        {/* <div>
          {notes.map(item => (
            <div key={item.id} className="notesDiv">
              <li className="listItem">{item.note}</li>
              <button className="listItemButton">
                <span>&times;</span>
              </button>
            </div>
          ))}
        </div> */}
      </div>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: true });
