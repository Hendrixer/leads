const Pusher = ['$rootScope', $rootScope => {
  const pusher = new window.Pusher($pusherKey);
  const uploadChannel = pusher.subscribe('upload-status');

  const uploadOn = (event, cb, broadcast) => {
    uploadChannel.bind(event, data => {
      cb(data);
      if (broadcast) {
        $rootScope.$broadcast(event, data);
      }
    });
  }

  return {uploadOn};
}];


export default Pusher;
