const getFileSize = (bytes, decimals) => {
  if (bytes === 0) {
    return '0 Byte';
  }

  const k = 1000;
  const dm = decimals + 1 || 3;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
};

class ModalController {
  constructor($mdDialog, $scope, Upload, Leads, $http) {
    this.modal = $mdDialog;
    this.files = [];
    this.$upload = Upload;
    this.Leads = Leads;
    this.progress = 0;
    this.startingUpload = false;
    this.uploadSize = 0;
    this.$http = $http;
    $scope.$watch(()=> {
      return this.files;
    },

    (fresh, old) => {
      const totalSize = getFileSize(
        fresh.reduce((size, file) => {
          size += file.size;
          return size;
        }, 0)
      );

      this.uploadSize = totalSize;
    });
  }

  hide() {
    this.startingUpload = false;
    this.modal.hide();
  }

  cancel() {
    this.startingUpload = false;
    this.modal.cancel();
  }

  sign() {
    const file = this.files[0];
    this.$http.get(`/api/leads/upload?filename=${file.name}&filetype=${file.type}`)
    .then(({data}) => {
      // console.log(data);
      this.upload(file, data);
    });
  }

  upload(file, data) {
    this.startingUpload = true;
    this.progressType = 'determinate';
    this.Leads.upload(file, data)
    .then(() => {
      console.log('done');
      this.hide();
    });
    // this.$upload.upload({
    //   data,
    //   url: data.signed_request,
    //   method: 'PUT',
    //   file: file,
    //   headers: {
    //     'x-amz-acl': 'public-read'
    //   }
    // })
    // .progress(evt => {
    //   const progress = parseInt(100.0 * evt.loaded / evt.total);
    //   this.progress = progress;
    //   if (this.progress === 100) {
    //     this.progressType = 'indeterminate';
    //     this.progress = 0;
    //   }
    // })
    // .success(() => {
    //   this.hide();
    // })
    // .error();
  }

  dropping($files) {
    this.files = this.files.concat($files);
  }
}

ModalController.$inject = ['$mdDialog', '$scope', 'Upload', 'Leads', '$http'];
export default ModalController;
