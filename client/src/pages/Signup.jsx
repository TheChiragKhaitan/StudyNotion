import signupImg from "../assets/Images/signup.webp"
import Footer from "../components/common/Footer"
import Template from "../components/core/Auth/Template"

function Signup() {
  return (
    <div>
      
      <div className='mb-20'>
      <Template
      title="Join the millions learning to code with StudyNotion for free"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={signupImg}
      formType="signup"
    />
      </div>
      <Footer/>
    </div>
    
  )
}

export default Signup