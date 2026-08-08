import data from "@/data/pushup.json";


export default function PushupStats(){


const start =
new Date(data.startDate);


const now =
new Date();


const days =
Math.floor(
(Number(now) - Number(start))
/
(1000 * 60 * 60 * 24)
);



const items = [

{
label:"开始日期",
value:data.startDate
},

{
label:"坚持天数",
value:`${days} 天`
},

{
label:"累计次数",
value:`${data.current} 个`
},

{
label:"剩余目标",
value:`${data.goal - data.current} 个`
}

];



return (

<section

style={{
display:"grid",
gridTemplateColumns:"repeat(4,1fr)",
gap:"16px",
marginTop:"24px"
}}

>


{
items.map(item=>(

<div

key={item.label}

style={{

padding:"20px",

border:"1px solid #eee",

borderRadius:"16px",

background:"#fff"

}}

>


<p

style={{
fontSize:"14px",
opacity:.6
}}

>

{item.label}

</p>



<strong

style={{
fontSize:"24px"
}}

>

{item.value}

</strong>


</div>

))

}


</section>

)

}