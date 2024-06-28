import React, { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setCompletedLectures, 
  setCourseSectionData, 
  setEntireCourseData, 
  setTotalNoOfLectures 
} from '../slices/viewCourseSlice';
import ReviewModal from '../components/core/ViewCourse/ReviewModal';
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSidebar';
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI';

const ViewCourse = () => {
  const [reviewModal, setReviewModal] = useState(false);
  const { courseId } = useParams();
  const { token } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const setCourseSpecifics = async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token);
      dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
      dispatch(setEntireCourseData(courseData.courseDetails));
      dispatch(setCompletedLectures(courseData.completedVideos));
      let lecture = 0;
      courseData?.courseDetails?.courseContent?.forEach(section => {
        lecture += section?.subSection?.length;
      });
      dispatch(setTotalNoOfLectures(lecture));
    };
    setCourseSpecifics();
  }, [courseId, token, dispatch]);

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        <VideoDetailsSidebar setReviewModal={setReviewModal} />
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-6">
            <Outlet />
          </div>
        </div>
      </div>
      {reviewModal && <ReviewModal setReviewModal={setReviewModal} />}
    </>
  );
};

export default ViewCourse;
