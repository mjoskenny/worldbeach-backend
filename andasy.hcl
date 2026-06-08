# andasy.hcl app configuration file generated for worldbeach on Thursday, 16-Apr-26 21:39:46 CAT
#
# See https://github.com/quarksgroup/andasy-cli for information about how to use this file.

app_name = "worldbeach"

app {

  env = {}

  port = 8080

  primary_region = "kgl"

  compute {
    cpu      = 1
    memory   = 512
    cpu_kind = "shared"
  }

  process {
    name = "worldbeach"
  }

}
