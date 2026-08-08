import EnglishWordCard from "./EnglishWordCard";


export default function EnglishView({
  words
}:{
  words:any[]
}){

  return (

    <div className="library-grid">

      {
        words.map(word=>(

          <EnglishWordCard

            key={word.id}

            word={word}

          />

        ))
      }

    </div>

  );

}