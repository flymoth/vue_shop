<template>
<div>
  <footer class="footer">
    <div class="footer__wrap">
      <div class="footer__secondary">
        <div class="footer__inner">
          <div class="footer__region">
            <span>地区</span>
            <select class="footer__region__select">
              <option value="zh-CN">中国</option>
              <option value="en-US">美国</option>
              <option value="in">印度</option>
            </select>
          </div>
          <div class="footer__secondary__nav">
            <span>Copyright © 2018 FLYMOTH All Rights Reserved.</span>
            <a href="javascript:;" @click="mdShowAbout = true">
              关于我们
            </a>
            <a href="javascript:;" @click="mdShowContact = true">
              联系我们
            </a>
            <a href="javascript:;" @click="mdShowTerms = true">
              条款
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
  <modal :md-show="mdShowAbout" @close="closeAbout">
    <p slot="message">关于我们</p>
    <div slot="btnGroup"><a href="javascript:;" class="btn btn--m" @click="mdShowAbout = false">关闭</a></div>
  </modal>
  <modal :md-show="mdShowContact" @close="closeContact">
    <p slot="message">联系我们</p>
    <div slot="btnGroup"><a href="javascript:;" class="btn btn--m" @click="mdShowContact = false">关闭</a></div>
  </modal>
  <modal :md-show="mdShowTerms" @close="closeTerms">
    <p slot="message">条款</p>
    <div slot="btnGroup"><a href="javascript:;" class="btn btn--m" @click="mdShowTerms = false">关闭</a></div>
  </modal>
</div>
</template>

<script>
  import Modal from '@/components/Modal'
    export default {
      name: "nav-footer",
      components:{
          Modal
      },
      data(){
          return{
            mdShowAbout:false,
            mdShowContact:false,
            mdShowTerms:false
          }
      },
      methods:{
          closeAbout(){
            this.mdShowAbout = false
          },
        closeContact(){
            this.mdShowContact = false
        },
        closeTerms(){
            this.mdShowTerms = false
        }
      }
    }
</script>

<style scoped>

</style>
