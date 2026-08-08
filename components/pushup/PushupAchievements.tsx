import data from "@/data/pushup.json";


export default function PushupAchievements(){


const achievements = [

{
title:"完成1000个",
target:1000
},

{
title:"完成2000个",
target:2000
},

{
title:"完成5000个",
target:5000
},

{
title:"完成10000个",
target:10000
}

];



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
成就
</h2>



<div

style={{
display:"grid",
gridTemplateColumns:"repeat(2,1fr)",
gap:"16px",
marginTop:"20px"
}}

>


{
achievements.map(item=>{


const done =
data.current >= item.target;


return (

<div

key={item.target}

style={{

padding:"18px",

borderRadius:"16px",

background:
done
?
"#f0fff0"
:
"#fafafa",

border:"1px solid #eee"

}}

>


<div
style={{
fontSize:"28px"
}}
>

{
done
?
"🏅"
:
"🔒"
}

</div>


<strong>
{item.title}
</strong>


<p>

{
done
?
"已解锁"
:
`还差 ${item.target-data.current} 个`
}

</p>


</div>

)


})

}


</div>


</section>

)

}