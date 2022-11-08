'use client';
// import Image from 'next/image';
// import { PDFDocument } from 'pdf-lib';
import PDFIcon from 'public/images/pdf.svg';
import { NextPage } from 'next';
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';
import { DragEvent, useRef, useState } from 'react';

export default function Home() {
	const [file, setFile] = useState<File | null | boolean>(false),
		inputRef = useRef<HTMLInputElement>(null);

	const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			const file = e.dataTransfer.files[0];
			if (file?.type !== 'application/pdf') return;
			setFile(file);
		},
		handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault(),
		handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files;
			if (!files || !files.length) return;
			setFile(files[0]);
		};

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
				<div
					className={`transition-all pb-5 duration-500 flex flex-col gap-3 max-w-4xl w-full overflow-hidden ${
						file ? 'h-[80rem]' : 'h-fit'
					}`}>
					<Input />
					<Input />
					<Input />
					<Input />
					<Input />
					<Input />
					<Input />
					<Input />
					<Input />
					<div className='mt-10 flex gap-5 w-full justify-evenly flex-wrap'>
						<ThemeBtn className='!w-full md:w-fit'>Automate PDF tasks</ThemeBtn>
						<ThemeBtn className='!w-full md:w-fit'>Download PDF</ThemeBtn>
						<ThemeBtn className='!collapsew-full md:w-fit'>Download .CSV</ThemeBtn>
					</div>
				</div>
			</div>
		</div>
	);
}

const Input = () => (
	<div className='w-full bg-gray-300 rounded-lg lg:rounded-2xl py-3 px-5 flex flex-col gap-3'>
		<label htmlFor='name' className='text-secondary text-lg font-bold'>
			Title
		</label>
		<input
			value='Title'
			className='pl-3 h-10 rounded-md lg:rounded-lg bg-white outline-none focus:shadow-primary'
			type='text'
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
		className={`bg-primary h-12 rounded-md flex justify-center items-center w-fit cursor-pointer px-8 outline-none border-none ${className}`}>
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
