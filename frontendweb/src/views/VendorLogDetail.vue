<!-- <template>
  <div>
    <h1>Vendor Log Detail</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>Vendor Log ID</th>
            <th>Vendor ID</th>
            <th>User ID</th>
            <th>Column Name</th>
            <th>Value Before</th>
            <th>Value After</th>
            <th>Operation</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in vendorLogs" :key="log.vendor_log_id">
            <td>{{ log.vendor_log_id }}</td>
            <td>{{ log.vendor_id }}</td>
            <td>{{ log.user_id }}</td>
            <td>{{ log.column_name }}</td>
            <td>{{ log.value_before }}</td>
            <td>{{ log.value_after }}</td>
            <td>{{ log.operation }}</td>
            <td>{{ log.created_at }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template> -->

<template>
  <b-row>
    <b-col lg="12">
      <b-card body-class="rounded">
        <b-row>
          <b-col sm="12">
            <h4 class="mb-2 border-bottom pb-2">Detail Perubahan Vendor</h4>
            <h5 class="mb-3">Operasi {{ operation }}</h5>
            <p>Nama Vendor : {{ vendor_name }}</p>
            <p>Username : {{ username }}</p>
            <p>Tanggal : {{ formatTanggal(created_at) }}</p>
          </b-col>
        </b-row>
      </b-card>
    </b-col>

    <b-col lg="6">
      <b-card no-body>
        <b-card-header header-class="d-flex justify-content-between">
          <div class="header-title">
            <h5 class="card-title">Versi Lama</h5>
          </div>
        </b-card-header>
        <b-card-body>
          <div class="iq-timeline0 m-0 d-flex align-items-center justify-content-between position-relative">
            <ul class="list-inline p-0 m-0">
              <li v-for="log in filteredVendorLogs" :key="log.vendor_log_id">
                <!-- <div class="timeline-dots1 border-primary text-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 3C7.03 3 3 7.03 3 12S7.03 21 12 21C14 21 15.92 20.34 17.5 19.14L16.06 17.7C14.87 18.54 13.45 19 12 19C8.13 19 5 15.87 5 12S8.13 5 12 5 19 8.13 19 12H16L20 16L24 12H21C21 7.03 16.97 3 12 3M7.71 13.16C7.62 13.23 7.59 13.35 7.64 13.45L8.54 15C8.6 15.12 8.72 15.12 8.82 15.12L9.95 14.67C10.19 14.83 10.44 14.97 10.7 15.09L10.88 16.28C10.9 16.39 11 16.47 11.1 16.47H12.9C13 16.5 13.11 16.41 13.13 16.3L13.31 15.12C13.58 15 13.84 14.85 14.07 14.67L15.19 15.12C15.3 15.16 15.42 15.11 15.47 15L16.37 13.5C16.42 13.38 16.39 13.26 16.31 13.19L15.31 12.45C15.34 12.15 15.34 11.85 15.31 11.55L16.31 10.79C16.4 10.72 16.42 10.61 16.37 10.5L15.47 8.95C15.41 8.85 15.3 8.81 15.19 8.85L14.07 9.3C13.83 9.13 13.57 9 13.3 8.88L13.13 7.69C13.11 7.58 13 7.5 12.9 7.5H11.14C11.04 7.5 10.95 7.57 10.93 7.67L10.76 8.85C10.5 8.97 10.23 9.12 10 9.3L8.85 8.88C8.74 8.84 8.61 8.89 8.56 9L7.65 10.5C7.6 10.62 7.63 10.74 7.71 10.81L8.71 11.55C8.69 11.7 8.69 11.85 8.71 12C8.7 12.15 8.7 12.3 8.71 12.45L7.71 13.19M12 13.5H12C11.16 13.5 10.5 12.82 10.5 12C10.5 11.17 11.17 10.5 12 10.5S13.5 11.17 13.5 12 12.83 13.5 12 13.5" />
                  </svg>
                </div> -->
                <div class="timeline-dots timeline-dot1 border-warning text-warning"></div>
                <h6 class="float-left mb-1">
                  {{ 
                    log.column_name=='vendor_id'?'ID Vendor':
                    log.column_name=='vendor_name'?'Nama Vendor':
                    log.column_name=='phone_number'?'No Telpon':
                    log.column_name=='email'?'E-mail':
                    log.column_name=='address'?'Alamat':
                    log.column_name=='upcoming_review_date'?'Tanggal Peninjauan Mendatang':
                    log.column_name=='vendor_remark'?'Komentar Vendor':
                    log.column_name=='vendor_status'?'Status Vendor':'' 
                  }}
                </h6>
                <!-- <small class="float-right mt-1">24 November 2019</small> -->
                <div class="d-inline-block w-100">
                  <p>{{ log.value_before==''?'-':log.value_before==null?'-':log.value_before }}</p>
                </div>
              </li>
            </ul>
          </div>
        </b-card-body>
      </b-card>
    </b-col>

    <b-col lg="6">
      <b-card no-body>
        <b-card-header header-class="d-flex justify-content-between">
          <div class="header-title">
            <h5 class="card-title">Versi Baru</h5>
          </div>
        </b-card-header>
        <b-card-body>
          <div class="iq-timeline0 m-0 d-flex align-items-center justify-content-between position-relative">
            <ul class="list-inline p-0 m-0">
              <li v-for="log in filteredVendorLogs" :key="log.vendor_log_id">
                <!-- <div class="timeline-dots1 border-primary text-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 3C7.03 3 3 7.03 3 12S7.03 21 12 21C14 21 15.92 20.34 17.5 19.14L16.06 17.7C14.87 18.54 13.45 19 12 19C8.13 19 5 15.87 5 12S8.13 5 12 5 19 8.13 19 12H16L20 16L24 12H21C21 7.03 16.97 3 12 3M7.71 13.16C7.62 13.23 7.59 13.35 7.64 13.45L8.54 15C8.6 15.12 8.72 15.12 8.82 15.12L9.95 14.67C10.19 14.83 10.44 14.97 10.7 15.09L10.88 16.28C10.9 16.39 11 16.47 11.1 16.47H12.9C13 16.5 13.11 16.41 13.13 16.3L13.31 15.12C13.58 15 13.84 14.85 14.07 14.67L15.19 15.12C15.3 15.16 15.42 15.11 15.47 15L16.37 13.5C16.42 13.38 16.39 13.26 16.31 13.19L15.31 12.45C15.34 12.15 15.34 11.85 15.31 11.55L16.31 10.79C16.4 10.72 16.42 10.61 16.37 10.5L15.47 8.95C15.41 8.85 15.3 8.81 15.19 8.85L14.07 9.3C13.83 9.13 13.57 9 13.3 8.88L13.13 7.69C13.11 7.58 13 7.5 12.9 7.5H11.14C11.04 7.5 10.95 7.57 10.93 7.67L10.76 8.85C10.5 8.97 10.23 9.12 10 9.3L8.85 8.88C8.74 8.84 8.61 8.89 8.56 9L7.65 10.5C7.6 10.62 7.63 10.74 7.71 10.81L8.71 11.55C8.69 11.7 8.69 11.85 8.71 12C8.7 12.15 8.7 12.3 8.71 12.45L7.71 13.19M12 13.5H12C11.16 13.5 10.5 12.82 10.5 12C10.5 11.17 11.17 10.5 12 10.5S13.5 11.17 13.5 12 12.83 13.5 12 13.5" />
                  </svg>
                </div> -->
                <div class="timeline-dots timeline-dot1 border-success text-success"></div>
                <h6 class="float-left mb-1">
                  {{ 
                    log.column_name=='vendor_id'?'ID Vendor':
                    log.column_name=='vendor_name'?'Nama Vendor':
                    log.column_name=='phone_number'?'No Telpon':
                    log.column_name=='email'?'E-mail':
                    log.column_name=='address'?'Alamat':
                    log.column_name=='upcoming_review_date'?'Tanggal Peninjauan Mendatang':
                    log.column_name=='vendor_remark'?'Komentar Vendor':
                    log.column_name=='vendor_status'?'Status Vendor':'' 
                  }}
                </h6>
                <!-- <small class="float-right mt-1">24 November 2019</small> -->
                <div class="d-inline-block w-100">
                  <p>{{ log.value_after==''?'-':log.value_after==null?log.value_before:log.value_after }}</p>
                </div>
              </li>
            </ul>
          </div>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>


<script>
import axios from 'axios';

export default {
  props: ['created_at','operation','vendor_name','username'],
  computed: {
    filteredVendorLogs() {
      return this.vendorLogs.filter(log => log.column_name !== 'vendor_id');
    }
  },
  methods: {
    formatTanggal(tanggalString) {
      const hari = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"
      ];
      const bulan = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
      ];

      const date = new Date(tanggalString);
      const namaHari = hari[date.getDay()];
      const tanggal = date.getDate();
      const namaBulan = bulan[date.getMonth()];
      const tahun = date.getFullYear();
      const jam = date.getHours().toString().padStart(2, "0");
      const menit = date.getMinutes().toString().padStart(2, "0");
      const detik = date.getSeconds().toString().padStart(2, "0");

      return `${namaHari}, ${tanggal} ${namaBulan} ${tahun}, Jam ${jam}:${menit}:${detik} WIB`;
    }
  },
  data() {
    return {
      vendorLogs: [],
      loading: false,
    };
  },
  async created() {
    this.loading = true;
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(
        `http://localhost:3000/api/vendor_change_log/details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            created_at: this.created_at,
          },
        }
      );
      this.vendorLogs = response.data;
    } catch (error) {
      console.error('Failed to fetch vendor logs:', error);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>
