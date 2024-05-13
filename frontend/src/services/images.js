// convert image to base64
export const toDataUrl = async function (url, callback) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };

    xhr.onerror = () => {
      reject({
        status: this.status,
        statusText: xhr.statusText,
      });
    };

    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  });
};
