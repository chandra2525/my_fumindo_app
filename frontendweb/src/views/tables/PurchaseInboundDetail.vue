<template>
  <div class="row">
    <b-col lg="12">
      <b-card body-class="rounded">
        <b-row>
          <b-col sm="12">
            <h4 class="mb-2 border-bottom pb-2">Detail Pembelian Masuk</h4>
            <div class="row mb-2">
              <div class="col-sm-10">
                <h5 class="mb-1">Nomor Pesanan Pembelian : {{ purchase_order_number }}</h5>
              </div>
              <div class="col-sm-2">
                <h5 v-if="statusPurchase === 'Pending'" class="text-warning">{{ statusPurchase }}</h5>
                <h5 v-else-if="statusPurchase === 'Receiving'" class="text-info">{{ statusPurchase }}</h5>
                <h5 v-else-if="statusPurchase === 'Done'" class="text-success">{{ statusPurchase }}</h5>
                <h5 v-else-if="statusPurchase === 'Canceled'" class="text-danger">{{ statusPurchase }}</h5>
                <h5 v-else>{{ statusPurchase }}</h5>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-sm-4">
                <div>Cabang : <h6>{{ branch_name }}</h6></div>
              </div>
              <div class="col-sm-4">
                <div>Gudang : <h6>{{ warehouse_name }}</h6></div>
              </div>
              <div class="col-sm-4">
                <div>Jenis Aset : <h6>{{ inventory_type }}</h6></div>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-sm-4">
                <div>Vendor : <h6>{{ vendor_name }}</h6></div>
              </div>
              <div class="col-sm-4">
                <div>Tanggal Masuk Diharapkan : <h6>{{ expected_inbound_date }}</h6></div>
              </div>
              <div class="col-sm-4">
                <div>Tanggal Masuk Diterima : <h6>{{ actual_inbound_date }}</h6></div>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-sm-4">
                <div>ASN : <h6>{{ asn }}</h6></div>
              </div>
              <div class="col-sm-4">
                <div>Dibuat Oleh : <h6>{{ username }}</h6></div>
              </div>
              <div class="col-sm-4">
                <div>Diselesaikan Oleh : <h6>{{ inboundByName ?? '-' }}</h6></div>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-sm-8">
                <div>Tanggal Pembuatan : <h6>{{ create_date }}</h6></div>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-card>
    </b-col>

    <div class="col-sm-12">
      <div class="card"> 
        <div class="card-header d-flex justify-content-between">
          <!-- <ul class="d-flex nav nav-pills mb-0 text-center profile-tab" data-toggle="slider-tab" id="profile-pills-tab" role="tablist">
            <li class="nav-item">
              <a class="nav-link active show" data-bs-toggle="tab" href="#pending-sku" role="tab" aria-selected="false">Pending SKU</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="tab" href="#received-sku" role="tab" aria-selected="false">Received SKU</a>
            </li>
          </ul> -->
          <ul class="d-flex nav nav-pills mb-0 text-center profile-tab" data-toggle="slider-tab" id="profile-pills-tab" role="tablist">
            <li class="nav-item" v-for="(tab, index) in tabs" :key="index">
              <a 
                class="nav-link" 
                :class="{ 'active show': activeTab === index, 'text-primary': activeTab != index }" 
                @click="setActiveTab(index)" 
                data-bs-toggle="tab"
                :href="tab.href" 
                role="tab"
                :aria-selected="activeTab === index"
              >
                {{ tab.label }}
              </a>
            </li>
          </ul>
        </div>
        <div class="card-header d-flex justify-content-between">
          <div class="header-title">
            <h5 class="card-title">Daftar SKU Item</h5>
            <!-- <h5 class="card-title"><span class="text-primary mt-4">|</span>Daftar SKU Item</h5> -->
          </div>
        </div>

        <div class="profile-content tab-content iq-tab-fade-up">
          <!-- Tab untuk menampilkan data SKU yang belum diterima -->
          <div id="pending-sku" class="tab-pane fade active show card-body">
            <!-- <div class="row mb-2">
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
                  <label for="validationCustomUsername01" class="form-label">Filter nomor pesanan pembelian</label>
                  <div class="input-group has-validation">
                    <input type="text" v-model="filterPurchaseOrderNumber" class="form-control" style="height: 35px" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
                  </div>
              </div> 
            </div>

            <div class="row mb-2">
              <div class="col-sm-6">
                <label for="filter" class="form-label">Filter jenis aset</label>
                <v-select 
                  :options="optionsInventoryType"
                  v-model="selectedInventoryType"
                  multiple
                  @update:modelValue="onInventoryTypeSelect"
                  class="filter-style"
                ></v-select>
              </div>
              <div class="col-sm-6">
                <label for="filter" class="form-label">Filter vendor</label>
                <v-select 
                  :options="vendorNames" 
                  v-model="selectedVendors" 
                  multiple  
                  @update:modelValue="onVendorSelect" 
                  class="filter-style"
                ></v-select>
              </div>
            </div>
            
            <div class="row mb-2">
              <div class="col-sm-6">
                <label for="validationCustomUsername01" class="form-label">Filter pembuat</label>
                <div class="input-group has-validation">
                  <input type="text" v-model="filterUsername" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
                </div>
              </div>
              <div class="col-sm-6">
                <label for="validationCustomUsername01" class="form-label">Filter tanggal masuk</label>
                <div class="input-group has-validation">
                  <input type="text" v-model="filterInboundDate" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
                </div>
              </div>
            </div>

            <div class="row mb-2">
              <div class="col-sm-6">
                <label for="validationCustomUsername01" class="form-label">Filter ASN</label>
                <div class="input-group has-validation">
                  <input type="text" v-model="filterAsn" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
                </div>
              </div>
              <div class="col-sm-6">
                <label for="validationCustomUsername01" class="form-label">Filter tanggal pembuatan</label>
                <div class="input-group has-validation">
                  <input type="text" v-model="filterCreateDate" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
                </div>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-sm-6">
                <label for="filter" class="form-label">Filter status</label>
                <v-select 
                  :options="optionsStatus"
                  v-model="selectedStatus"
                  multiple
                  @update:modelValue="onStatusSelect"
                  class="filter-style"
                ></v-select>
              </div>
              <div class="col-sm-6">
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
            </div>

            <div class="row mb-4">
              <div class="col-sm-4">
                <div class="input-group has-validation">
                  <button
                    class="btn btn-primary width-button-style filter-style" 
                    @click="fetchSkuItemPendingData"
                    title="Search">
                    Filter
                  </button>
                </div>
              </div>
            </div> -->
  

            <div class="row mb-2">
              <!-- Dropdown Show Entries -->
              <div class="col-sm-6 pagination-show-entries">
                <label for="entries" class="form-label col-sm-3">Show entries</label>
                <select
                  id="entries"
                  class="form-select show-entries"
                  v-model="pageSize"
                  @change="fetchSkuItemPendingData"
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
                :data="purchaseInboundData"
                :columns="columns"
                :currentPage="currentPage"
                :pageSize="pageSize"  
                :idrow="purchase_inbound_item_id"
                @edit="showEditModal"
                @delete="showDeleteModal"
                @viewDetail="navigateToDetail"
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

            </div>
          </div>


          <!-- Tab untuk menampilkan data SKU yang sudah diterima -->
          <div id="received-sku" class="tab-pane fade card-body">
            <div class="row mb-2">
              <!-- Dropdown Show Entries -->
              <div class="col-sm-6 pagination-show-entries">
                <label for="entries" class="form-label col-sm-3">Show entries</label>
                <select
                  id="entries"
                  class="form-select show-entries"
                  v-model="pageSize2"
                  @change="fetchSkuItemReceivedData"
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
                :data="purchaseInboundData2"
                :columns="columns2"
                :currentPage="currentPage2"
                :pageSize="pageSize2"  
                :idrow="purchase_inbound_item_id"
                @edit="showEditModal"
                @delete="showDeleteModal"
                @viewDetail="navigateToDetail"
                @sort="onSort2"
              />

              <div class="pagination-container">
                <p class="text-muted">
                  Showing {{ (currentPage2 - 1) * pageSize2 + 1 }} to
                  {{ Math.min(currentPage2 * pageSize2, totalData2) }} of {{ totalData2 }} entries
                </p>
                <nav aria-label="Page navigation example">
                  <ul class="pagination justify-content-end">
                    <li class="page-item" :class="{ disabled: currentPage2 === 1 }">
                      <button class="page-link" @click="changePage2(currentPage2 - 1)">Previous</button>
                    </li>
                    <li
                      class="page-item"
                      v-for="page in totalPages2"
                      :key="page"
                      :class="{ active: currentPage2 === page }"
                    >
                      <button class="page-link" @click="changePage2(page)">{{ page }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage2 === totalPages2 }">
                      <button class="page-link" @click="changePage2(currentPage2 + 1)">Next</button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          <div class="modal fade" id="form-received" data-bs-backdrop="static" data-bs-keyboard="true" tabindex="-1" aria-labelledby="staticBackdropPermissionLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <div class="col-sm-6">
                    <h5 class="modal-title" id="staticBackdropPermissionLabel">Terima Item SKU</h5>
                  </div>
                  <div class="col-sm-4">
                    <h6 class="text-warning">Progress : {{ editForm.total_actual_quantity }} / {{ editForm.expected_quantity2 }}</h6>
                  </div>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <form @submit.prevent>
                    <!-- <p>Form yang bertanda <span class="text-primary">*</span> wajib diisi</p> -->
                    <!-- <div class="mb-3"> 
                      <label for="input-205" class="form-label">Dari Jenis SKU<span class="text-primary">*</span></label>
                      <select id="sku_type_id" v-model="editForm.sku_type_id" class="form-select" required>
                        <option value="" disabled>Silahkan pilih jenis SKU</option>
                        <option v-for="sku_type in skuTypes" :key="sku_type.sku_type_id" :value="sku_type.sku_type_id">
                          {{ sku_type.sku_type_name }}
                        </option>
                      </select>
                    </div> -->
                    <!-- <div class="mb-3">
                      <label for="sku_item_name" class="form-label">Nama Item SKU<span class="text-primary">*</span></label>
                      <input disabled v-model="editForm.sku_item_name" maxlength="100" type="text" class="form-control" id="sku_item_name" required />
                    </div>
                    <div class="mb-3"> 
                      <label for="brand" class="form-label">Merek</label>
                      <input disabled v-model="editForm.brand" maxlength="100" type="text" class="form-control" id="brand" />
                    </div> -->
                    <div class="row mb-3">
                      <div class="mb-1">Nama Item SKU :</div>
                      <h6>{{ editForm.sku_item_name }}</h6>
                    </div>
                    <div class="row mb-3">
                      <div class="col-sm-6">
                        <div class="mb-1">Merek :</div>
                        <h6>{{ editForm.brand }}</h6>
                      </div>
                      <div class="col-sm-6">
                        <div class="mb-1">Harga :</div>
                        <h6>{{ editForm.current_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) }}</h6>
                      </div>
                    </div>
                    <!-- <div class="mb-3"> 
                      <label for="price" class="form-label">Harga</label>
                      <input disabled v-model="editForm.price" maxlength="4" type="number" class="form-control" id="price" />
                    </div>
                    <div class="mb-3"> 
                      <label for="expected_quantity2" class="form-label">Kuantitas Diharapkan</label>
                      <input disabled v-model="editForm.expected_quantity2" maxlength="4" type="number" class="form-control" id="expected_quantity2" /> -->
                    <!-- </div> -->
                    <div class="row mb-3">
                      <div class="col-sm-6">
                        <div class="mb-1">Kuantitas Diharapkan :</div>
                        <h6>{{ editForm.expected_quantity2 }}</h6>
                      </div>
                      <div class="col-sm-6">
                        <div class="mb-1">Kuantitas Diterima :</div>
                        <h6>{{ editForm.total_actual_quantity }}</h6>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div class="col-sm-6">
                        <label for="actual_quantity" class="form-label">Terima Kuantitas</label>
                        <input v-model="editForm.actual_quantity" @input="handleMaxQuantity" maxlength="4" type="number" min="1" class="form-control" id="actual_quantity"/>
                      </div>
                      <div class="col-sm-6">
                        <label for="actual_inbound_date" class="form-label">Tanggal Diterima Item SKU</label>
                        <input v-model="actualInboundItemDate" type="date" class="form-control mb-3" id="actual_inbound_date" required @click="$event.target.showPicker()" />
                      </div>
                    </div>
                    <!-- Tambahkan field lainnya sesuai dengan struktur data Item SKU -->
                    <button type="submit" @click="submitActualQuantity" class="btn btn-primary" :data-bs-dismiss="'modal'">Simpan</button>
                    <!-- <button type="submit" class="btn btn-primary" :data-bs-dismiss="
                      editForm.actual_quantity ? 'modal' : null">Terima SKU
                    </button> -->
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div class="modal fade" id="form-confirmation" data-bs-backdrop="static" data-bs-keyboard="true" tabindex="-1" aria-labelledby="staticBackdropPermissionLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header"> 
                  <h5 class="modal-title" id="staticBackdropPermissionLabel">Selesaikan Pembelian Masuk</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <!-- <form @submit.prevent="completePurchaseInbound"> -->
                    <label for="actual_inbound_date" class="form-label">Tanggal Masuk Pembelian Diterima</label>
                    <input v-model="actualInboundDate" type="date" class="form-control mb-3" id="actual_inbound_date" required @click="$event.target.showPicker()" />
                    <p>Anda yakin ingin menyelesaikan pembelian masuk?</p>
                    <!-- <button type="submit" @click="completePurchaseInbound" class="btn btn-primary">Selesaikan Pembelian Masuk</button> -->
                    <!-- <button type="submit" class="btn btn-primary" :data-bs-dismiss="
                      editForm.actual_quantity ? 'modal' : null">Terima SKU
                    </button> -->
                  <!-- </form> -->
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kembali</button>
                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="completePurchaseInbound">Selesaikan</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Konfirmasi Penghapusan -->
          <div class="modal fade" id="delete-confirmation" data-bs-backdrop="static" data-bs-keyboard="true" tabindex="-1" aria-labelledby="staticBackdropPermissionLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="deleteConfirmationLabel">Konfirmasi Hapus</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <p>Apa kamu yakin ingin menghapus Item SKU <strong>{{ selectedSkuItem?.sku_item_name }}</strong>?</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="confirmDelete">Delete</button>
                </div>
              </div>
            </div>
          </div>


          <!-- Modal for Mass Upload -->
          <!-- <div
            class="modal fade"
            id="mass-upload-modal"
            tabindex="-1"
            aria-labelledby="massUploadModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="massUploadModalLabel">Mass Upload Pembelian Masuk</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <form @submit.prevent="uploadFilePurchaseInboundData">
                    <div class="mb-3">
                      <label for="upload-file" class="form-label">Pilih File</label>
                      <input
                        type="file"
                        id="upload-file"
                        ref="fileInput"
                        accept=".xlsx, .csv"
                        required
                        class="form-control"
                      />
                    </div>
                    <button type="submit" class="btn btn-primary">Upload</button>
                  </form>
                </div>
              </div>
            </div>
          </div> -->

          <!-- Memanggil Modal  -->
          <MessageModal :message="alertMessage" :title="titleMessage"/>
          
        </div>
 
        <div v-if="statusPurchase != 'Done'" class="card-body">
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#form-confirmation">Selesaikan Pembelian Masuk</button>
        </div>
        
      </div>
    </div>
  </div>
</template>

<style scoped>
  .filter-style {
    /* max-width: 400px; */
    height: 35px;
    /* margin-bottom: 1rem; */
  }

  .width-button-style {
    /* max-width: 400px; */
    width: 85px;
    font-size: 13px; /* Kecil */
    /* margin-bottom: 1rem; */
  }

  .width-button-style-top {
    /* width: 105px; */
    font-size: 13px;
    /* padding: 10px; */
  }

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
</style>


<script setup>
import { ref, onMounted, defineProps } from 'vue';
import axios from 'axios';
import DataTable from '@/components/DataTable.vue';
import MessageModal from '@/components/ModalAlert.vue'; 
import { Modal as BootstrapModal } from 'bootstrap';
// import vSelect from 'vue-select';
// import 'vue-select/dist/vue-select.css';
import { useRouter } from 'vue-router';

const router = useRouter();

const activeTab = ref(0); // Tab yang aktif (default: tab pertama)
const tabs = [
  { label: "Pending SKU", href: "#pending-sku" },
  { label: "Received SKU", href: "#received-sku" },
];
 
const setActiveTab = (index) => {
  activeTab.value = index; // Perbarui tab aktif
  if(tabs.label == 'Pending SKU'){
    typeSubmit.value='create';
  }else{
    typeSubmit.value='update';
  }
};

const props = defineProps({
  purchase_inbound_id: {
    type: String, required: true,
  },
  branch_id: {
    type: String, required: true,
  },
  branch_name: {
    type: String, required: true,
  },
  warehouse_id: {
    type: String, required: true,
  },
  warehouse_name: {
    type: String, required: true,
  },
  purchase_order_number: {
    type: String, required: true,
  },
  inventory_type: {
    type: String, required: true,
  },
  vendor_name: {
    type: String, required: true,
  },
  username: {
    type: String, required: true,
  },
  expected_inbound_date: {
    type: String, required: true,
  },
  actual_inbound_date: {
    type: String, required: true,
  },
  inbound_by: {
    type: String, required: true,
  },
  asn: {
    type: String, required: true,
  },
  status: {
    type: String, required: true,
  },
  create_date: {
    type: String, required: true,
  },
});

const titleMessage = ref('');
const alertMessage = ref(''); 

// Reactive data untuk menyimpan data pembelian masuk
const purchaseInboundData = ref([]);
const purchaseInboundData2 = ref([]);
// const warehouseNames = ref([]);
// const vendorNames = ref([]);
const optionsInventoryType = ref([]);
const optionsStatus = ref([]);
// const selectedWarehouses = ref([]);
// const selectedVendors = ref([]);
// const selectedInventoryType = ref([]);
// const selectedStatus = ref([]);

// const filterPurchaseOrderNumber = ref('');
// const filterUsername = ref('');
// const filterInboundDate = ref('');
// const filterAsn = ref('');
// const filterCreateDate= ref('');

const globalSearch = ref('');

const currentPage = ref(1); // Halaman aktif
const currentPage2 = ref(1); // Halaman aktif
const totalPages = ref(0); // Total halaman
const totalPages2 = ref(0); // Total halaman
const pageSize = ref(10); // Banyaknya data per halaman
const pageSize2 = ref(10); // Banyaknya data per halaman
const totalData = ref(0); // Jumlah total data dari API
const totalData2 = ref(0); // Jumlah total data dari API

const statusPurchase = ref('');
const actualInboundDate = ref(new Date().toISOString().split('T')[0]);
const actualInboundItemDate = ref(new Date().toISOString().split('T')[0]);
const inboundByName = ref(null);

const actualQuantityBefore = ref(0);
const typeSubmit = ref('create');

// Definisikan kolom untuk DataTable, gunakan komponen Actions untuk kolom tindakan
// Ambil token dari localStorage
const token = localStorage.getItem('access_token');
const user_id = localStorage.getItem('user_id');

const columns = [
  // { title: 'Dari Jenis SKU', data: 'sku_type_name', sortable: true },
  { title: 'Nama Item SKU', data: 'sku_item_name', sortable: true },
  { title: 'Merek', data: 'brand', sortable: true },
  // { title: 'Panjang', data: 'length', sortable: true },
  // { title: 'Lebar', data: 'width', sortable: true },
  // { title: 'Tinggi', data: 'height', sortable: true },
  // { title: 'Berat', data: 'weight', sortable: true },
  // { title: 'Dari Satuan', data: 'unit_name', sortable: true },
  // { title: 'Dari Vendor', data: 'vendor_name', sortable: true },
  { title: 'Harga', data: 'current_price', sortable: true },
  { title: 'Kuantitas Diharapkan', data: 'expected_quantity2', sortable: true },
  { title: 'Total Harga', data: 'total_price', sortable: false },
  { title: 'Kuantitas Diterima', data: 'total_actual_quantity', sortable: true },
  { title: 'SKU dapat Dikonsumsi', data: 'consumed', sortable: true },
  // { title: 'Tanggal Masuk Diterima', data: 'actual_inbound_item_date', sortable: true },
  // { title: 'Aksi', data: 'edit', sortable: false },
];

const columns2 = [
  // { title: 'Dari Jenis SKU', data: 'sku_type_name', sortable: true },
  { title: 'Nama Item SKU', data: 'sku_item_name', sortable: true },
  { title: 'Merek', data: 'brand', sortable: true },
  // { title: 'Panjang', data: 'length', sortable: true },
  // { title: 'Lebar', data: 'width', sortable: true },
  // { title: 'Tinggi', data: 'height', sortable: true },
  // { title: 'Berat', data: 'weight', sortable: true },
  // { title: 'Dari Satuan', data: 'unit_name', sortable: true },
  // { title: 'Dari Vendor', data: 'vendor_name', sortable: true },
  { title: 'Harga', data: 'current_price', sortable: true },
  { title: 'Kuantitas Diharapkan', data: 'expected_quantity2', sortable: true },
  { title: 'Total Harga', data: 'total_price', sortable: false },
  { title: 'Kuantitas Diterima', data: 'actual_quantity', sortable: true },
  { title: 'SKU dapat Dikonsumsi', data: 'consumed', sortable: true },
  { title: 'Tanggal Masuk Diterima', data: 'actual_inbound_item_date', sortable: true },
  // { title: 'Aksi', data: 'edit', sortable: false },
];

const editForm = ref({
  purchase_inbound_item_id: null,
  // sku_type_id: '',
  unit_id: '',
  vendor_id: '',
  sku_item_name: '',
  brand: '',
  length: '0',
  width: '0',
  height: '0',
  weight: '0',
  price: '0',
  current_price: '0',
  expected_quantity2: '0',
  actual_quantity: '0',
  total_actual_quantity: '0',
  consumed: 'Iya',
})

const selectedSkuItem = ref(null) // Menyimpan data jenis SKU yang dipilih untuk dihapus
const isEditMode = ref(false)

// Fungsi untuk membuka modal edit dan mengisi form dengan data yang dipilih
const showEditModal = (rowData) => {
  selectedSkuItem.value = rowData
  editForm.value = { ...rowData } 
  isEditMode.value = true
}

const showDeleteModal = (rowData) => {
  selectedSkuItem.value = rowData
  editForm.value = { ...rowData }
}

// Mengambil data pembelian masuk saat komponen dimuat
onMounted(async () => {
  const modalReceived = document.getElementById('form-received');
  // const modalDelete = document.getElementById('delete-confirmation');
  // const bootstrapModal = new BootstrapModal(modalReceived);

  // Tambahkan listener untuk event 'shown.bs.modal'
  modalReceived.addEventListener('shown.bs.modal', () => {
    getQuantityBefore();
  });
  // modalDelete.addEventListener('shown.bs.modal', () => {
  //   getQuantityBefore();
  // });
  
  statusPurchase.value = props.status;
  if (statusPurchase.value != 'Done') {
    columns.push({ title: 'Aksi', data: 'edit', sortable: false });
    columns2.push({ title: 'Aksi', data: 'edit2', sortable: false });
  } else {
    await getUserById();
  }
  await fetchSkuItemPendingData();
  await fetchSkuItemReceivedData();
  optionsInventoryType.value= ["Usage", "Storage"];
  optionsStatus.value= ["Pending", "Receiving", "Done", "Canceled"];
});

const currentSort = ref({ column: 'oldest_purchase_inbound_item_id', order: 'DESC' });
const currentSort2 = ref({ column: 'purchase_inbound_item_id', order: 'DESC' });

const onSort = ({ column, order }) => {
  currentSort.value = { column, order };
  fetchSkuItemPendingData(); // Panggil ulang API dengan parameter sorting
};

const onSort2 = ({ column, order }) => {
  currentSort2.value = { column, order };
  fetchSkuItemReceivedData(); // Panggil ulang API dengan parameter sorting
};

// const onVendorSelect = (selected) => {
//   selectedVendors.value = selected; // Perbarui nilai terpilih
//   // fetchSkuItemPendingData(); // Panggil fungsi fetch dengan data terpilih
// };

// const onInventoryTypeSelect = (selected) => {
//   selectedInventoryType.value = selected; // Perbarui nilai terpilih
//   // fetchSkuItemPendingData(); // Panggil fungsi fetch dengan data terpilih
// };

// const onStatusSelect = (selected) => {
//   selectedStatus.value = selected; // Perbarui nilai terpilih
//   // fetchSkuItemPendingData(); // Panggil fungsi fetch dengan data terpilih
// };


// Daftar
// const vendors = ref([]);

// Fungsi untuk mengambil data pembelian masuk dari backend
const fetchSkuItemPendingData = async () => {
  try {
    const responsePending = await axios.get('http://localhost:3000/api/purchase_inbound_item/pending', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        purchase_inbound_id: props.purchase_inbound_id,
        // actual_quantity: 0,
        search: globalSearch.value,
        order_by: currentSort.value.column == 'expected_quantity2' ? 'expected_quantity' :currentSort.value.column,
        order_direction: currentSort.value.order,
        page: currentPage.value, // Kirim nomor halaman
        pageSize: pageSize.value, // Kirim ukuran data per halaman
      },
    })

    purchaseInboundData.value = responsePending.data.rows.map((purchase_inbound) => ({
      ...purchase_inbound,
      // Ambil nama nama atau tampilkan "N/A" jika tidak ada
      sku_item_name: purchase_inbound.skuItem?.sku_item_name || '-',
      brand: purchase_inbound.skuItem?.brand || '-',
      length: purchase_inbound.skuItem?.length || '0',
      width: purchase_inbound.skuItem?.width || '0',
      height: purchase_inbound.skuItem?.height || '0',
      weight: purchase_inbound.skuItem?.weight || '0',
      price: purchase_inbound.skuItem?.price || '0',
      consumed: purchase_inbound.skuItem?.consumed || '0',
      // username: purchase_inbound.user?.username || 'N/A',
      // vendor_name: purchase_inbound.vendor?.vendor_name || 'N/A',
      // create_date2: formatTanggal(purchase_inbound.create_date), // Format kolom tanggal
      expected_quantity2: purchase_inbound.expected_quantity,
      total_actual_quantity: purchase_inbound.total_actual_quantity || 0,
      // actual_inbound_item_date: purchase_inbound.actual_inbound_item_date || '-',
      actual_inbound_item_date: '-',
      total_price: parseFloat((purchase_inbound.expected_quantity * purchase_inbound.current_price).toFixed(2)),
      // total_price: parseFloat((purchase_inbound.expected_quantity * purchase_inbound.skuItem?.price).toFixed(2)),
    }))

    purchaseInboundData.value = purchaseInboundData.value.filter(purchase_inbound => purchase_inbound.expected_quantity2 != purchase_inbound.total_actual_quantity);
    // totalData.value = responsePending.data.sp.rowCount;
    totalData.value = purchaseInboundData.value.length;
    totalPages.value = Math.ceil(totalData.value / pageSize.value);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    } 
    else {
      console.error('Error fetching purchase_inbound pending data:', error)
      handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    }
  }
};


const fetchSkuItemReceivedData = async () => {
  try {
    const responseReceived = await axios.get('http://localhost:3000/api/purchase_inbound_item/received', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        purchase_inbound_id: props.purchase_inbound_id,
        actual_quantity: '>0',
        search: globalSearch.value,
        order_by: currentSort2.value.column == 'expected_quantity2' ? 'expected_quantity' :currentSort2.value.column,
        order_direction: currentSort2.value.order,
        page: currentPage2.value, // Kirim nomor halaman
        pageSize: pageSize2.value, // Kirim ukuran data per halaman
      },
    })

    purchaseInboundData2.value = responseReceived.data.rows.map((purchase_inbound) => ({
      ...purchase_inbound,
      // Ambil nama nama atau tampilkan "N/A" jika tidak ada
      sku_item_name: purchase_inbound?.sku_item_name || '-',
      brand: purchase_inbound?.brand || '-',
      length: purchase_inbound?.length || '0',
      width: purchase_inbound?.width || '0',
      height: purchase_inbound?.height || '0',
      weight: purchase_inbound?.weight || '0',
      price: purchase_inbound?.price || '0',
      consumed: purchase_inbound?.consumed || '0',
      // username: purchase_inbound.user?.username || 'N/A',
      // vendor_name: purchase_inbound.vendor?.vendor_name || 'N/A',
      // create_date2: formatTanggal(purchase_inbound.create_date), // Format kolom tanggal
      expected_quantity2: purchase_inbound.expected_quantity,
      actual_quantity: purchase_inbound.actual_quantity || 0,
      total_actual_quantity: purchase_inbound.total_actual_quantity || 0,
      actual_inbound_item_date: purchase_inbound.actual_inbound_item_date || '-',
      total_price: parseFloat((purchase_inbound.expected_quantity * purchase_inbound.current_price).toFixed(2)),
      // total_price: parseFloat((purchase_inbound.expected_quantity * purchase_inbound.skuItem?.price).toFixed(2)),
    }))
    
    totalData2.value = responseReceived.data.sp.rowCount;
    totalPages2.value = Math.ceil(responseReceived.data.sp.rowCount / pageSize2.value);
    if(totalData2.value == 0){
      statusPurchase.value = 'Pending';
    // }else if(statusPurchase.value == 'Done'){
    }else if(totalData.value == 0 && statusPurchase.value != 'Done' ){
      statusPurchase.value = 'Done';
      completePurchaseInbound()
    }else if(totalData.value == 0){
      statusPurchase.value = 'Done';
    }else if(statusPurchase.value == 'Canceled'){
      statusPurchase.value = 'Canceled';
    }else{
      statusPurchase.value = 'Receiving';
    }
    autoUpdateStatus();
  } catch (error) {
    // if (error.response && error.response.status === 401) {
    //   handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    // } 
    // else {
      console.error('Error fetching purchase_inbound received data:', error)
    //   handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    // }
  }
};


// Fungsi untuk mengganti halaman
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchSkuItemPendingData(); // Refresh data untuk halaman baru
  }
};

const changePage2 = (page) => {
  if (page >= 1 && page <= totalPages2.value) {
    currentPage2.value = page;
    fetchSkuItemReceivedData(); // Refresh data untuk halaman baru
  }
};


const getUserById = async () => {
  console.error('props.inbound_by', props.inbound_by);
  try {
    const response = await axios.get(`http://localhost:3000/api/user/${props.inbound_by}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    inboundByName.value = response.data.username;
    console.log('inboundByName.value:', inboundByName.value)
  } catch (error) {
    // if (error.response && error.response.status === 401) {
    //   handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    // } 
    // else {
      console.error('Error fetching getUserById:', error);
    //   handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    // }
  }
};

// const fetchVendors = async () => {
//   try {
//     const response = await axios.get('http://localhost:3000/api/vendor', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       params: {
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
//     handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
//     // alert('Lakukan login terlebih dulu') 
//   }
// };

const getQuantityBefore = async () => {
  actualQuantityBefore.value = Number(editForm.value.actual_quantity);
  console.log('Data update:', actualQuantityBefore.value)
}


const confirmDelete = async () => {
  actualQuantityBefore.value = Number(selectedSkuItem.value.actual_quantity);
  editForm.value.actual_quantity = 0;
  submitActualQuantity();
}


const submitActualQuantity = async () => {
  // console.log('Edit data submitted:', editForm.value)
  try {
    if(editForm.value.actual_quantity > 0 && actualQuantityBefore.value != editForm.value.actual_quantity && actualQuantityBefore.value == 0){
      console.log('Create Data');
      // Create data baru menambah parsial ke table purchase_inbound_item
      const response = await axios.post(`http://localhost:3000/api/purchase_inbound_item`,
        {
          purchase_inbound_id: props.purchase_inbound_id,
          sku_item_id: editForm.value.sku_item_id,
          current_price: editForm.value.current_price,
          expected_quantity: editForm.value.expected_quantity2,
          actual_quantity: editForm.value.actual_quantity,
          actual_inbound_item_date: actualInboundItemDate.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log('Data berhasil ditambahkan:', response.data)
    }else if(editForm.value.actual_quantity == 0){
      console.log('Delete Data:', selectedSkuItem.value.purchase_inbound_item_id)
       const response = await axios.delete(`http://localhost:3000/api/purchase_inbound_item/${Number(selectedSkuItem.value.purchase_inbound_item_id)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      handleErrorMessage(`Berhasil Dihapus`,`Data Item SKU <strong>${selectedSkuItem.value.sku_item_name}</strong> berhasil dihapus.`,'error');
      console.log('Data berhasil dihapus:', response.data)
    }else{
      console.log('Update Data');
      // Update data dari table purchase_inbound_item where purchase_inbound_item_id dan perbarui stok menyesuaikan kuantitas diterima
      // const response = await axios.put(`http://localhost:3000/api/purchase_inbound_item/${editForm.value.purchase_inbound_item_id}`,
      const response = await axios.put(`http://localhost:3000/api/purchase_inbound_item/${selectedSkuItem.value.purchase_inbound_item_id}`,
        {
          actual_quantity: editForm.value.actual_quantity,
          actual_inbound_item_date: editForm.value.actual_quantity == 0 ? null : actualInboundItemDate.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log('Data berhasil diupdate:', response.data)
    }

    console.log('Data update terima warehouse_id:', props.warehouse_id)
    console.log('Data update terima stock_quantity:', editForm.value.actual_quantity)
    console.log('Data update terima quantity_before: ', actualQuantityBefore.value)
    console.log('Data update terima type_submit:', typeSubmit.value)
    const response2 = await axios.post(`http://localhost:3000/api/stock`,
      {
        sku_item_id: editForm.value.sku_item_id,
        branch_id: Number(props.branch_id),
        warehouse_id: Number(props.warehouse_id),
        stock_quantity: editForm.value.actual_quantity,
        quantity_before: actualQuantityBefore.value,
        type_submit: typeSubmit.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    console.log('Data stock berhasil diupdate:', response2.data)


    // if(editForm.value.actual_quantity == 0){
    //   const response3 = await axios.delete(`http://localhost:3000/api/stock`,
    //     {
    //       sku_item_id: Number(editForm.value.sku_item_id),
    //       warehouse_id: Number(props.warehouse_id),
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   )
    //   console.log('Data stock berhasil dihapus:', response3.data)
    // }

    fetchSkuItemPendingData()
    fetchSkuItemReceivedData()
  }
  catch (error) {
    if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    } 
    else {
      console.error('Gagal menyimpan data:', error)
      handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    }
  }
}


const autoUpdateStatus = async () => {
  try {
    const response = await axios.put(`http://localhost:3000/api/purchase_inbound/updateStatus/${props.purchase_inbound_id}`,
    {
      status: statusPurchase.value,
    }, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('Data berhasil diupdate:', response.data)
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    } 
    else {
      console.error('Gagal mengupdate data:', error)
      handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    }
  }
}


const completePurchaseInbound = async () => {
  try {
    const response = await axios.put(`http://localhost:3000/api/purchase_inbound/updateStatus/${props.purchase_inbound_id}`,
    {
      status: 'Done',
      actual_inbound_date : actualInboundDate.value,
      inbound_by: Number(user_id),
    }, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('Data berhasil diupdate:', response.data)
    handleErrorMessage(`Berhasil Diselesaikan`,`Pembelian masuk berhasil diselesaikan.`,'error');
    // router.go(-1);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    } 
    else {
      console.error('Gagal mengupdate data:', error)
      handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    }
  }
}


const handleErrorMessage = (title, alert, type) => {
  type == 'session'? router.push({ name: 'auth.login' }) : null;
  titleMessage.value = title;
  alertMessage.value = alert;
  const modal = new BootstrapModal(document.getElementById('message-alert'));
  modal.show();
};


// Fungsi untuk mencegah input `actual_quantity` melebihi `expected_quantity2`
const handleMaxQuantity = (event) => {
  const maxQuantity = ref(0);
  if(actualQuantityBefore.value == 0){
    maxQuantity.value = editForm.value.expected_quantity2 - editForm.value.total_actual_quantity;
  }else{
    maxQuantity.value = editForm.value.expected_quantity2 - (editForm.value.total_actual_quantity - actualQuantityBefore.value) ;
  }
  if (event.target.value > maxQuantity.value) {
    event.target.value = maxQuantity; // Batasi nilai ke maksimum
    editForm.value.actual_quantity = maxQuantity;
  }
};


// watch(
//   purchaseInboundData,
//   purchaseInboundData2,
//   (newVal) => {
//     newVal.forEach(item => { 
//       item.total_price = parseFloat((item.expected_quantity2 * item.price).toFixed(2));
//     });
//   },
//   { deep: true }
// );

// const validateNumericInput = async (field) => {
//   // Dapatkan nilai input
//   const value = editForm.value[field];
  
//   // Regex untuk angka 0-9
//   const numericRegex = /^[0-9]*$/; 
  
//   // Jika input tidak sesuai, hapus karakter terakhir
//   if (!numericRegex.test(value)) {
//     editForm.value[field] = value.slice(0, -1); // Hapus karakter terakhir
//   }
// };


// function formatTanggal(tanggalString) {
//   const hari = [
//     "Minggu",
//     "Senin",
//     "Selasa",
//     "Rabu",
//     "Kamis",
//     "Jumat",
//     "Sabtu"
//   ];
//   const bulan = [
//     "Januari",
//     "Februari",
//     "Maret",
//     "April",
//     "Mei",
//     "Juni",
//     "Juli",
//     "Agustus",
//     "September",
//     "Oktober",
//     "November",
//     "Desember"
//   ];

//   const date = new Date(tanggalString);
//   const namaHari = hari[date.getDay()];
//   const tanggal = date.getDate();
//   const namaBulan = bulan[date.getMonth()];
//   const tahun = date.getFullYear();
//   const jam = date.getHours().toString().padStart(2, "0");
//   const menit = date.getMinutes().toString().padStart(2, "0");
//   const detik = date.getSeconds().toString().padStart(2, "0");

//   return `${namaHari}, ${tanggal} ${namaBulan} ${tahun}, Jam ${jam}:${menit}:${detik} WIB`;
// }

</script>
