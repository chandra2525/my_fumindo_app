"use strict";(self["webpackChunkhopeui_vue"]=self["webpackChunkhopeui_vue"]||[]).push([[0],{68904:function(e,a,t){t.d(a,{A:function(){return k}});var s=t(56768),l=t(24232);const n={class:"modal fade",id:"message-alert",tabindex:"-1","aria-labelledby":"deleteConfirmationLabel","aria-hidden":"true"},r={class:"modal-dialog"},o={class:"modal-content"},i={class:"modal-header"},d={class:"modal-title",id:"deleteConfirmationLabel"},c={class:"modal-body"},m=["innerHTML"];function u(e,a,t,u,g,b){return(0,s.uX)(),(0,s.CE)("div",n,[(0,s.Lk)("div",r,[(0,s.Lk)("div",o,[(0,s.Lk)("div",i,[(0,s.Lk)("h5",d,(0,l.v_)(""==t.title?"Alert Dialog":t.title),1),a[0]||(a[0]=(0,s.Lk)("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"},null,-1))]),(0,s.Lk)("div",c,[(0,s.Lk)("p",{innerHTML:t.message},null,8,m)]),a[1]||(a[1]=(0,s.Lk)("div",{class:"modal-footer"},[(0,s.Lk)("button",{type:"button",class:"btn btn-secondary","data-bs-dismiss":"modal"},"Tutup")],-1))])])])}var g={name:"MessageModal",props:{title:{type:String,required:!1},message:{type:String,required:!0}}},b=t(71241);const p=(0,b.A)(g,[["render",u]]);var k=p},86470:function(e,a,t){t.r(a),t.d(a,{default:function(){return w}});t(44114);var s=t(56768),l=t(45130),n=t.p+"img/01.c2945cff.png",r=t(68904),o=t(94373),i=t(90144),d=t(48077);const c={class:"login-content"},m={class:"logo-title ms-3 mb-0","data-setting":"app_name"},u={class:"row"},g={class:"col-lg-12"},b={class:"form-group"},p={class:"col-lg-12"},k={class:"form-group"},f=(0,i.KR)(""),h={data(){return{username:"",password:""}},methods:{async submitLogin(){try{const e=await o.A.post("http://localhost:3000/api/auth/login",{username:this.username,password:this.password}),{access_token:a,user_id:t,username:s,role:l}=e.data;if(localStorage.setItem("access_token",a),localStorage.setItem("user_id",t),localStorage.setItem("username",s),localStorage.setItem("role",l),"Admin"===l)this.$router.push("/listcabang");else if("Manajer Teknis"===l)this.$router.push("/listcabang");else{f.value="Selain Admin dan Manajer Teknis tidak bisa mengakses Web App ini";const e=new d.aF(document.getElementById("message-alert"));e.show(),localStorage.clear()}}catch(e){f.value="Username atau password salah.";const a=new d.aF(document.getElementById("message-alert"));a.show()}}}};var L=Object.assign(h,{__name:"SignIn",setup(e){return(e,a)=>{const t=(0,s.g2)("brand-logo"),o=(0,s.g2)("brand-name"),i=(0,s.g2)("router-link"),d=(0,s.g2)("b-card"),h=(0,s.g2)("b-col"),L=(0,s.g2)("b-row");return(0,s.uX)(),(0,s.CE)("section",c,[(0,s.bF)(L,{class:"m-0 align-items-center bg-white h-100"},{default:(0,s.k6)((()=>[(0,s.bF)(h,{md:"6"},{default:(0,s.k6)((()=>[(0,s.bF)(L,{class:"justify-content-center"},{default:(0,s.k6)((()=>[(0,s.bF)(h,{md:"10"},{default:(0,s.k6)((()=>[(0,s.bF)(d,{class:"card-transparent shadow-none d-flex justify-content-center mb-0 auth-card iq-auth-form"},{default:(0,s.k6)((()=>[(0,s.bF)(i,{to:{name:"default.dashboard"},class:"navbar-brand d-flex align-items-center mb-3 text-primary"},{default:(0,s.k6)((()=>[(0,s.bF)(t),(0,s.Lk)("h4",m,[(0,s.bF)(o)])])),_:1}),a[6]||(a[6]=(0,s.Lk)("h2",{class:"mb-2 text-center"},"Log In",-1)),a[7]||(a[7]=(0,s.Lk)("p",{class:"text-center"},"Login untuk mengelola data.",-1)),(0,s.Lk)("form",{onSubmit:a[2]||(a[2]=(0,l.D$)(((...a)=>e.submitLogin&&e.submitLogin(...a)),["prevent"]))},[(0,s.Lk)("div",u,[(0,s.Lk)("div",g,[(0,s.Lk)("div",b,[a[3]||(a[3]=(0,s.Lk)("label",{for:"username",class:"form-label"},"Username",-1)),(0,s.bo)((0,s.Lk)("input",{type:"text",id:"username","onUpdate:modelValue":a[0]||(a[0]=a=>e.username=a),class:"form-control",required:"","aria-describedby":"email",placeholder:" "},null,512),[[l.Jo,e.username]])])]),(0,s.Lk)("div",p,[(0,s.Lk)("div",k,[a[4]||(a[4]=(0,s.Lk)("label",{for:"password",class:"form-label"},"Password",-1)),(0,s.bo)((0,s.Lk)("input",{type:"password",id:"password","onUpdate:modelValue":a[1]||(a[1]=a=>e.password=a),class:"form-control",required:"","aria-describedby":"password",placeholder:" "},null,512),[[l.Jo,e.password]])])])]),a[5]||(a[5]=(0,s.Lk)("div",{class:"d-flex justify-content-center"},[(0,s.Lk)("button",{type:"submit",class:"btn btn-primary"},"Log In")],-1))],32),(0,s.bF)(r.A,{message:f.value},null,8,["message"])])),_:1})])),_:1})])),_:1}),a[8]||(a[8]=(0,s.Lk)("div",{class:"sign-bg"},[(0,s.Lk)("svg",{width:"280",height:"230",viewBox:"0 0 431 398",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[(0,s.Lk)("g",{opacity:"0.05"},[(0,s.Lk)("rect",{x:"-157.085",y:"193.773",width:"543",height:"77.5714",rx:"38.7857",transform:"rotate(-45 -157.085 193.773)",fill:"#3B8AFF"}),(0,s.Lk)("rect",{x:"7.46875",y:"358.327",width:"543",height:"77.5714",rx:"38.7857",transform:"rotate(-45 7.46875 358.327)",fill:"#3B8AFF"}),(0,s.Lk)("rect",{x:"61.9355",y:"138.545",width:"310.286",height:"77.5714",rx:"38.7857",transform:"rotate(45 61.9355 138.545)",fill:"#3B8AFF"}),(0,s.Lk)("rect",{x:"62.3154",y:"-190.173",width:"543",height:"77.5714",rx:"38.7857",transform:"rotate(45 62.3154 -190.173)",fill:"#3B8AFF"})])])],-1))])),_:1}),a[9]||(a[9]=(0,s.Lk)("div",{class:"col-md-6 d-md-block d-none bg-primary p-0 vh-100 overflow-hidden"},[(0,s.Lk)("img",{src:n,class:"img-fluid gradient-main animated-scaleX",alt:"images",loading:"lazy"})],-1))])),_:1})])}}});const v=L;var w=v}}]);
//# sourceMappingURL=0.ca92f950.js.map