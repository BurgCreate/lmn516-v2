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



const clone =
element.cloneNode(true) as HTMLElement;



// 添加来源

const source =
document.createElement("div");


source.className =
"pdf-source";


source.innerHTML =
`
来源：
${window.location.href}
`;



clone.appendChild(source);



// 临时渲染区域

clone.style.position =
"fixed";

clone.style.left =
"0";

clone.style.top =
"0";

clone.style.width =
`${element.scrollWidth}px`;

clone.style.background =
"#fff";

clone.style.zIndex =
"-1";



document.body.appendChild(clone);



await html2pdf()

.from(clone)

.set({

margin:10,

filename:
`${title}.pdf`,


image:{

type:"jpeg",

quality:0.98

},



html2canvas:{

scale:2,

useCORS:true,

scrollY:0,

removeContainer:false,

windowWidth:
clone.scrollWidth,

windowHeight:
clone.scrollHeight

},



jsPDF:{

format:"a4",

orientation:"portrait"

}


})

.save();



clone.remove();


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