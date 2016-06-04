module.exports = function(client, callback) {
  if (client.jstp) client.jstp.accept();
  callback();
};
