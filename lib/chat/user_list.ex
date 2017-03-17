defmodule Chat.UserList do
  use GenServer
  @table_name UserList
  # API

  def start_link do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def add(username, %Phoenix.Socket{channel_pid: pid}) when is_binary(username) do
    GenServer.call(__MODULE__, {:add, username, pid})
  end

  def change(from, to) when is_binary(from) and is_binary(to) do
    GenServer.call(__MODULE__, {:change, from, to})
  end

  def dump_state do
    :ets.tab2list(@table_name)
    |> Enum.reduce(%{}, fn({k, v}, acc) ->
      Map.put(acc, k, Map.delete(v, :ref))
    end)
  end

  # Callbacks

  def init(_) do
    list = :ets.new(@table_name, [:set, :protected, :named_table, read_concurrency: true])
    refs = %{}
    {:ok, {list, refs}}
  end

  def handle_call({:add, username, socket}, _from, {table, refs} = state) do
    case :ets.member(table, username) do
      false ->
        ref = Process.monitor(socket)
        # TODO: Randomize user color on join!
        color = "#FFF"
        :ets.insert(table, {username, %{color: color, ref: ref}})
        {:reply, {:ok, %{name: username, color: color}}, {table, Map.put(refs, ref, username)}}
      true ->
        {:reply, :error, state}
    end
  end

  def handle_call({:change, from, to}, _, {table, refs} = state) do
    with {:ok, val} <- lookup(table, from),
         true <- :ets.insert(table, {to, val}),
         true <- :ets.delete(table, from),
         {:ok, new_refs} <- update_refs(refs, from, to) do
      {:reply, :ok, {table, new_refs}}
    else
      _ ->
        {:reply, :error, state}
    end
  end

  def handle_call(:dump_state, _from, state) do
    {:reply, state, state}
  end

  def handle_info({:DOWN, ref, :process, _pid, _reason}, {table, refs}) do
    {username, refs} = Map.pop(refs, ref)
    :ets.delete(table, username)
    Chat.Endpoint.broadcast!("rooms:lobby", "user:left", %{user: username})
    {:noreply, {table, refs}}
  end

  # Ignore unhandled messages
  def handle_info(_, state) do
    {:ok, state}
  end

  defp lookup(table, username) do
    case :ets.lookup(table, username) do
      [{^username, val}] -> {:ok, val}
      [] -> :error
    end
  end

  defp update_refs(refs, from, to) do
    with {ref, ^from} <- Enum.find(refs, fn({_, v}) -> v == from end),
         new_refs <- Map.put(refs, ref, to) do
      {:ok, new_refs}
    else
      _ -> :error
    end
  end
end
