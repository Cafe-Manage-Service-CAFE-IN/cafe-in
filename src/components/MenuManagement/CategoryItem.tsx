import { ChangeEvent } from 'react';
import styled from 'styled-components';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { categoryListState, selectedCategoryState } from '../../state/CategoryList';
import { menuListState } from '../../state/MenuListState';
import { CategoryType } from '../../types/menuMangementType';
import { checkDisabled } from '../../utils/Category/checkCategory';
import useInput from '../../hooks/useInput';
import { deleteCategory, editCategory, toggleOptionModal } from '../../utils/Category/categoryDB';

function CategoryItem({ categoryItem }: { categoryItem: CategoryType }) {
	const { id, category, isShowOptionModal } = categoryItem;

	const categoryList = useRecoilValue(categoryListState);
	const menuList = useRecoilValue(menuListState);
	const setSelectedCategory = useSetRecoilState(selectedCategoryState);

	const [editedCategoryName, bindEdit, resetEdit] = useInput('');
	const [editShowOptionModal, bindOption] = useInput(isShowOptionModal);
	const [selectedId, bindId, resetId] = useInput(0);

	const removeCategory = async () => {
		await deleteCategory(id);
		setSelectedCategory(categoryList[0].category);
	};

	const clickEditButton = () => {
		resetEdit();
		bindId.setValue(id);
	};

	const storeEditName = async () => {
		if (!editedCategoryName.trim()) {
			resetId();
			return;
		}
		await editCategory(id, category, editedCategoryName);
		resetId();
		setSelectedCategory(editedCategoryName);
	};

	const toggleOption = async (e: ChangeEvent<HTMLInputElement>) => {
		bindOption.onChange(e);
		await toggleOptionModal(e.currentTarget.checked, id);
		setSelectedCategory(category);
	};

	return (
		<>
			<CategoryItemWrapper data-id={id}>
				<label htmlFor={`${category}-option-checkbox`}>옵션 체크박스</label>
				<input
					type="checkbox"
					id={`${category}-option-checkbox`}
					checked={editShowOptionModal}
					onChange={toggleOption}
				/>
				{id === selectedId ? (
					<>
						<label htmlFor="editCategoryName">수정할 카테고리 이름</label>
						<input
							type="text"
							id="editCategoryName"
							placeholder={category}
							value={editedCategoryName}
							onChange={bindEdit.onChange}
						/>
						<EditCategoryButton type="button" onClick={storeEditName}>
							저장
						</EditCategoryButton>
						<button type="button" onClick={resetId}>
							취소
						</button>
					</>
				) : (
					<>
						<span>{category}</span>
						<EditCategoryButton type="button" onClick={clickEditButton}>
							수정
						</EditCategoryButton>
						<button type="button" disabled={checkDisabled(id, categoryList, menuList)} onClick={removeCategory}>
							삭제
						</button>
					</>
				)}
			</CategoryItemWrapper>
		</>
	);
}

export default CategoryItem;

const CategoryItemWrapper = styled.li`
	display: flex;
	align-items: center;

	label {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: polygon(0 0, 0 0, 0 0);
	}

	input[type='checkbox'] {
		width: 20px;
		height: 20px;
		accent-color: ${({ theme }) =>
			theme.lightColor
				? theme.color === 'blue'
					? theme.lightColor.sub
					: theme.lightColor.point
				: theme.darkColor.main};
	}

	span,
	input {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		width: 191px;
		height: 57px;
		background-color: ${({ theme }) => theme.textColor.white};
		margin-right: 16px;
		font-size: ${({ theme }) => theme.fontSize['3xl']};
		font-weight: ${({ theme }) => theme.fontWeight.semibold};
		border-radius: 10px;
		padding-left: 10px;
		border: none;
	}

	button {
		width: 83px;
		height: 57px;
		background-color: ${({ theme }) =>
			theme.lightColor
				? theme.color === 'green'
					? theme.lightColor.sub
					: theme.lightColor.main
				: theme.darkColor.main};
		color: ${({ theme }) => (theme.lightColor ? theme.textColor.black : theme.textColor.white)};
		border-radius: 10px;
		font-size: ${({ theme }) => theme.fontSize['2xl']};
		font-weight: ${({ theme }) => theme.fontWeight.regular};

		&:disabled {
			cursor: not-allowed;
			color: ${({ theme }) => theme.textColor.white};
			background-color: ${({ theme }) => theme.textColor.darkgray};
		}
	}
`;

const EditCategoryButton = styled.button`
	margin-right: 3px;
`;
