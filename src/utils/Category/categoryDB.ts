import { deleteData, getCollection, getDataFromDB, updateData } from '../db';

const categoryListRef = getCollection('categoryList');
const menuItemRef = getCollection('menuItem');

export const deleteCategory = async (id: number) => {
	const deleteCategory = await getDataFromDB(categoryListRef, 'id', id);
	if (deleteCategory.docs.length !== 0) {
		await deleteData(deleteCategory.docs[0].ref);
	}
};

export const editCategory = async (id: number, prevCategoryName: string, newCategoryName: string) => {
	const editCategory = await getDataFromDB(categoryListRef, 'id', id);
	if (editCategory.docs.length !== 0) {
		await updateData(editCategory.docs[0].ref, {
			category: newCategoryName,
		});
	}
	const editMenuList = await getDataFromDB(menuItemRef, 'category', prevCategoryName);
	if (editMenuList.docs.length !== 0) {
		editMenuList.docs.forEach(async (doc) => {
			await updateData(doc.ref, {
				category: newCategoryName,
			});
		});
	}
};

export const toggleOptionModal = async (value: boolean, id: number) => {
	const category = await getDataFromDB(categoryListRef, 'id', id);
	if (category.docs.length !== 0) {
		await updateData(category.docs[0].ref, {
			isShowOptionModal: value,
		});
	}
};
