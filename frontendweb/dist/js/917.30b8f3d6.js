"use strict";(self["webpackChunkhopeui_vue"]=self["webpackChunkhopeui_vue"]||[]).push([[917],{8298:function(a,e,l){l.r(e),l.d(e,{default:function(){return Z}});l(4114),l(4603),l(7566),l(8721);var t=l(6768),s=l(144),o=l(5130),n=l(4232),r=l(4373),i=l(7363),d=l(8904),c=l(8077),u=l(961);const m={class:"row"},b={class:"col-sm-12"},v={class:"card"},p={class:"card-body"},h={class:"row mb-2"},g={class:"col-sm-6"},k={class:"col-sm-6"},L={class:"input-group has-validation"},f={class:"row mb-4"},y={class:"col-sm-6"},w={class:"search-container"},C={class:"input-group has-validation"},_={class:"row mb-2"},x={class:"col-sm-6 pagination-show-entries"},A={class:"table-responsive border-bottom"},B={class:"pagination-container"},E={class:"text-muted"},F={"aria-label":"Page navigation example"},R={class:"pagination justify-content-end"},U=["onClick"],K={class:"modal-dialog"},$={class:"modal-content"},I={class:"modal-header"},S={class:"modal-title",id:"staticBackdropPermissionLabel"},D={class:"modal-body"},P={class:"mb-3"},z={class:"mb-3"},G=["data-bs-dismiss"],V={class:"modal fade",id:"delete-confirmation",tabindex:"-1","aria-labelledby":"deleteConfirmationLabel","aria-hidden":"true"},j={class:"modal-dialog"},M={class:"modal-content"},T={class:"modal-body"},N={class:"modal fade",id:"mass-upload-modal",tabindex:"-1","aria-labelledby":"massUploadModalLabel","aria-hidden":"true"},W={class:"modal-dialog"},q={class:"modal-content"},H={class:"modal-body"},J={class:"mb-3"},X={type:"file",id:"upload-file",ref:"fileInput",accept:".xlsx, .csv",required:"",class:"form-control"};var O={__name:"ListCabang",setup(a){const e=(0,s.KR)(""),l=(0,s.KR)(""),O=localStorage.getItem("access_token"),Q=(0,s.KR)([]),Y=(0,s.KR)([]),Z=(0,s.KR)([]),aa=(0,s.KR)(""),ea=(0,s.KR)(""),la=(0,s.KR)(1),ta=(0,s.KR)(0),sa=(0,s.KR)(10),oa=(0,s.KR)(0),na=[{title:"Nama Cabang",data:"branch_name",sortable:!0},{title:"Alamat",data:"address",sortable:!0},{title:"Aksi",data:"actions",sortable:!1}];(0,t.sV)((async()=>{await ua(),await ca()}));const ra=(0,s.KR)({column:"branch_id",order:"DESC"}),ia=({column:a,order:e})=>{ra.value={column:a,order:e},ca()},da=a=>{Z.value=a},ca=async()=>{try{const a=await r.A.get("http://localhost:3000/api/branch",{headers:{Authorization:`Bearer ${O}`},params:{branch_name:Z.value.join(","),address:aa.value,search:ea.value,order_by:ra.value.column,order_direction:ra.value.order,page:la.value,pageSize:sa.value}});Q.value=a.data.rows,oa.value=a.data.sp.rowCount,ta.value=Math.ceil(a.data.sp.rowCount/sa.value)}catch(a){console.error("Error fetching branch data:",a),xa()}},ua=async()=>{try{const a=await r.A.get("http://localhost:3000/api/branch/filterBranchName",{headers:{Authorization:`Bearer ${O}`}});Y.value=a.data}catch(a){console.error("Error fetching branch names:",a),xa()}},ma=a=>{a>=1&&a<=ta.value&&(la.value=a,ca())},ba=(0,s.KR)(!1),va=(0,s.KR)({branch_id:null,branch_name:"",address:""}),pa=()=>{va.value={branch_id:null,branch_name:"",address:""}},ha=async()=>{try{const a=await r.A.get("http://localhost:3000/api/branch/export",{headers:{Authorization:`Bearer ${O}`},params:{branch_name:Z.value.join(","),address:aa.value,search:ea.value,order_by:ra.value.column,order_direction:ra.value.order},responseType:"blob"}),e=window.URL.createObjectURL(new Blob([a.data])),l=document.createElement("a");l.href=e,l.setAttribute("download","data_cabang.xlsx"),document.body.appendChild(l),l.click(),l.parentNode.removeChild(l)}catch(a){console.error("Error exporting data:",a),e.value="Gagal Ekspor",l.value="Gagal mengekspor data. Silakan coba lagi.";const t=new c.aF(document.getElementById("message-alert"));t.show()}},ga=async()=>{const a=document.getElementById("upload-file"),t=a.files[0];if(!t){e.value="Pilih File",l.value="Silakan pilih file sebelum mengunggah.";const a=new c.aF(document.getElementById("message-alert"));return void a.show()}const s=new FormData;s.append("file",t);try{const a=await r.A.post("http://localhost:3000/api/branch/mass-upload",s,{headers:{Authorization:`Bearer ${O}`,"Content-Type":"multipart/form-data"}});e.value="Berhasil",l.value=`Upload berhasil, ${a.data.successCount} data cabang berhasil terupload`;const t=new c.aF(document.getElementById("message-alert"));t.show(),ca()}catch(o){console.error("Gagal mengunggah file:",o),e.value="Gagal Upload",l.value="Gagal mengunggah file. Pastikan format file benar.";const a=new c.aF(document.getElementById("message-alert"));a.show()}},ka=async()=>{try{const a=await r.A.get("http://localhost:3000/api/branch/template/",{headers:{Authorization:`Bearer ${O}`},responseType:"blob"}),e=window.URL.createObjectURL(new Blob([a.data])),l=document.createElement("a");l.href=e,l.setAttribute("download","template_data_cabang.xlsx"),document.body.appendChild(l),l.click(),l.parentNode.removeChild(l)}catch(a){console.error("Error downloading template:",a),e.value="Gagal Download",l.value="Gagal mendownload template. Silakan coba lagi.";const t=new c.aF(document.getElementById("message-alert"));t.show()}},La=()=>{pa(),ba.value=!1},fa=a=>{wa.value=a,va.value={...a},ba.value=!0},ya=async()=>{console.log("Edit data submitted:",va.value);try{if(ba.value){const a=await r.A.put(`http://localhost:3000/api/branch/${va.value.branch_id}`,va.value,{headers:{Authorization:`Bearer ${O}`}});console.log("Data berhasil diupdate:",a.data);const e=Q.value.findIndex((a=>a.branch_id===va.value.branch_id));-1!==e&&(Q.value[e]={...va.value})}else{const a=await r.A.post("http://localhost:3000/api/branch",va.value,{headers:{Authorization:`Bearer ${O}`}});console.log("Data berhasil ditambahkan:",a.data),Q.value.push(a.data)}}catch(a){console.error("Gagal mengupdate data:",a),xa()}},wa=(0,s.KR)(null),Ca=a=>{wa.value=a},_a=async()=>{try{console.log("Id deleted:",wa.value.branch_id),await r.A.delete(`http://localhost:3000/api/branch/${wa.value.branch_id}`,{headers:{Authorization:`Bearer ${O}`}}),e.value="Berhasil Hapus",l.value=`Data Cabang <strong>${wa.value.branch_name}</strong> berhasil dihapus.`;const a=new c.aF(document.getElementById("message-alert"));a.show(),ca()}catch(a){if(a.response&&409===a.response.status){e.value="Gagal Menghapus",l.value=`Data Cabang <strong>${wa.value.branch_name}</strong> gagal dihapus. ${a.response.data.message}. Anda harus menghapus terlebih dahulu data yang terkait dengan Data Cabang <strong>${wa.value.branch_name}</strong>.`;const t=new c.aF(document.getElementById("message-alert"));t.show()}else console.error("Failed to delete branch data:",a),xa()}},xa=()=>{e.value="Koneksi Gagal",l.value="Cek koneksi internet Anda.";const a=new c.aF(document.getElementById("message-alert"));a.show()};return(a,r)=>{const c=(0,t.g2)("b-form-textarea");return(0,t.uX)(),(0,t.CE)("div",m,[(0,t.Lk)("div",b,[(0,t.Lk)("div",v,[(0,t.Lk)("div",{class:"card-header d-flex justify-content-between"},[r[9]||(r[9]=(0,t.Lk)("div",{class:"header-title"},[(0,t.Lk)("h4",{class:"card-title"},"List Cabang")],-1)),(0,t.Lk)("div",null,[(0,t.Lk)("button",{class:"btn btn-success",style:{"margin-right":"10px"},onClick:La,"data-bs-toggle":"modal","data-bs-target":"#form-confirmation"}," Tambah Cabang "),(0,t.Lk)("button",{class:"btn btn-outline-success",style:{"margin-right":"10px"},onClick:ha}," Ekspor Data "),r[8]||(r[8]=(0,t.Lk)("button",{class:"btn btn-info",style:{"margin-right":"10px"},"data-bs-toggle":"modal","data-bs-target":"#mass-upload-modal"}," Mass Upload ",-1)),(0,t.Lk)("button",{class:"btn btn-outline-info",onClick:ka}," Download Template ")])]),(0,t.Lk)("div",p,[(0,t.Lk)("div",h,[(0,t.Lk)("div",g,[r[10]||(r[10]=(0,t.Lk)("label",{for:"filter",class:"form-label"},"Filter nama cabang",-1)),(0,t.bF)((0,s.R1)(u.A),{options:Y.value,modelValue:Z.value,"onUpdate:modelValue":[r[0]||(r[0]=a=>Z.value=a),da],multiple:"",class:"filter-style"},null,8,["options","modelValue"])]),(0,t.Lk)("div",k,[r[11]||(r[11]=(0,t.Lk)("label",{for:"validationCustomUsername01",class:"form-label"},"Filter alamat",-1)),(0,t.Lk)("div",L,[(0,t.bo)((0,t.Lk)("input",{type:"text","onUpdate:modelValue":r[1]||(r[1]=a=>aa.value=a),class:"form-control filter-style",id:"validationCustomUsername01","aria-describedby":"inputGroupPrepend"},null,512),[[o.Jo,aa.value]])])])]),(0,t.Lk)("div",f,[(0,t.Lk)("div",y,[(0,t.Lk)("div",w,[r[12]||(r[12]=(0,t.Lk)("label",{for:"global-search",class:"form-label"},"Pencarian",-1)),(0,t.Lk)("div",C,[(0,t.bo)((0,t.Lk)("input",{type:"text",id:"global-search","onUpdate:modelValue":r[2]||(r[2]=a=>ea.value=a),class:"form-control filter-style"},null,512),[[o.Jo,ea.value]])])])]),(0,t.Lk)("div",{class:"col-sm-4"},[r[13]||(r[13]=(0,t.Lk)("label",{for:"validationCustomUsername01",class:"form-label text-white"},"I",-1)),(0,t.Lk)("div",{class:"input-group has-validation"},[(0,t.Lk)("button",{class:"btn btn-primary width-button-style filter-style",onClick:ca,title:"Search"}," Filter ")])])]),(0,t.Lk)("div",_,[(0,t.Lk)("div",x,[r[15]||(r[15]=(0,t.Lk)("label",{for:"entries",class:"form-label col-sm-3"},"Show entries",-1)),(0,t.bo)((0,t.Lk)("select",{id:"entries",class:"form-select show-entries","onUpdate:modelValue":r[3]||(r[3]=a=>sa.value=a),onChange:ca},r[14]||(r[14]=[(0,t.Lk)("option",{value:"10"},"10",-1),(0,t.Lk)("option",{value:"25"},"25",-1),(0,t.Lk)("option",{value:"50"},"50",-1),(0,t.Lk)("option",{value:"100"},"100",-1)]),544),[[o.u1,sa.value]])])]),(0,t.Lk)("div",A,[(0,t.bF)(i.A,{data:Q.value,columns:na,currentPage:la.value,pageSize:sa.value,idrow:a.asset_id,onEdit:fa,onDelete:Ca,onSort:ia},null,8,["data","currentPage","pageSize","idrow"]),(0,t.Lk)("div",B,[(0,t.Lk)("p",E," Showing "+(0,n.v_)((la.value-1)*sa.value+1)+" to "+(0,n.v_)(Math.min(la.value*sa.value,oa.value))+" of "+(0,n.v_)(oa.value)+" entries ",1),(0,t.Lk)("nav",F,[(0,t.Lk)("ul",R,[(0,t.Lk)("li",{class:(0,n.C4)(["page-item",{disabled:1===la.value}])},[(0,t.Lk)("button",{class:"page-link",onClick:r[4]||(r[4]=a=>ma(la.value-1))},"Previous")],2),((0,t.uX)(!0),(0,t.CE)(t.FK,null,(0,t.pI)(ta.value,(a=>((0,t.uX)(),(0,t.CE)("li",{class:(0,n.C4)(["page-item",{active:la.value===a}]),key:a},[(0,t.Lk)("button",{class:"page-link",onClick:e=>ma(a)},(0,n.v_)(a),9,U)],2)))),128)),(0,t.Lk)("li",{class:(0,n.C4)(["page-item",{disabled:la.value===ta.value}])},[(0,t.Lk)("button",{class:"page-link",onClick:r[5]||(r[5]=a=>ma(la.value+1))},"Next")],2)])])]),(0,t.Lk)("div",{class:"modal fade",id:"form-confirmation","data-bs-backdrop":"static","data-bs-keyboard":"true",tabindex:"-1","aria-labelledby":"staticBackdropPermissionLabel","aria-hidden":"true",onHide:pa},[(0,t.Lk)("div",K,[(0,t.Lk)("div",$,[(0,t.Lk)("div",I,[(0,t.Lk)("h5",S,(0,n.v_)(ba.value?"Perbarui Cabang":"Tambah Cabang"),1),r[16]||(r[16]=(0,t.Lk)("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"},null,-1))]),(0,t.Lk)("div",D,[r[19]||(r[19]=(0,t.Lk)("p",null,[(0,t.eW)("Form yang bertanda "),(0,t.Lk)("span",{class:"text-primary"},"*"),(0,t.eW)(" wajib diisi")],-1)),(0,t.Lk)("form",{onSubmit:(0,o.D$)(ya,["prevent"])},[(0,t.Lk)("div",P,[r[17]||(r[17]=(0,t.Lk)("label",{for:"branch_name",class:"form-label"},[(0,t.eW)("Nama Cabang"),(0,t.Lk)("span",{class:"text-primary"},"*")],-1)),(0,t.bo)((0,t.Lk)("input",{"onUpdate:modelValue":r[6]||(r[6]=a=>va.value.branch_name=a),maxlength:"100",id:"branch_name",type:"text",required:"",class:"form-control"},null,512),[[o.Jo,va.value.branch_name]])]),(0,t.Lk)("div",z,[r[18]||(r[18]=(0,t.Lk)("label",{for:"address",class:"form-label"},[(0,t.eW)("Alamat"),(0,t.Lk)("span",{class:"text-primary"},"*")],-1)),(0,t.bF)(c,{modelValue:va.value.address,"onUpdate:modelValue":r[7]||(r[7]=a=>va.value.address=a),id:"address",type:"text",required:"",rows:"6","max-rows":"6"},null,8,["modelValue"])]),(0,t.Lk)("button",{type:"submit",class:"btn btn-primary","data-bs-dismiss":va.value.branch_name&&va.value.address?"modal":null},(0,n.v_)(ba.value?"Simpan Perubahan":"Tambahkan Cabang"),9,G)],32)])])])],32),(0,t.Lk)("div",V,[(0,t.Lk)("div",j,[(0,t.Lk)("div",M,[r[23]||(r[23]=(0,t.Lk)("div",{class:"modal-header"},[(0,t.Lk)("h5",{class:"modal-title",id:"deleteConfirmationLabel"},"Konfirmasi Hapus"),(0,t.Lk)("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})],-1)),(0,t.Lk)("div",T,[(0,t.Lk)("p",null,[r[20]||(r[20]=(0,t.eW)("Apa kamu yakin ingin menghapus data Cabang ")),(0,t.Lk)("strong",null,(0,n.v_)(wa.value?.branch_name),1),r[21]||(r[21]=(0,t.eW)("?"))])]),(0,t.Lk)("div",{class:"modal-footer"},[r[22]||(r[22]=(0,t.Lk)("button",{type:"button",class:"btn btn-secondary","data-bs-dismiss":"modal"},"Cancel",-1)),(0,t.Lk)("button",{type:"button",class:"btn btn-primary","data-bs-dismiss":"modal",onClick:_a},"Delete")])])])]),(0,t.Lk)("div",N,[(0,t.Lk)("div",W,[(0,t.Lk)("div",q,[r[26]||(r[26]=(0,t.Lk)("div",{class:"modal-header"},[(0,t.Lk)("h5",{class:"modal-title",id:"massUploadModalLabel"},"Mass Upload Cabang"),(0,t.Lk)("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})],-1)),(0,t.Lk)("div",H,[(0,t.Lk)("form",{onSubmit:(0,o.D$)(ga,["prevent"])},[(0,t.Lk)("div",J,[r[24]||(r[24]=(0,t.Lk)("label",{for:"upload-file",class:"form-label"},"Pilih File",-1)),(0,t.Lk)("input",X,null,512)]),r[25]||(r[25]=(0,t.Lk)("button",{type:"submit",class:"btn btn-primary"},"Upload",-1))],32)])])])]),(0,t.bF)(d.A,{message:l.value,title:e.value},null,8,["message","title"])])])])])])}}},Q=l(1241);const Y=(0,Q.A)(O,[["__scopeId","data-v-6b0e42e4"]]);var Z=Y}}]);