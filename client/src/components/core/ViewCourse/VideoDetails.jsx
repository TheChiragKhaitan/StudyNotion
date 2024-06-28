import React from 'react'
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { ControlBar, Player } from 'video-react';
import { useLocation } from 'react-router';
import { useRef } from 'react';
// import '~video-react/dist/video-react.css'; // import css
import { BigPlayButton, LoadingSpinner, PlaybackRateMenuButton, ForwardControl, ReplayControl, CurrentTimeDisplay, TimeDivider } from 'video-react';
import {BiSkipPreviousCircle} from 'react-icons/bi';
import {BiSkipNextCircle} from 'react-icons/bi';
import {MdOutlineReplayCircleFilled} from 'react-icons/md';
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { setCompletedLectures, updateCompletedLectures } from '../../../slices/viewCourseSlice';
import { useDispatch } from 'react-redux';
import IconBtn from '../../common/IconBtn';


const VideoDetails = () => {
  const {courseId, sectionId, subSectionId} = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const {token} = useSelector(state => state.auth);
  // console.log("user",user._id);
  const {courseSectionData, courseEntireData, completedLectures, totalNoOfLectures} = useSelector(state => state.viewCourse);
  const navigate = useNavigate();
  const playerRef = React.useRef(null);

  const [videoData, setVideoData] = useState([]);
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect (() => {
      if (courseSectionData.length === 0) {
          return;
      }
      if (!courseId && !sectionId && !subSectionId) {
          navigate(`/dashboard/enrolled-courses`)
      }
      else{
          const filteredSection = courseSectionData?.filter((section) => section._id === sectionId);
          // console.log("filtered Section: ",filteredSection?.[0])
          const filteredSubsection = filteredSection?.[0]?.subSection?.filter((subsection) => subsection._id === subSectionId);
          
          setVideoData(filteredSubsection?.[0]);
          //console.log("filtered Sub Section: ",filteredSubsection[0]);
          setPreviewSource(courseEntireData.thumbnail)
          //console.log("1", courseEntireData.thumbnail)
          setVideoEnded(false);
      }            
  }, [courseSectionData, sectionId, subSectionId]);


  const isLastLecture = () => {
     const currentSectionIndex = courseSectionData?.findIndex((section) => section._id === sectionId);
      const currentSubsectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex((subsection) => subsection._id === subSectionId);
      if (currentSubsectionIndex === courseSectionData[currentSectionIndex]?.subSection?.length - 1  && currentSectionIndex === courseSectionData?.length - 1) {
        // console.log("last lecture");
        return true;
      }else {
        // console.log("not last lecture");
        return false;
      }
  }
  
  
  const isFirstLecture = () => {
      const currentSectionIndex = courseSectionData?.findIndex((section) => section._id === sectionId);
      const currentSubsectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex((subsection) => subsection._id === subSectionId);
      if (currentSubsectionIndex === 0  && currentSectionIndex === 0) {
          // console.log("first lecture");
          return true;
      }else {
          // console.log("not first lecture");
          return false;
      }
  }

  const nextLecture = () => {
      if (isLastLecture()) {
          return;
      }
      const currentSectionIndex = courseSectionData?.findIndex((section) => section._id === sectionId);
      const currentSubsectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex((subsection) => subsection._id === subSectionId);
      if (currentSubsectionIndex === courseSectionData[currentSectionIndex]?.subSection.length - 1) {
          const nextSectionId = courseSectionData[currentSectionIndex + 1]?._id;
          const nextSubSectionId = courseSectionData[currentSectionIndex + 1]?.subSection[0]._id;
          navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`);
      }else {
          const nextSectionId = courseSectionData[currentSectionIndex]._id;
          const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubsectionIndex + 1]._id;
          navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`);
      }
  }

  const previousLecture = () => {
    if (isFirstLecture()) {
        return;
    }
    const currentSectionIndex = courseSectionData?.findIndex((section) => section._id === sectionId);
    const currentSubsectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex((subSection) => subSection._id === subSectionId);
    if (currentSubsectionIndex === 0) {
        const previousSectionId = courseSectionData[currentSectionIndex - 1]._id;
        const previousSubSectionId = courseSectionData[currentSectionIndex - 1]?.subSection[courseSectionData[currentSectionIndex - 1].subSection.length - 1]._id;
        navigate(`/view-course/${courseId}/section/${previousSectionId}/sub-section/${previousSubSectionId}`);
    }else {
        const previousSectionId = courseSectionData[currentSectionIndex]?._id;
        const previousSubSectionId = courseSectionData[currentSectionIndex]?.subSection[currentSubsectionIndex - 1]._id;
        navigate(`/view-course/${courseId}/section/${previousSectionId}/sub-section/${previousSubSectionId}`);
    }
  }


  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  //set video end to false when .play() is called
 
   
  return (
    <div className='md:w-[calc(100vw-320px)] w-screen p-3 flex flex-col gap-5 text-white'>
      {
        !videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) :
        (
          <div>
            <Player className="w-full relative"
              ref={playerRef}
              src={videoData?.videoUrl}
              aspectRatio="16:9"
              fluid={true}
              playsInline
              autoPlay={false}
              onEnded={() => setVideoEnded(true)}
            >
              
              <BigPlayButton position="center" />

              <LoadingSpinner />
              <ControlBar>
                <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1} />
                <ReplayControl seconds={5} order={7.1} />
                <ForwardControl seconds={5} order={7.2} />
                <TimeDivider order={4.2} />
                <CurrentTimeDisplay order={4.1} />
                <TimeDivider order={4.2} />
              </ControlBar>
              {
                videoEnded && (
                  <div className='flex justify-center items-center'>
                  <div className='flex justify-center items-center'>
                    {
                      !completedLectures.includes(subSectionId) && (
                        <button onClick={()=>{handleLectureCompletion()}} className='bg-yellow-100 text-richblack-900 absolute top-[40%] hover:scale-90 z-20 font-bold font-inter font-large text-lg md:text-medium px-4 py-2 rounded-md'>Mark as Completed</button>
                      )
                    }
                  </div>
                  {
                    !isFirstLecture() && (
                      <div className=' z-20 left-0 top-1/2 transform -translate-y-1/2 absolute m-5'>
                        <BiSkipPreviousCircle onClick={previousLecture} className=" text-2xl md:text-5xl bg-richblack-600 rounded-full cursor-pointer hover:scale-90"/>
                        {/* <button onClick={previousLecture} className='bg-blue-500 text-white px-4 py-2 rounded-md'>Previous Lecture</button> */}
                      </div>
                    )

                  }
                  {
                    !isLastLecture() && (
                      <div className=' z-20 right-4 top-1/2 transform -translate-y-1/2 absolute m-5'>
                        <BiSkipNextCircle onClick={nextLecture} className="text-2xl md:text-5xl bg-richblack-600 rounded-full cursor-pointer hover:scale-90"/>
                        {/* <button onClick={nextLecture} className='bg-blue-500 text-white px-4 py-2 rounded-md'>Next Lecture</button> */}
                        </div>
                    )
                  }
                  {
                    <MdOutlineReplayCircleFilled onClick={() =>{ playerRef.current.seek(0);playerRef.current.play();setVideoEnded(false)}} className="text-2xl md:text-5xl bg-richblack-600 rounded-full cursor-pointer hover:scale-90 absolute top-1/2 z-20"/>
                  }
                  </div>
                )
              }
            </Player>
          </div>
        )
      }
      {/* video title and desc */}
      <div className='mt-5'>
        <h1 className='text-3xl font-semibold text-richblack-25'>{videoData?.title}</h1>
        <p className='pt-2 pb-6 text-gray-500 text-richblack-100'>{videoData?.description}</p>
        </div>
    </div>
  )
}

export default VideoDetails