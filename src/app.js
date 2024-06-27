document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "tulip", img: "5.jpg", price: 25000 },
      { id: 2, name: "jasmin", img: "2.jpg", price: 25000 },
      { id: 3, name: "lily", img: "3.jpg", price: 25000 },
      { id: 4, name: "rose", img: "4.jpg", price: 25000 },
      { id: 5, name: "lavender", img: "1.jpg", price: 25000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah ada barang yang sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika belum ada / cart masih kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // jika barang sudah ada,cek apakah barang beda atau sama dengan yang ada di cart
        this.items = this.items.map((item) => {
          // jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika barang sudah ada,tambah quantity dan totalnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },

    remove(id) {
      // ambil item yang mau diremove berdasarkan id nya
      const cartItem = this.items.find((item) => item.id === id);

      // jika lebih dari satu
      if (cartItem.quantity > 1) {
        // telusuri satu satu
        this.items = this.items.map((item) => {
          // jika bukan barang yang di klik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // jika barangnya sisa satu
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// kirim data ketika checkout diklik
const checkoutButton = document.querySelector(".checkout-button");
const form = document.querySelector("#checkoutForm");
checkoutButton.addEventListener("click", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData);
  window.open("http://wa.me/6282216375620?text=" + encodeURIComponent(message));
});

// format pesan wa
const formatMessage = (obj) => {
  return `Data Customer 
  Nama: ${obj.name}
  Alamat: ${obj.alamat}
  Pesan: ${obj.pesan}
Data Pesanan
${JSON.parse(obj.items).map(
  (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)})\n`
)}
TOTAL: ${rupiah(obj.total)} 
 Terima kasih. `;
};

// konversi ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
