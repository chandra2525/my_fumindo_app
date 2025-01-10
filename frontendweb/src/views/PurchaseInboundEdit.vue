<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header d-flex justify-content-between">
          <div class="header-title">
            <h4 class="card-title">Edit Pembelian Masuk</h4>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent>
            <h5 class="card-title"><span class="text-primary">|</span>Detail Pembelian</h5>
            <p>Form yang bertanda <span class="text-primary">*</span> wajib diisi</p>
            <div class="row mb-3">
              <div class="col-sm-4"> 
                <label for="input-205" class="form-label">Pilih Gudang<span class="text-primary">*</span></label>
                <select id="warehouse_id" v-model="editForm.warehouse_id" class="form-select" required>
                  <option value="" disabled>Silahkan pilih gudang</option>
                  <option v-for="warehouse in warehouses" :key="warehouse.warehouse_id" :value="warehouse.warehouse_id">
                    {{ warehouse.warehouse_name }}
                  </option>
                </select>
              </div>
              <div class="col-sm-4">
                <label for="purchase_order_number" class="form-label">Nomor Pesanan Pembelian<span class="text-primary">*</span></label>
                <input v-model="editForm.purchase_order_number" maxlength="100" type="text" class="form-control" id="purchase_order_number" required />
              </div>
              <div class="col-sm-4">
                <label for="inventory_type" class="form-label">Jenis Aset<span class="text-primary">*</span></label>
                <div class="mb-1">
                  <b-form-radio value="Usage" v-model="editForm.inventory_type" class="d-inline-block">Usage</b-form-radio>
                  <label class="form-label text-white"> . . . . </label>
                  <b-form-radio value="Storage" v-model="editForm.inventory_type" class="d-inline-block">Storage</b-form-radio>
                </div>
              </div>
            </div>
             
            <div class="row mb-3">
              <div class="col-sm-4"> 
                <label for="input-205" class="form-label">Pilih Vendor<span class="text-primary">*</span></label>
                <select id="vendor_id" v-model="editForm.vendor_id" class="form-select" @change="clearSkuItemData" required>
                  <option value="" disabled>Silahkan pilih vendor</option>
                  <option v-for="vendor in vendors" :key="vendor.vendor_id" :value="vendor.vendor_id">
                    {{ vendor.vendor_name }}
                  </option>
                </select>
              </div>
              <div class="col-sm-4"> 
                <label for="expected_inbound_date" class="form-label">Tanggal Masuk Diharapkan<span class="text-primary">*</span></label>
                <!-- <input v-model="editForm.expected_inbound_date" type="date" class="form-control" id="expected_inbound_date" required /> -->
                <input v-model="editForm.expected_inbound_date" type="date" class="form-control" id="expected_inbound_date" required @click="$event.target.showPicker()" />
              </div>
              <div class="col-sm-4"> 
                <label for="asn" class="form-label">ASN</label> 
                <input v-model="editForm.asn" maxlength="100" type="text" class="form-control" id="asn" />
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
                  :disabled="!editForm.vendor_id"
                  placeholder="Silahkan pilih item SKU"
                  required
                ></v-select>
                <!-- multiple -->
              </div>
              <div class="col-sm-4">
                <label for="validationCustomUsername01" class="form-label text-white">I</label>
                <div class="input-group has-validation">
                  <button
                    :disabled="!editForm.vendor_id || selectedSkuItemNames?.sku_item_name==undefined"
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
              editForm.warehouse_id&&editForm.purchase_order_number&&editForm.inventory_type&&editForm.vendor_id&&editForm.expected_inbound_date ? 'modal' : null">{{ isEditMode ? 'Simpan Perubahan' : 'Tambahkan Pembelian Masuk' }}
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
    width: 95px;
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
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import axios from 'axios';
import DataTable from '@/components/DataTableLocal.vue';
import MessageModal from '@/components/ModalAlert.vue'; 
import { Modal as BootstrapModal } from 'bootstrap';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
 
const router = useRouter();

const route = useRoute();
const editForm = ref({ ...route.params }); // Terima data dari params

const titleMessage = ref('');
const alertMessage = ref(''); 

const currentPage = ref(1); // Halaman aktif
// const totalPages = ref(0); // Total halaman
const pageSize = ref(10); // Banyaknya data per halaman
// const totalData = ref(0); // Jumlah total data dari API

// Ambil data dari localStorage
const token = localStorage.getItem('access_token');
const user_id = localStorage.getItem('user_id');

// Daftar option
const warehouses = ref([]);
const vendors = ref([]);

const temporarySkuItems = ref([]);
const skuItemNames = ref([]);
const warehouseNames = ref([]);
const vendorNames = ref([]);

const selectedSkuItemNames = ref([]);

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

// Mengambil data pembelian masuk saat komponen dimuat
onMounted(async () => {
  await getPurchaseInboundById();
  await fetchWarehouses();
  await fetchVendors();
  await fetchSkuItemData();
});

const currentSort = ref({ column: 'sku_item_id', order: 'DESC' });

const onSkuItemSelect = (selected) => {
 selectedSkuItemNames.value = selected;
 console.log('selected : ', selected)
};

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

// const submitPurchaseInbound = async () => {
//   try {
//     const response = await axios.put(
//       `http://localhost:3000/api/purchase_inbound/${editForm.value.purchase_inbound_id}`, 
//       editForm.value
//     );
//     console.log('Data berhasil diperbarui:', response.data);
//   } catch (error) {
//     console.error('Gagal memperbarui data:', error);
//   }
// };

const submitPurchaseInbound = async () => {
  if(editForm.value.warehouse_id != '' &&
     editForm.value.purchase_order_number != '' &&
     editForm.value.inventory_type != '' &&
     editForm.value.vendor_id != '' &&
     editForm.value.expected_inbound_date != ''){

    if (temporarySkuItems.value.length == 0){
      handleErrorMessage(`Gagal Ditambahkan`,`Item SKU belum dipilih.`,'error');
    } else {
      if (temporarySkuItems.value.every((item) => item.expected_quantity !== 0)) {
        const skuItemIds = temporarySkuItems.value.map(item => item.sku_item_id)
        const skuItemCurrentPrice = temporarySkuItems.value.map((item) => item.price)
        const skuItemQuantity = temporarySkuItems.value.map((item) => item.expected_quantity)


        // editForm.value.purchase_inbound_id = null;
        editForm.value.warehouse_id = Number(editForm.value.warehouse_id);
        editForm.value.vendor_id = Number(editForm.value.vendor_id);
        
        editForm.value.sku_item_id = skuItemIds;
        editForm.value.price = skuItemCurrentPrice;
        editForm.value.expected_quantity = skuItemQuantity;
        editForm.value.user_id = Number(user_id)

        console.log('skuItemCurrentPrice:', skuItemCurrentPrice)
        console.log('skuItemCurrentPrice:', skuItemQuantity)
        console.log('editForm.value:', editForm.value)
        console.log('editForm.value:', editForm.value.price)

        try {
          const response = await axios.put(`http://localhost:3000/api/purchase_inbound/${editForm.value.purchase_inbound_id}`, editForm.value, {
          headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          console.log('Data berhasil disimpan:', response.data)
          router.go(-1);
          handleErrorMessage(`Berhasil Disimpan`,`Data pembelian masuk berhasil disimpan.`,'error');
        } catch (error) {
          if (error.response && error.response.status === 401) {
            handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
          } 
          else {
            console.error('Error fetching purchase_inbound data:', error); 
            handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
          }
        }
      }
    }
  } 
}


// Fungsi untuk mengambil data jenis SKU dari backend
const fetchSkuItemData = async () => {
  console.log('editForm.value.vendor_id:', editForm.value.vendor_id)
  try {
    const response = await axios.get('http://localhost:3000/api/sku_item', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        // sku_item_name: selectedSkuItemNames.value,
        // unit_name: selectedUnits.value.join(','),
        // vendor_name: selectedVendors.value.join(','),
        vendor_id: editForm.value.vendor_id,
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
    // if (error.response && error.response.status === 401) {
    //   handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    // } 
    // else {
      console.error('Error fetching sku_item data:', error)
    //   handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    // }
  } 
};


const getPurchaseInboundById = async () => {
  console.log('editForm.value.vendor_id:', editForm.value.vendor_id)
  try {
    const response = await axios.get(`http://localhost:3000/api/purchase_inbound/${editForm.value.purchase_inbound_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    temporarySkuItems.value = response.data.items.map((purchase_inbound) => ({
      ...purchase_inbound,
      price: purchase_inbound.current_price, // Ambil nama nama atau tampilkan "N/A" jika tidak ada
      sku_item_name: purchase_inbound.skuItem?.sku_item_name || 'N/A', // Ambil nama nama atau tampilkan "N/A" jika tidak ada
      sku_type_name: purchase_inbound.skuItem.skuType?.sku_type_name || 'N/A', // Ambil nama nama atau tampilkan "N/A" jika tidak ada
      unit_name: purchase_inbound.skuItem.assetUnit?.unit_name || 'N/A', // Ambil nama nama atau tampilkan "N/A" jika tidak ada
      vendor_name: purchase_inbound.skuItem.vendor?.vendor_name || 'N/A', // Ambil nama nama atau tampilkan "N/A" jika tidak ada
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
    if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    } 
    else {
      console.error('Error fetching sku_item data:', error)
      handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    }
  } 
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
    // if (error.response && error.response.status === 401) {
    //   handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    // } 
    // else {
      console.error('Error fetching warehouses:', error);
    //   handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    // }
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
    // if (error.response && error.response.status === 401) {
    //   handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    // } 
    // else {
      console.error('Error fetching vendors:', error);
    //   handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    // }
  }
};

// Fungsi untuk mengganti halaman
const updatePage = (page) => {
  // if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // fetchSkuItemData(); // Refresh data untuk halaman baru
  // }
};

const clearSkuItemData = async () => {
  skuItemNames.value = [];
  selectedSkuItemNames.value = [];
  temporarySkuItems.value = [];
  fetchSkuItemData();
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
        handleErrorMessage(`Gagal Menambahkan Item SKU`,`Item SKU <strong>${skuItem.sku_item_name}</strong> sudah ada di tabel!`,'error');
      }
    } else {
      handleErrorMessage(`Gagal Menambahkan Item SKU`,`Item SKU <strong>${skuItem.sku_item_name}</strong> tidak ditemukan!`,'error');
    }
  } else {
    handleErrorMessage(`Gagal Menambahkan Item SKU`,`Item SKU tidak ditemukan!`,'error');
  }
}


// Fungsi untuk menghapus data dari tabel sementara
const removeTemporarySkuItem = () => {
  temporarySkuItems.value = temporarySkuItems.value.filter(
    (item) => item.sku_item_id !== selectedSkuItem.value.sku_item_id
  );
};


const handleErrorMessage = (title, alert, type) => {
  type == 'session'? router.push({ name: 'auth.login' }) : null;
  titleMessage.value = title;
  alertMessage.value = alert;
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
