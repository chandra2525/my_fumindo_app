"use strict";(self["webpackChunkhopeui_vue"]=self["webpackChunkhopeui_vue"]||[]).push([[7734],{97734:function(a,e,l){l.r(e),l.d(e,{default:function(){return da}});l(17642),l(58004),l(33853),l(45876),l(32475),l(15024),l(31698),l(81454),l(14603),l(47566),l(98721);var s=l(56768),t=l(45130),o=l(90144),n=l(24232),r=l(94373),i=l(30967),d=l(68904),u=l(48077),c=l(50961);const m={class:"row"},p={class:"col-sm-12"},v={class:"card"},b={class:"card-body"},k={class:"row mb-2"},h={class:"col-sm-6"},L={class:"input-group has-validation"},g={class:"col-sm-6"},y={class:"input-group has-validation"},f={class:"row mb-3"},w={class:"col-sm-6"},_={class:"col-sm-6"},C={class:"search-container"},U={class:"input-group has-validation"},x={class:"row mb-2"},A={class:"col-sm-6 pagination-show-entries"},E={class:"table-responsive border-bottom"},R={class:"pagination-container"},K={class:"text-muted"},B={"aria-label":"Page navigation example"},F={class:"pagination justify-content-end"},D=["onClick"],S={class:"modal-dialog"},I={class:"modal-content"},P={class:"modal-header"},$={class:"modal-title",id:"staticBackdropPermissionLabel"},V={class:"modal-body"},G={class:"mb-3"},z=["value"],j={class:"mb-3"},T={class:"mb-3"},W=["required"],M={class:"mb-3"},N=["data-bs-dismiss"],q={class:"modal fade",id:"delete-confirmation",tabindex:"-1","aria-labelledby":"deleteConfirmationLabel","aria-hidden":"true"},J={class:"modal-dialog"},X={class:"modal-content"},H={class:"modal-body"},O={class:"modal fade",id:"delete-confirmation",tabindex:"-1","aria-labelledby":"deleteConfirmationLabel","aria-hidden":"true"},Q={class:"modal-dialog"},Y={class:"modal-content"},Z={class:"modal-body"},aa={class:"modal fade",id:"mass-upload-modal",tabindex:"-1","aria-labelledby":"massUploadModalLabel","aria-hidden":"true"},ea={class:"modal-dialog"},la={class:"modal-content"},sa={class:"modal-body"},ta={class:"mb-3"},oa={type:"file",id:"upload-file",ref:"fileInput",accept:".xlsx, .csv",required:"",class:"form-control"};var na={__name:"ListUser",setup(a){const e=(0,o.KR)(""),l=(0,o.KR)(""),na=(0,o.KR)(""),ra=(0,o.KR)(""),ia=(0,o.KR)(""),da=(0,o.KR)(1),ua=(0,o.KR)(0),ca=(0,o.KR)(10),ma=(0,o.KR)(0),pa=localStorage.getItem("access_token"),va=[{title:"ID",data:"user_id",sortable:!0},{title:"Dari Nama",data:"fullname",sortable:!0},{title:"Username",data:"username",sortable:!0},{title:"Role",data:"role",sortable:!0},{title:"Aksi",data:"actions",sortable:!1}],ba=(0,o.KR)([]),ka=(0,o.KR)([]),ha=(0,o.KR)([]),La=(0,o.KR)(!1),ga=(0,o.KR)({user_id:null,employee_id:"",username:"",password:"",role:""}),ya=()=>{ga.value={user_id:null,employee_id:"",username:"",password:"",role:""}},fa=(0,o.KR)(null),wa=a=>{fa.value=a},_a=a=>{fa.value=a,ga.value={...a},ga.value.password="",La.value=!0},Ca=()=>{ya(),La.value=!1},Ua=async()=>{""==ga.value.employee_id?ga.value={user_id:ga.value.user_id,username:ga.value.username,password:ga.value.password,role:ga.value.role}:ga.value={user_id:ga.value.user_id,employee_id:ga.value.employee_id,username:ga.value.username,password:ga.value.password,role:ga.value.role},console.log("Edit data submitted:",ga.value);try{if(La.value){const a=await r.A.put(`http://localhost:3000/api/user/${ga.value.user_id}`,ga.value,{headers:{Authorization:`Bearer ${pa}`}});console.log("Data berhasil diupdate:",a.data),Ka()}else{const a=await r.A.post("http://localhost:3000/api/user",ga.value,{headers:{Authorization:`Bearer ${pa}`}});console.log("Data berhasil ditambahkan:",a.data),Ka()}}catch(a){console.error("Gagal mengupdate data:",a),Va()}};(0,s.sV)((async()=>{await Da(),await Ra(),await Ka()}));const xa=(0,o.KR)({column:"user_id",order:"DESC"}),Aa=({column:a,order:e})=>{xa.value={column:a,order:e},Ka()},Ea=(0,o.KR)([]),Ra=async()=>{try{const a=await r.A.get("http://localhost:3000/api/employee",{headers:{Authorization:`Bearer ${pa}`}});Ea.value=a.data.rows}catch(a){console.error("Error fetching employees:",a),Va()}},Ka=async()=>{try{const a=await r.A.get("http://localhost:3000/api/user",{headers:{Authorization:`Bearer ${pa}`},params:{fullname:na.value,username:ra.value,role:ha.value.join(","),search:ia.value,order_by:xa.value.column,order_direction:xa.value.order,page:da.value,pageSize:ca.value}});ba.value=a.data.rows.map((a=>({...a,fullname:a.employee?.fullname||"N/A"}))),ma.value=a.data.sp.rowCount,ua.value=Math.ceil(a.data.sp.rowCount/ca.value)}catch(a){console.error("Error fetching user data:",a),Va()}},Ba=a=>{a>=1&&a<=ua.value&&(da.value=a,Ka())},Fa=a=>{a.value=a},Da=async()=>{try{const a=await r.A.get("http://localhost:3000/api/user/getUsersRole",{headers:{Authorization:`Bearer ${pa}`}});ka.value=[...new Set(a.data)]}catch(a){console.error("Error fetching role:",a),Va()}},Sa=async()=>{try{const a=await r.A.get("http://localhost:3000/api/user/export",{headers:{Authorization:`Bearer ${pa}`},params:{fullname:na.value,username:ra.value,role:ha.value.join(","),search:ia.value,order_by:xa.value.column,order_direction:xa.value.order},responseType:"blob"}),e=window.URL.createObjectURL(new Blob([a.data])),l=document.createElement("a");l.href=e,l.setAttribute("download","data_user.xlsx"),document.body.appendChild(l),l.click(),l.parentNode.removeChild(l)}catch(a){console.error("Error exporting data:",a),e.value="Gagal Ekspor",l.value="Gagal mengekspor data. Silakan coba lagi.";const s=new u.aF(document.getElementById("message-alert"));s.show()}},Ia=async()=>{const a=document.getElementById("upload-file"),s=a.files[0];if(!s){e.value="Pilih File",l.value="Silakan pilih file sebelum mengunggah.";const a=new u.aF(document.getElementById("message-alert"));return void a.show()}const t=new FormData;t.append("file",s);try{const a=await r.A.post("http://localhost:3000/api/user/mass-upload",t,{headers:{Authorization:`Bearer ${pa}`,"Content-Type":"multipart/form-data"}});e.value="Berhasil",l.value=`Upload berhasil, ${a.data.successCount} data user berhasil terupload`;const s=new u.aF(document.getElementById("message-alert"));s.show(),Ka()}catch(o){console.error("Gagal mengunggah file:",o),e.value="Gagal Upload",l.value="Gagal mengunggah file. Pastikan format file benar.";const a=new u.aF(document.getElementById("message-alert"));a.show()}},Pa=async()=>{try{const a=await r.A.get("http://localhost:3000/api/user/template/",{headers:{Authorization:`Bearer ${pa}`},responseType:"blob"}),e=window.URL.createObjectURL(new Blob([a.data])),l=document.createElement("a");l.href=e,l.setAttribute("download","template_data_user.xlsx"),document.body.appendChild(l),l.click(),l.parentNode.removeChild(l)}catch(a){console.error("Error downloading template:",a),e.value="Gagal Download",l.value="Gagal mendownload template. Silakan coba lagi.";const s=new u.aF(document.getElementById("message-alert"));s.show()}},$a=async()=>{try{console.log("Id deleted:",fa.value.user_id),await r.A.delete(`http://localhost:3000/api/user/${fa.value.user_id}`,{headers:{Authorization:`Bearer ${pa}`}}),e.value="Berhasil Hapus",l.value=`Data User <strong>${fa.value.username}</strong> berhasil dihapus.`;const a=new u.aF(document.getElementById("message-alert"));a.show(),Ka()}catch(a){console.error("Failed to delete user data:",a),Va()}},Va=()=>{e.value="Koneksi Gagal",l.value="Cek koneksi internet Anda.";const a=new u.aF(document.getElementById("message-alert"));a.show()},Ga=[{value:null,text:"Silahkan pilih role karyawan"},{value:"Admin",text:"Admin"},{value:"Manajer Teknis",text:"Manajer Teknis"},{value:"Petugas Lapangan",text:"Petugas Lapangan"}];return(a,e)=>{const r=(0,s.g2)("b-form-select");return(0,s.uX)(),(0,s.CE)("div",m,[(0,s.Lk)("div",p,[(0,s.Lk)("div",v,[(0,s.Lk)("div",{class:"card-header d-flex justify-content-between"},[e[12]||(e[12]=(0,s.Lk)("div",{class:"header-title"},[(0,s.Lk)("h4",{class:"card-title"},"List User")],-1)),(0,s.Lk)("div",null,[(0,s.Lk)("button",{class:"btn btn-success",style:{"margin-right":"10px"},onClick:Ca,"data-bs-toggle":"modal","data-bs-target":"#form-confirmation"}," Tambah User "),(0,s.Lk)("button",{class:"btn btn-outline-success",style:{"margin-right":"10px"},onClick:Sa}," Ekspor Data "),e[11]||(e[11]=(0,s.Lk)("button",{class:"btn btn-info",style:{"margin-right":"10px"},"data-bs-toggle":"modal","data-bs-target":"#mass-upload-modal"}," Mass Upload ",-1)),(0,s.Lk)("button",{class:"btn btn-outline-info",onClick:Pa}," Download Template ")])]),(0,s.Lk)("div",b,[(0,s.Lk)("div",k,[(0,s.Lk)("div",h,[e[13]||(e[13]=(0,s.Lk)("label",{for:"validationCustomUsername01",class:"form-label"},"Filter nama karyawan",-1)),(0,s.Lk)("div",L,[(0,s.bo)((0,s.Lk)("input",{type:"text","onUpdate:modelValue":e[0]||(e[0]=a=>na.value=a),class:"form-control",style:{height:"35px"},id:"validationCustomUsername01","aria-describedby":"inputGroupPrepend"},null,512),[[t.Jo,na.value]])])]),(0,s.Lk)("div",g,[e[14]||(e[14]=(0,s.Lk)("label",{for:"validationCustomUsername01",class:"form-label"},"Filter username",-1)),(0,s.Lk)("div",y,[(0,s.bo)((0,s.Lk)("input",{type:"text","onUpdate:modelValue":e[1]||(e[1]=a=>ra.value=a),class:"form-control",style:{height:"35px"},id:"validationCustomUsername01","aria-describedby":"inputGroupPrepend"},null,512),[[t.Jo,ra.value]])])])]),(0,s.Lk)("div",f,[(0,s.Lk)("div",w,[e[15]||(e[15]=(0,s.Lk)("label",{for:"filter",class:"form-label"},"Filter role",-1)),(0,s.bF)((0,o.R1)(c.A),{options:ka.value,modelValue:ha.value,"onUpdate:modelValue":[e[2]||(e[2]=a=>ha.value=a),Fa],multiple:"",class:"filter-style"},null,8,["options","modelValue"])]),(0,s.Lk)("div",_,[(0,s.Lk)("div",C,[e[16]||(e[16]=(0,s.Lk)("label",{for:"global-search",class:"form-label"},"Pencarian",-1)),(0,s.Lk)("div",U,[(0,s.bo)((0,s.Lk)("input",{type:"text",id:"global-search","onUpdate:modelValue":e[3]||(e[3]=a=>ia.value=a),class:"form-control filter-style"},null,512),[[t.Jo,ia.value]])])])])]),(0,s.Lk)("div",{class:"row mb-4"},[(0,s.Lk)("div",{class:"col-sm-4"},[(0,s.Lk)("button",{class:"btn btn-primary width-button-style filter-style",onClick:Ka,title:"Search"}," Filter ")])]),(0,s.Lk)("div",x,[(0,s.Lk)("div",A,[e[18]||(e[18]=(0,s.Lk)("label",{for:"entries",class:"form-label col-sm-3"},"Show entries",-1)),(0,s.bo)((0,s.Lk)("select",{id:"entries",class:"form-select show-entries","onUpdate:modelValue":e[4]||(e[4]=a=>ca.value=a),onChange:Ka},e[17]||(e[17]=[(0,s.Lk)("option",{value:"10"},"10",-1),(0,s.Lk)("option",{value:"25"},"25",-1),(0,s.Lk)("option",{value:"50"},"50",-1),(0,s.Lk)("option",{value:"100"},"100",-1)]),544),[[t.u1,ca.value]])])]),(0,s.Lk)("div",E,[(0,s.bF)(i.A,{data:ba.value,columns:va,idrow:a.user_id,onEdit:_a,onDelete:wa,onSort:Aa},null,8,["data","idrow"]),(0,s.Lk)("div",R,[(0,s.Lk)("p",K," Showing "+(0,n.v_)((da.value-1)*ca.value+1)+" to "+(0,n.v_)(Math.min(da.value*ca.value,ma.value))+" of "+(0,n.v_)(ma.value)+" entries ",1),(0,s.Lk)("nav",B,[(0,s.Lk)("ul",F,[(0,s.Lk)("li",{class:(0,n.C4)(["page-item",{disabled:1===da.value}])},[(0,s.Lk)("button",{class:"page-link",onClick:e[5]||(e[5]=a=>Ba(da.value-1))},"Previous")],2),((0,s.uX)(!0),(0,s.CE)(s.FK,null,(0,s.pI)(ua.value,(a=>((0,s.uX)(),(0,s.CE)("li",{class:(0,n.C4)(["page-item",{active:da.value===a}]),key:a},[(0,s.Lk)("button",{class:"page-link",onClick:e=>Ba(a)},(0,n.v_)(a),9,D)],2)))),128)),(0,s.Lk)("li",{class:(0,n.C4)(["page-item",{disabled:da.value===ua.value}])},[(0,s.Lk)("button",{class:"page-link",onClick:e[6]||(e[6]=a=>Ba(da.value+1))},"Next")],2)])])]),(0,s.Lk)("div",{class:"modal fade",id:"form-confirmation","data-bs-backdrop":"static","data-bs-keyboard":"true",tabindex:"-1","aria-labelledby":"staticBackdropPermissionLabel","aria-hidden":"true",onHide:ya},[(0,s.Lk)("div",S,[(0,s.Lk)("div",I,[(0,s.Lk)("div",P,[(0,s.Lk)("h5",$,(0,n.v_)(La.value?"Perbarui User":"Tambah User"),1),e[19]||(e[19]=(0,s.Lk)("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"},null,-1))]),(0,s.Lk)("div",V,[(0,s.Lk)("form",{onSubmit:(0,t.D$)(Ua,["prevent"])},[e[25]||(e[25]=(0,s.Lk)("p",null,[(0,s.eW)("Form yang bertanda "),(0,s.Lk)("span",{class:"text-primary"},"*"),(0,s.eW)(" wajib diisi")],-1)),(0,s.Lk)("div",G,[e[21]||(e[21]=(0,s.Lk)("label",{for:"employee_id",class:"form-label"},"Dari Nama",-1)),(0,s.bo)((0,s.Lk)("select",{id:"employee_id","onUpdate:modelValue":e[7]||(e[7]=a=>ga.value.employee_id=a),class:"form-select"},[e[20]||(e[20]=(0,s.Lk)("option",{value:"",disabled:""},"Silahkan pilih nama",-1)),((0,s.uX)(!0),(0,s.CE)(s.FK,null,(0,s.pI)(Ea.value,(a=>((0,s.uX)(),(0,s.CE)("option",{key:a.employee_id,value:a.employee_id},(0,n.v_)(a.fullname),9,z)))),128))],512),[[t.u1,ga.value.employee_id]])]),(0,s.Lk)("div",j,[e[22]||(e[22]=(0,s.Lk)("label",{for:"username",class:"form-label"},[(0,s.eW)("Username"),(0,s.Lk)("span",{class:"text-primary"},"*")],-1)),(0,s.bo)((0,s.Lk)("input",{"onUpdate:modelValue":e[8]||(e[8]=a=>ga.value.username=a),maxlength:"15",type:"text",class:"form-control",id:"username",required:""},null,512),[[t.Jo,ga.value.username]])]),(0,s.Lk)("div",T,[e[23]||(e[23]=(0,s.Lk)("label",{for:"password",class:"form-label"},[(0,s.eW)("Password"),(0,s.Lk)("span",{class:"text-primary"},"*")],-1)),(0,s.bo)((0,s.Lk)("input",{"onUpdate:modelValue":e[9]||(e[9]=a=>ga.value.password=a),maxlength:"15",type:"password",class:"form-control",id:"password",required:!La.value},null,8,W),[[t.Jo,ga.value.password]])]),(0,s.Lk)("div",M,[e[24]||(e[24]=(0,s.Lk)("label",{for:"role",class:"form-label"},[(0,s.eW)("Role Karyawan"),(0,s.Lk)("span",{class:"text-primary"},"*")],-1)),(0,s.bF)(r,{modelValue:ga.value.role,"onUpdate:modelValue":e[10]||(e[10]=a=>ga.value.role=a),options:Ga,id:"role",required:""},null,8,["modelValue"])]),(0,s.Lk)("button",{type:"submit",class:"btn btn-primary","data-bs-dismiss":La.value?ga.value.username&&ga.value.role?"modal":null:ga.value.username&&ga.value.password&&ga.value.role?"modal":null},(0,n.v_)(La.value?"Simpan Perubahan":"Tambahkan User"),9,N)],32)])])])],32),(0,s.Lk)("div",q,[(0,s.Lk)("div",J,[(0,s.Lk)("div",X,[e[29]||(e[29]=(0,s.Lk)("div",{class:"modal-header"},[(0,s.Lk)("h5",{class:"modal-title",id:"deleteConfirmationLabel"},"Konfirmasi Hapus"),(0,s.Lk)("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})],-1)),(0,s.Lk)("div",H,[(0,s.Lk)("p",null,[e[26]||(e[26]=(0,s.eW)("Apa kamu yakin ingin menghapus data User ")),(0,s.Lk)("strong",null,(0,n.v_)(fa.value?.username),1),e[27]||(e[27]=(0,s.eW)("?"))])]),(0,s.Lk)("div",{class:"modal-footer"},[e[28]||(e[28]=(0,s.Lk)("button",{type:"button",class:"btn btn-secondary","data-bs-dismiss":"modal"},"Cancel",-1)),(0,s.Lk)("button",{type:"button",class:"btn btn-primary","data-bs-dismiss":"modal",onClick:$a},"Delete")])])])]),(0,s.Lk)("div",O,[(0,s.Lk)("div",Q,[(0,s.Lk)("div",Y,[e[33]||(e[33]=(0,s.Lk)("div",{class:"modal-header"},[(0,s.Lk)("h5",{class:"modal-title",id:"deleteConfirmationLabel"},"Konfirmasi Hapus"),(0,s.Lk)("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})],-1)),(0,s.Lk)("div",Z,[(0,s.Lk)("p",null,[e[30]||(e[30]=(0,s.eW)("Apa kamu yakin ingin menghapus data Karyawan ")),(0,s.Lk)("strong",null,(0,n.v_)(a.selectedEmployee?.fullname),1),e[31]||(e[31]=(0,s.eW)("?"))])]),(0,s.Lk)("div",{class:"modal-footer"},[e[32]||(e[32]=(0,s.Lk)("button",{type:"button",class:"btn btn-secondary","data-bs-dismiss":"modal"},"Cancel",-1)),(0,s.Lk)("button",{type:"button",class:"btn btn-primary","data-bs-dismiss":"modal",onClick:$a},"Delete")])])])]),(0,s.Lk)("div",aa,[(0,s.Lk)("div",ea,[(0,s.Lk)("div",la,[e[36]||(e[36]=(0,s.Lk)("div",{class:"modal-header"},[(0,s.Lk)("h5",{class:"modal-title",id:"massUploadModalLabel"},"Mass Upload User"),(0,s.Lk)("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})],-1)),(0,s.Lk)("div",sa,[(0,s.Lk)("form",{onSubmit:(0,t.D$)(Ia,["prevent"])},[(0,s.Lk)("div",ta,[e[34]||(e[34]=(0,s.Lk)("label",{for:"upload-file",class:"form-label"},"Pilih File",-1)),(0,s.Lk)("input",oa,null,512)]),e[35]||(e[35]=(0,s.Lk)("button",{type:"submit",class:"btn btn-primary"},"Upload",-1))],32)])])])]),(0,s.bF)(d.A,{message:l.value},null,8,["message"])])])])])])}}},ra=l(71241);const ia=(0,ra.A)(na,[["__scopeId","data-v-76e69d9c"]]);var da=ia}}]);
//# sourceMappingURL=7734.3673c8ed.js.map