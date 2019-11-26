import React, { Component } from "react";
import { withAuthenticator } from "aws-amplify-react";
import { API, graphqlOperation } from "aws-amplify";
import { createNote, deleteNote, updateNote } from "./graphql/mutations";
import { listNotes } from "./graphql/queries";

import "./app.css";

class App extends Component {
  state = {
    note: "",
    notes: [],
    id: ""
  };

  async componentDidMount() {
    const result = await API.graphql(graphqlOperation(listNotes));
    this.setState({
      notes: result.data.listNotes.items
    });
  }

  handleInputChange = event =>
    this.setState({
      note: event.target.value
    });

  hasExistingData = () => {
    const { notes, id } = this.state;
    if (id) {
      const itExist = notes.findIndex(note => note.id === id) > -1;

      return itExist;
    }
    return false;
  };

  handleSubmitForm = async event => {
    event.preventDefault();
    const { note, notes } = this.state;

    if (this.hasExistingData()) {
      this.handleUpdate();
    } else {
      const result = await API.graphql(
        graphqlOperation(createNote, { input: { note } })
      );
      const newNote = result.data.createNote;
      const updatedNotes = [newNote, ...notes];
      this.setState({
        notes: updatedNotes,
        note: ""
      });
    }
  };

  handleUpdate = async () => {
    const { notes, id, note } = this.state;
    const input = { id, note };
    const result = await API.graphql(graphqlOperation(updateNote, { input }));

    const updatedNote = result.data.updateNote;

    const index = notes.findIndex(note => note.id === updatedNote.id);

    const updatedNotes = [
      ...notes.slice(0, index),
      updatedNote,
      ...notes.slice(index + 1)
    ];
    this.setState({
      notes: updatedNotes,
      note: "",
      id: ""
    });
  };

  handleDelete = async id => {
    const { notes } = this.state;
    const input = { id: id };

    const result = await API.graphql(graphqlOperation(deleteNote, { input }));
    const deletedItem = result.data.deleteNote.id;

    const updatedNoteState = notes.filter(note => note.id !== deletedItem);

    this.setState({
      notes: updatedNoteState
    });
  };

  handleSetNoteToInput = item => {
    this.setState({
      note: item.note,
      id: item.id
    });
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
            value={this.state.note}
            onChange={this.handleInputChange}
          />
          <button type="submit">
            {this.state.id ? "Update Note" : "Add Note"}
          </button>
        </form>
        <div>
          {this.state.notes.map(item => (
            <div key={item.id} className="notesDiv">
              <li
                className="listItem"
                onClick={() => this.handleSetNoteToInput(item)}
              >
                {item.note}
              </li>
              <button
                className="listItemButton
              "
                onClick={() => this.handleDelete(item.id)}
              >
                <span>&times;</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: true });
