import React, { ChangeEvent, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { categoryListState } from '../../state/CategoryList';
import { db } from '../../firebase/firebaseConfig';
import { deleteDoc, collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { menuListState } from '../../state/MenuListState';

function CategoryItem() {
	const categoryListRef = collection(db, 'categoryList');
	const categoryList = useRecoilValue(categoryListState);
	const menuList = useRecoilValue(menuListState);
	const [editedCategoryName, setEditedCategoryName] = useState<string>('');
	const [selectedId, setSelectedId] = useState<number>(0);

	const checkDisabled = useCallback(
		(id: number) => {
			const currentCategory = categoryList.filter((category) => category.id === id)[0];
			const isContain = menuList.some((menu) => menu.category === currentCategory.category);
			return isContain;
		},
		[categoryList, menuList],
	);

	const handleDeleteCategory = useCallback(
		async (id: number) => {
			const data = await getDocs(query(categoryListRef, where('id', '==', id)));
			if (data.docs.length !== 0) {
				await deleteDoc(data.docs[0].ref);
			}
		},
		[categoryListRef],
	);

	const handleEditCategoryName = (e: ChangeEvent<HTMLInputElement>) => {
		setEditedCategoryName(e.target.value);
	};

	const handleClickEditButton = (id: number) => {
		setEditedCategoryName('');
		setSelectedId(id);
	};

	const handleStoreEdit = useCallback(
		async (id: number) => {
			if (!editedCategoryName.trim()) {
				setSelectedId(0);
				return;
			}
			const data = await getDocs(query(categoryListRef, where('id', '==', id)));
			if (data.docs.length !== 0) {
				await updateDoc(data.docs[0].ref, {
					category: editedCategoryName,
				});
			}
			setSelectedId(0);
		},
		[categoryListRef, editedCategoryName],
	);

	const handleDeleteEdit = () => {
		setSelectedId(0);
	};

	return (
		<>
			{categoryList.map(({ id, category }) => (
				<CategoryItemWrapper key={id} data-id={id}>
					{id === selectedId ? (
						<>
							<input type="text" placeholder={category} value={editedCategoryName} onChange={handleEditCategoryName} />
							<EditCategoryButton
								type="button"
								onClick={() => {
									handleStoreEdit(id);
								}}
							>
								저장
							</EditCategoryButton>
							<button type="button" onClick={handleDeleteEdit}>
								취소
							</button>
						</>
					) : (
						<>
							<span>{category}</span>
							<EditCategoryButton type="button" onClick={() => handleClickEditButton(id)}>
								수정
							</EditCategoryButton>
							<button
								type="button"
								disabled={checkDisabled(id) ? true : false}
								onClick={() => {
									handleDeleteCategory(id);
								}}
							>
								삭제
							</button>
						</>
					)}
				</CategoryItemWrapper>
			))}
		</>
	);
}

export default CategoryItem;

const CategoryItemWrapper = styled.li`
	display: flex;

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
		background-color: ${({ theme }) => (theme.lightColor ? theme.lightColor?.yellow.main : theme.darkColor?.main)};
		color: ${({ theme }) => theme.textColor.white};
		border-radius: 10px;
		font-size: ${({ theme }) => theme.fontSize['2xl']};
		font-weight: ${({ theme }) => theme.fontWeight.regular};

		&:disabled {
			cursor: not-allowed;
			background-color: ${({ theme }) => theme.textColor.darkgray};
		}
	}
`;

const EditCategoryButton = styled.button`
	margin-right: 3px;
`;
