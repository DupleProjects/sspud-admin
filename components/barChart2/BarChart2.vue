<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: {
    chartdata2: {
      type: Object,
      default: null
    },
    options2: {
      type: Object,
      default: null
    }
  },
   mounted () {
    this.renderChart(this.chartdata2, this.options2)
  },
}
</script>