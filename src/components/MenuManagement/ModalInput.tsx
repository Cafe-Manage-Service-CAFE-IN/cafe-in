import { ChangeEvent, useRef, KeyboardEvent } from 'react';
import styled from 'styled-components';
import { MenuType } from '../../types/menuMangementType';
import { useRecoilValue } from 'recoil';
import { categoryListState } from '../../state/CategoryList';
import useInput, { BindMenuType } from '../../hooks/useInput';

type ModalInputPropType = {
	menuInfo: MenuType;
	bindMenu: BindMenuType;
	bindFile: BindMenuType;
	resetFile: () => void;
};

function ModalInput({ menuInfo, bindMenu, bindFile, resetFile }: ModalInputPropType) {
	const [imgSrc, bindImage, resetImage] = useInput(menuInfo.imageUrl ? menuInfo.imageUrl : '');

	const categoryList = useRecoilValue(categoryListState);

	const instockRef = useRef<HTMLButtonElement>(null);
	const soldoutRef = useRef<HTMLButtonElement>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);

	const inputText = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		bindMenu.onChange(e);
	};

	const toggleStock = () => {
		instockRef.current?.classList.toggle('is-selected');
		soldoutRef.current?.classList.toggle('is-selected');
		const isSoldOut = soldoutRef.current?.classList.contains('is-selected');
		bindMenu.setObject('soldout', isSoldOut);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLLabelElement>) => {
		if (e.key === 'Enter') {
			const fileInput = imageInputRef.current;
			fileInput?.click();
		}
	};

	const handleRegisterImage = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files as FileList;
		if (!files) return;

		const file = files[0];
		const fileName = `${Date.now()}${file.name}`;

		bindFile.setValue(file);
		bindMenu.setObject('imageName', fileName);

		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			bindImage.setValue(reader.result as string);
		};

		e.target.value = '';
	};

	const deleteImage = () => {
		resetFile();
		bindMenu.setObject('imageName', '');
		resetImage();
	};

	return (
		<ModalInputWrapper>
			<fieldset>
				<legend>about Beverage</legend>
				{imgSrc ? (
					<ImageContainer>
						<img src={imgSrc} alt={`${menuInfo.name} 이미지`} width={273} height={350} />
						<label htmlFor={`${menuInfo.name} 이미지 변경하기`} tabIndex={0} onKeyDown={handleKeyDown}>
							이미지 변경하기
						</label>
						<input
							type="file"
							ref={imageInputRef}
							name="file"
							accept="image/*"
							id={`${menuInfo.name} 이미지 변경하기`}
							onChange={handleRegisterImage}
						></input>
						<CloseButton type="button" onClick={deleteImage}>
							<img src="/assets/admin/close_light.svg" alt="닫기" />
						</CloseButton>
					</ImageContainer>
				) : (
					<ImageContainer>
						<div>이미지 없음</div>
						<label htmlFor={`${menuInfo.name} 이미지 등록하기`} tabIndex={0} onKeyDown={handleKeyDown}>
							이미지 등록하기
						</label>
						<input
							type="file"
							ref={imageInputRef}
							name="file"
							accept="image/*"
							id={`${menuInfo.name} 이미지 등록하기`}
							onChange={handleRegisterImage}
						></input>
					</ImageContainer>
				)}
				<InputList>
					<li>
						<label htmlFor={`${menuInfo.name} name`}>메뉴명</label>
						<input
							type="text"
							name="name"
							id={`${menuInfo.name} name`}
							defaultValue={menuInfo.name || ''}
							onChange={inputText}
						/>
					</li>
					<li>
						<label htmlFor={`${menuInfo.name} price`}>금액</label>
						<input
							type="text"
							name="price"
							id={`${menuInfo.name} price`}
							defaultValue={menuInfo.price || ''}
							onChange={inputText}
						/>
					</li>
					<li>
						<label htmlFor={`${menuInfo.name} category`}>카테고리</label>
						<select
							name="category"
							id={`${menuInfo.name} category`}
							defaultValue={menuInfo.category || ''}
							onChange={inputText}
						>
							{categoryList.map((category) => (
								<option key={category.id} value={category.category}>
									{category.category}
								</option>
							))}
						</select>
					</li>
					<li>
						<InventoryButton
							type="button"
							ref={instockRef}
							className={menuInfo.soldout ? '' : 'is-selected'}
							onClick={toggleStock}
						>
							재고있음
						</InventoryButton>
						<InventoryButton
							type="button"
							ref={soldoutRef}
							className={menuInfo.soldout ? 'is-selected' : ''}
							onClick={toggleStock}
						>
							품절
						</InventoryButton>
					</li>
				</InputList>
			</fieldset>
		</ModalInputWrapper>
	);
}

export default ModalInput;

const ModalInputWrapper = styled.form`
	margin-bottom: 37px;
	fieldset {
		display: flex;
	}

	legend {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: polygon(0 0, 0 0, 0 0);
	}
`;

const ImageContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-right: 90px;
	position: relative;

	img {
		width: 273px;
		height: 350px;
		margin-bottom: 22px;
		background-color: ${({ theme }) => theme.textColor.white};
		border-radius: 10px;
		object-fit: cover;
	}

	input {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: polygon(0 0, 0 0, 0 0);
	}

	div {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: ${({ theme }) => theme.fontSize['xl']};
		font-weight: ${({ theme }) => theme.fontWeight.regular};
		width: 273px;
		height: 350px;
		margin-bottom: 22px;
		background-color: ${({ theme }) => theme.textColor.white};
		border-radius: 10px;
	}

	label {
		font-size: ${({ theme }) => theme.fontSize['xl']};
		font-weight: ${({ theme }) => theme.fontWeight.regular};
		color: ${({ theme }) => (theme.lightColor ? theme.textColor.black : theme.textColor.white)};
		cursor: pointer;
	}
`;

const CloseButton = styled.button`
	position: absolute;
	top: 8px;
	right: 8px;

	img {
		background-color: transparent;
		width: 30px;
		height: 30px;
	}
`;
const InputList = styled.ul`
	li {
		margin-bottom: 33px;
	}

	li:last-child {
		margin-left: 117px;
	}

	label {
		display: inline-block;
		width: 109px;
		text-align: right;
		font-size: ${({ theme }) => theme.fontSize['3xl']};
		font-weight: ${({ theme }) => theme.fontWeight.regular};
		color: ${({ theme }) => (theme.lightColor ? theme.textColor.black : theme.textColor.white)};
		margin-right: 8px;
	}

	input {
		width: 291px;
		height: 66px;
		border: none;
		border-radius: 10px;
		padding-left: 8px;
		font-size: ${({ theme }) => theme.fontSize['2xl']};
	}

	select {
		width: 291px;
		height: 66px;
		border: none;
		border-radius: 10px;
		padding-left: 8px;
		font-size: ${({ theme }) => theme.fontSize['2xl']};
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background: ${({ theme }) => theme.textColor.white} url('/assets/admin/open.svg') no-repeat 95%;
	}
`;

const InventoryButton = styled.button`
	width: 136px;
	height: 50px;
	background-color: ${({ theme }) => theme.textColor.lightbrown};
	border-radius: 10px;
	font-size: ${({ theme }) => theme.fontSize['2xl']};
	font-weight: ${({ theme }) => theme.fontWeight.regular};

	&:first-child {
		margin-right: 15px;
	}

	&.is-selected {
		background-color: ${({ theme }) => (theme.lightColor ? theme.lightColor.main : theme.darkColor.main)};
		color: ${({ theme }) => (theme.lightColor ? theme.textColor.black : theme.textColor.white)};
	}
`;
