<script>
import { Bar } from 'vue-chartjs'

export default {
  name:"",
  extends: Bar,
  props: {
    chartdata: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
  },
   mounted () {
    this.renderChart(this.chartdata, this.options)
  },
}
</script>