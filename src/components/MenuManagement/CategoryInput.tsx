import { ChangeEvent, useState } from 'react';
import { styled } from 'styled-components';
import { CategoryType } from '../../types/menuMangementType';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { categoryListState, selectedCategoryState } from '../../state/CategoryList';
import { checkDuplicate } from '../../utils/Category/checkCategory';
import { SELECT_USING_OPTION } from '../../constants/category';
import { addToDB, getCollection } from '../../utils/db';

const initialCategoryState: CategoryType = {
	id: 0,
	category: '',
	isShowOptionModal: false,
};

function CategoryInput() {
	const [newCategory, setNewCategory] = useState<CategoryType>(initialCategoryState);
	const categoryList = useRecoilValue(categoryListState);
	const setSelectedCategory = useSetRecoilState(selectedCategoryState);

	const handleChangeCategoryState = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value, checked } = e.target;
		setNewCategory((prev) => {
			if (name === 'isShowOptionModal') {
				return {
					...prev,
					[name]: checked,
				};
			}
			return {
				...prev,
				[name]: value,
			};
		});
	};

	const handleAddCategory = async () => {
		const { category, isShowOptionModal } = newCategory;
		const categoryListRef = getCollection('categoryList');
		if (category.trim()) {
			await addToDB(categoryListRef, { id: Date.now(), category, isShowOptionModal });
			setSelectedCategory(category);
			setNewCategory(initialCategoryState);
		}
	};

	return (
		<AddContainer>
			<form
				onSubmit={(e) => {
					e.preventDefault();
				}}
			>
				<label htmlFor="categoryName">카테고리이름</label>
				<input
					type="text"
					id="categoryName"
					name="category"
					value={newCategory.category}
					onChange={handleChangeCategoryState}
				/>
				<div>
					<label htmlFor="optionCheckbox">옵션 체크박스</label>
					<input
						type="checkbox"
						id="optionCheckbox"
						checked={newCategory.isShowOptionModal}
						name="isShowOptionModal"
						onChange={handleChangeCategoryState}
					/>
					<p>{SELECT_USING_OPTION}</p>
				</div>
			</form>
			<button
				type="button"
				onClick={handleAddCategory}
				disabled={!newCategory.category || checkDuplicate(categoryList, newCategory.category)}
			>
				추가
			</button>
		</AddContainer>
	);
}

export default CategoryInput;
const AddContainer = styled.div`
	display: flex;
	align-items: flex-start;
	margin-bottom: 25px;

	div {
		display: flex;
		align-items: center;
		margin-top: 10px;
	}

	p {
		color: ${({ theme }) => (theme.lightColor ? theme.textColor.black : theme.textColor.white)};
	}

	input[type='checkbox'] {
		width: 20px;
		height: 20px;
	}

	label {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: polygon(0 0, 0 0, 0 0);
	}

	input {
		width: 296px;
		height: 66px;
		background-color: ${({ theme }) => theme.textColor.white};
		border: none;
		border-radius: 10px;
		margin-right: 17px;
		padding-left: 8px;
		font-size: ${({ theme }) => theme.fontSize['2xl']};
	}

	button {
		width: 97px;
		height: 66px;
		background-color: ${({ theme }) =>
			theme.lightColor
				? theme.color === 'green'
					? theme.lightColor.sub
					: theme.lightColor.main
				: theme.darkColor.main};
		color: ${({ theme }) => (theme.lightColor ? theme.textColor.black : theme.textColor.white)};
		border-radius: 10px;
		font-size: ${({ theme }) => theme.fontSize['3xl']};
		font-weight: ${({ theme }) => theme.fontWeight.semibold};

		&:disabled {
			cursor: not-allowed;
			background-color: ${({ theme }) => theme.textColor.darkgray};
			color: ${({ theme }) => theme.textColor.white};
		}
	}
`;
