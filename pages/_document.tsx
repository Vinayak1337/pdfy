import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
	render = () => (
		<Html lang='en' className='scroll-smooth'>
			<Head>
				<meta charSet='utf-8' />
				<meta name='robots' content='index, follow' />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

export default MyDocument;
