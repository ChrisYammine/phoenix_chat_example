defmodule Chat.UserList do
  use GenServer

  @default_state %{users: MapSet.new()}

  # API

  def start_link do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def add(username) when is_binary(username) do
    GenServer.call(__MODULE__, {:add, username})
  end

  def remove(username) when is_binary(username) do
    GenServer.cast(__MODULE__, {:remove, username})
  end

  # Callbacks

  def init(_) do
    {:ok, @default_state}
  end

  def handle_call({:add, username}, _from, %{users: users} = state) do
    case MapSet.member?(users, username) do
      false ->
        Chat.Endpoint.broadcast!("rooms:lobby", "user:entered", %{user: username})
        {:reply, :ok, %{state | users: MapSet.put(users, username)}}
      true ->
        {:reply, :error, state}
    end
  end

  def handle_cast({:remove, username}, %{users: users} = state) do
    Chat.Endpoint.broadcast!("rooms:lobby", "user:left", %{user: username})
    {:noreply, %{state | users: MapSet.delete(users, username)}}
  end

  # Ignore unhandled messages
  def handle_info(_, state) do
    {:ok, state}
  end
end
