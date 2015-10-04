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
  constructor($mdDialog, $scope, Upload) {
    this.modal = $mdDialog;
    this.files = [];
    this.$upload = Upload;
    this.progress = 0;
    this.startingUpload = false;
    this.uploadSize = 0;

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

  upload() {
    this.startingUpload = true;
    this.progressType = 'determinate';
    this.$upload.upload({
      url: '/api/leads',
      file: this.files,
      fileFormDataName: 'leads',
    })
    .progress(evt => {
      const progress = parseInt(100.0 * evt.loaded / evt.total);
      this.progress = progress;
      if (this.progress === 100) {
        this.progressType = 'indeterminate';
        this.progress = 0;
      }
    })
    .success(() => {
      this.hide();
    })
    .error();
  }

  dropping($files) {
    this.files = this.files.concat($files);
  }
}

ModalController.$inject = ['$mdDialog', '$scope', 'Upload'];
export default ModalController;
