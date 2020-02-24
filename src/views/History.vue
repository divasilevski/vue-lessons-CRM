<template>
  <div>
    <div class="page-title">
      <h3>{{ "Menu_History" | localize }}</h3>
    </div>

    <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div>

    <Loader v-if="loading" />
    <p class="center" v-else-if="!records.length">
      {{ "NoRecords" | localize }}
    </p>
    <section v-else>
      <HistoryTable :records="items" />

      <paginate
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="'Назад'"
        :next-text="'Вперед'"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
      >
      </paginate>
    </section>
  </div>
</template>

<script>
import localizeFilter from "../filters/localize.filter";
import paginationMixin from "../mixins/pagination.mixin";
import HistoryTable from "../components/HistoryTable";
import { Pie } from "vue-chartjs";
export default {
  name: "History",
  extends: Pie,
  mixins: [paginationMixin],
  data: () => ({
    records: [],
    loading: true
  }),
  async mounted() {
    this.records = await this.$store.dispatch("fetchRecords");
    const categories = await this.$store.dispatch("fetchCategories");

    this.setup(categories);

    this.loading = false;
  },
  methods: {
    setup(categories) {
      this.setupPagination(
        this.records.map(record => {
          return {
            ...record,
            categoryName: categories.find(c => c.id === record.categoryId)
              .title,
            typeClass: record.type === "income" ? "green" : "red",
            typeText:
              record.type === "income"
                ? localizeFilter("Income")
                : localizeFilter("Outcome")
          };
        })
      );

      this.renderChart({
        labels: categories.map(c => c.title),
        datasets: [
          {
            label: "Расходы по категориям",
            data: categories.map(c => {
              return this.records.reduce((total, r) => {
                if (r.categoryId === c.id && r.type === "outcome") {
                  total += +r.amount;
                }
                return total;
              }, 0);
            }),
            backgroundColor: [
              "rgba(255, 99, 100, 0.2)",
              "rgba(25, 99, 255, 0.2)",
              "rgba(25, 99, 100, 0.2)",
              "rgba(255, 255, 100, 0.2)",
              "rgba(0, 99, 0, 0.2)"
            ]
          }
        ]
      });
    }
  },
  components: {
    HistoryTable
  }
};
</script>
