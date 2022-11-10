import 'styles/globals.css';
import type { AppProps } from 'next/app';
import Image from 'next/image';

import { Inter } from '@next/font/google';
const inter = Inter({ subsets: ['latin'], fallback: ['sans-serif'] });

export default function App({ Component, pageProps }: AppProps) {
	return (
		<div
			className={
				inter.className +
				'w-screen min-h-screen flex flex-col overflow-x-hidden justify-between'
			}>
			<div className='flex flex-col'>
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
			</div>
			<footer className='w-full h-12 bg-secondary pl-5 pt-3 text-white'>
				Copyright
			</footer>
		</div>
	);
}
