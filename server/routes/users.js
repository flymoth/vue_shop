let express = require('express');
let router = express.Router();
let User = require('./../models/user');
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
})
module.exports = router;
