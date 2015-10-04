const PubnubFactory = ['$rootScope', ($rootScope) => {
  const pubnub = PUBNUB({
    publish_key: $pubnubPubKey,
    subscribe_key: $pubnubSubKey,
    ssl: process.env.NODE_ENV === 'production' ? true : false
  });

  const listenTo = (channel, cb) => {
    pubnub.subscribe({
      channel,
      message(data) {
        $rootScope.$apply(() => {
          cb(data);
        });
      }
    });
  };

  const sendTo = (channel, message) => {
    pubnub.publish({channel, message});
  };

  return {sendTo, listenTo};
}];

export default PubnubFactory;
