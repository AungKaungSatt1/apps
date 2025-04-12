import { Eye } from "phosphor-react";
import Footer from "../components/Footer";

export default function Login() {
	return (
		<>
			<img
				className='absolute -z-1 end-[105px] bottom-0'
				src='/Meal_1.png'
				alt='Meal 1 photo'
			/>
			<img
				className='absolute -z-1 end-[165px] top-30'
				src='/Meal_2.png'
				alt='Meal 2 photo'
			/>
			<img
				className='absolute -z-1 top-40 start-[100px]'
				src='/Meal_3.png'
				alt='Meal 3 photo'
			/>
			<div className='mt-[130px] mb-[100px] mx-auto rounded-[15px] bg-[rgb(237,242,244,0.6)] p-[25px] w-[400px] border border-white backdrop-blur-[5px] h-[435px]'>
				<strong className='text-center block text-[2em]'>Log In</strong>

				<label className='block mt-[5px] mb-[10px] text-[1.3em]'>Email</label>
				<input
					className='bg-(--white) py-[7px] px-[15px] rounded-[5px] w-full'
					type='text'
					placeholder='example@gmail.com...'
					name='gmail'
				/>

				<label className='block mt-[20px] mb-[10px] text-[1.3em]'>Password</label>
				<div className='flex relative mb-[20px]'>
					<input
						className='bg-(--white) py-[7px] px-[15px] rounded-[5px] w-full'
						type='password'
						placeholder='Password...'
						name='password'
					/>
					<Eye className='absolute end-3 top-[25%] cursor-pointer' size='1.2em' />
				</div>
				<button className='w-full bg-(--secondary-color) text-(--white) py-[10px] rounded-[10px] cursor-pointer mb-[5px]'>
					<b>Login</b>
				</button>
				<a href='/meals' className='block text-end underline text-blue-700'>
					Forgot Password?
				</a>
				<strong className='block text-center mt-[20px] text-[1.2em]'>
					Don't have an account?{" "}
					<a href='/signup' className='underline font-medium text-blue-700'>
						Sign Up
					</a>
					!
				</strong>
			</div>
			<Footer />
		</>
	);
}
