import React, {useState,useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux';
import CreateTrip from './createTrip';
import Trip from '../subcomponents/Trip'
import { set_hPosts } from "../../Redux/Actions/action";
import ReactDOM from 'react-dom';
import Discover from '../subcomponents/Discover';
import APIService from '../../apiService'
import './styles/home.css'

const Home = () => {
  const {id, postId} = useParams();
  const loggedUser = useSelector(state => state.loggedUser)
  const isAuth = useSelector(state => state.isLogged);
  const isUpdate = useSelector(state => state.isUpdate);
  const posts = useSelector(state => state.ishposts);
  const [loaded,setLoaded] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //const [trips, setTrips] = useState([]);
  //const [followingTrips, setFollowingTrips] = useState([])



  useEffect(() => {

    /* stuff to post-getting scaleable

    async function getFollowing (){
      const response = await APIService.getFollowing(loggedUser.username)
      const allTrips = [];
      response.following.forEach(profile => {
        profile.trips.forEach(trip => allTrips.push(trip))
      })
      setFollowingTrips(allTrips);
    }
    
    getFollowing()
    
    async function getTripInfo(trip) {
      const tripObject = await APIService.getTripInfo(trip);
      return tripObject;
    }
    
    const getTrips = async () => {
      return Promise.all(followingTrips.map(trip => getTripInfo(trip)))
    }
    
    
    getTrips().then(res => console.log(res));
    */
    
    if (isAuth) {
      // // Using ReactDOM.unstable_batchedUpdates to batch the fetch and sts
      ReactDOM.unstable_batchedUpdates(() => {
        // If id is recieved as useParams prop then fetch specific user posts else if postId is recieved then fetch myCollection else home page fetch.
        APIService.populateTrips(id, postId)
          .then(resp => {
            if (!resp.error && resp.trips.length > 0) {
              dispatch(set_hPosts(resp.trips));
              if (!loaded) {
                setLoaded(true);
              }
            } else {
              navigate.push('/');  //if selected collection or userposts are 0 then display home route.
            }
          })
          .catch(err => console.log(err))
      })
    }
    // eslint-disable-next-line
}, [isAuth, isUpdate, id, postId]);  


  return(
    <div className="home trip-card">
    {
      isAuth &&
      posts && // Only display the block if user is logged in and post array has data from fetch API.
      <div>
        <div>Top Trips</div>
        <div>
          <Discover />
          </div>
          <div className="homepage" style={{ position: "relative", }}>
            {(!id && !postId) && <CreateTrip />}
            { // Mapping through the post state array to display all the posts on Page.
            posts.map(post => {
              if (loggedUser.following.indexOf(post.postedBy._id) !== -1) {
                return <Trip id={post._id} key={post._id} postId={post._id} post={post} />
              }
            })
            }
        </div>
      </div>
    }
    </div>
  )
}

export default Home