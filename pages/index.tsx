import { PDFDocument } from 'pdf-lib';
import PDFIcon from 'public/images/pdf.svg';
import { NextPage } from 'next';
import {
	ButtonHTMLAttributes,
	DetailedHTMLProps,
	ReactNode,
	DragEvent,
	useRef,
	useState,
	useEffect
} from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';

export default function Home() {
	const inputRef = useRef<HTMLInputElement>(null),
		[pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null),
		[pdfUri, setPdfUri] = useState<string>(''),
		[meta, setMeta] = useState(initialMeta),
		[tempMeta, setTempMeta] = useState(initialMeta),
		[hasMetaChanged, setHasMetaChanged] = useState(false);

	const handleFile = async (file: File) => {
			const arrayBuffer = await file.arrayBuffer();
			const pdfDoc = await PDFDocument.load(arrayBuffer);
			setPdfDoc(pdfDoc);
			setPdfUri(URL.createObjectURL(file));
			const creator = pdfDoc.getCreator() || '';
			const producer = pdfDoc.getProducer() || '';
			const title = pdfDoc.getTitle() || '';
			const subject = pdfDoc.getSubject() || '';

			const meta = {
				Author: pdfDoc.getAuthor() || '',
				Creator: fallbackTexts.includes(creator) ? '' : creator,
				Keywords: pdfDoc.getKeywords() || '',
				Producer: fallbackTexts.includes(producer) ? '' : producer,
				Subject: fallbackTexts.includes(subject) ? '' : subject,
				Title: fallbackTexts.includes(title) ? '' : title,
				'File Name': file.name.replace('.pdf', ''),
				'File Size': file.size,
				Pages: pdfDoc.getPageCount(),
				Encrypted: pdfDoc.isEncrypted,
				'Created On': pdfDoc.getCreationDate()?.toLocaleString() || '-',
				'Modified On': pdfDoc.getModificationDate()?.toLocaleString() || '-'
			};

			setTempMeta(meta);

			setMeta({
				...meta,
				Creator: creator,
				Producer: producer,
				Subject: subject,
				Title: title
			});
		},
		handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			const file = e.dataTransfer.files[0];
			if (file?.type !== 'application/pdf') return;
			handleFile(file);
		},
		handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault(),
		handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files;
			if (!files || !files.length || files[0]?.type !== 'application/pdf')
				return;
			handleFile(files[0]);
		},
		handleMetaChange = ({
			target: { value, name }
		}: React.ChangeEvent<HTMLInputElement>) =>
			setTempMeta(prevState => ({
				...prevState,
				[name]: value
			})),
		downloadCsv = () => {
			const csv = Object.entries(tempMeta)
				.map(
					([key, value]) => `${JSON.stringify(key)},${JSON.stringify(value)}`
				)
				.join('\n');
			const blob = new Blob([csv], { type: 'text/csv' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = tempMeta['File Name'] + '.csv';
			a.click();
		},
		handleSave = () => {
			if (!pdfDoc) return;
			setMeta(tempMeta);

			pdfDoc.setAuthor(tempMeta.Author);
			pdfDoc.setCreator(tempMeta.Creator);
			pdfDoc.setKeywords(tempMeta.Keywords.split(/\s+/));
			pdfDoc.setProducer(tempMeta.Producer);
			pdfDoc.setSubject(tempMeta.Subject);
			pdfDoc.setTitle(tempMeta.Title);
		},
		downloadPdf = async () => {
			if (!pdfDoc) return;
			const pdfBytes = await pdfDoc.save();
			const blob = new Blob([pdfBytes], { type: 'application/pdf' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = tempMeta['File Name'] + '.pdf';
			a.click();
		},
		redirectToNanonets = () =>
			window.open('https://app.nanonets.com/#/signup/');

	useEffect(() => {
		for (const [key, value] of Object.entries(meta)) {
			const tempValue = tempMeta[key as keyof typeof meta];
			if (
				typeof value === 'string' &&
				typeof tempValue === 'string' &&
				fallbackTexts.includes(value) &&
				!tempValue
			)
				continue;

			if (tempValue !== value) {
				setHasMetaChanged(true);
				break;
			}

			setHasMetaChanged(false);
		}
	}, [meta, tempMeta]);

	return (
		<div className='flex flex-col items-center pb-10'>
			<h1 className='text-secondary mt-8 text-3xl font-bold text-center'>
				PDF metadata
			</h1>
			<p className='mt-4 max-w-xs lg:max-w-none text-center text-base text-tertiary'>
				Extract PDF metadata of the uploaded files
			</p>
			<div className='pt-16 gap-14 px-8 w-full flex flex-col justify-center items-center'>
				<div
					onDragOver={handleDragOver}
					onDrop={handleDragEnd}
					onDragEnd={handleDragEnd}
					onClick={() => inputRef.current?.click()}
					draggable
					className='flex flex-col justify-evenly items-center cursor-pointer max-w-4xl h-80 border-2 border-dashed border-gray-1 bg-white-1 rounded-2xl w-full'>
					<PDFIcon />
					<p className='text-secondary text-lg font-bold text-center'>
						<span>Drag and drop or click to upload</span>
						<br />
						<span>(Supports only PDF format)</span>
					</p>
					<ThemeBtn>Upload PDF</ThemeBtn>
					<input
						onChange={handleFileChange}
						ref={inputRef}
						type='file'
						accept='application/pdf'
						hidden
					/>
				</div>
				{pdfDoc && (
					<div className='transition-all justify-center max-w-7xl pb-5 duration-500 flex flex-col lg:flex-row gap-3 w-full h-fit'>
						<div className='border rounded-md w-full lg:w-1/2 h-[40rem] text-black'>
							{pdfUri && (
								<Worker workerUrl='https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js'>
									<Viewer fileUrl={pdfUri} />
								</Worker>
							)}
						</div>
						<div className='w-full lg:w-1/2 h-fit text-primary text-lg font-medium flex flex-col gap-4'>
							{Object.entries(tempMeta).map(([label, value], i) => (
								<Input
									handleChange={handleMetaChange}
									key={label + i}
									label={label}
									value={value}
								/>
							))}

							<div className='mt-10 flex gap-5 w-full justify-evenly flex-wrap'>
								<ThemeBtn
									onClick={redirectToNanonets}
									className='!w-full md:!w-fit'>
									Automate PDF tasks
								</ThemeBtn>
								<ThemeBtn
									onClick={hasMetaChanged ? handleSave : downloadPdf}
									className='!w-full md:!w-fit min-w-[172px]'>
									{hasMetaChanged ? 'Save' : 'Download PDF'}
								</ThemeBtn>
								<ThemeBtn
									onClick={downloadCsv}
									disabled={hasMetaChanged}
									className='!w-full md:!w-fit'>
									Download .CSV
								</ThemeBtn>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

const initialMeta = {
		Author: '',
		Creator: '',
		Keywords: '',
		Producer: '',
		Subject: '',
		Title: '',
		'Created On': '',
		'File Name': '',
		'File Size': 0,
		Pages: 0,
		Encrypted: false,
		'Modified On': ''
	},
	disabledKeys = [
		'Pages',
		'Encrypted',
		'File Size',
		'Modified On',
		'Created On'
	],
	fallbackTexts = [
		'pdf-lib (https://github.com/Hopding/pdf-lib)',
		'PDF Metadata viewer Tool'
	];

const Input: NextPage<{
	label: string;
	value: string | number | boolean;
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, value, handleChange }) => (
	<div key={label} className='flex gap-5'>
		<label className='w-40'>{label}</label>
		<input
			key={label}
			onChange={handleChange}
			placeholder={
				label === 'Keywords'
					? 'Enter Keywords (separated by space)'
					: 'Enter ' + label
			}
			name={label}
			disabled={disabledKeys.includes(label)}
			className='pl-2 caret-primary w-full border-primary border-[0.1px] rounded-md outline-none text-black bg-white text-lg font-medium disabled:opacity-70 disabled:cursor-not-allowed'
			type='text'
			value={value.toString()}
		/>
	</div>
);

const ThemeBtn: NextPage<ThemeBtnProps> = ({
	children,
	className = '',
	...restProps
}) => (
	<button
		{...restProps}
		className={`bg-primary h-12 rounded-md flex justify-center items-center w-fit cursor-pointer px-8 outline-none border-none disabled:opacity-80 disabled:cursor-not-allowed ${className}`}>
		<p className='text-white text-base text-center font-semibold'>{children}</p>
	</button>
);

interface ThemeBtnProps
	extends DetailedHTMLProps<
		ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	children: ReactNode;
}
