"use client";


import { useState, useEffect } from "react";

import {
  Volume2,
  Check
} from "lucide-react";



export default function EnglishWordCard({
  word
}:any){


  const [flip,setFlip] = useState(false);



  // 键盘模式

  const [typing,setTyping] = useState(false);

  const [answer,setAnswer] = useState("");

  const [showWord,setShowWord] = useState(false);

  const [errorCount,setErrorCount] = useState(0);

  const [hint,setHint] = useState("");




  const [rotate,setRotate] = useState({

    x:0,

    y:0

  });



  const [emojiColor,setEmojiColor] = useState(
    "#f6f1e6"
  );





  const pastelize = (
    r:number,
    g:number,
    b:number
  )=>{


    const boost = 1.08;


    r *= boost;

    g *= boost;

    b *= boost;



    r = r + (255-r)*0.62;

    g = g + (255-g)*0.62;

    b = b + (255-b)*0.62;



    return `rgb(
      ${Math.min(255,Math.round(r))},
      ${Math.min(255,Math.round(g))},
      ${Math.min(255,Math.round(b))}
    )`;

  };







  useEffect(()=>{


    const canvas =
      document.createElement("canvas");


    const ctx =
      canvas.getContext("2d");


    if(!ctx) return;



    canvas.width=50;

    canvas.height=50;



    ctx.font="50px serif";


    ctx.fillText(
      word.emoji,
      0,
      45
    );



    const pixels =
      ctx.getImageData(
        0,
        0,
        50,
        50
      ).data;




    let r=0;

    let g=0;

    let b=0;

    let count=0;



    for(
      let i=0;
      i<pixels.length;
      i+=4
    ){


      if(pixels[i+3]>80){


        r+=pixels[i];

        g+=pixels[i+1];

        b+=pixels[i+2];


        count++;

      }


    }





    if(count){


      setEmojiColor(

        pastelize(
          r/count,
          g/count,
          b/count
        )

      );


    }



  },[word.emoji]);









  const handleMove = (
    e:React.MouseEvent<HTMLDivElement>
  )=>{


    const rect =
      e.currentTarget.getBoundingClientRect();



    const x =
      e.clientX - rect.left;


    const y =
      e.clientY - rect.top;



    setRotate({

      x:
      ((y / rect.height)-0.5)*-6,


      y:
      ((x / rect.width)-0.5)*6


    });


  };






  const resetMove=()=>{


    setRotate({

      x:0,

      y:0

    });


  };







  const speak=()=>{


    const text =
      new SpeechSynthesisUtterance(
        word.word
      );


    text.lang="en-US";


    window.speechSynthesis.speak(text);


  };







  const checkAnswer=()=>{


    const value =
      answer.trim().toLowerCase();



    if(
      value === word.word.toLowerCase()
    ){


      setShowWord(true);

      speak();

      return;

    }




    const count =
      errorCount + 1;



    setErrorCount(count);



    if(count===3){

      setHint(
        `提示：首字母 ${word.word[0]}`
      );

    }



    if(count===4){

      setHint(
        `提示：${word.word.length} 个字母`
      );

    }



    if(count>=5){

      setShowWord(true);

      speak();

    }


  };







  const master=async()=>{


    await fetch(

      `/api/english/master?id=${word.id}`,

      {
        method:"POST"
      }

    );


    window.location.reload();


  };







  return (

    <div


      className={
        `library-card english-card ${
          flip ? "flip" : ""
        }`
      }



      onMouseMove={handleMove}



      onMouseLeave={resetMove}





      style={{

        transform:

        `perspective(700px)
        rotateX(${rotate.x}deg)
        rotateY(${rotate.y}deg)`,


        "--card-color":

        emojiColor


      } as React.CSSProperties}




      onClick={(e)=>{


        if(!typing){

          setTyping(true);

          return;

        }



        if(showWord){

          setFlip(!flip);

        }


      }}



    >






      {


        !flip ? (



          <div className="english-front">


            <div className="english-emoji">

              {word.emoji}

            </div>





            <div className="word-area">



              <h2>

                {word.word}

              </h2>



              {

                !showWord && (

                  <div

                    className="marker-cover"

                    onClick={

                      e=>{

                        e.stopPropagation();

                        setTyping(true);

                      }

                    }

                  />

                )

              }





              {

                typing && !showWord && (

                  <input


                    autoFocus


                    value={answer}



                    onChange={

                      e=>setAnswer(
                        e.target.value
                      )

                    }



                    onKeyDown={

                      e=>{

                        if(e.key==="Enter"){

                          checkAnswer();

                        }

                      }

                    }



                    onClick={

                      e=>e.stopPropagation()

                    }


                  />

                )

              }



            </div>




            {

              hint && (

                <small>

                  {hint}

                </small>

              )

            }




          </div>





        ) : (



          <div className="english-back">


            <p>

              {word.example}

            </p>



            <span className="english-translation">

              {word.translation}

            </span>



          </div>



        )


      }







      <div


        className="library-actions"



        onClick={

          e=>e.stopPropagation()

        }



      >




        <button

          className="library-visit"

          onClick={speak}

        >

          <Volume2 size={16}/>

        </button>






        <button

          className="library-favorite"

          onClick={master}

        >

          <Check size={16}/>

        </button>



      </div>






    </div>

  );

}