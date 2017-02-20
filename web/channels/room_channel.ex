defmodule Chat.RoomChannel do
  use Phoenix.Channel
  require Logger

  @doc """
  Authorize socket to subscribe and broadcast events on this channel & topic

  Possible Return Values

  `{:ok, socket}` to authorize subscription for channel for requested topic

  `:ignore` to deny subscription/broadcast on this channel
  for the requested topic
  """
  def join("rooms:lobby", message, socket) do
    Process.flag(:trap_exit, true)
    case Chat.UserList.add(message["user"]) do
      {:ok, user} ->
        send(self(), {:after_join, %{"user" => user}})
        {:ok, socket}
      :error ->
        join("rooms:lobby", Map.put(message, "user", message["user"] <> "(1)"), socket)
    end
  end

  def join("rooms:" <> _private_subtopic, _message, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_info({:after_join, %{"user" => user}}, socket) do
    broadcast! socket, "user:entered", %{user: user}
    push socket, "join", %{status: "connected"}
    {:noreply, assign(socket, :user, user)}
  end
  def handle_info(:ping, socket) do
    push socket, "new:msg", %{user: "SYSTEM", body: "ping"}
    {:noreply, socket}
  end

  def terminate(reason, socket) do
    Logger.debug"> leave #{inspect reason}"
    Chat.UserList.remove(socket.assigns[:user])
    :ok
  end

  def handle_in("new:msg", msg, socket) do
    broadcast! socket, "new:msg", %{user: msg["user"], body: msg["body"]}
    {:reply, {:ok, %{msg: msg["body"]}}, assign(socket, :user, msg["user"])}
  end

  def handle_in("user:set_username", msg, socket) do
    username = msg["username"]
    case Chat.UserList.change(socket.assigns.user, username) do
      :ok ->
        broadcast! socket, "user:set_username", %{previous: socket.assigns.user, next: username}
        push socket, "user:set", %{user: username}
        {:noreply, assign(socket, :user, username)}
      :error ->
        push socket, "user:set_failed", %{error: "Username exists."}
        {:noreply, socket}
    end
  end

end
