import React from "react";
import CommunityCard from "./CommunityCard";
import img1 from "../images/1.jpg";
import GalleryPlaceholder1 from "../images/gallery-placeholder1.png";
import GalleryPlaceholder2 from "../images/gallery-placeholder2.png";
import GalleryPlaceholder3 from "../images/gallery-placeholder3.png";
import GalleryPlaceholder4 from "../images/gallery-placeholder4.png";
import { UserContext } from "../contexts/UserContext";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import ReactPaginate from 'react-paginate'


const Community = () => {
  const [user, setUser] = useContext(UserContext)
  const [sketches, setSketches] = useState([])
  const [sketchesDisplayed, setSketchesDisplayed] = useState([])
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false)
  const sketchesPerPage = 20

  const [data, setData] = useState([])
  
  const fetchSketches = async () => {
    setLoading(true);
    await axios
      .get(`http://localhost:4000/api/users/all`)
      .then(res =>
        setData(res.data)
        // res.data.map(user => {
        //   console.log(user.username)
        //   user.sketch_ids.map(sketch => {
        //     console.log(sketch.sketch_url)
        //   })
        // })
        )
  }
  console.log(data)

  useEffect(()=>{
    fetchSketches()
  },[])

  useEffect(() => {
    setPageCount(Math.ceil(sketches.length / sketchesPerPage));
    setSketchesDisplayed(sketches.reverse().slice(pageNumber, pageNumber + sketchesPerPage))
  }, [sketches, pageNumber])

  const handlePageChange = ({selected}) => {
    setPageNumber(selected * sketchesPerPage);
  }
  //console.log(sketches)
  return (
    <>
      <div className="content-page">
        <div>
          <h1>Community artwork</h1>
          <h4>Most recent shown first:</h4>
          <div className="community-grid">
            {/* <CommunityCard artwork={GalleryPlaceholder1} title="Tan Clouds" />
            <CommunityCard artwork={GalleryPlaceholder2} title="Weird Chess" />
            <CommunityCard artwork={GalleryPlaceholder3} title="Bullseye!" />
            <CommunityCard
              artwork={GalleryPlaceholder4}
              title="Spring in the City"
            /> */}
            <div>
              {sketchesDisplayed && sketchesDisplayed
                .map(sketch => {
                  return(  
                  <>
                  <img style={{width:"300px", height:"auto"}} src={sketch.sketch_url}/>
                  </>
                )})} 
            </div>
            <ReactPaginate
              previousLabel={"previous"}
              nextLabel={"next"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={4}
              onPageChange={handlePageChange}
              containerClassName={"pagination justify-content-center"}
              pageClassName={"page-item"}
              pageLinkClassName= {"page-link"}
              pageRangeDisplayed={5}
              previousClassName= {"page-items"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              breakClassName={"break-me"}
              breakLinkClassName={"page-Link"}
              activeClassName={"active"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Community;
