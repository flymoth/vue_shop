<!-- FLYMOTH -->
<template>
  <div>
  <nav-header></nav-header>
  <nav-bread>
    <span>订单生成</span>
  </nav-bread>
    <div class="container">
    <div class="page-title-normal">
      <h2 class="page-title-h2"><span>check out</span></h2>
    </div>
    <!-- 进度条 -->
    <div class="check-step">
        <ul>
          <li class="cur"><span>确认</span> 地址</li>
          <li class="cur"><span>确认</span> 订单</li>
          <li class="cur"><span>选择</span> 支付</li>
          <li class="cur"><span>订单</span> 详情</li>
        </ul>
      </div>

    <div class="order-create">
      <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
      <div class="order-create-main">
        <h3>恭喜！ <br>您的订单已生成！</h3>
        <p>
          <span>Order ID：{{orderId}}</span>
          <span>Order total：{{orderTotal | currency('¥')}}</span>
        </p>
        <div class="order-create-btn-wrap">
          <div class="btn-l-wrap">
            <router-link class="btn btn--m" to="/cart">购物车列表</router-link>
          </div>
          <div class="btn-r-wrap">
            <router-link class="btn btn--m" to="/">商品列表</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <nav-footer></nav-footer>
  </div>
</template>

<script>
  import './../assets/css/checkout.css'
  import NavHeader from '@/components/NavHeader'
  import NavFooter from '@/components/NavFooter'
  import NavBread from '@/components/NavBread'
  import axios from 'axios'
export default {
  data () {
    return {
      orderId:'',
      orderTotal:0
    };
  },

  components: {
    NavHeader,
    NavBread,
    NavFooter,
    Modal
  },

  computed: {},

  mounted(){
    let orderId = this.$route.query.orderId;
    if(!orderId){
      return;
    }
    axios.get("/users/orderDetail",{
      params:{
        orderId:orderId
      }
    }).then((response)=>{
      let res = response.data;
      if(res.status === '0'){
        this.orderId = orderId;
        this.orderTotal = res.result.orderTotal
      }
    })
  },

  methods: {}
}

</script>
<style scoped>
</style>
