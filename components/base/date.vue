<template>
  <div>{{convertDate(date)}}</div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin";

export default {
  props: {
    date: null,
  },
  mixins: [baseMixin],
  data() {
    return {

    };
  },
  mounted() {},
  methods: {
    convertDate(date) {
      return baseMixin.methods.formatDateTime(date)
    }
  },
};
</script>

