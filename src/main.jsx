import React,{useMemo,useState} from "react";
import{createRoot}from"react-dom/client";
import{LayoutDashboard,ClipboardList,Users,Boxes,HardHat,UserCircle,Settings,Search,Bell,Plus,ArrowUpLeft,Clock3,Truck,MoreHorizontal,ShieldCheck,LogOut,Package,ChevronLeft}from"lucide-react";
import"./styles.css";

const nav=[["dashboard","דשבורד",LayoutDashboard],["orders","הזמנות",ClipboardList],["customers","לקוחות",Users],["inventory","מלאי",Boxes],["workers","עובדים",HardHat]];
const orders=[["#1048","משפחת כהן","שיש קלקטה","₪18,500","בייצור"],["#1047","אדריכלות קו נקי","גרניט שחור","₪32,800","ממתין לחיתוך"],["#1046","יוסי לוי","שיש קררה","₪12,400","מוכן לאספקה"],["#1045","פרויקט הרקפות","דקטון","₪46,200","הושלם"],["#1044","משפחת ישראלי","פורצלן לבן","₪21,900","באספקה"]];
const customers=[["משפחת כהן","050-1234567","מטבח פרטי","₪18,500"],["אדריכלות קו נקי","03-5552211","אדריכל","₪128,400"],["יוסי לוי","052-7654321","לקוח פרטי","₪12,400"],["פרויקט הרקפות","052-8812345","קבלן","₪214,600"]];
const inventory=[["שיש קלקטה","לוחות","18","תקין"],["גרניט שחור","לוחות","7","נמוך"],["קררה איטלקי","לוחות","23","תקין"],["דקטון","לוחות","4","נמוך"],["פורצלן לבן","לוחות","31","תקין"],["קוורץ אפור","לוחות","12","תקין"]];

function App(){
 const[page,setPage]=useState("dashboard"),[query,setQuery]=useState(""),[notice,setNotice]=useState("");
 const[user,setUser]=useState({name:"ישראל ישראלי",email:"israel@example.com",role:"מנהל המפעל"});
 const title=nav.find(x=>x[0]===page)?.[1]||"הפרופיל שלי";
 const action=(msg="הפעולה בוצעה בהצלחה")=>{setNotice(msg);setTimeout(()=>setNotice(""),2400)};
 const go=p=>setPage(p);
 return <div className="app" dir="rtl">
  <aside>
   <div className="brand"><div className="brand-mark">א</div><div><b>אבן פרימיום</b><span>ניהול מפעל שיש</span></div></div>
   <nav>{nav.map(([id,label,Icon])=><button className={page===id?"active":""} onClick={()=>go(id)} key={id}><Icon size={19}/><span>{label}</span></button>)}</nav>
   <div className="side-bottom"><button className={page==="profile"?"active":""} onClick={()=>go("profile")}><UserCircle size={19}/><span>הפרופיל שלי</span></button><button onClick={()=>action("הגדרות זמינות בקרוב")}><Settings size={19}/><span>הגדרות</span></button></div>
  </aside>
  <main>
   <header><div><div className="crumb">אבן פרימיום / {title}</div><h1>{title}</h1></div>
    <div className="head-actions"><div className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="חיפוש..." /></div><button className="icon-btn"><Bell size={19}/><i/></button><button className="avatar" onClick={()=>go("profile")}>י</button></div>
   </header>
   {notice&&<div className="toast"><ShieldCheck size={18}/>{notice}</div>}
   {page==="dashboard"&&<Dashboard go={go} action={action}/>}
   {page==="orders"&&<Orders query={query} action={action}/>}
   {page==="customers"&&<Customers query={query} action={action}/>}
   {page==="inventory"&&<Inventory query={query} action={action}/>}
   {page==="workers"&&<Workers/>}
   {page==="profile"&&<Profile user={user} setUser={setUser} action={action}/>}
  </main>
 </div>
}

function Dashboard({go,action}){
 return <section>
  <div className="welcome"><div><span className="eyebrow">יום עבודה פורה</span><h2>בוקר טוב, ישראל 👋</h2><p>הנה תמונת המצב של המפעל להיום.</p></div><button className="primary" onClick={()=>action("הזמנה חדשה נפתחה")}><Plus size={18}/>הזמנה חדשה</button></div>
  <div className="stats">{[["מכירות החודש","₪284,650","+12.8%",ArrowUpLeft],["הזמנות פעילות","24","+4 השבוע",ClipboardList],["ממתין לייצור","8","3 דחופות",Clock3],["מוכנות לאספקה","6","למחר",Truck]].map(([a,b,c,I])=><div className="stat" key={a}><div className="stat-top"><span>{a}</span><I size={19}/></div><strong>{b}</strong><small>{c}</small></div>)}</div>
  <div className="grid"><div className="card wide"><div className="card-head"><div><h3>הזמנות אחרונות</h3><span>הפעילות האחרונה במפעל</span></div><button onClick={()=>go("orders")}>לכל ההזמנות <ArrowUpLeft size={15}/></button></div><OrderTable rows={orders.slice(0,4)}/></div>
  <div className="card"><div className="card-head"><div><h3>משימות היום</h3><span>מצב ביצוע</span></div></div>{["חיתוך הזמנה #1047","ליטוש קררה #1046","העמסת משלוח #1044","מדידת מטבח — משפחת כהן"].map((x,i)=><div className="task" key={x}><div className={"check "+(i<2?"done":"")}>{i<2?"✓":""}</div><span>{x}</span><MoreHorizontal size={17}/></div>)}</div></div>
 </section>
}
function OrderTable({rows}){return <div className="table"><div className="tr th"><span>הזמנה</span><span>לקוח</span><span>מוצר</span><span>סכום</span><span>סטטוס</span></div>{rows.map(o=><div className="tr" key={o[0]}><span className="bold">{o[0]}</span><span>{o[1]}</span><span>{o[2]}</span><span className="bold">{o[3]}</span><span><em className={o[4]==="הושלם"?"green":o[4].includes("ממתין")?"orange":"blue"}>{o[4]}</em></span></div>)}</div>}
function Orders({query,action}){const rows=useMemo(()=>orders.filter(x=>x.join(" ").includes(query)),[query]);return <section><div className="toolbar"><p className="muted">{rows.length} הזמנות</p><button className="primary" onClick={()=>action("הזמנה חדשה נפתחה")}><Plus size={18}/>הזמנה חדשה</button></div><div className="card"><OrderTable rows={rows}/></div></section>}
function Customers({query,action}){const rows=customers.filter(x=>x.join(" ").includes(query));return <section><div className="toolbar"><p className="muted">{rows.length} לקוחות</p><button className="primary" onClick={()=>action("טופס לקוח חדש נפתח")}><Plus size={18}/>לקוח חדש</button></div><div className="customer-grid">{rows.map(c=><div className="customer" key={c[0]}><div className="customer-avatar">{c[0][0]}</div><div><h3>{c[0]}</h3><span>{c[1]} · {c[2]}</span><strong>{c[3]}</strong></div><MoreHorizontal/></div>)}</div></section>}
function Inventory({query,action}){const rows=inventory.filter(x=>x.join(" ").includes(query));return <section><div className="toolbar"><p className="muted">מלאי חומרי גלם ומוצרים</p><button className="primary" onClick={()=>action("פריט מלאי חדש נפתח")}><Plus size={18}/>הוספת פריט</button></div><div className="inventory-grid">{rows.map((x,i)=><div className="inventory" key={x[0]}><div className={"stone stone"+i}></div><div><h3>{x[0]}</h3><span>{x[1]}</span></div><strong>{x[2]} <small>יח׳</small></strong><em className={x[3]==="נמוך"?"orange":"green"}>{x[3]}</em></div>)}</div></section>}
function Workers(){return <section><div className="toolbar"><p className="muted">צוות המפעל · 4 עובדים פעילים</p><button className="secondary"><Plus size={16}/>הוספת עובד</button></div><div className="customer-grid">{["דוד כהן","משה לוי","אברהם פרץ","יונתן רוזן"].map((n,i)=><div className="customer" key={n}><div className="customer-avatar worker">{n[0]}</div><div><h3>{n}</h3><span>{["מנהל ייצור","מפעיל CNC","מחסנאי","נהג משלוחים"][i]}</span><strong className="green-text">● פעיל</strong></div></div>)}</div></section>}
function Profile({user,setUser,action}){const[connected,setConnected]=useState(false);return <section><div className="profile-card"><div className="profile-cover"></div><div className="profile-main"><div className="big-avatar">י</div><div className="profile-name"><h2>{user.name}</h2><p>{user.role}</p></div><button className="secondary" onClick={()=>action("הפרטים נשמרים אוטומטית")}>שמירת פרטים</button></div><div className="profile-body"><div><h3>פרטים אישיים</h3><label>שם מלא<input value={user.name} onChange={e=>setUser({...user,name:e.target.value})}/></label><label>דוא״ל<input value={user.email} onChange={e=>setUser({...user,email:e.target.value})}/></label><label>תפקיד<input value={user.role} onChange={e=>setUser({...user,role:e.target.value})}/></label></div><div><h3>חיבורים ואבטחה</h3><div className="connection"><div className="google">G</div><div><b>Google</b><span>{connected?"החשבון מחובר ומוכן לכניסה":"חיבור חשבון Google לכניסה מהירה"}</span></div><button className={connected?"connected":"secondary"} onClick={()=>{setConnected(!connected);action(connected?"חיבור Google נותק":"החיבור ל-Google מוכן להגדרה")}}>{connected?"מחובר":"חבר חשבון"}</button></div><div className="connection"><div className="security"><ShieldCheck/></div><div><b>אבטחת החשבון</b><span>אימות דו-שלבי והגדרות כניסה</span></div><button className="secondary" onClick={()=>action("הגדרות אבטחה נפתחו")}>ניהול</button></div><div className="connection"><div className="security"><Package/></div><div><b>מערכת המפעל</b><span>ניהול הזמנות, מלאי, לקוחות ועובדים</span></div><ChevronLeft/></div></div></div></div></section>}

createRoot(document.getElementById("root")).render(<App/>);