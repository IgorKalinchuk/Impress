{

  master: {
    protocol:  'jstp',
    address:   '127.0.0.1',
    ports:     [2500],
    slowTime:  '1s'
  },

  test: {
    protocol:  'http',
    address:   '127.0.0.1',
    ports:     [8080],
    nagle:     true,
    slowTime:  '1s',
    timeout:   '10s'
  }

}