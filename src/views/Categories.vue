<template>
  <div>
    <div class="page-title">
      <h3>{{"Menu_Categories" | localize}}</h3>
    </div>
    <section>
      <Loader v-if="loading" />
      <div v-else class="row">
        <CategoryCreate @created="addNewCategory" />

        <CategoryEdit
          v-if="categories.length"
          :categories="categories"
          @updated="updateCategories"
          :key="categories.length + updateCount"
        />

        <p v-else class="center">{{"NoCategories" | localize}}</p>
      </div>
    </section>
  </div>
</template>

<script>
import CategoryCreate from "../components/CategoryCreate";
import CategoryEdit from "../components/CategoryEdit";
export default {
    metaInfo() {
    return {
      title: this.$title("Menu_Categories")
    };
  },
  name: "categories",
  data: () => ({
    categories: [],
    loading: true,
    updateCount: 0
  }),
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories");
    this.loading = false;
  },
  methods: {
    addNewCategory(category) {
      this.categories.push(category);
    },
    updateCategories(category) {
      const idx = this.categories.findIndex(cat => cat.id === category.id);
      this.categories[idx].title = category.title;
      this.categories[idx].limit = category.limit;
      this.updateCount++;
    }
  },
  components: {
    CategoryCreate,
    CategoryEdit
  }
};
</script>
