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

  def change(from, to) when is_binary(from) and is_binary(to) do
    GenServer.call(__MODULE__, {:change, from, to})
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
        {:reply, {:ok, username}, %{state | users: MapSet.put(users, username)}}
      true ->
        {:reply, :error, state}
    end
  end

  def handle_call({:change, from, to}, _, %{users: users} = state) do
    with false <- MapSet.member?(users, to),
         added <- MapSet.put(users, to),
         final <- MapSet.delete(added, from) do
      {:reply, :ok, %{state | users: final}}
    else
      _ ->
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
