export default function Cuisine({ cuisine }) {
	return (
		<div className='w-[300px] cursor-pointer group hover:scale-110 relative duration-500 ease-in-out transition-all transform'>
			<img className='rounded-[25px]' src={`${cuisine}.jpg`} alt={`${cuisine}`} />
			<div className='group-hover:bg-gradient-to-b from-transparent from-0% to-white to-110% rounded-[25px] w-full h-full absolute top-[0.1%] '>
				<strong className='opacity-0 group-hover:opacity-100 -z-1 group-hover:z-1 absolute bottom-0 group-hover:bottom-3 left-3 text-[1.5em] duration-500 ease-in-out transition-all transform'>
					{cuisine}
				</strong>
			</div>
		</div>
	);
}
