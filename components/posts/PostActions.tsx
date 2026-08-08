"use client";

import { useState } from "react";

import {
  Link,
  Bookmark,
  Share2,
  Printer,
  FileDown
} from "lucide-react";


interface Props {
  title:string;
}


export default function PostActions({
  title
}:Props){


const [marked,setMarked] =
useState(false);



function copyLink(){

navigator.clipboard.writeText(
window.location.href
);

}



function bookmark(){

document.cookie =
`lmn516-bookmark-${location.pathname}=true;max-age=31536000;path=/`;

setMarked(true);

}



async function share(){

if(navigator.share){

await navigator.share({

title,

url:window.location.href

});

}else{

copyLink();

}

}



function printPage(){

window.print();

}



async function downloadPDF(){


const html2pdf =
(await import("html2pdf.js")).default;



const element =
document.querySelector(".article-body") as HTMLElement | null;



if(!element) return;



html2pdf()

.from(element)

.set({

margin:10,

filename:`${title}.pdf`,


pagebreak:{

mode:[

"avoid-all",

"css",

"legacy"

]

},


html2canvas:{

scale:2,

useCORS:true,

windowWidth:
document.documentElement.scrollWidth,

windowHeight:
document.documentElement.scrollHeight

},


jsPDF:{

format:"a4",

orientation:"portrait"

}

})

.save();

}



return (

<div className="post-actions">


<button onClick={copyLink}>

<Link size={14}/>

<span>
复制链接
</span>

</button>



<button onClick={bookmark}>

<Bookmark

size={14}

fill={
marked
?
"currentColor"
:
"none"
}

/>

<span>

{
marked
?
"已标记"
:
"标记"
}

</span>

</button>



<button onClick={share}>

<Share2 size={14}/>

<span>
分享
</span>

</button>



<button onClick={printPage}>

<Printer size={14}/>

<span>
打印
</span>

</button>



<button onClick={downloadPDF}>

<FileDown size={14}/>

<span>
PDF
</span>

</button>



</div>

);

}