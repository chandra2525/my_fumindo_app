<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header d-flex justify-content-between">
          <div class="header-title">
            <h4 class="card-title">Tambah Pembelian Masuk</h4>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent>
            <h5 class="card-title"><span class="text-primary">|</span>Detail Pembelian</h5>
            <p>Form yang bertanda <span class="text-primary">*</span> wajib diisi</p>
            <div class="row mb-3">
              <div class="col-sm-4"> 
                <label for="input-205" class="form-label">Pilih Gudang<span class="text-primary">*</span></label>
                <select id="warehouse_id" v-model="addForm.warehouse_id" class="form-select" required>
                  <option value="" disabled>Silahkan pilih gudang</option>
                  <option v-for="warehouse in warehouses" :key="warehouse.warehouse_id" :value="warehouse.warehouse_id">
                    {{ warehouse.warehouse_name }}
                  </option>
                </select>
              </div>
              <div class="col-sm-4">
                <label for="purchase_order_number" class="form-label">Nomor Pesanan Pembelian<span class="text-primary">*</span></label>
                <input v-model="addForm.purchase_order_number" maxlength="100" type="text" class="form-control" id="purchase_order_number" required />
              </div>
              <div class="col-sm-4">
                <label for="inventory_type" class="form-label">Jenis Aset<span class="text-primary">*</span></label>
                <div class="mb-1">
                  <b-form-radio value="Usage" v-model="addForm.inventory_type" class="d-inline-block">Usage</b-form-radio>
                  <label class="form-label text-white"> . . . . </label>
                  <b-form-radio value="Storage" v-model="addForm.inventory_type" class="d-inline-block">Storage</b-form-radio>
                </div>
              </div>
            </div>
             
            <div class="row mb-3">
              <div class="col-sm-4"> 
                <label for="input-205" class="form-label">Pilih Vendor<span class="text-primary">*</span></label>
                <select id="vendor_id" v-model="addForm.vendor_id" class="form-select" @change="clearSkuItemData" required>
                  <option value="" disabled>Silahkan pilih vendor</option>
                  <option v-for="vendor in vendors" :key="vendor.vendor_id" :value="vendor.vendor_id">
                    {{ vendor.vendor_name }}
                  </option>
                </select>
              </div>
              <div class="col-sm-4"> 
                <label for="expected_inbound_date" class="form-label">Tanggal Masuk Diharapkan<span class="text-primary">*</span></label>
                <!-- <input v-model="addForm.expected_inbound_date" type="date" class="form-control" id="expected_inbound_date" required /> -->
                <input v-model="addForm.expected_inbound_date" type="date" class="form-control" id="expected_inbound_date" required @click="$event.target.showPicker()" />
              </div>
              <div class="col-sm-4"> 
                <label for="asn" class="form-label">ASN</label> 
                <input v-model="addForm.asn" maxlength="100" type="text" class="form-control" id="asn" />
              </div>
            </div>
           
            <h5 class="card-title"><span class="text-primary mt-4">|</span>SKU Item yang Dipilih</h5>
            <div class="row mb-2">
              <!-- <div class="col-sm-4">
                <label class="form-label">Cari Item SKU</label>
                <input v-model="filterSkuItemName" maxlength="100" type="text" class="form-control" required/>
              </div> -->
              <div class="col-sm-6">
                <label for="filter" class="form-label">Cari Item SKU</label>
                <v-select
                  :options="skuItemNames"
                  v-model="selectedSkuItemNames"
                  label="sku_item_name"
                  @update:modelValue="onSkuItemSelect"
                  :disabled="!addForm.vendor_id"
                  placeholder="Silahkan pilih item SKU"
                  required
                ></v-select>
                <!-- multiple -->
              </div>
              <div class="col-sm-4">
                <label for="validationCustomUsername01" class="form-label text-white">I</label>
                <div class="input-group has-validation">
                  <button
                    :disabled="!addForm.vendor_id || selectedSkuItemNames?.sku_item_name==undefined"
                    class="btn btn-primary" 
                    @click="submitTemporaryItemSKU"
                    title="Search">
                    Tambah SKU
                  </button>
                </div>
              </div>
            </div>
            <div class="row mb-2">
              <!-- Dropdown Show Entries -->
              <div class="col-sm-6 pagination-show-entries">
                <label for="entries" class="form-label col-sm-3">Show entries</label>
                <select
                  id="entries"
                  class="form-select show-entries"
                  v-model="pageSize"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
            
            <div class="table-responsive border-bottom mb-4">
              <data-table
                :data="temporarySkuItems"
                :columns="columns"
                :currentPage="currentPage"
                :pageSize="pageSize"  
                :idrow="sku_item_id"
                @update-price="onUpdatePrice"
                @update-expected-quantity="handleUpdateExpectedQuantity"
                @edit="showEditModal"
                @delete="showDeleteModal"
                @page-change="updatePage"
              />

              <!-- <div class="pagination-container">
                <p class="text-muted">
                  Showing {{ (currentPage - 1) * pageSize + 1 }} to
                  {{ Math.min(currentPage * pageSize, totalData) }} of {{ totalData }} entries
                </p>
                <nav aria-label="Page navigation example">
                  <ul class="pagination justify-content-end">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                      <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
                    </li>
                    <li
                      class="page-item"
                      v-for="page in totalPages"
                      :key="page"
                      :class="{ active: currentPage === page }"
                    >
                      <button class="page-link" @click="changePage(page)">{{ page }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                      <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
                    </li>
                  </ul>
                </nav>
              </div> -->
              
              <!-- Modal Konfirmasi Penghapusan -->
              <div class="modal fade" id="delete-confirmation" tabindex="-1" aria-labelledby="deleteConfirmationLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="deleteConfirmationLabel">Konfirmasi Hapus</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <p>Apa kamu yakin ingin menghapus data Item SKU <strong>{{ selectedSkuItem?.sku_item_name }}</strong>?</p>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                      <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="removeTemporarySkuItem()">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Memanggil Modal  -->
              <MessageModal :message="alertMessage" :title="titleMessage"/>
            </div>
            
            <!-- Tambahkan field lainnya sesuai dengan struktur data Pembelian Masuk -->
            <!-- <button type="submit" class="btn btn-primary" :data-bs-dismiss="
              addForm.warehouse_id&&addForm.purchase_order_number&&addForm.inventory_type&&addForm.vendor_id&&addForm.expected_inbound_date ? 'modal' : null">{{ isEditMode ? 'Simpan Perubahan' : 'Tambahkan Pembelian Masuk' }}
            </button> -->
            <button type="submit" @click="submitPurchaseInbound" class="btn btn-primary">Simpan</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .show-entries {
    /* max-width: 400px; */
    width: 95px;
    /* margin-bottom: 1rem; */
  }

  .pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pagination-show-entries {
    display: flex; 
    align-items: center;
  }

  ::v-deep(.vs__dropdown-toggle) {
    height: 41.5px;
  }
</style>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import DataTable from '@/components/DataTableLocal.vue';
import MessageModal from '@/components/ModalAlert.vue'; 
import { Modal as BootstrapModal } from 'bootstrap';
import { useRouter } from 'vue-router';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

const router = useRouter();

const titleMessage = ref('');
const alertMessage = ref(''); 

// Reactive data untuk menyimpan data pembelian masuk
// const skuItemData = ref([]);
const temporarySkuItems = ref([]);
const skuItemNames = ref([]);
const warehouseNames = ref([]);
const vendorNames = ref([]);
const optionsInventoryType = ref([]);
const optionsStatus = ref([]);

const selectedSkuItemNames = ref([]);
// const selectedWarehouses = ref([]);
// const selectedVendors = ref([]);
// const selectedInventoryType = ref([]);
// const selectedStatus = ref([]);

// const filterPurchaseOrderNumber = ref('');
// const filterUsername = ref('');
// const filterInboundDate = ref('');
// const filterAsn = ref('');
// const filterCreateDate= ref('');
// const filterSkuItemName = ref('');

// const globalSearch = ref('');

const currentPage = ref(1); // Halaman aktif
// const totalPages = ref(0); // Total halaman
const pageSize = ref(10); // Banyaknya data per halaman
// const totalData = ref(0); // Jumlah total data dari API

// Definisikan kolom untuk DataTable, gunakan komponen Actions untuk kolom tindakan
// Ambil token dari localStorage
const token = localStorage.getItem('access_token');
const user_id = localStorage.getItem('user_id');

const columns = [
  // { title: 'ID', data: 'sku_item_id', sortable: true },
  { title: 'Jenis SKU', data: 'sku_type_name', sortable: true },
  { title: 'Nama Item SKU', data: 'sku_item_name', sortable: true },
  // { title: 'Merek', data: 'brand', sortable: true },
  // { title: 'Panjang', data: 'length', sortable: true },
  // { title: 'Lebar', data: 'width', sortable: true },
  // { title: 'Tinggi', data: 'height', sortable: true },
  // { title: 'Berat', data: 'weight', sortable: true },
  { title: 'Satuan', data: 'unit_name', sortable: true },
  { title: 'Vendor', data: 'vendor_name', sortable: true },
  { title: 'Harga Item SKU Saat Ini', data: 'price', sortable: true },
  { title: 'Kuantitas Diharapkan', data: 'expected_quantity', sortable: true },
  { title: 'Total Harga', data: 'total_price', sortable: true },
  // { title: 'SKU dapat Dikonsumsi', data: 'consumed', sortable: true },
  { title: 'Aksi', data: 'delete', sortable: false },
  // { title: 'Expected', data: 'delete', sortable: false },
];



// const isEditModalOpen = ref(false)
// const isEditMode = ref(false)

const addForm = ref({
  purchase_inbound_id: null,
  warehouse_id: '',
  purchase_order_number: '',
  inventory_type: 'Usage',
  vendor_id: '',
  expected_inbound_date: '',
  asn: '',
  sku_item_id: [],
  price: [],
  expected_quantity: [],
  status: 'Pending',
})

// Fungsi untuk membuka modal edit dan mengisi form dengan data yang dipilih
// const openEditModal = (rowData) => {
//   addForm.value = { ...rowData }
//   isEditModalOpen.value = true
// }

// Fungsi untuk reset form saat modal ditutup
const resetForm = () => {
  addForm.value = {
    purchase_inbound_id: null,
    warehouse_id: '',
    purchase_order_number: '',
    inventory_type: 'Usage',
    vendor_id: '',
    expected_inbound_date: '',
    asn: '',
    sku_item_id: [],
    price: [],
    expected_quantity: [],
    status: 'Pending',
  }
}

const selectedSkuItem = ref(null) // Menyimpan data pembelian masuk yang dipilih untuk dihapus

// Fungsi untuk menampilkan modal konfirmasi penghapusan
const showDeleteModal = (rowData) => {
  selectedSkuItem.value = rowData
}

// Tangkap event update-expected-quantity dari DataTable
const handleUpdateExpectedQuantity = (updatedRow) => {
  const item = temporarySkuItems.value.find(
    (item) => item.sku_item_id === updatedRow.sku_item_id
  );
  if (item) {
    item.expected_quantity = updatedRow.expected_quantity;
    console.log(
      "Updated expected_quantity:",
      temporarySkuItems.value.map((item) => item.expected_quantity)
    );
  }
};

const onUpdatePrice = (updatedRow) => {
  console.log("Total Price Updated:", updatedRow);
  const item = temporarySkuItems.value.find(
    (item) => item.sku_item_id === updatedRow.sku_item_id
  );
  if (item) {
    item.price = updatedRow.price;
    console.log(
      "Updated price:",
      temporarySkuItems.value.map((item) => item.price)
    );
  }
};


// Fungsi untuk membuka modal edit dan mengisi form dengan data yang dipilih
// const showEditModal = (rowData) => {
//   selectedSkuItem.value = rowData
//   addForm.value = { ...rowData } 
//   isEditMode.value = true
// }

// Fungsi untuk membuka modal tambah dengan form kosong
// const showAddModal = () => {
//   resetForm() // Kosongkan form
//   isEditMode.value = false
//   // isEditModalOpen.value = true
// }

// Fungsi untuk submit tambah/edit
const submitPurchaseInbound = async () => {
  if(addForm.value.warehouse_id != '' &&
     addForm.value.purchase_order_number != '' &&
     addForm.value.inventory_type != '' &&
     addForm.value.vendor_id != '' &&
     addForm.value.expected_inbound_date != ''){

    if (temporarySkuItems.value.length == 0){
      titleMessage.value = `Gagal Ditambahkan`;
      alertMessage.value = `Item SKU belum dipilih.`;
      const modal = new BootstrapModal(document.getElementById('message-alert'));
      modal.show();
    } else {
      if (temporarySkuItems.value.every((item) => item.expected_quantity !== 0)) {
        const skuItemIds = temporarySkuItems.value.map(item => item.sku_item_id)
        const skuItemCurrentPrice = temporarySkuItems.value.map((item) => item.price)
        const skuItemQuantity = temporarySkuItems.value.map((item) => item.expected_quantity)

        addForm.value.sku_item_id = skuItemIds;
        addForm.value.price = skuItemCurrentPrice;
        addForm.value.expected_quantity = skuItemQuantity;
        addForm.value.user_id = Number(user_id)

        console.log('skuItemCurrentPrice:', skuItemCurrentPrice)
        console.log('skuItemCurrentPrice:', skuItemQuantity)
        console.log('addForm.value:', addForm.value)
        console.log('addForm.value:', addForm.value.price)

        try {
          const response = await axios.post('http://localhost:3000/api/purchase_inbound', addForm.value, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          console.log('Data berhasil ditambahkan:', response.data)
          router.go(-1);
          titleMessage.value = `Berhasil Ditambahkan`;
          alertMessage.value = `Data pembelian masuk berhasil ditambahkan.`;
          const modal = new BootstrapModal(document.getElementById('message-alert'));
          modal.show();
        } catch (error) {
          console.error('Error fetching purchase_inbound data:', error); 
          handleAuthError();
        }
      }
    }
  } 
}

// Mengambil data pembelian masuk saat komponen dimuat
onMounted(async () => {
  resetForm()
  await fetchWarehouses();
  await fetchVendors();
  await fetchSkuItemData();
  optionsInventoryType.value= ["Usage", "Storage"];
  optionsStatus.value= ["Pending", "Receiving", "Done", "Canceled"];
});

const currentSort = ref({ column: 'sku_item_id', order: 'DESC' });

// const onSort = ({ column, order }) => {
//   currentSort.value = { column, order };
//   fetchSkuItemData(); // Panggil ulang API dengan parameter sorting
// };

const onSkuItemSelect = (selected) => {
 selectedSkuItemNames.value = selected;
 console.log('selected : ', selected)
  // fetchSkuItemData(); // Panggil fungsi fetch dengan data terpilih
};

// const onWarehouseSelect = (selected) => {
//   selectedWarehouses.value = selected; // Perbarui nilai terpilih
//   // fetchSkuItemData(); // Panggil fungsi fetch dengan data terpilih
// };

// const onVendorSelect = (selected) => {
//   selectedVendors.value = selected; // Perbarui nilai terpilih
//   // fetchSkuItemData(); // Panggil fungsi fetch dengan data terpilih
// };

// const onInventoryTypeSelect = (selected) => {
//   selectedInventoryType.value = selected; // Perbarui nilai terpilih
//   // fetchSkuItemData(); // Panggil fungsi fetch dengan data terpilih
// };

// const onStatusSelect = (selected) => {
//   selectedStatus.value = selected; // Perbarui nilai terpilih
//   // fetchSkuItemData(); // Panggil fungsi fetch dengan data terpilih
// };


// Daftar  
const warehouses = ref([]);
const vendors = ref([]);

const clearSkuItemData = async () => {
  skuItemNames.value = [];
  selectedSkuItemNames.value = [];
  temporarySkuItems.value = [];
  fetchSkuItemData();
};

// Fungsi untuk mengambil data jenis SKU dari backend
const fetchSkuItemData = async () => {
  console.log('addForm.value.vendor_id:', addForm.value.vendor_id)
  try {
    const response = await axios.get('http://localhost:3000/api/sku_item', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        // sku_item_name: selectedSkuItemNames.value,
        // unit_name: selectedUnits.value.join(','),
        // vendor_name: selectedVendors.value.join(','),
        vendor_id: addForm.value.vendor_id,
        // sku_item_name: filterSkuItemName.value,
        // brand: filterBrand.value,
        // length: filterLength.value,
        // width: filterWidth.value,
        // height: filterHeight.value,
        // weight: filterWeight.value,
        // price: filterPrice.value,
        // consumed: selectedConsume.value.join(','),
        // search: globalSearch.value,
        order_by: currentSort.value.column,
        order_direction: currentSort.value.order,
        page: 1,
        pageSize: 1000,
        // page: currentPage.value, // Kirim nomor halaman
        // pageSize: pageSize.value, // Kirim ukuran data per halaman
        // order_by: 'sku_item_id', // Sorting berdasarkan ID
        // order_direction: 'DESC', // Urutan descending
      },
    })
    skuItemNames.value = response.data.rows.map((sku_item) => ({
      ...sku_item,
      sku_type_name: sku_item.skuType?.sku_type_name || 'N/A', // Ambil nama nama atau tampilkan "N/A" jika tidak ada
      unit_name: sku_item.assetUnit?.unit_name || 'N/A', // Ambil nama nama atau tampilkan "N/A" jika tidak ada
      vendor_name: sku_item.vendor?.vendor_name || 'N/A', // Ambil nama nama atau tampilkan "N/A" jika tidak ada
    }))
    // skuItemNames.value = response.data.rows.map(item => item.sku_item_name);
    // skuItemData.value = response.data.rows.map((sku_item) => ({
    //   ...sku_item,
    //   sku_type_name: sku_item.skuType?.sku_type_name || 'N/A', // Ambil nama nama atau tampilkan "N/A" jika tidak ada
    //   unit_name: sku_item.assetUnit?.unit_name || 'N/A', // Ambil nama nama atau tampilkan "N/A" jika tidak ada
    //   vendor_name: sku_item.vendor?.vendor_name || 'N/A', // Ambil nama nama atau tampilkan "N/A" jika tidak ada
    // }))
    // totalData.value = response.data.sp.rowCount;
    // totalPages.value = Math.ceil(response.data.sp.rowCount / pageSize.value);
  } catch (error) {
    console.error('Error fetching sku_item data:', error)
    handleAuthError();
    // alert('Lakukan login terlebih dulu') 
  } 
};


const submitTemporaryItemSKU = async () => {
    console.error('selectedSkuItemNames.value :', selectedSkuItemNames.value)
  if(selectedSkuItemNames.value.sku_item_name!=undefined){
    const skuItem = selectedSkuItemNames.value;
    if (skuItem) {
      const exists = temporarySkuItems.value.some(
        (item) => item.sku_item_id === skuItem.sku_item_id
      );
      if (!exists) {
        temporarySkuItems.value.push({
          ...skuItem,
          sku_type_name: skuItem.skuType?.sku_type_name || 'N/A',
          unit_name: skuItem.assetUnit?.unit_name || 'N/A',
          vendor_name: skuItem.vendor?.vendor_name || 'N/A',
          expected_quantity: 0,
          price: skuItem.price || 0,
          total_price: 0,
        });
      } else {
        // alert('Item SKU sudah ada di tabel!');
        titleMessage.value = `Gagal Menambahkan Item SKU`;
        alertMessage.value = `Item SKU <strong>${skuItem.sku_item_name}</strong> sudah ada di tabel!`;
        const modal = new BootstrapModal(document.getElementById('message-alert'));
        modal.show(); 
      }
    } else {
      // alert('Item SKU tidak ditemukan!');
      titleMessage.value = `Gagal Menambahkan Item SKU`;
      alertMessage.value = `Item SKU <strong>${skuItem.sku_item_name}</strong> tidak ditemukan!`;
      const modal = new BootstrapModal(document.getElementById('message-alert'));
      modal.show(); 
    }
  } else {
    // alert('Item SKU tidak ditemukan!');
    titleMessage.value = `Gagal Menambahkan Item SKU`;
    alertMessage.value = `Item SKU tidak ditemukan!`;
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show(); 
  }
}


// Fungsi untuk mengganti halaman
const updatePage = (page) => {
  // if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // fetchSkuItemData(); // Refresh data untuk halaman baru
  // }
};


const fetchWarehouses = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/warehouse', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {  
        // order_by: currentSort.value.column,
        // order_direction: currentSort.value.order,
        page: 1,
        pageSize: 1000,
      },
    });
    warehouses.value = response.data.rows;
    warehouseNames.value = response.data.rows.map(item => item.warehouse_name);
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    handleAuthError();
    // alert('Lakukan login terlebih dulu') 
  }
};


const fetchVendors = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/vendor', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {  
        // order_by: currentSort.value.column,
        // order_direction: currentSort.value.order,
        page: 1,
        pageSize: 1000,
      },
    });
    vendors.value = response.data.rows;
    vendorNames.value = response.data.rows.map(item => item.vendor_name);
    console.log('vendorNames.value:', vendorNames.value)
 
    vendorNames.value
  } catch (error) {
    console.error('Error fetching vendors:', error);
    handleAuthError();
    // alert('Lakukan login terlebih dulu') 
  }
};

// const exportPurchaseInboundData = async () => {
//   try {
//     const response = await axios.get("http://localhost:3000/api/purchase_inbound/export", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       params: { 
//         warehouse_name: selectedWarehouses.value.join(','),
//         purchase_order_number: filterPurchaseOrderNumber.value,
//         inventory_type: selectedInventoryType.value.join(','),
//         vendor_name: selectedVendors.value.join(','),
//         username: filterUsername.value,
//         expected_inbound_date: filterInboundDate.value,
//         asn: filterAsn.value,
//         status: selectedStatus.value.join(','),
//         create_date: filterCreateDate.value,
//         search: globalSearch.value,
//         order_by: currentSort.value.column,
//         order_direction: currentSort.value.order,
//        },
//       responseType: "blob", // Blob untuk file biner
//     });

//     // Buat URL dari blob
//     const url = window.URL.createObjectURL(new Blob([response.data]));

//     // Buat link untuk download
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "data_pembelian_masuk.xlsx"); // Nama file
//     document.body.appendChild(link);
//     link.click();

//     // Hapus elemen link setelah selesai
//     link.parentNode.removeChild(link);
//   } catch (error) {
//     console.error("Error exporting data:", error);
//     // alert("Gagal mengekspor data. Silakan coba lagi.");
//     titleMessage.value = `Gagal Ekspor`;
//     alertMessage.value = `Gagal mengekspor data. Silakan coba lagi.`;
//     const modal = new BootstrapModal(document.getElementById('message-alert'));
//     modal.show();
//   }
// };

// const uploadFilePurchaseInboundData = async () => {
//   const fileInput = document.getElementById('upload-file');
//   const file = fileInput.files[0];

//   if (!file) {
//     titleMessage.value = `Pilih File`;
//     alertMessage.value = 'Silakan pilih file sebelum mengunggah.';
//     const modal = new BootstrapModal(document.getElementById('message-alert'));
//     modal.show();
//     return;
//   }

//   const formData = new FormData();
//   formData.append('file', file);

//   try {
//     const response = await axios.post('http://localhost:3000/api/purchase_inbound/mass-upload', formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     titleMessage.value = `Berhasil`;
//     alertMessage.value = `Upload berhasil, ${response.data.successCount} data pembelian masuk berhasil terupload`;
//     const modal = new BootstrapModal(document.getElementById('message-alert'));
//     modal.show();
 
//     fetchSkuItemData();
//   } catch (error) {
//     console.error('Gagal mengunggah file:', error);
//     titleMessage.value = `Gagal Upload`;
//     alertMessage.value = 'Gagal mengunggah file. Pastikan format file benar.';
//     const modal = new BootstrapModal(document.getElementById('message-alert'));
//     modal.show();
//   }
// };

// const downloadTemplatePurchaseInboundData = async () => { 
//   try {
//     const response = await axios.get("http://localhost:3000/api/purchase_inbound/template/", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       responseType: "blob", // Blob untuk file biner
//     });

//     // Buat URL dari blob
//     const url = window.URL.createObjectURL(new Blob([response.data]));

//     // Buat link untuk download
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "template_data_pembelian_masuk.xlsx"); // Nama file
//     document.body.appendChild(link);
//     link.click();

//     // Hapus elemen link setelah selesai
//     link.parentNode.removeChild(link);
//   } catch (error) {
//     console.error("Error downloading template:", error);
//     // alert("Gagal mendownload template. Silakan coba lagi.");
//     titleMessage.value = `Gagal Download`;
//     alertMessage.value = `Gagal mendownload template. Silakan coba lagi.`;
//     const modal = new BootstrapModal(document.getElementById('message-alert'));
//     modal.show();
//   }
// }

// Fungsi untuk menghapus data dari tabel sementara
const removeTemporarySkuItem = () => {
  temporarySkuItems.value = temporarySkuItems.value.filter(
    (item) => item.sku_item_id !== selectedSkuItem.value.sku_item_id
  );
};

// const confirmDelete = async () => {
//   try {
//     console.log('Id deleted:', selectedPurchaseInbound.value.purchase_inbound_id)
//     await axios.delete(`http://localhost:3000/api/purchase_inbound/${selectedPurchaseInbound.value.purchase_inbound_id}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     // alert('Data Pembelian Masuk berhasil dihapus.') 
//     titleMessage.value = `Berhasil Hapus`;
//     alertMessage.value = `Data Pembelian Masuk <strong>${selectedPurchaseInbound.value.purchase_order_number}</strong> berhasil dihapus.`;
//     const modal = new BootstrapModal(document.getElementById('message-alert'));
//     modal.show();

//     fetchSkuItemData()
//   } catch (error) {
//     if (error.response && error.response.status === 409) {
//         titleMessage.value = `Gagal Menghapus`;
//         alertMessage.value = `Data Pembelian Masuk <strong>${selectedPurchaseInbound.value.purchase_order_number}</strong> gagal dihapus. ${error.response.data.message}. Anda harus menghapus terlebih dahulu data yang terkait dengan Data Pembelian Masuk <strong>${selectedPurchaseInbound.value.purchase_order_number}</strong>.`;
//         const modal = new BootstrapModal(document.getElementById('message-alert'));
//         modal.show(); 
//     } 
//     else {
//       console.error('Failed to delete purchase inbound data:', error) 
//       handleAuthError();
//     }
//   }
// }

const handleAuthError = () => {
  // router.push({ name: 'auth.login' });
  titleMessage.value = `Koneksi Gagal`;
  alertMessage.value = `Cek koneksi internet Anda.`;
  const modal = new BootstrapModal(document.getElementById('message-alert'));
  modal.show();
};

watch(
  temporarySkuItems,
  (newVal) => {
    newVal.forEach(item => { 
      item.total_price = parseFloat((item.expected_quantity * item.price).toFixed(2));
    });
  },
  { deep: true }
);

</script>
