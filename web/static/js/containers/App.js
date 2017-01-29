import React, { Component } from 'react';
import { connect } from 'react-redux';
import { connectWebsocket, changeUserForm, setUsername } from '../actions';

class App extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(connectWebsocket());
  }

  _handleSubmit(ev) {
    ev.preventDefault()
    const { usernameInput } = this.refs;
    const { socket, dispatch } = this.props;
    const { channel } = socket;

    dispatch(setUsername(usernameInput.value, channel));
  }

  render() {
    const { user } = this.props;
    const { usernameForm } = user;

    return (
      <div className="container">
        <div id="messages" className="container">
        </div>
        <div id="root">
        </div>
        <div id="footer">
          <div className="container">
            <div className="row">
              <div className="col-sm-3">
                <form onSubmit={this._handleSubmit.bind(this)}>
                  <div className="input-group">
                    <span className="input-group-addon">@</span>
                    <input
                     id="username"
                     type="text"
                     ref="usernameInput"
                     placeholder="username" />
                    <button type="submit">Set</button>
                  </div>
                </form>
              </div>
              <div className="col-sm-9">
                <input id="message-input" className="form-control" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => (state);

const mapDispatchToProps = (dispatch) => ({
  usernameFormChange: (contents) => {
    dispatch(changeUserForm(contents))
  },
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
