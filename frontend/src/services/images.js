// convert image to base64
export const toDataUrl = async (url) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    const reader = new FileReader();

    reader.onloadend = () => {
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

  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
});
