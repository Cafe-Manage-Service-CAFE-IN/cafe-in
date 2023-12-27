import React, { useRef } from 'react';
import styled from 'styled-components';
import ModalInput from './ModalInput';
import { ModalDefaultType } from '../../types/ModalOpenTypes';
import { MenuType } from '../../types/menuMangementType';
import { useRecoilValue } from 'recoil';
import { selectedCategoryState } from '../../state/CategoryList';
import { isValidMenu } from '../../utils/MenuManagement/checkMenu';
import useInput from '../../hooks/useInput';
import { addMenu, storeImage } from '../../utils/MenuManagement/menuDB';

const initialMenu: MenuType = {
	id: Date.now(),
	name: '',
	price: '',
	category: '',
	soldout: false,
	imageUrl: '',
	imageName: '',
};

function AddMenuModal({ onClickToggleModal }: ModalDefaultType) {
	const backgroundRef = useRef<HTMLDivElement>(null);

	const selectedCategory = useRecoilValue(selectedCategoryState);

	const [menuInfo, bindMenu, resetMenu] = useInput<MenuType>({
		...initialMenu,
		category: selectedCategory,
	});
	const [file, bindFile, resetFile] = useInput<File | null>(null);

	const handleAddMenu = async () => {
		if (!file) return;
		const imageUrl = await storeImage(file, menuInfo.imageName);
		await addMenu(menuInfo, imageUrl);
		resetMenu();
		onClickToggleModal();
	};

	const handleDeleteMenu = () => {
		resetMenu();
		onClickToggleModal();
	};

	const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === backgroundRef.current) {
			onClickToggleModal();
		}
	};

	return (
		<AddModalWrapper ref={backgroundRef} onClick={handleClickOutside}>
			<AddModalContent>
				<ModalInput menuInfo={menuInfo} bindMenu={bindMenu} bindFile={bindFile} resetFile={resetFile} />
				<Guide>*모든 정보 입력 후 메뉴 추가가 가능합니다.</Guide>
				<div>
					<Button type="button" onClick={handleAddMenu} disabled={!isValidMenu(menuInfo) ? true : false}>
						추가
					</Button>
					<Button type="button" onClick={handleDeleteMenu}>
						취소
					</Button>
				</div>
			</AddModalContent>
		</AddModalWrapper>
	);
}

export default AddMenuModal;

const AddModalWrapper = styled.div`
	width: 1194px;
	height: 834px;
	background-color: rgba(0, 0, 0, 0.2);
	position: fixed;
	left: 50%;
	top: 0;
	transform: translateX(-597px);
	display: flex;
	align-items: center;
	justify-content: center;
`;
const AddModalContent = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 896px;
	height: 586px;
	background-color: ${({ theme }) => (theme.lightColor ? theme.lightColor.background : theme.textColor.black)};
	padding-top: 58px;
	border-radius: 10px;
`;

const Guide = styled.p`
	position: relative;
	top: -55px;
	right: 62px;
	width: 400px;
	text-align: right;
	align-self: flex-end;
`;

const Button = styled.button`
	width: 146px;
	height: 57px;
	border-radius: 10px;
	font-size: ${({ theme }) => theme.fontSize['3xl']};
	font-weight: ${({ theme }) => theme.fontWeight.regular};
	color: ${({ theme }) => (theme.lightColor ? theme.textColor.black : theme.textColor.white)};
	background-color: ${({ theme }) => (theme.lightColor ? theme.lightColor.sub : theme.darkColor.main)};

	&:first-child {
		margin-right: 24px;
	}

	&:disabled {
		cursor: not-allowed;
		background-color: ${({ theme }) => theme.textColor.darkgray};
		color: ${({ theme }) => theme.textColor.white};
	}
`;
