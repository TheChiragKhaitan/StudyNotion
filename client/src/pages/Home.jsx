import React from 'react'
import {FaArrowRight} from "react-icons/fa"
import {Link} from "react-router-dom";
import { HighlightedText } from '../components/core/Homepage/HighlightedText';
import CTAButton from '../components/core/Homepage/Button';
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from '../components/core/Homepage/Codeblocks';
import ExploreMore  from '../components/core/Homepage/ExploreMore';
import Footer from '../components/common/Footer';
import ReviewSlider from '../components/common/ReviewSlider';
import TimelineSection from '../components/core/Homepage/Timeline';
import LearningLanguageSection from '../components/core/Homepage/LearningLanguageSection';
import InstructorSection from '../components/core/Homepage/InstructorSection';


const Home = () => {
  return (
    <div >
        {/*Section 1*/}
        <div className='relative mx-auto max-w-maxContent flex flex-col w-11/12 items-center text-white justify-between'>
            
            {/* Instructor Button*/}
            <Link to={"/signup"}>
                <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 
                drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none w-fit'>
                    <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
                    transition-all duration-200 group-hover:bg-richblack-900'>
                        <p>Become an Instructor</p>
                        <FaArrowRight/>
                    </div>
                </div>
            </Link>

            {/* Heading */}
            <div className='text-center text-3xl md:text-4xl font-semibold mt-7'>
                Empower Your Future with <HighlightedText text={"Coding Skills"}/>
            </div>

            {/* Sub-Heading */}
            <div className='mt-4 w-[90%] text-left md:text-center text-sm md:text-lg font-bold text-richblack-300'>
                With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
            </div>

            {/* Button */}
            <div className='flex flex-row gap-7 mt-8'>
                <CTAButton linkto={"/signup"} active={true}>
                    Learn More
                </CTAButton>
                <CTAButton linkto={"/login"} active={false}>
                    Book a Demo
                </CTAButton>
            </div>

            {/* Video */}
            <div className="mx-3 my-12 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
                <video
                    className="shadow-[20px_20px_rgba(255,255,255)]"
                    muted
                    loop
                    autoPlay>
                    <source src={Banner} type="video/mp4" />
                </video>
            </div>

            {/*Codeblocks-1*/}
            <div>
                <CodeBlocks position = {"lg:flex-row"}
                    heading = {<div className='text-4xl font-semibold'>
                                    Unlock Your <HighlightedText text={"coding potential"}/>  with our online courses.
                                </div>
                            }
                    subheading = { "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
                    ctabtn1 = { { btnText: "Try it Yourself",  linkto: "/signup",  active: true, } }
                    ctabtn2 = { { btnText: "Learn More",  linkto: "/login",  active: false, } }
                    codeblock = {`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a>\n<a href="/three">Three</a>\n</nav>\n</body>`}
                    codeColor = {"text-pink-50"}
                    backgroundGradient = {<div className = "codeblock1 absolute"></div>}
                />
            </div>

            {/*Codeblocks-2*/}
            <div>
                <CodeBlocks position = {"lg:flex-row-reverse"}
                    heading = {<div className="w-[100%] text-4xl font-semibold lg:w-[35%]">
                                    Start <HighlightedText text={"coding in seconds"} />
                                </div>
                            }
                    subheading = { "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
                    ctabtn1 = { { btnText: "Continue Lesson",  linkto: "/signup",  active: true, } }
                    ctabtn2 = { { btnText: "Learn More",  linkto: "/login",  active: false, } }
                    codeblock = {`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                    codeColor = {"text-white"}
                    backgroundGradient={<div className = "codeblock2 absolute"></div>}
                />
            </div>
            
            {/*Explore More*/}
            <ExploreMore/>
        </div>

        {/*Section 2*/}
        <div className="bg-pure-greys-5 text-richblack-700">
            <div className="homepage_bg h-[320px]">

                {/* Explore Full Catagory Section */}
                <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
                    <div className="lg:h-[150px]"></div>
                    <div className="flex flex-row gap-7 text-white lg:mt-8">
                        <CTAButton active={true} linkto={"/signup"}>
                            <div className="flex items-center gap-2">
                                Explore Full Catalog
                                <FaArrowRight />
                            </div>
                        </CTAButton>
                        <CTAButton active={false} linkto={"/login"}>
                            Learn More
                        </CTAButton>
                    </div>
                </div>
            </div>

            <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 ">
            
                {/* Job that is in Demand - Section 1 */}
                <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
                    <div className="text-4xl font-semibold lg:w-[45%] ">
                        Get the skills you need for a{" "}
                        <HighlightedText text={"job that is in demand."} />
                    </div>
                    <div className="flex flex-col items-start gap-10 lg:w-[40%]">
                        <div className="text-[16px]">
                            The modern StudyNotion is the dictates its own terms. Today, to
                            be a competitive specialist requires more than professional
                            skills.
                        </div>
                        <CTAButton active={true} linkto={"/signup"}>
                            <div className="">Learn More</div>
                        </CTAButton>
                    </div>
                </div>

                {/* Timeline Section */}
                <TimelineSection />
                {/* Learning Language Section */}
                <LearningLanguageSection />
            </div>
        </div>
        
        {/*Section 3*/}
        <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
            {/* Become a instructor section */}
            <InstructorSection />

            {/* Reviws from Other Learner */}
            <h1 className="text-center text-4xl font-semibold mt-[120px]">
                Reviews from other learners
            </h1>
            <ReviewSlider />
        </div>
        
        {/* Footer */}
        <Footer />
    
    </div>
  )
}

export default Home
