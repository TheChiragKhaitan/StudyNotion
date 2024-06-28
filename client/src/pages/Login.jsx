import loginImg from "../assets/Images/login.webp"
import Template from "../components/core/Auth/Template"
import Footer from "../components/common/Footer"

function Login() {
  return (
    <div>
      <Template
      title="Welcome Back"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={loginImg}
      formType="login"
    />
    <Footer/>
    </div>
    
  )
}

export default Login