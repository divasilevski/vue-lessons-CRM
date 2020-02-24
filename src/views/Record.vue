<template>
  <div>
    <div class="page-title">
      <h3>{{ "Menu_NewRecord" | localize }}</h3>
    </div>

    <Loader v-if="loading" />

    <p v-else-if="!categories.length" class="center">
      {{ "NoCategories" | localize }}
      <router-link to="/categories">{{
        "AddNewCategory" | localize
      }}</router-link>
    </p>

    <form v-else class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <select ref="select" v-model="category">
          <option v-for="cat of categories" :key="cat.id" :value="cat.id">{{
            cat.title
          }}</option>
        </select>
        <label>{{ "SelectCategory" | localize }}</label>
      </div>

      <p>
        <label>
          <input
            v-model="type"
            class="with-gap"
            name="type"
            type="radio"
            value="income"
          />
          <span>{{ "Income" | localize }}</span>
        </label>
      </p>

      <p>
        <label>
          <input
            v-model="type"
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
          />
          <span>{{ "Outcome" | localize }}</span>
        </label>
      </p>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{ invalid: $v.amount.$dirty && !$v.amount.minValue }"
        />
        <label for="amount">{{ "Sum" | localize }}</label>
        <span
          v-if="$v.amount.$dirty && !$v.amount.minValue"
          class="helper-text invalid"
          >{{ "MinValue" | localize }}
          {{ $v.amount.$params.minValue.min }}</span
        >
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="description"
          :class="{
            invalid: $v.description.$dirty && !$v.description.required
          }"
        />
        <label for="description">{{ "Description" | localize }}</label>
        <span
          v-if="$v.description.$dirty && !$v.description.required"
          class="helper-text invalid"
          >{{ "InputDescription" | localize }}</span
        >
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ "Create" | localize }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { required, minValue } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
export default {
  metaInfo() {
    return {
      title: this.$title("Menu_NewRecord")
    };
  },
  name: "record",
  data: () => ({
    select: null,
    loading: true,
    categories: [],
    category: null,
    type: "income",
    amount: 1,
    description: ""
  }),
  validations: {
    amount: { minValue: minValue(1) },
    description: { required }
  },
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories");
    this.loading = false;

    if (this.categories.length) {
      this.category = this.categories[0].id;
    }

    setTimeout(() => {
      M.updateTextFields(),
        (this.select = M.FormSelect.init(this.$refs.select));
    }, 0);
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  },
  computed: {
    ...mapGetters(["info"]),
    canCreateRecord() {
      if (this.type === "income") {
        return true;
      }
      return this.info.bill >= this.amount;
    }
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      if (this.canCreateRecord) {
        try {
          await this.$store.dispatch("createRecord", {
            categoryId: this.category,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON()
          });
          const bill =
            this.type === "income"
              ? this.info.bill + this.amount
              : this.info.bill - this.amount;

          await this.$store.dispatch("updateInfo", { bill });
          this.$message("Запись успешно создана");
          this.$v.$reset();
          this.amount = 1;
          this.description = "";
        } catch (error) {}
      } else {
        this.$message(`Недостаточно средств (${this.amount - this.info.bill})`);
      }
    }
  }
};
</script>
