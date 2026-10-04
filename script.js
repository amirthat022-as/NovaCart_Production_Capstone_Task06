const DEMO_USER={email:"demo@example.com",password:"123456"};
const STORAGE_KEY="novacart_products_v1";
const SESSION_KEY="novacart_session";
const seed=[
 {id:"p1",name:"Smart Watch Pro",category:"Electronics",price:129.99,description:"Fitness tracking, notifications and a bright AMOLED display."},
 {id:"p2",name:"Urban Backpack",category:"Accessories",price:54.50,description:"Lightweight everyday backpack with laptop protection."},
 {id:"p3",name:"Wireless Headphones",category:"Electronics",price:89.00,description:"Comfortable over-ear headphones with rich wireless audio."},
 {id:"p4",name:"Classic Sneakers",category:"Fashion",price:72.25,description:"Minimal everyday sneakers designed for comfort."},
 {id:"p5",name:"Desk Lamp",category:"Home",price:34.75,description:"Adjustable LED desk lamp with three brightness modes."},
 {id:"p6",name:"Coffee Tumbler",category:"Home",price:22.00,description:"Reusable insulated tumbler for hot and cold drinks."}
];

const $=id=>document.getElementById(id);
let products=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null")||seed;
let editingId=null;

function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(products))}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function money(v){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(v)}

function render(){
 const query=$("searchInput").value.toLowerCase().trim();
 const cat=$("categoryFilter").value;
 const filtered=products.filter(p=>(!query||`${p.name} ${p.category} ${p.description}`.toLowerCase().includes(query))&&(cat==="all"||p.category===cat));
 const cats=[...new Set(products.map(p=>p.category))].sort();
 $("categoryFilter").innerHTML='<option value="all">All categories</option>'+cats.map(c=>`<option ${c===cat?"selected":""}>${escapeHtml(c)}</option>`).join("");
 $("totalProducts").textContent=products.length;
 $("totalCategories").textContent=cats.length;
 $("catalogValue").textContent=money(products.reduce((s,p)=>s+Number(p.price),0));
 $("productGrid").innerHTML=filtered.length?filtered.map(productCard).join(""):'<div class="empty">No products found.<br><small>Try another search or add a new product.</small></div>';
}

function productCard(p){
 return `<article class="product">
   <span class="category">${escapeHtml(p.category)}</span>
   <h3>${escapeHtml(p.name)}</h3>
   <p>${escapeHtml(p.description)}</p>
   <div class="price">${money(Number(p.price))}</div>
   <div class="product-actions">
    <button class="ghost" onclick="editProduct('${p.id}')">Edit</button>
    <button class="primary danger" onclick="deleteProduct('${p.id}')">Delete</button>
   </div>
 </article>`;
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function openDialog(p=null){
 editingId=p?.id||null;
 $("dialogTitle").textContent=p?"Edit Product":"Add Product";
 $("productId").value=p?.id||"";
 $("productName").value=p?.name||"";
 $("productCategory").value=p?.category||"";
 $("productPrice").value=p?.price||"";
 $("productDescription").value=p?.description||"";
 $("productDialog").showModal();
}
window.editProduct=id=>openDialog(products.find(p=>p.id===id));
window.deleteProduct=id=>{
 const p=products.find(x=>x.id===id);
 if(!p)return;
 if(confirm(`Delete "${p.name}"?`)){products=products.filter(x=>x.id!==id);save();render();toast("Product deleted")}
};

$("loginForm").addEventListener("submit",e=>{
 e.preventDefault();
 const email=$("loginEmail").value.trim(),password=$("loginPassword").value;
 if(email===DEMO_USER.email&&password===DEMO_USER.password){
  localStorage.setItem(SESSION_KEY,email);showApp();toast("Signed in successfully");
 }else toast("Invalid demo credentials");
});
$("logoutBtn").addEventListener("click",()=>{localStorage.removeItem(SESSION_KEY);showAuth();});
$("addProductBtn").addEventListener("click",()=>openDialog());
$("closeDialog").addEventListener("click",()=>$("productDialog").close());
$("cancelBtn").addEventListener("click",()=>$("productDialog").close());
$("searchInput").addEventListener("input",render);
$("categoryFilter").addEventListener("change",render);

$("productForm").addEventListener("submit",e=>{
 e.preventDefault();
 const item={id:editingId||`p${Date.now()}`,name:$("productName").value.trim(),category:$("productCategory").value.trim(),price:Number($("productPrice").value),description:$("productDescription").value.trim()};
 if(editingId){products=products.map(p=>p.id===editingId?item:p);toast("Product updated")}
 else{products.unshift(item);toast("Product added")}
 save();render();$("productDialog").close();
});

function showApp(){$("authScreen").classList.add("hidden");$("appScreen").classList.remove("hidden");$("userEmail").textContent=localStorage.getItem(SESSION_KEY)||DEMO_USER.email;render()}
function showAuth(){$("appScreen").classList.add("hidden");$("authScreen").classList.remove("hidden")}
if(localStorage.getItem(SESSION_KEY)===DEMO_USER.email)showApp();else showAuth();