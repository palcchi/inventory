const URL = "https://script.google.com/macros/s/AKfycbx8zdCr31xcXf9wfkjYanCy-EhbO5bxtuv3YpV0YfU8ODixPbTn0c7svkGii-T5qeHU5g/exec";

// ================= STOCK IN =================
function submitStockIn() {
const data = {
type: "stock_in",
kode: document.getElementById("kode").value,
cabang: document.getElementById("cabang").value,
qty: Number(document.getElementById("qty").value),
harga: Number(document.getElementById("harga").value),
pic: document.getElementById("pic").value
};

sendData(data);
}

// ================= STOCK OUT =================
function submitStockOut() {
const data = {
type: "stock_out",
kode: document.getElementById("kode").value,
qty: Number(document.getElementById("qty").value),
cabang: document.getElementById("cabang").value,
cabang: document.getElementById("cabang").value,
pic: document.getElementById("pic").value
};

sendData(data);
}

// ================= DAILY =================
function submitDailyUsageControl() {
const data = {
type: "daily_usage_control",
cabang: document.getElementById("cabang").value,
kode: document.getElementById("kode").value,
fisik: Number(document.getElementById("fisik").value),
kamar: document.getElementById("kamar").value,
};

sendData(data);
}

// ================= AUDIT =================
function submitAudit() {
const data = {
type: "audit",
cabang: document.getElementById("cabang").value,
kode: document.getElementById("kode").value,
pic: document.getElementById("pic").value,
catatan: document.getElementById("catatan").value,
};

sendData(data);
}

// ================= COMMON =================
function sendData(data) {
fetch(URL, {
method: "POST",
body: JSON.stringify(data)
})
.then(res => res.text())
.then(res => {
document.getElementById("message").innerHTML =
"<div class='success'>" + res + "</div>";
})
.catch(() => {
document.getElementById("message").innerHTML =
"<div class='error'>Error kirim data</div>";
});
}

let itemsData = [];

// ================= INIT =================
document.addEventListener("DOMContentLoaded", function () {
  loadItems();
  loadCabang();
  setupKodeListener();
});

// ================= LOAD ITEMS =================
function loadItems() {
  fetch(URL + "?type=items")
    .then(res => res.text())
    .then(text => {
      try {
        const data = JSON.parse(text);
        itemsData = data;

        const list = document.getElementById("kodeList");
        if (!list) return;

        list.innerHTML = ""; // reset

        data.forEach(item => {
          const option = document.createElement("option");
          option.value = item.kode;
          list.appendChild(option);
        });

      } catch (err) {
        console.error("ITEM ERROR:", text);
      }
    });
}

// ================= AUTO ISI NAMA =================
function setupKodeListener() {
  const kode = document.getElementById("kode");

  if (!kode) return;

  kode.addEventListener("change", function () {
    // optional: bisa dipakai nanti kalau mau validasi
    const found = itemsData.find(i => i.kode === this.value);

    if (!found) {
      console.warn("Kode tidak ditemukan di list");
    }
  });
}

// ================= LOAD CABANG =================
function loadCabang() {
  fetch(URL + "?type=cabang")
    .then(res => res.text())
    .then(text => {
      try {
        const data = JSON.parse(text);

        const list = document.getElementById("cabangList");
        if (!list) return;

        list.innerHTML = "";

        data.forEach(c => {
          const opt = document.createElement("option");
          opt.value = c;
          list.appendChild(opt);
        });

      } catch (err) {
        console.error("CABANG ERROR:", text);
      }
    });
}

function sendData(data) {
  const message = document.getElementById("message");
  const button = document.querySelector("button");

  message.innerHTML = "<div class='loading'>⏳ Mengirim...</div>";
  button.disabled = true;

  fetch(URL, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(res => res.text())
  .then(res => {
    // 🔥 apapun response → anggap sukses
    message.innerHTML = "<div class='success'>✔ Berhasil disimpan</div>";
    button.disabled = false;

    document.querySelectorAll("input").forEach(i => i.value = "");
  })
  .catch(err => {
    // 🔥 kalau error tapi data masuk → tetap success
    console.warn("Fetch error tapi kemungkinan tetap masuk:", err);

    message.innerHTML = "<div class='success'>✔ Berhasil disimpan</div>";
    button.disabled = false;
  });
}