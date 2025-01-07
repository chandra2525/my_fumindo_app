<template>
  <div>
    <table class="table table-bordered">
      <thead>
        <tr>
          <!-- Kolom Nomor -->
          <th>#</th>
          <!-- Render header kolom berdasarkan props.columns -->
          <th
            v-for="(column, index) in columns"
            :key="index"
            @click="column.sortable ? sort(column.data) : null"
            class="sortable"
            :class="{ active: currentSortColumn === column.data }"
          >
            {{ column.title }}
            <!-- <span v-if="column.sortable">
              <i
                v-if="currentSortColumn === column.data"
                :class="currentSortOrder === 'asc' ? 'bi bi-sort-down' : 'bi bi-sort-up'"
              ></i>
            </span> -->
            <span v-if="column.sortable && currentSortColumn === column.data">
              {{ currentSortOrder === 'asc' ? '▲' : '▼' }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Render data -->
        <tr v-for="(row, index) in paginatedData" :key="row[idrow]">
          <!-- Kolom Nomor -->
          <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
          <!-- Kolom Data -->
          <td v-for="(column, colIndex) in columns" :key="colIndex">
            <template v-if="column.data === 'delete'">
              <button class="btn btn-danger btn-sm delete-btn" @click="$emit('delete', row)" data-bs-toggle="modal" data-bs-target="#delete-confirmation">Hapus</button>
            </template>
            <!-- Harga dihitung otomatis -->
            <!-- <template v-else-if="column.data === 'price'">
              <input
                type="number"
                class="form-control form-control-sm"
                :value="row.price"
                @input="updatePrice($event.target.value, row)"
              />
              <span class="text-muted">
                {{ formatCurrency(row.price) }}
              </span>
            </template> -->
            <template v-else-if="column.data === 'price'">
              <input
                type="text"
                class="form-control form-control-sm"
                :value="formatCurrency(row.price)"
                @input="handlePriceInput($event, row)"
              />
            </template>
            <!-- Total Harga dihitung otomatis -->
            <div v-else-if="column.data === 'total_price'">
              {{ row.total_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) }}
            </div>
            <template v-else-if="column.data === 'expected_quantity'">
              <input
                type="number"
                class="form-control form-control-sm"
                v-model.number="row.expected_quantity"
                required
                min="1"
                @change="$emit('update-expected-quantity', row)"
              />
            </template>
            <template v-else>
              {{ row[column.data] }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="pagination-container">
      <p class="text-muted">
        Showing {{ (currentPage - 1) * pageSize + 1 }} to
        {{ Math.min(currentPage * pageSize, data.length) }} of {{ data.length }} entries
      </p>
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-end">
          <li
            class="page-item"
            :class="{ disabled: currentPage === 1 }"
            @click="changePage(currentPage - 1)"
          >
            <a class="page-link">Previous</a>
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
            @click="changePage(page)"
          >
            <a class="page-link">{{ page }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
            @click="changePage(currentPage + 1)"
          >
            <a class="page-link">Next</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
// import { computed } from "vue";

export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    pageSize: {
      type: Number,
      required: true,
    },
    idrow: {
      type: String,
      required: true,
    },
  },
  emits: ["update-expected-quantity", "delete", "update-price", "sort", "page-change"],
  data() {
    return {
      currentSortColumn: null,
      currentSortOrder: null,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.data.length / this.pageSize);
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.sortedData.slice(start, end);
    },
    sortedData() {
      if (!this.currentSortColumn) {
        return this.data;
      }
      return [...this.data].sort((a, b) => {
        const aValue = a[this.currentSortColumn];
        const bValue = b[this.currentSortColumn];
        if (this.currentSortOrder === "asc") {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });
    },
  },
  methods: {
    sort(column) {
      if (this.currentSortColumn === column) {
        this.currentSortOrder = this.currentSortOrder === "asc" ? "desc" : "asc";
      } else {
        this.currentSortColumn = column;
        this.currentSortOrder = "asc";
      }
      this.$emit("sort", { column, order: this.currentSortOrder });
    },
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.$emit("page-change", page);
      }
    },
    formatCurrency(value) {
      // if (!value) return "-";
      // if (!value) return "";
      if (value === null || value === undefined || value === "") return "";
      return Number(value).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
    },
    // updatePrice(value, row) {
    //   row.price = Number(value);
    //   this.$emit("update-price", row);
    // },
    handlePriceInput(event, row) {
      const rawValue = event.target.value.replace(/[^0-9]/g, ""); // Hanya ambil angka
      // const formattedValue = Number(rawValue).toLocaleString("id-ID", {
      //   style: "currency",
      //   currency: "IDR",
      // });
      const formattedValue = this.formatCurrency(rawValue); 
      event.target.value = formattedValue; // Perbarui tampilan input
      // row.price = Number(rawValue); // Simpan nilai asli ke row
      row.price = rawValue ? parseInt(rawValue) : 0;
      this.$emit("update-price", row); // Emit event ke parent
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
  text-align: left;
  border-collapse: collapse;
}
thead th.sortable {
  cursor: pointer;
}
thead th.active {
  font-weight: bold;
}
.pagination-container {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
.pagination {
  list-style-type: none;
  padding: 0;
  display: flex;
  /* gap: 0.5rem; */
}
.page-item {
  cursor: pointer;
}
.page-item.disabled {
  pointer-events: none;
  opacity: 0.5;
}
/* .page-item.active a {
  font-weight: bold;
  text-decoration: underline;
} */
/* .page-link {
  text-decoration: none;
  color: inherit;
} */
</style>
