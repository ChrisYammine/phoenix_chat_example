use Mix.Config

# For production, we configure the host to read the PORT
# from the system environment. Therefore, you will need
# to set PORT=80 before running your server.
#
# You should also configure the url host to something
# meaningful, we use this information when generating URLs.
config :chat, Chat.Endpoint,
  http: [port: 4000],
  url: [host: "www.chrisyammine.com"],
  debug_errors: true,
  server: true,
  code_reloader: false,
  cache_static_manifest: "priv/static/manifest.json",
  check_origin: false,
  watchers: [],
  https: [
    port: 443,
    keyfile: System.get_env("SSL_KEYFILE_PATH"),
    certfile: System.get_env("SSL_CERTFILE_PATH"),
    cacertfile: System.get_env("SSL_INTERMEDIATE_CERTFILE_PATH")
  ],
  force_ssl: [rewrite_on: [:x_forwarded_proto]]
#
# Where those two env variables point to a file on
# disk for the key and cert.

# Do not print debug messages in production
config :logger, level: :info

# ## Using releases
#
# If you are doing OTP releases, you need to instruct Phoenix
# to start the server for all endpoints:
#
#     config :phoenix, :serve_endpoints, true
#
# Alternatively, you can configure exactly which server to
# start per endpoint:
#
#     config :chat, Chat.Endpoint, server: true
#

# Finally import the config/prod.secret.exs
# which should be versioned separately.
import_config "prod.secret.exs"
