import data from "@/data/pushup.json";


export default function PushupCalendar(){


const records = data.records;


return (

<section
style={{
marginTop:"32px",
padding:"24px",
border:"1px solid #eee",
borderRadius:"20px",
background:"#fff"
}}
>


<h2>
训练日历
</h2>


<div

style={{
display:"grid",
gridTemplateColumns:"repeat(14,18px)",
gap:"8px",
marginTop:"20px"
}}

>


{
Array.from(
{
length:42
}
).map((_,index)=>{


const record =
records[index];


const level =
record
?
record.count >=50
?
"high"
:
record.count >=20
?
"middle"
:
"low"

:
"none";



return (

<div

key={index}

title={
record
?
`${record.date} ${record.count}个`
:
"未训练"
}


style={{

width:"18px",

height:"18px",

borderRadius:"4px",

background:

level==="high"
?
"#2f9e44"

:

level==="middle"
?
"#69db7c"

:

level==="low"
?
"#b2f2bb"

:
"#eee"

}}

>


</div>

)


})

}


</div>


</section>

)

}