import { apiBaseUrl } from "@/constants/environment";

export function toDataURL(url: string): Promise<string> {
  var xhr = new XMLHttpRequest();
  return new Promise(r => {
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        r(reader.result as string);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  });
}

export function appendApiBaseUrl(url: string) {
  if (!url?.includes("https")) {
    return apiBaseUrl + url;
  }

  return url;
}
