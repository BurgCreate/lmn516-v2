export default function SiteCard({ site }: any) {

  const favicon =
    site.domain
      ? `https://www.google.com/s2/favicons?domain=${site.domain}&sz=64`
      : null;


  return (
    <div className="library-card">

      <a
        href={site.url}
        target="_blank"
        className="library-card-link"
      >

        <div className="library-card-main">


          <div className="library-card-title">

            {favicon && (
              <img
                src={favicon}
                alt={site.name}
                className="library-card-icon"
              />
            )}


            <h2>
              {site.name}
            </h2>

          </div>


          <p>
            {site.description}
          </p>


        </div>



        <div className="library-card-bottom">

          <span>
            {site.category}
          </span>


          <span>
            →
          </span>

        </div>


      </a>

    </div>
  );
}