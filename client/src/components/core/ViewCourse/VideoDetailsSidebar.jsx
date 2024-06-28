import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import IconBtn from "../../common/IconBtn";
import { FaChevronLeft, FaAngleDoubleRight } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const VideoDetailsSidebar = ({ setReviewModal }) => {
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId, subSectionId } = useParams();
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    if (!courseSectionData.length) return;
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndx = courseSectionData?.[
      currentSectionIndx
    ]?.subSection.findIndex((data) => data._id === subSectionId);
    const activeSubSectionId =
      courseSectionData[currentSectionIndx]?.subSection?.[currentSubSectionIndx]
        ?._id;
    setActiveStatus(courseSectionData?.[currentSectionIndx]?._id);
    setVideoBarActive(activeSubSectionId);
  }, [
    courseSectionData,
    courseEntireData,
    location.pathname,
    sectionId,
    subSectionId,
  ]);

  const handleClickOutside = () => {
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  useEffect(() => {
    // Add event listener to handle clicks outside the sidebar
    const handleOutsideClick = (event) => {
      if (event.target.closest(".offSidebar1") === null) {
        setShowSidebar(false);
      }
    };

    if (showSidebar) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showSidebar]);

  return (
    <>
      <div
        className={`${showSidebar ? "" : "hidden"} w-6 h-72 md:hidden relative`}
      >
        <FaAngleDoubleRight
          onClick={() => {
            setShowSidebar(!showSidebar);
          }}
          className={`md:hidden z-10 cursor-pointer text-2xl text-richblack-900 m-2 bg-richblack-100 rounded-full p-1 top-3 absolute -left-1`}
        />
      </div>
      <div
        className={`${
          showSidebar ? "h-0 w-0" : "h-[calc(100vh-3.5rem)] w-[320px]"
        } transition-all duration-700 z-20 relative offSidebar1`}
      >
        <div
          className={`${
            showSidebar ? "hidden" : ""
          } transition-all origin-right duration-500 flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 offSidebar2`}
        >
          <div
            className={`${
              showSidebar ? "hidden" : ""
            } mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25 offSidebar2`}
          >
            <div className="flex w-full items-center justify-between ">
              <div className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90">
                <FaChevronLeft
                  className="cursor-pointer md:hidden"
                  onClick={() => {
                    setShowSidebar(true);
                  }}
                />
                <FaChevronLeft
                  className="cursor-pointer hidden md:block"
                  onClick={() => {
                    navigate(`/dashboard/enrolled-courses`);
                  }}
                />
              </div>
              <IconBtn
                text="Add Review"
                customClasses={"ml-auto"}
                onclick={() => setReviewModal(true)} // Corrected onClick handler
              />
            </div>
            <div className="flex flex-col">
              <p>{courseEntireData?.courseName}</p>
              <p className="text-sm font-semibold text-richblack-500">
                {completedLectures?.length} of {totalNoOfLectures} Lectures
                Completed
              </p>
            </div>
          </div>
          <div className="h-[calc(100vh - 5rem)] overflow-y-auto px-2">
            {courseSectionData?.map((section, sectionIndex) => (
              <details
                key={sectionIndex}
                className="appearance-none text-richblack-5 detailanimatation"
              >
                <summary
                  className="mt-2 cursor-pointer text-sm text-richblack-5 appearance-none"
                  onClick={() => setActiveStatus(section?._id)}
                >
                  <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                    <p className="w-[70%] font-semibold">
                      {section?.sectionName}
                    </p>
                    <div className="flex items-center gap-3">
                      <MdOutlineKeyboardArrowDown className="arrow" />
                    </div>
                  </div>
                </summary>
                {activeStatus === section?._id && (
                  <div className="transition-[height] duration-500 ease-in-out">
                    {section.subSection.map((topic, topicIndex) => (
                      <div
                        className={`flex gap-3 px-5 py-2 ${
                          videoBarActive === topic._id
                            ? "bg-yellow-200 font-semibold text-richblack-800"
                            : "bg-richblack-800 "
                        } `}
                        key={topicIndex}
                        onClick={() => {
                          navigate(
                            `/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`
                          );
                          setVideoBarActive(topic._id);
                        }}
                      >
                        <span>{`${topicIndex + 1}. ${topic.title}`}</span>
                      </div>
                    ))}
                  </div>
                )}
              </details>
            ))}
          </div>
        </div>
      </div>
      <div
        onClick={handleClickOutside}
        className={`${
          showSidebar ? "hidden" : ""
        } fixed top-0 left-0 w-full h-full bg-richblack-900 bg-opacity-50 z-10 offSidebar3 md:hidden`}
      ></div>
    </>
  );
};

export default VideoDetailsSidebar;
