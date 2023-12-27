import { useRef } from 'react';
import { styled } from 'styled-components';
import CategoryItem from './CategoryItem';
import { ModalDefaultType } from '../../types/ModalOpenTypes';
import { useRecoilValue } from 'recoil';
import { categoryListState } from '../../state/CategoryList';
import CategoryInput from './CategoryInput';
import { IMPOSSIBLE_ADD, IMPOSSIBLE_DELETE } from '../../constants/category';

function CategoryManagementModal({ onClickToggleModal }: ModalDefaultType) {
	const backgroundRef = useRef<HTMLDivElement>(null);
	const categoryList = useRecoilValue(categoryListState);

	const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === backgroundRef.current) {
			onClickToggleModal();
		}
	};

	return (
		<CategoryManagementWrapper ref={backgroundRef} onClick={handleClickOutside}>
			<CategoryModalContent>
				<GuidText>{IMPOSSIBLE_ADD}</GuidText>
				<CategoryInput />
				<GuidText>{IMPOSSIBLE_DELETE}</GuidText>
				<ul>
					{categoryList.map((item) => (
						<CategoryItem key={item.id} categoryItem={item} />
					))}
				</ul>
				<CloseButton type="button" onClick={onClickToggleModal}>
					닫기
				</CloseButton>
			</CategoryModalContent>
		</CategoryManagementWrapper>
	);
}

export default CategoryManagementModal;

const CategoryManagementWrapper = styled.div`
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

const CategoryModalContent = styled.div`
	width: 492px;
	height: 758px;
	background-color: ${({ theme }) => (theme.lightColor ? theme.lightColor.background : theme.textColor.black)};
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	align-items: start;
	padding: 30px 0 20px 40px;

	ul {
		display: flex;
		flex-direction: column;
		height: 472px;
		grid-row-gap: 10px;
		margin-bottom: 30px;
		overflow-y: auto;
		-ms-overflow-style: none;
		scrollbar-width: none;
		&::-webkit-scrollbar {
			display: none;
		}
	}
`;

const CloseButton = styled.button`
	margin-left: 115px;
	width: 146px;
	height: 57px;
	background-color: ${({ theme }) =>
		theme.lightColor ? (theme.color === 'green' ? theme.lightColor.sub : theme.lightColor.main) : theme.darkColor.main};
	color: ${({ theme }) => (theme.lightColor ? theme.textColor.black : theme.textColor.white)};
	border-radius: 10px;
	font-size: ${({ theme }) => theme.fontSize['3xl']};
	font-weight: ${({ theme }) => theme.fontWeight.regular};
`;

const GuidText = styled.p`
	color: ${({ theme }) => (theme.lightColor ? theme.textColor.black : theme.textColor.white)};
	margin-bottom: 10px;
`;
