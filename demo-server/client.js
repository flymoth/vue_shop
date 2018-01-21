let http = require('http');
http.get('http://www.imooc.com/u/card',(res)=>{
  let data = '';
  res.on("data",(chunk)=>{
    data+=chunk;
  });
  res.on("end",()=>{
    let result = JSON.parse(data);
    console.log("result"+result.msg);
  })
})
