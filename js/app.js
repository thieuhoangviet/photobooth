const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const downloadLink = document.getElementById("downloadLink");
const context = canvas.getContext("2d");
const photoGallery = document.getElementById("photoGallery");
const selectedCountSpan = document.getElementById("selectedCount");
let selectedFrameClass = "";

navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((error) => {
    alert("Không thể truy cập camera: " + error.message);
  });

function takePhoto() {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataURL = canvas.toDataURL("image/png");
  downloadLink.href = dataURL;
  addPhotoToGallery(dataURL);
}

function addPhotoToGallery(dataURL) {
  const photoItem = document.createElement("div");
  photoItem.className = "photo-item";

  const img = document.createElement("img");
  img.src = dataURL;

  const actions = document.createElement("div");
  actions.className = "photo-actions";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.onchange = updateSelectedCount;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.onclick = () => {
    photoItem.remove();
    updateSelectedCount();
  };

  actions.appendChild(checkbox);
  actions.appendChild(deleteBtn);
  photoItem.appendChild(img);
  photoItem.appendChild(actions);
  photoGallery.appendChild(photoItem);
}

function updateSelectedCount() {
  const checkboxes = document.querySelectorAll(
    '.photo-item input[type="checkbox"]'
  );
  let count = 0;
  checkboxes.forEach((cb) => {
    if (cb.checked) count++;
  });
  selectedCountSpan.textContent = count;
}

function downloadSelectedPhotos() {
  const checkboxes = document.querySelectorAll(
    '.photo-item input[type="checkbox"]'
  );
  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      const img = checkbox.closest(".photo-item").querySelector("img");
      const a = document.createElement("a");
      a.href = img.src;
      a.download = `photo_${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  });
}
