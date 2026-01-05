import { Heading } from "../components/Heading"
import { SubHeading } from "../components/SubHeading"
import { Button } from "../components/Button"
import { InputBox } from "../components/InputBox"
import { BottomWarning } from "../components/BottomWarning"

export const SignUp = () => {
    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading title="Sign Up" />
                <SubHeading message="Enter your information to Create your account" />
                <InputBox title="First Name" placeholder="Enter your first name" value="" />
                <InputBox title="Last Name" placeholder="Enter your last name" value="" />
                <InputBox title="Email" placeholder="Enter your email" value="" />
                <InputBox title="Password" placeholder="Enter your password" value="" />
                <div className="pt-4">
                    <Button label="Sign Up" />
                </div>
                <BottomWarning warningMessage="Already have an account? " buttonText="Sign In" to="/signin" />
            </div>
        </div>
    </div>
}