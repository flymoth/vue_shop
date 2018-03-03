
let express = require('express');
let router = express.Router();
let User = require('./../models/user');
require('./../util/util');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//登录
router.post("/login",(req,res,next)=>{
  let param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  };
  User.findOne(param,(err,doc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message
      });
    }else {
      if(doc){
        res.cookie("userId",doc.userId,{
          path:'/',
          maxAge:1000*60*60
        });
        res.cookie("userName",doc.userName,{

        });
        res.json({
          status:'0',
          msg:'',
          result:{
            userName:doc.userName
          }
        })
      }
    }
  })
});
//登出
router.post("/logout",(req,res,next)=>{
  res.cookie("userId","",{
    path:'/',
    maxAge:-1
  });
  res.json({
    status:'0',
    msg:'',
    result:''
  })
});
//登录拦截
router.get("/checkLogin",(req,res,next)=>{
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName || ''
    });
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    });
  }
});
//获取购物车数据
router.get("/cartList",(req,res,next)=>{
  let userId = req.cookies.userId;
  User.findOne({userId:userId},function (err,doc) {
    if (err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else {
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        });
      }
    }
  })
});
//删除购物车商品
router.post("/cartDel",function (req,res,next) {
  let userId = req.cookies.userId,productId = req.body.productId;
  User.update(
    {
      userId:userId
    },
    {
      $pull:{
      'cartList':{
        'productId':productId
      }
    }
    },function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        res.json({
          status:'0',
          msg:'',
          result:'success'
        })
      }
    }
  )
});
//编辑购物车商品数量
router.post("/cartEdit",function (req,res,next) {
  let userId = req.cookies.userId,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked;
  User.update({"userId":userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked
  },function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'success'
      })
    }
  })
});
//购物车全选
router.post("/editCheckAll",function (req,res,next) {
  let userId = req.cookies.userId,
    checkAll = req.body.checkAll;
  User.findOne({userId:userId},function (err,user) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(user){
        user.cartList.forEach((item)=>{
          item.checked = checkAll;
        })
        user.save(function (err1,doc) {
          if(err1){
            res.json({
              status:'1',
              msg:err1.message,
              result:''
            })
          }else{
            res.json({
              status:'0',
              msg:'',
              result:'success'
            })
          }
        })
      }
    }
  })
});
//获取地址列表
router.get("/addressList",function (req,res,next) {
  let userId = req.cookies.userId;
  User.findOne({userId:userId},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:doc.addressList
      })
    }
  })
})
//设置默认地址
router.post("/setDefault",function(req,res,next){
  let userId = req.cookies.userId,
  addressId = req.body.addressId;
  if(!addressId){
    res.json({
      status:'1003',
      msg:'addressId is null',
      result:''
    })
  }
  User.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:message,
        result:''
      })
    }else{
      let addressList = doc.addressList;
      addressList.forEach((item)=>{
        if(item.addressId === addressId){
          item.isDefault = true;
        } else{
          item.isDefault = false;
        }
      });
      doc.save(function(err,doc1){
        if(err){
          res.json({
            status:'1',
            msg:err1.message,
            result:''
          })
        }else{
          res.json({
            status:'0',
            msg:'',
            result:''
          })
        }
      })
    }
  })
})
//删除地址
router.post("/delAddress",function(req,res,next){
  let userId = req.cookies.userId,
  addressId = req.body.addressId;
  User.update(
    {
      userId:userId
    },
    {
      $pull:{
      'addressList':{
        'addressId':addressId
      }
    }
    },function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        res.json({
          status:'0',
          msg:'',
          result:'success'
        })
      }
    }
  )
})
//生成订单
router.post("/payment",function(req,res,next){
  let userId = req.cookies.userId,
  addressId = req.body.addressId,
  orderTotal = req.body.orderTotal;
  User.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      let address = '',goodsList=[];
      doc.addressList.forEach((item)=>{
        if(addressId === item.addressId){
          address = item;
        }
      });
      //获取用户购物车商品信息
      doc.cartList.filter((item)=>{
        if(item.checked === 1){
          goodsList.push(item)
        }
      });

      let platform = '622'
      let r1 = Math.floor(Math.random()*10);
      let r2 = Math.floor(Math.random()*10);
      let sysDate = new Date().Format('yyyyMMddhhmmss');
      let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      let orderId =platform+r1+sysDate+r2;
      let order = {
        orderId:orderId,
        orderTotal:orderTotal,
        addressInfo:address,
        goodsList:goodsList,
        orderStatus:'1',
        createDate:createDate
      };
      doc.orderList.push(order);
      doc.save(function(err1,doc1){
        if(err1){
          res.json({
            status:'1',
            msg:err.message,
            result:''
          })
        }else{
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:order.orderId,
              orderTotal:order.orderTotal
            }
          })
        }
      })
    }
  })
})
//根据订单ID查询订单信息
router.get("/orderDetail",function(req,res,next){
  let userId = req.cookies.userId,orderId = req.param("orderId");
  User.findOne({userId:userId},function(err,userInfo){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      let orderList = userInfo.orderList;
      if(orderList.length>0){
        let orderTotal = 0;
        orderList.forEach((item)=>{
          if(item.orderId === orderId){
            orderTotal = item.orderTotal
          }
        });
        if(orderTotal>0){
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:orderId,
              orderTotal:orderTotal
            }
          })
        }else{
          res.json({
            status:'120002',
            msg:'无此订单！',
            result:''
          })
        }
      }else{
        res.json({
          status:'120001',
          msg:'当前无订单！',
          result:''
        })
      }
    }
  })
})
module.exports = router;
