import {Socket, LongPoller} from "phoenix"
import React from 'react';

class App {

  static randomNumberBetween(min, max) {
    let minimum = Math.ceil(min);
    let maximum = Math.floor(max);
    return Math.floor(Math.random() * (maximum - minimum)) + minimum;
  }

  static init(){
    let socket = new Socket("/socket", {
      logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    })

    socket.connect()
    var $status    = $("#status")
    var $messages  = $("#messages")
    var $input     = $("#message-input")
    var $username  = $("#username")
    var $setUsername = $("#setUsername")
    let initialUsername = "anonymous#" + App.randomNumberBetween(3, 20000);
    $username.val(initialUsername);

    socket.onOpen( ev => console.log("OPEN", ev) )
    socket.onError( ev => console.log("ERROR", ev) )
    socket.onClose( e => console.log("CLOSE", e))

    var chan = socket.channel("rooms:lobby", {user: initialUsername})
    chan.join().receive("ignore", () => console.log("auth error"))
               .receive("ok", () => console.log("join ok"))
               .after(10000, () => console.log("Connection interruption"))
    chan.onError(e => console.log("something went wrong", e))
    chan.onClose(e => console.log("channel closed", e))

    $input.off("keypress").on("keypress", e => {
      if (e.keyCode == 13) {
        chan.push("new:msg", {user: $username.val(), body: $input.val()})
        $input.val("")
      }
    });

    $setUsername.click(e => {
      e.preventDefault()
      chan.push("user:set_username", {username: $username.val()});
    });

    chan.on("user:set", msg => {
      $username.val(msg["user"]);
    });

    chan.on("new:msg", msg => {
      $messages.append(this.messageTemplate(msg))
      scrollTo(0, document.body.scrollHeight)
    });

    chan.on("user:entered", msg => {
      var username = this.sanitize(msg.user)
      $messages.append(`<br/><i>[${username} entered]</i>`)
    });

    chan.on("user:set_username", msg => {
      $messages.append(`<br/><i>${msg.previous} is now ${msg.next}</i>`)
    })

    chan.on("user:left", msg => {
      $messages.append(`<br/><i>${msg.user} left</i>`)
    });
  }

  static sanitize(html){ return $("<div/>").text(html).html() }

  static messageTemplate(msg){
    let username = this.sanitize(msg.user || "anonymous")
    let body     = this.sanitize(msg.body)

    return(`<p><a href='#'>[${username}]</a>&nbsp; ${body}</p>`)
  }

}

$( () => App.init() )

export default App
