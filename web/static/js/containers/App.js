import React, { Component } from 'react';
import { connect } from 'react-redux';
import { connectWebsocket, changeUserForm, setUsername, sendMessage } from '../actions';

class App extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(connectWebsocket());
  }

  componentDidUpdate() {
    scrollTo(0, document.body.scrollHeight);
  }

  _sanitize(html){ return $("<div/>").text(html).html() }

  _handleSubmit(ev) {
    ev.preventDefault()
    const { usernameInput } = this.refs;
    const { dispatch } = this.props;

    dispatch(setUsername(usernameInput.value));
  }

  _handleMessageSubmit(ev) {
    ev.preventDefault()
    const { messageInput } = this.refs;
    const { dispatch } = this.props;

    dispatch(sendMessage(messageInput.value));
    messageInput.value = '';
  }

  render() {
    const { user, messages } = this.props;
    const { usernameForm } = user;
    const messageList = messages.messages;

    return (
      <div className="container">
        <div id="messages" className="container">
          {messageList.map((m, i) => {
            let username = this._sanitize(m.user);
            let body = this._sanitize(m.body);
            return (<p key={i}><a href='#'>[{username}]</a>&nbsp; {body}</p>)
          })}
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
                <form onSubmit={this._handleMessageSubmit.bind(this)}>
                  <input id="message-input" ref="messageInput" className="form-control" />
                </form>
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
