<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header d-flex justify-content-between">
          <div class="header-title">
            <h4 class="card-title">List Item SKU</h4>
          </div>
          <div>
            <button
              class="btn btn-success width-button-style-top"
              style="margin-right: 10px;" 
              @click="showAddModal"
              data-bs-toggle="modal"
              data-bs-target="#form-confirmation">
              Tambah Item SKU
            </button>
            <button 
              class="btn btn-outline-success width-button-style-top" 
              style="margin-right: 10px;" 
              @click="exportSkuItemData">
              Ekspor Data
            </button>
            <button
              class="btn btn-info width-button-style-top"
              style="margin-right: 10px;"
              data-bs-toggle="modal"
              data-bs-target="#mass-upload-modal">
              Mass Upload
            </button>
            <button 
              class="btn btn-outline-info width-button-style-top" 
              @click="downloadTemplateSkuItemData">
              Download Template
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="row mb-2">
            <div class="col-sm-6">
              <label for="filter" class="form-label">Filter jenis SKU</label>
              <v-select 
                :options="skuTypeNames" 
                v-model="selectedSkuTypes" 
                multiple  
                @update:modelValue="onSkuTypeSelect" 
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
              <label for="validationCustomUsername01" class="form-label">Filter merek</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterBrand" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            </div>
            <div class="col-sm-6">
              <label for="filter" class="form-label">Filter satuan</label>
              <v-select 
                :options="unitNames" 
                v-model="selectedUnits" 
                multiple  
                @update:modelValue="onUnitSelect" 
                class="filter-style"
              ></v-select>
            </div>
          </div>
          
          <div class="row mb-3">
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
            <!-- <div class="col-sm-6">
              <label for="validationCustomUsername01" class="form-label">Filter SKU dapat dikonsumsi</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterConsumed" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            </div> -->
            <!-- <div class="col-sm-6">
              <label for="validationCustomUsername01" class="form-label">Filter panjang</label>
              <div class="input-group has-validation"> 
                <input type="text" v-model="filterLength" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            </div> -->
          </div>

          <!-- <div class="row mb-2">
            <div class="col-sm-6">
              <label for="validationCustomUsername01" class="form-label">Filter lebar</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterWidth" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            </div>
            <div class="col-sm-6">
              <label for="validationCustomUsername01" class="form-label">Filter tinggi</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterHeight" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            </div>
          </div>

          <div class="row mb-2">
            <div class="col-sm-6">
              <label for="validationCustomUsername01" class="form-label">Filter berat</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterWeight" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            </div>
            <div class="col-sm-6">
              <label for="validationCustomUsername01" class="form-label">Filter harga</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterPrice" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            </div>
          </div> -->

          <div class="row mb-2">
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
             <div class="col-sm-4">
              <label for="validationCustomUsername01" class="form-label text-white">I</label>
              <div class="input-group has-validation">
                <button
                  class="btn btn-primary width-button-style filter-style" 
                  @click="fetchSkuItemData"
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
                @change="fetchSkuItemData"
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
              :data="skuItemData"
              :columns="columns"
              :currentPage="currentPage"
              :pageSize="pageSize"  
              :idrow="sku_item_id"
              @edit="showEditModal"
              @delete="showDeleteModal"
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
            
            <div class="modal fade" id="form-confirmation" data-bs-backdrop="static" data-bs-keyboard="true" tabindex="-1" aria-labelledby="staticBackdropPermissionLabel" aria-hidden="true" @hide="resetForm">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropPermissionLabel">{{ isEditMode ? 'Perbarui Item SKU' : 'Tambah Item SKU' }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form @submit.prevent="submitSkuItem">
                      <p>Form yang bertanda <span class="text-primary">*</span> wajib diisi</p> 
                      <div class="mb-3"> 
                        <label for="input-205" class="form-label">Dari Jenis SKU<span class="text-primary">*</span></label>
                        <select id="sku_type_id" v-model="editForm.sku_type_id" class="form-select" required>
                          <option value="" disabled>Silahkan pilih jenis SKU</option>
                          <option v-for="sku_type in skuTypes" :key="sku_type.sku_type_id" :value="sku_type.sku_type_id">
                            {{ sku_type.sku_type_name }}
                          </option>
                        </select>
                      </div>
                      <div class="mb-3">
                        <label for="sku_item_name" class="form-label">Nama Item SKU<span class="text-primary">*</span></label>
                        <input v-model="editForm.sku_item_name" maxlength="100" type="text" class="form-control" id="sku_item_name" required />
                      </div>
                      <div class="mb-3"> 
                        <label for="brand" class="form-label">Merek</label>
                        <input v-model="editForm.brand" maxlength="100" type="text" class="form-control" id="brand" />
                      </div>
                      <div class="mb-3"> 
                        <label for="length" class="form-label">Panjang</label>
                        <div class="input-group">
                          <!-- <input v-model="editForm.length" maxlength="4" type="number" class="form-control" id="length" /> -->
                          <input v-model="editForm.length" maxlength="6" type="text" class="form-control" id="length" @input="validateDecimalInput('length')" />
                          <span class="input-group-text">cm</span>
                        </div>
                      </div>
                      <div class="mb-3"> 
                        <label for="width" class="form-label">Lebar</label> 
                        <div class="input-group">
                          <!-- <input v-model="editForm.width" maxlength="4" type="number" class="form-control" id="width" /> -->
                          <input v-model="editForm.width" maxlength="6" type="text" class="form-control" id="width" @input="validateDecimalInput('width')" />
                          <span class="input-group-text">cm</span>
                        </div>
                      </div>
                      <div class="mb-3"> 
                        <label for="height" class="form-label">Tinggi</label>
                        <div class="input-group">
                          <!-- <input v-model="editForm.height" maxlength="4" type="number" class="form-control" id="height" /> -->
                          <input v-model="editForm.height" maxlength="6" type="text" class="form-control" id="height" @input="validateDecimalInput('height')" />
                          <span class="input-group-text">cm</span>
                        </div>
                      </div>
                      <div class="mb-3"> 
                        <label for="weight" class="form-label">Berat</label>
                        <div class="input-group">
                          <!-- <input v-model="editForm.weight" maxlength="4" type="number" class="form-control" id="weight" /> -->
                          <input v-model="editForm.weight" maxlength="6" type="text" class="form-control" id="weight" @input="validateDecimalInput('weight')" />
                          <span class="input-group-text">kg</span>
                        </div>
                      </div>
                      <div class="mb-3"> 
                        <label for="input-205" class="form-label">Dari Satuan<span class="text-primary">*</span></label>
                        <select id="unit_id" v-model="editForm.unit_id" class="form-select" required>
                          <option value="" disabled>Silahkan pilih satuan</option>
                          <option v-for="unit in units" :key="unit.unit_id" :value="unit.unit_id">
                            {{ unit.unit_name }}
                          </option>
                        </select>
                      </div>
                      <div class="mb-3"> 
                        <label for="input-205" class="form-label">Dari Vendor<span class="text-primary">*</span></label>
                        <select id="vendor_id" v-model="editForm.vendor_id" class="form-select" required>
                          <option value="" disabled>Silahkan pilih vendor</option>
                          <option v-for="vendor in vendors" :key="vendor.vendor_id" :value="vendor.vendor_id">
                            {{ vendor.vendor_name }}
                          </option>
                        </select>
                      </div>
                      <div class="mb-3"> 
                        <label for="price" class="form-label">Harga<span class="text-primary">*</span></label>
                        <div class="input-group">
                          <input v-model="editForm.price" maxlength="4" type="number" class="form-control" id="price" required/>
                          <span class="input-group-text">Rp</span>
                        </div>
                      </div>
                      <div class="mb-3">
                        <label for="consumed" class="form-label">SKU dapat Dikonsumsi<span class="text-primary">*</span></label>
                        <div class="mb-1">
                          <b-form-radio value="Iya" v-model="editForm.consumed" class="d-inline-block">Iya</b-form-radio>
                          <label class="form-label text-white"> . . . . </label>
                          <b-form-radio value="Tidak" v-model="editForm.consumed" class="d-inline-block">Tidak</b-form-radio>
                        </div>
                      </div>
                      <!-- <div class="mb-3"> 
                        <label for="consumed" class="form-label">SKU dapat Dikonsumsi<span class="text-primary">*</span></label>
                        <input v-model="editForm.consumed" maxlength="4" type="text" class="form-control" id="consumed" required/>
                      </div> -->
                      <!-- Tambahkan field lainnya sesuai dengan struktur data Item SKU -->
                      <div class="mb-3">
                        <label class="form-label" for="sku_item_image">Gambar</label>
                        <input @change="handleFileUpload" type="file" ref="imagePath" accept="image/*" class="form-control mb-2" id="sku_item_image" />
                        <img
                          :src="`http://localhost:3000/qr_code_image/${editForm.sku_item_image}`"
                          alt="Image"
                          width="100"
                          height="100"
                          v-if="editForm.sku_item_image"
                        />
                      </div>
                      <button type="submit" class="btn btn-primary" :data-bs-dismiss="
                        editForm.sku_type_id&&editForm.unit_id&&editForm.vendor_id&&editForm.sku_item_name&&editForm.consumed&&editForm.price ? 'modal' : null">{{ isEditMode ? 'Simpan Perubahan' : 'Tambahkan Item SKU' }}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

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
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="confirmDelete">Delete</button>
                  </div>
                </div>
              </div>
            </div>
 

            <!-- Modal for Mass Upload -->
            <div
              class="modal fade"
              id="mass-upload-modal"
              tabindex="-1"
              aria-labelledby="massUploadModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="massUploadModalLabel">Mass Upload Item SKU</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form @submit.prevent="uploadFileSkuItemData">
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
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from '@/components/DataTable.vue';
import MessageModal from '@/components/ModalAlert.vue'; 
import { Modal as BootstrapModal } from 'bootstrap';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import { useRouter } from 'vue-router';

const router = useRouter();
const titleMessage = ref('');
const alertMessage = ref(''); 

// Reactive data untuk menyimpan data jenis SKU
const skuItemData = ref([]);
const skuTypeNames = ref([]);
const unitNames = ref([]);
const vendorNames = ref([]);
const optionsConsume = ref([]);
const selectedSkuTypes = ref([]);
const selectedUnits = ref([]);
const selectedVendors = ref([]);
const selectedConsume = ref([]);
const filterSkuItemName = ref('');
const filterBrand = ref('');
const filterLength = ref('');
const filterWidth = ref('');
const filterHeight = ref('');
const filterWeight= ref('');
const filterPrice = ref('');
// const filterConsumed = ref('');
const globalSearch = ref('');

const imagePath = ref('');

const currentPage = ref(1); // Halaman aktif
const totalPages = ref(0); // Total halaman
const pageSize = ref(10); // Banyaknya data per halaman
const totalData = ref(0); // Jumlah total data dari API

// Definisikan kolom untuk DataTable, gunakan komponen Actions untuk kolom tindakan
// Ambil token dari localStorage
const token = localStorage.getItem('access_token');

const columns = [
  // { title: 'ID', data: 'sku_item_id', sortable: true },
  { title: 'Dari Jenis SKU', data: 'sku_type_name', sortable: true },
  { title: 'Nama Item SKU', data: 'sku_item_name', sortable: true },
  { title: 'Merek', data: 'brand', sortable: true },
  { title: 'Panjang', data: 'length', sortable: true },
  { title: 'Lebar', data: 'width', sortable: true },
  { title: 'Tinggi', data: 'height', sortable: true },
  { title: 'Berat', data: 'weight', sortable: true },
  { title: 'Dari Satuan', data: 'unit_name', sortable: true },
  { title: 'Dari Vendor', data: 'vendor_name', sortable: true },
  { title: 'Harga', data: 'price', sortable: true },
  { title: 'SKU dapat Dikonsumsi', data: 'consumed', sortable: true },
  { title: 'Gambar', data: 'sku_item_image', sortable: true },
  { title: 'QR Code', data: 'sku_item_id', sortable: true },
  { title: 'Aksi', data: 'actions', sortable: false },
];



// const isEditModalOpen = ref(false)
const isEditMode = ref(false)

const editForm = ref({
  sku_item_id: null,
  sku_type_id: '',
  unit_id: '',
  vendor_id: '',
  sku_item_name: '',
  brand: '',
  length: '0',
  width: '0',
  height: '0',
  weight: '0',
  price: '0',
  consumed: 'Iya',
  sku_item_image: null,
})

// Fungsi untuk membuka modal edit dan mengisi form dengan data yang dipilih
// const openEditModal = (rowData) => {
//   editForm.value = { ...rowData }
//   isEditModalOpen.value = true
// }

// Fungsi untuk reset form saat modal ditutup
const resetForm = () => {
  editForm.value = {
    sku_item_id: null,
    sku_type_id: '',
    unit_id: '',
    vendor_id: '',
    sku_item_name: '',
    brand: '',
    length: '0',
    width: '0',
    height: '0',
    weight: '0',
    price: '0',
    consumed: 'Iya',
    sku_item_image: null,
  }
}

const selectedSkuItem = ref(null) // Menyimpan data jenis SKU yang dipilih untuk dihapus

// Fungsi untuk menampilkan modal konfirmasi penghapusan
const showDeleteModal = (rowData) => {
  selectedSkuItem.value = rowData
}

// Fungsi untuk membuka modal edit dan mengisi form dengan data yang dipilih
const showEditModal = (rowData) => {
  if (imagePath.value) {
    imagePath.value.value = null;
  }
  selectedSkuItem.value = rowData
  editForm.value = { ...rowData } 
  isEditMode.value = true
}

// Fungsi untuk membuka modal tambah dengan form kosong
const showAddModal = () => {
  resetForm() // Kosongkan form
  isEditMode.value = false
  // isEditModalOpen.value = true
}

// Fungsi untuk submit tambah/edit
const submitSkuItem = async () => {
  console.log('Edit data submitted:', editForm.value)

  const formData = new FormData();
  formData.append("sku_type_id", editForm.value.sku_type_id);
  formData.append("unit_id", editForm.value.unit_id);
  formData.append("vendor_id", editForm.value.vendor_id);
  formData.append("sku_item_name", editForm.value.sku_item_name);
  formData.append("brand", editForm.value.brand);
  formData.append("length", editForm.value.length);
  formData.append("width", editForm.value.width);
  formData.append("height", editForm.value.height);
  formData.append("weight", editForm.value.weight);
  formData.append("price", editForm.value.price);
  formData.append("consumed", editForm.value.consumed);
  if (imagePath.value) {
    editForm.value.sku_item_image = imagePath.value; 
    formData.append("sku_item_image", editForm.value.sku_item_image);
  } 
  console.log('file image:', editForm.value.sku_item_image)

  try {
    if (isEditMode.value) {
      // Update data jika dalam mode edit
      const response = await axios.put(`http://localhost:3000/api/sku_item/${editForm.value.sku_item_id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil diupdate:', response.data)
      fetchSkuItemData()
    }else {
      // Tambahkan data baru jika dalam mode tambah
      const response = await axios.post('http://localhost:3000/api/sku_item', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil ditambahkan:', response.data)

      fetchSkuItemData()
    }
    // Tutup modal setelah berhasil update
    // isEditModalOpen.value = false
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    } 
    else {
      console.error('Gagal menyimpan data:', error)
      handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    }
  }
}

// Mengambil data jenis SKU saat komponen dimuat
onMounted(async () => {
  await fetchSkuItemData();
  await fetchSkuTypes();
  await fetchUnits();
  await fetchVendors();
   optionsConsume.value= ["Iya", "Tidak"];
});

const currentSort = ref({ column: 'sku_item_id', order: 'DESC' });

const onSort = ({ column, order }) => {
  currentSort.value = { column, order };
  fetchSkuItemData(); // Panggil ulang API dengan parameter sorting
};

const onSkuTypeSelect = (selected) => {
  selectedSkuTypes.value = selected; // Perbarui nilai terpilih
  // fetchSkuItemData(); // Panggil fungsi fetch dengan data terpilih
};

const onUnitSelect = (selected) => {
  selectedUnits.value = selected; // Perbarui nilai terpilih
  // fetchSkuItemData(); // Panggil fungsi fetch dengan data terpilih
};

const onVendorSelect = (selected) => {
  selectedVendors.value = selected; // Perbarui nilai terpilih
  // fetchSkuItemData(); // Panggil fungsi fetch dengan data terpilih
};

const onConsumeSelect = (selected) => {
  selectedConsume.value = selected; // Perbarui nilai terpilih
  // fetchSkuItemData(); // Panggil fungsi fetch dengan data terpilih
};


// Daftar  
const skuTypes = ref([]);
const units = ref([]);
const vendors = ref([]);


// Fungsi untuk mengambil data jenis SKU dari backend
const fetchSkuItemData = async () => {
    console.log('SelectedConsumedata:', selectedConsume.value.join(','))
  try {
    const response = await axios.get('http://localhost:3000/api/sku_item', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        sku_type_name: selectedSkuTypes.value.join(','),
        unit_name: selectedUnits.value.join(','),
        vendor_name: selectedVendors.value.join(','),
        sku_item_name: filterSkuItemName.value,
        brand: filterBrand.value,
        length: filterLength.value,
        width: filterWidth.value,
        height: filterHeight.value,
        weight: filterWeight.value,
        price: filterPrice.value,
        // consumed: filterConsumed.value,
        consumed: selectedConsume.value.join(','),
        search: globalSearch.value,
        order_by: currentSort.value.column,
        order_direction: currentSort.value.order,
        page: currentPage.value, // Kirim nomor halaman
        pageSize: pageSize.value, // Kirim ukuran data per halaman
        // order_by: 'sku_item_id', // Sorting berdasarkan ID
        // order_direction: 'DESC', // Urutan descending
      },
    })
    skuItemData.value = response.data.rows.map((sku_item) => ({
      ...sku_item,
      sku_type_name: sku_item.skuType?.sku_type_name || 'N/A', // Ambil nama nama atau tampilkan "N/A" jika tidak ada
      unit_name: sku_item.assetUnit?.unit_name || 'N/A', // Ambil nama nama atau tampilkan "N/A" jika tidak ada
      vendor_name: sku_item.vendor?.vendor_name || 'N/A', // Ambil nama nama atau tampilkan "N/A" jika tidak ada
    }))
    totalData.value = response.data.sp.rowCount;
    totalPages.value = Math.ceil(response.data.sp.rowCount / pageSize.value);
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

// Fungsi untuk mengganti halaman
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchSkuItemData(); // Refresh data untuk halaman baru
  }
};


const fetchSkuTypes = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/sku_type', {
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
    skuTypes.value = response.data.rows;
    skuTypeNames.value = response.data.rows.map(item => item.sku_type_name);
  } catch (error) {
    // if (error.response && error.response.status === 401) {
    //   handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    // } 
    // else {
      console.error('Error fetching skuTypes:', error);
    //   handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    // }
  }
};

const fetchUnits = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/asset_unit', {
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
    units.value = response.data.rows;
    unitNames.value = response.data.rows.map(item => item.unit_name);
  } catch (error) {
    // if (error.response && error.response.status === 401) {
    //   handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    // } 
    // else {
      console.error('Error fetching units:', error);
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

const exportSkuItemData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/sku_item/export", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { 
        sku_type_name: selectedSkuTypes.value.join(','),
        unit_name: selectedUnits.value.join(','),
        vendor_name: selectedVendors.value.join(','),
        sku_item_name: filterSkuItemName.value,
        brand: filterBrand.value,
        length: filterLength.value,
        width: filterWidth.value,
        height: filterHeight.value,
        weight: filterWeight.value,
        price: filterPrice.value,
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
    if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    } 
    else {
      console.error("Error exporting data:", error);
      handleErrorMessage(`Gagal Ekspor`,`Gagal mengekspor data. Silakan coba lagi.`,'error');
    }
  }
};

const uploadFileSkuItemData = async () => {
  const fileInput = document.getElementById('upload-file');
  const file = fileInput.files[0];

  if (!file) {
    handleErrorMessage(`Pilih File`,`Silakan pilih file sebelum mengunggah.`,'error');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('http://localhost:3000/api/sku_item/mass-upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    handleErrorMessage(`Berhasil`,`Upload berhasil, ${response.data.successCount} data jenis SKU berhasil terupload`,'error');
    fetchSkuItemData();
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    } 
    else {
      console.error('Gagal mengunggah file:', error);
      handleErrorMessage(`Gagal Upload`,`Gagal mengunggah file. Pastikan format file benar.`,'error');
    }
  }
};

const downloadTemplateSkuItemData = async () => { 
  try {
    const response = await axios.get("http://localhost:3000/api/sku_item/template/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob", // Blob untuk file biner
    });

    // Buat URL dari blob
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Buat link untuk download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "template_data_jenis_sku.xlsx"); // Nama file
    document.body.appendChild(link);
    link.click();

    // Hapus elemen link setelah selesai
    link.parentNode.removeChild(link);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    } 
    else {
      console.error("Error downloading template:", error);
      handleErrorMessage(`Gagal Download`,`Gagal mendownload template. Silakan coba lagi.`,'error');
    }
  }
}

const confirmDelete = async () => {
  try {
    console.log('Id deleted:', selectedSkuItem.value.sku_item_id)
    await axios.delete(`http://localhost:3000/api/sku_item/${selectedSkuItem.value.sku_item_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    handleErrorMessage(`Berhasil Hapus`,`Data Item SKU <strong>${selectedSkuItem.value.sku_item_name}</strong> berhasil dihapus.`,'error');
    fetchSkuItemData()
  } catch (error) {
    if (error.response && error.response.status === 409) {
      handleErrorMessage(`Gagal Menghapus`,`Data Item SKU <strong>${selectedSkuItem.value.sku_item_name}</strong> gagal dihapus. ${error.response.data.message}. Anda harus menghapus terlebih dahulu data yang terkait dengan Data Item SKU <strong>${selectedSkuItem.value.sku_item_name}</strong>.`,'error');
    } 
    else {
      console.error('Failed to delete sku item data:', error) 
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

const validateDecimalInput = async (field) => {
  // Hanya izinkan angka dan koma/desimal
  const value = editForm.value[field];
  // const decimalRegex = /^[0-9]*[.]?[0-9]*$/; // Angka desimal dengan "," atau "."
  const decimalRegex = /^[0-9]*\.?[0-9]*$/; // Angka desimal dengan "."
  
  // Perbaiki input jika tidak valid
  if (!decimalRegex.test(value)) {
    editForm.value[field] = value.slice(0, -1);// Hapus karakter terakhir
  }
};
 

const handleFileUpload = (event) => {
  imagePath.value = event.target.files[0];
  console.log('file image:', imagePath.value)
};

</script>
