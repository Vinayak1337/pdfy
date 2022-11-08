import 'styles/globals.scss';
import { Inter } from '@next/font/google';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'], fallback: ['sans-serif'] });

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html className={inter.className}>
			<body className='w-screen h-screen flex flex-col bg-white overflow-x-hidden'>
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
				{children}
				<footer className='w-full h-12 bg-secondary pl-5'>Copyright</footer>
			</body>
		</html>
	);
}
