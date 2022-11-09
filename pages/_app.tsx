import 'styles/globals.scss';
import type { AppProps } from 'next/app';
import Image from 'next/image';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<div className='w-screen h-screen flex flex-col bg-white overflow-x-hidden'>
			<nav className='w-full max-w-7xl self-center h-16 flex pt-3 pl-3'>
				<Image
					className='self-center'
					width={123}
					height={32}
					priority
					src='/images/nanonets.png'
					alt='logo'
					placeholder='blur'
					blurDataURL='/images/nanonets.png'
				/>
			</nav>
			<Component {...pageProps} />
			<footer className='w-full h-12 bg-secondary pl-5'>Copyright</footer>
		</div>
	);
}
