import React from "react";
import { FooterLink2 } from "../../data/footer-links";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Images
import Logo from "../../assets/Logo/Logo-Full-Light.png";

// Icons
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import {MdEmail} from "react-icons/md";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
    "Articles",
    "Blog",
    "Chart Sheet",
    "Code challenges",
    "Docs",
    "Projects",
    "Videos",
    "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];



const Footer = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const helpCenterLink = document.getElementById("help-center-link");

    const handleClick = (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        navigate("/contact");
      }, 500);
    };

    if (helpCenterLink) {
      helpCenterLink.addEventListener("click", handleClick);
    }

    return () => {
      if (helpCenterLink) {
        helpCenterLink.removeEventListener("click", handleClick);
      }
    };
  }, [navigate]);

  return (
    <div className="bg-richblack-800">
      <div className="flex lg:flex-row gap-8 items-center justify-between w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto relative py-14">
        <div className="border-b w-[100%] flex flex-col lg:flex-row pb-5 border-richblack-700">
          {/* Section 1 */}
          <div className="lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r lg:border-richblack-700 pl-3 lg:pr-5 gap-3">
            <div className="w-[30%] flex flex-col gap-3 lg:w-[30%] mb-7 lg:pl-0">
              <img src={Logo} alt="" className="object-contain" />
              <h1 className="text-richblack-50 font-semibold text-[16px]">
                Company
              </h1>
              <div className="flex flex-col gap-2">
                {["About", "Careers", "Affiliates"].map((element, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={`/${element.toLowerCase()}`}>{element}</Link>

                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3 text-lg">
               {/*Link these Icons */}
                
                <a href="https://www.linkedin.com/in/chirag-khaitan" target="_blank"><FaLinkedin /></a>
                <a href="https://www.instagram.com/thechiragkhaitan" target="_blank"><FaInstagram /></a>
                <a href="https://github.com/TheChiragKhaitan" target="_blank"><FaGithub /></a>
                <a href="mailto:chiragkhaitan2014@gmail.com"><MdEmail /></a>
              </div>
              <div></div>
            </div>

            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h1 className="text-richblack-50 font-semibold text-[16px]">
                Resources
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                {Resources.map((element, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={"/"}>
                        {element}
                      </Link>
                    </div>
                  );
                })}
              </div>

              <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">
                Support
              </h1>
              <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200 mt-2">
                <a href="/contact" id="help-center-link">Help Center</a>
              </div>
            </div>

            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h1 className="text-richblack-50 font-semibold text-[16px]">
                Plans
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                {Plans.map((element, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={"/login"}>
                        {element}
                      </Link>
                    </div>
                  );
                })}
              </div>
              <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">
                Community
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                {Community.map((element, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={"/login"}>
                        {element}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">
            {FooterLink2.map((element, index) => {
              return (
                <div key={index} className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                  <h1 className="text-richblack-50 font-semibold text-[16px]">
                    {element.title}
                  </h1>
                  <div className="flex flex-col gap-2 mt-2">
                    {element.links.map((link, index) => {
                      return (
                        <div
                          key={index}
                          className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                        >
                          {element.title === "Career building"? (<Link to="/login">{link.title}</Link>) :(<Link to={`/catalog${link.link}`}>{link.title}</Link>)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto  pb-14 text-sm">
        {/* Section 1 */}
        <div className="flex justify-between lg:items-start items-center flex-col lg:flex-row gap-3 w-full">
          <div className="flex flex-row">
            {BottomFooter.map((element, index) => {
              return (
                <div
                  key={index}
                  className={` ${
                    BottomFooter.length - 1 === index
                      ? ""
                      : "border-r border-richblack-700 cursor-pointer hover:text-richblack-50 transition-all duration-200"
                  } px-3 `}
                >
                  <Link to={"/about"}>
                    {element}
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="text-center">Made with ❤️ Chirag Khaitan © 2024 Studynotion</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;