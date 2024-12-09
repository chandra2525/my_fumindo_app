"use strict";(self["webpackChunkhopeui_vue"]=self["webpackChunkhopeui_vue"]||[]).push([[755],{90755:function(t,a,n){n.r(a),n.d(a,{default:function(){return _}});var e=n(56768);const l={class:"card"},i={class:"card-body px-0"},o={class:"table-responsive"},c={id:"user-list-table",class:"table table-striped",role:"grid","data-toggle":"data-table"};function r(t,a,n,r,s,m){const u=(0,e.g2)("table-widget"),d=(0,e.g2)("b-col"),p=(0,e.g2)("b-row");return(0,e.uX)(),(0,e.Wv)(p,null,{default:(0,e.k6)((()=>[(0,e.bF)(d,{sm:"12"},{default:(0,e.k6)((()=>[(0,e.Lk)("div",l,[a[1]||(a[1]=(0,e.Lk)("div",{class:"card-header d-flex justify-content-between"},[(0,e.Lk)("div",{class:"header-title"},[(0,e.Lk)("h4",{class:"card-title"},"User List")])],-1)),(0,e.Lk)("div",i,[(0,e.Lk)("div",o,[(0,e.Lk)("table",c,[a[0]||(a[0]=(0,e.Lk)("thead",null,[(0,e.Lk)("tr",{class:"ligth"},[(0,e.Lk)("th",null,"Profile"),(0,e.Lk)("th",null,"Name"),(0,e.Lk)("th",null,"Contact"),(0,e.Lk)("th",null,"Email"),(0,e.Lk)("th",null,"Country"),(0,e.Lk)("th",null,"Status"),(0,e.Lk)("th",null,"Company"),(0,e.Lk)("th",null,"Join Date"),(0,e.Lk)("th",{style:{"min-width":"100px"}},"Action")])],-1)),(0,e.Lk)("tbody",null,[(0,e.bF)(u,{list:r.tableData},null,8,["list"])])])])])])])),_:1})])),_:1})}var s=n(24232);const m={class:"text-center"},u=["src"],d={class:"flex align-items-center list-user-action"},p={class:"btn btn-sm btn-icon btn-success mx-1","data-bs-toggle":"tooltip","data-bs-placement":"top",title:"Add",href:"#"},g={class:"btn-inner"},b={class:"btn btn-sm btn-icon btn-warning mx-1","data-bs-toggle":"tooltip","data-bs-placement":"top","data-bs-original-title":"Edit",href:"#"},y={class:"btn-inner"},k={class:"btn btn-sm btn-icon btn-danger mx-1","data-bs-toggle":"tooltip","data-bs-placement":"top","data-bs-original-title":"Delete",href:"#"},f={class:"btn-inner"};function L(t,a,n,l,i,o){const c=(0,e.g2)("icon-component");return(0,e.uX)(!0),(0,e.CE)(e.FK,null,(0,e.pI)(n.list,((t,a)=>((0,e.uX)(),(0,e.CE)("tr",{key:a},[(0,e.Lk)("td",m,[(0,e.Lk)("img",{class:"bg-soft-primary rounded img-fluid avatar-40 me-3",src:t.image,alt:"profile",loading:"lazy"},null,8,u)]),(0,e.Lk)("td",null,(0,s.v_)(t.name),1),(0,e.Lk)("td",null,(0,s.v_)(t.contact),1),(0,e.Lk)("td",null,(0,s.v_)(t.email),1),(0,e.Lk)("td",null,(0,s.v_)(t.country),1),(0,e.Lk)("td",null,[(0,e.Lk)("span",{class:(0,s.C4)(["badge",t.color])},(0,s.v_)(t.status),3)]),(0,e.Lk)("td",null,(0,s.v_)(t.company),1),(0,e.Lk)("td",null,(0,s.v_)(t.date),1),(0,e.Lk)("td",null,[(0,e.Lk)("div",d,[(0,e.Lk)("a",p,[(0,e.Lk)("span",g,[(0,e.bF)(c,{type:"outlined","icon-name":"user-add"})])]),(0,e.Lk)("a",b,[(0,e.Lk)("span",y,[(0,e.bF)(c,{type:"outlined","icon-name":"pencil-alt"})])]),(0,e.Lk)("a",k,[(0,e.Lk)("span",f,[(0,e.bF)(c,{type:"outlined","icon-name":"trash"})])])])])])))),128)}var h={props:{list:{type:Array,default:()=>[]},name:{type:String,default:""},image:{type:String,default:""},contact:{type:String,default:""},email:{type:String,default:""},country:{type:String,default:""},status:{type:String,default:""},company:{type:String,default:""},date:{type:String,default:""},color:{type:String,default:""}}},v=n(71241);const A=(0,v.A)(h,[["render",L]]);var C=A,x={components:{TableWidget:C},setup(){const t=[{image:n(41568),name:"Anna Sthesia",contact:"(760) 756 7568",email:"annasthesia@gmail.com",country:"USA",status:"Active",company:"Acme Corporation",date:"2019/12/01",color:"bg-primary"},{image:n(21892),name:"Brock Lee",contact:"+62 5689 458 658",email:"brocklee@gmail.com",country:"Indonesia",status:"Active",company:"Soylent Corp",date:"2019/12/01",color:"bg-primary"},{image:n(78189),name:"Dan Druff",contact:"+55 6523 456 856",email:"dandruff@gmail.com",country:"Brazil",status:"Pending",company:"Umbrella Corporation",date:"2019/12/01",color:"bg-warning"},{image:n(5682),name:"Hans Olo",contact:"+91 2586 253 125",email:"hansolo@gmail.com",country:"India",status:"Inactive",company:"Vehement Capital",date:"2019/12/01",color:"bg-danger"},{image:n(3547),name:"Lynn Guini",contact:"+27 2563 456 589",email:"lynnguini@gmail.com",country:"Africa",status:"Active",company:"Massive Dynamic",date:"2019/12/01",color:"bg-primary"},{image:n(41568),name:"Eric Shun",contact:"+55 25685 256 589",email:"ericshun@gmail.com",country:"Brazil",status:"Pending",company:"Globex Corporation",date:"2019/12/01",color:"bg-warning"},{image:n(78189),name:"aaronottix",contact:"(760) 756 7568",email:"budwiser@ymail.com",country:"USA",status:"Hold",company:"Acme Corporation",date:"2019/12/01",color:"bg-info"},{image:n(3547),name:"Marge Arita",contact:"+27 5625 456 589",email:"margearita@gmail.com",country:"Africa",status:"Complite",company:"Vehement Capital",date:"2019/12/01",color:"bg-success"},{image:n(21892),name:"Bill Dabear",contact:"+55 2563 456 589",email:"billdabear@gmail.com",country:"Brazil",status:"Active",company:"Massive Dynamic",date:"2019/12/01",color:"bg-primary"}];return{tableData:t}}};const S=(0,v.A)(x,[["render",r]]);var _=S},21892:function(t,a,n){t.exports=n.p+"img/02.c798a516.png"},78189:function(t,a,n){t.exports=n.p+"img/03.141dfbcd.png"},5682:function(t,a,n){t.exports=n.p+"img/04.772d4702.png"},3547:function(t,a,n){t.exports=n.p+"img/05.3a142b57.png"},41568:function(t,a,n){t.exports=n.p+"img/06.3f613bf7.png"}}]);