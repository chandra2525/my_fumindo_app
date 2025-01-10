<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header d-flex justify-content-between">
          <div class="header-title">
            <h4 class="card-title">List Stok Item</h4>
          </div>
          <div>
            <button 
              class="btn btn-outline-success width-button-style-top" 
              style="margin-right: 10px;" 
              @click="exportStockData">
              Ekspor Data
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="row mb-2">
            <!-- <div class="col-sm-6">
              <label for="filter" class="form-label">Filter jenis SKU</label>
              <v-select 
                :options="skuTypeNames" 
                v-model="selectedSkuTypes" 
                multiple  
                @update:modelValue="onSkuTypeSelect" 
                class="filter-style"
              ></v-select>
            </div> -->
            <div class="col-sm-6">
              <label for="filter" class="form-label">Filter gudang</label>
              <v-select 
                :options="warehouseNames" 
                v-model="selectedWarehouses" 
                multiple  
                @update:modelValue="onWarehouseSelect" 
                class="filter-style"
              ></v-select>
            </div>
            <div class="col-sm-6">
                <label for="validationCustomUsername01" class="form-label">Filter nama item SKU</label>
                <div class="input-group has-validation">
                  <input type="text" v-model="filterSkuItemName" class="form-control" style="height: 35px" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
                </div>
            </div>
          </div>

          <div class="row mb-2">
            <div class="col-sm-6">
              <label for="validationCustomUsername01" class="form-label">Filter jumlah stok</label>
              <div class="input-group has-validation">
                <input type="number" v-model="filterStockQuantity" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            </div>
            <div class="col-sm-6">
              <label for="validationCustomUsername01" class="form-label">Filter merek</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterBrand" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            </div>
            <!-- <div class="col-sm-6">
              <label for="filter" class="form-label">Filter satuan</label>
              <v-select 
                :options="unitNames" 
                v-model="selectedUnits" 
                multiple  
                @update:modelValue="onUnitSelect" 
                class="filter-style"
              ></v-select>
            </div> -->
          </div>
          
          <div class="row mb-2">
            <!-- <div class="col-sm-6">
              <label for="filter" class="form-label">Filter vendor</label>
              <v-select 
                :options="vendorNames" 
                v-model="selectedVendors" 
                multiple  
                @update:modelValue="onVendorSelect" 
                class="filter-style"
              ></v-select>
            </div> -->
            <!-- <div class="col-sm-6">
              <label for="validationCustomUsername01" class="form-label">Filter SKU dapat dikonsumsi</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterConsumed" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            </div> -->
            <div class="col-sm-6">
              <label for="validationCustomUsername01" class="form-label">Filter panjang</label>
              <div class="input-group has-validation"> 
                <input type="number" v-model="filterLength" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            </div>
            <div class="col-sm-6">
              <label for="validationCustomUsername01" class="form-label">Filter lebar</label>
              <div class="input-group has-validation">
                <input type="number" v-model="filterWidth" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            </div>
          </div>

          <div class="row mb-2">
            <div class="col-sm-6">
              <label for="validationCustomUsername01" class="form-label">Filter tinggi</label>
              <div class="input-group has-validation">
                <input type="number" v-model="filterHeight" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            </div>
            <div class="col-sm-6">
              <label for="validationCustomUsername01" class="form-label">Filter berat</label>
              <div class="input-group has-validation">
                <input type="number" v-model="filterWeight" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-sm-6">
              <label for="filter" class="form-label">Filter SKU dapat dikonsumsi</label>
              <v-select 
                :options="optionsConsume"
                v-model="selectedConsume"
                multiple
                @update:modelValue="onConsumeSelect"
                class="filter-style"
              ></v-select>
            </div>
            <div class="col-sm-6">
              <!-- Input Pencarian Global -->
              <div class="search-container">
                <label for="global-search" class="form-label">Pencarian</label>
                <div class="input-group has-validation">
                  <input
                    type="text"
                    id="global-search"
                    v-model="globalSearch" 
                    class="form-control filter-style" 
                  />
                </div>
              </div>
            </div>
            <!-- <div class="col-sm-6">
              <label for="validationCustomUsername01" class="form-label">Filter harga</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterPrice" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            </div> -->
          </div>

          <div class="row mb-4">
             <div class="col-sm-4">
              <!-- <label for="validationCustomUsername01" class="form-label text-white">I</label> -->
              <div class="input-group has-validation">
                <button
                  class="btn btn-primary width-button-style filter-style" 
                  @click="fetchStockData"
                  title="Search">
                  Filter
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
                @change="fetchStockData"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
          
          <div class="table-responsive border-bottom">
            <data-table
              :data="stockData"
              :columns="columns"
              :currentPage="currentPage"
              :pageSize="pageSize"  
              :idrow="stock_id"
              @sort="onSort"
            />

            <div class="pagination-container">
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
            </div>

            <!-- Memanggil Modal  -->
            <MessageModal :message="alertMessage" :title="titleMessage"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .filter-style {
    height: 35px;
  }

  .width-button-style {
    width: 85px;
    font-size: 13px;
  }

  .width-button-style-top {
    font-size: 13px;
  }

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
</style>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from '@/components/DataTable.vue';
import MessageModal from '@/components/ModalAlert.vue'; 
import { Modal as BootstrapModal } from 'bootstrap';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

const titleMessage = ref('');
const alertMessage = ref(''); 

// Reactive data untuk menyimpan data jenis SKU
const stockData = ref([]);
// const skuTypeNames = ref([]);
// const unitNames = ref([]);
// const vendorNames = ref([]);
const warehouseNames = ref([]);
const optionsConsume = ref([]);
// const selectedSkuTypes = ref([]);
// const selectedUnits = ref([]);
// const selectedVendors = ref([]);
const selectedWarehouses = ref([]);
const selectedConsume = ref([]);
const filterSkuItemName = ref('');
const filterBrand = ref('');
const filterLength = ref('');
const filterWidth = ref('');
const filterHeight = ref('');
const filterWeight= ref('');
// const filterPrice = ref('');
const filterStockQuantity = ref('');
// const filterConsumed = ref('');
const globalSearch = ref('');

const currentPage = ref(1); // Halaman aktif
const totalPages = ref(0); // Total halaman
const pageSize = ref(10); // Banyaknya data per halaman
const totalData = ref(0); // Jumlah total data dari API

// Definisikan kolom untuk DataTable, gunakan komponen Actions untuk kolom tindakan
// Ambil token dari localStorage
const token = localStorage.getItem('access_token');

const columns = [
  // { title: 'ID', data: 'stock_id', sortable: true },
  // { title: 'Dari Jenis SKU', data: 'sku_type_name', sortable: true },
  { title: 'Dari Gudang', data: 'warehouse_name', sortable: true },
  { title: 'Nama Item SKU', data: 'sku_item_name', sortable: true },
  { title: 'Jumlah Stok', data: 'stock_quantity', sortable: true },
  { title: 'Merek', data: 'brand', sortable: true },
  { title: 'Panjang', data: 'length', sortable: true },
  { title: 'Lebar', data: 'width', sortable: true },
  { title: 'Tinggi', data: 'height', sortable: true },
  { title: 'Berat', data: 'weight', sortable: true },
  // { title: 'Dari Satuan', data: 'unit_name', sortable: true },
  // { title: 'Dari Vendor', data: 'vendor_name', sortable: true },
  // { title: 'Harga', data: 'price', sortable: true },
  { title: 'SKU dapat Dikonsumsi', data: 'consumed', sortable: true },
];


// Mengambil data jenis SKU saat komponen dimuat
onMounted(async () => {
  // await fetchSkuTypes();
  // await fetchUnits();
  // await fetchVendors();
  await fetchWarehouses();
  await fetchStockData();
   optionsConsume.value= ["Iya", "Tidak"];
});

const currentSort = ref({ column: 'stock_id', order: 'DESC' });

const onSort = ({ column, order }) => {
  currentSort.value = { column, order };
  fetchStockData(); // Panggil ulang API dengan parameter sorting
};

// const onSkuTypeSelect = (selected) => {
//   selectedSkuTypes.value = selected; // Perbarui nilai terpilih
//   // fetchStockData(); // Panggil fungsi fetch dengan data terpilih
// };

// const onUnitSelect = (selected) => {
//   selectedUnits.value = selected; // Perbarui nilai terpilih
//   // fetchStockData(); // Panggil fungsi fetch dengan data terpilih
// };

// const onVendorSelect = (selected) => {
//   selectedVendors.value = selected; // Perbarui nilai terpilih
//   // fetchStockData(); // Panggil fungsi fetch dengan data terpilih
// };

const onWarehouseSelect = (selected) => {
  selectedWarehouses.value = selected; // Perbarui nilai terpilih
  // fetchStockData(); // Panggil fungsi fetch dengan data terpilih
};

const onConsumeSelect = (selected) => {
  selectedConsume.value = selected; // Perbarui nilai terpilih
  // fetchStockData(); // Panggil fungsi fetch dengan data terpilih
};


// Daftar  
// const skuTypes = ref([]);
// const units = ref([]);
// const vendors = ref([]);


// Fungsi untuk mengambil data jenis SKU dari backend
const fetchStockData = async () => {
    console.log('SelectedConsumedata:', selectedConsume.value.join(','))
  try {
    const response = await axios.get('http://localhost:3000/api/stock', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        // sku_type_name: selectedSkuTypes.value.join(','),
        // unit_name: selectedUnits.value.join(','),
        // vendor_name: selectedVendors.value.join(','),
        warehouse_name: selectedWarehouses.value.join(','),
        sku_item_name: filterSkuItemName.value,
        brand: filterBrand.value,
        length: filterLength.value,
        width: filterWidth.value,
        height: filterHeight.value,
        weight: filterWeight.value,
        stock_quantity: filterStockQuantity.value,
        // price: filterPrice.value,
        // consumed: filterConsumed.value,
        consumed: selectedConsume.value.join(','),
        search: globalSearch.value,
        order_by: currentSort.value.column,
        order_direction: currentSort.value.order,
        page: currentPage.value, // Kirim nomor halaman
        pageSize: pageSize.value, // Kirim ukuran data per halaman
        // order_by: 'stock_id', // Sorting berdasarkan ID
        // order_direction: 'DESC', // Urutan descending
      },
    })
    stockData.value = response.data.rows.map((stock) => ({
      ...stock,
       // Ambil nama nama atau tampilkan "N/A" jika tidak ada
      // sku_type_name: stock.skuType?.sku_type_name || 'N/A',
      // unit_name: stock.assetUnit?.unit_name || 'N/A',
      // vendor_name: stock.vendor?.vendor_name || 'N/A',
      sku_item_name: stock.skuItem?.sku_item_name || '-',
      brand: stock.skuItem?.brand || '-',
      length: stock.skuItem?.length || '0',
      width: stock.skuItem?.width || '0',
      height: stock.skuItem?.height || '0',
      weight: stock.skuItem?.weight || '0',
      consumed: stock.skuItem?.consumed || '0',
      warehouse_name: stock.warehouse?.warehouse_name || '-',
    }))
    totalData.value = response.data.sp.rowCount;
    totalPages.value = Math.ceil(response.data.sp.rowCount / pageSize.value);
  } catch (error) {
    console.error('Error fetching stock data:', error)
    handleAuthError();
    // alert('Lakukan login terlebih dulu') 
  }
};

// Fungsi untuk mengganti halaman
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchStockData(); // Refresh data untuk halaman baru
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
    warehouseNames.value = response.data.rows.map(item => item.warehouse_name);
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    handleAuthError();
    // alert('Lakukan login terlebih dulu') 
  }
};


// const fetchSkuTypes = async () => {
//   try {
//     const response = await axios.get('http://localhost:3000/api/sku_type', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       params: {  
//         // order_by: currentSort.value.column,
//         // order_direction: currentSort.value.order,
//         page: 1,
//         pageSize: 1000,
//       },
//     });
//     skuTypes.value = response.data.rows;
//     skuTypeNames.value = response.data.rows.map(item => item.sku_type_name);
//   } catch (error) {
//     console.error('Error fetching skuTypes:', error);
//     handleAuthError();
//     // alert('Lakukan login terlebih dulu') 
//   }
// };

// const fetchUnits = async () => {
//   try {
//     const response = await axios.get('http://localhost:3000/api/asset_unit', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       params: {  
//         // order_by: currentSort.value.column,
//         // order_direction: currentSort.value.order,
//         page: 1,
//         pageSize: 1000,
//       },
//     });
//     units.value = response.data.rows;
//     unitNames.value = response.data.rows.map(item => item.unit_name);
//   } catch (error) {
//     console.error('Error fetching units:', error);
//     handleAuthError();
//     // alert('Lakukan login terlebih dulu') 
//   }
// };

// const fetchVendors = async () => {
//   try {
//     const response = await axios.get('http://localhost:3000/api/vendor', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       params: {  
//         // order_by: currentSort.value.column,
//         // order_direction: currentSort.value.order,
//         page: 1,
//         pageSize: 1000,
//       },
//     });
//     vendors.value = response.data.rows;
//     vendorNames.value = response.data.rows.map(item => item.vendor_name);
//     console.log('vendorNames.value:', vendorNames.value)
 
//     vendorNames.value
//   } catch (error) {
//     console.error('Error fetching vendors:', error);
//     handleAuthError();
//     // alert('Lakukan login terlebih dulu') 
//   }
// };


const exportStockData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/stock/export", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { 
        // sku_type_name: selectedSkuTypes.value.join(','),
        // unit_name: selectedUnits.value.join(','),
        // vendor_name: selectedVendors.value.join(','),
        warehouse_name: selectedWarehouses.value.join(','),
        sku_item_name: filterSkuItemName.value,
        brand: filterBrand.value,
        length: filterLength.value,
        width: filterWidth.value,
        height: filterHeight.value,
        weight: filterWeight.value,
        stock_quantity: filterStockQuantity.value,
        // price: filterPrice.value,
        // consumed: filterConsumed.value,
        consumed: selectedConsume.value.join(','),
        search: globalSearch.value,
        order_by: currentSort.value.column,
        order_direction: currentSort.value.order,
       },
      responseType: "blob", // Blob untuk file biner
    });

    // Buat URL dari blob
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Buat link untuk download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data_jenis_sku.xlsx"); // Nama file
    document.body.appendChild(link);
    link.click();

    // Hapus elemen link setelah selesai
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error("Error exporting data:", error);
    // alert("Gagal mengekspor data. Silakan coba lagi.");
    titleMessage.value = `Gagal Ekspor`;
    alertMessage.value = `Gagal mengekspor data. Silakan coba lagi.`;
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();
  }
};


const handleAuthError = () => {
  // router.push({ name: 'auth.login' });
  titleMessage.value = `Koneksi Gagal`;
  alertMessage.value = `Cek koneksi internet Anda.`;
  const modal = new BootstrapModal(document.getElementById('message-alert'));
  modal.show();
};


</script>
